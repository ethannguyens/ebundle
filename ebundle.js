/**
 * Created by ethannguyen on 06/10/2016.
 */

define(['app', 'ebundleSection'], function (app, ebundleSection) {
    /**
     * Bundle Class
     */
    class bundle {
        /**
         * Bundle Constructor
         */
        constructor() {
            this.total = 0;
            this.count = 0;
            this.totalCost = 0;
            this.bundle = document.querySelector('.bundle-wrapper');
            this.elements = this.getElements();
            this.limit = this.getLimit();
            this.sections = this.getSections();
            this.type = this.getType();

            this.typeInit();
        }

        /**
         * Get Bundle Elements
         * @returns {{summary: Element, categories: Element, bundleSections: NodeList, limit: Element, dialSummaryText: Element, buyNow: Element, receiptCount: Element, progressBar: Element, dialCount: Element, dial: Element}}
         */
        getElements() {
            const elements = { summary : this.bundle.querySelector('.bundle-summary'),
                dialHolder : this.bundle.querySelector('.dial-holder'),
                totalCostEl : this.bundle.querySelector('.total-cost'),
                percentageEls : this.bundle.querySelectorAll('.percentage'),
                categories : this.bundle.querySelector('.categories'),
                sections : this.bundle.querySelectorAll('.bundle-section'),
                limit : this.bundle.querySelector('.cap'),
                dialSummaryText : this.bundle.querySelector('.bundle-summary-text'),
                buyNow : this.bundle.querySelector('.js-buynow a'),
                receiptCount : this.bundle.querySelector('.receipt-count'),
                progressBar : this.bundle.querySelector('.progress-bar'),
                dialCount : this.bundle.querySelector('.dial-count'),
                dial : this.bundle.querySelector('#dial')
            };

            return elements;
        }

        /**
         * Get bundle limit
         */
        getLimit() {
            let limit = 9999;

            if (this.elements.limit) {
                limit = parseInt(this.elements.limit.getAttribute('data-product'));
            }

            return limit;
        }

        /**
         * Get section object
         * @returns {Array}
         */
        getSections() {
            let sections = [];

            for (let i = 0; i < this.elements.sections.length; i++) {
                sections[i] = new ebundleSection(this, this.elements.sections[i]);
            }

            return sections;
        }

        /**
         * Get the bundle type
         * @returns {*}
         */
        getType() {
            if (this.elements.dialCount && !siteObj.siteIsMobile) {
                if (this.elements.progressBar) this.elements.progressBar.style.display = 'none';
                return 'dial';
            } else if (this.elements.receiptCount) {
                return'receipt';
            } else {
                return 'progress';
            }
        }

        /**
         * Int Bundle Type
         */
        typeInit() {
            switch(this.type) {
                case 'dial':
                    this.ctx = this.elements.dial.getContext('2d');
                    this.dialColor = this.getDialColor();
                    this.generateCategories();
                    this.summaryLockHandler();
                    this.drawDial();
                    break;

                case 'progress':
                    this.elements.dial.parentNode.removeChild(this.elements.dial);
                    app.element.addClass('active', this.elements.progressBar);
                    break;
            }
        }

        /**
         * Get Dial Colors
         * @returns {{background: string, foreground: string}}
         */
        getDialColor() {
            const dialColor = {
                background: window.getComputedStyle(this.elements.summary.querySelector('#dial-color')).getPropertyValue('background-color'),
                foreground: window.getComputedStyle(this.elements.summary.querySelector('#dial-color')).getPropertyValue('color')
            };

            return dialColor;
        }

        /**
         * Generate Category
         */
        generateCategories() {
            for (let i = 0; i < this.sections.length; i++) {
                this.elements.categories.insertAdjacentHTML('beforeend', this.sections[i].categoryEl);
                this.elements.categories.querySelector('li').lastChild.addEventListener('click', (e) =>{
                    e.target.scrollIntoView(true);
                });
            }
        }


        /**
         * Lock/Unlock the bundle summary when user scrolling
         */
        summaryLockHandler() {
            this.categoryLock = false;
            window.onscroll = () => {
                const bundlePos = this.bundle.getBoundingClientRect().top;
                if (bundlePos < 0 && !this.categoryLock) {
                    this.categoryLock= true;
                    app.element.addClass('fixed-summary', this.elements.summary);
                } else if (bundlePos > 0 && this.categoryLock) {
                    this.categoryLock = false;
                    app.element.removeClass('fixed-summary', this.elements.summary);
                }
            };
        }

        /**
         * Update Bundle
         */
        updateBundle() {
            this.resetData();
            this.sections.map((section) => {
                this.total += section.total;
                this.count += section.count;
                this.totalCost += section.totalCost;
            });

            this.totalCost = this.totalCost.toFixed(2);

            this.updateSummary();
        }

        /**
         * Reset Data total, count, cost
         */
        resetData() {
            this.total = 0;
            this.count = 0;
            this.totalCost = 0;
        }

        /**
         * Validate Update
         * @param item
         * @param newCount
         * @returns {boolean}
         */
        updateValidation(item, newCount) {
            let newTotal = this.total + newCount - item.total;

            if (newTotal < 0 || newTotal > this.limit) {
                this.dialPulse();
                return false;
            }
            return true;
        }

        /**
         * Update Bundle Summary
         */
        updateSummary() {
            this.updateBuyLink();

            switch (this.type) {
                case 'receipt':
                    this.updateBundleReceipt();
                    break;
                case 'progress':
                    this.updateBundleProgress();
                    break;
                default:
                    this.updateBundleDial();
            }
        }

        /**
         * Update Bundle Buy Link
         */
        updateBuyLink(){
            let buyHref = '/my.basket?buylist=';

            this.sections.map((section) => {
                section.items.map((item) => {
                    if (item.total > 0)
                        buyHref = `${buyHref}${item.itemNo}:${item.total},`;
                });
            });

            buyHref = buyHref.slice(0, -1);

            this.elements.buyNow.href = buyHref;
        }

        /**
         * Update Bundle Type = Receipt
         */
        updateBundleReceipt(){
            this.elements.receiptCount.innerHTML = this.total.toString();
            this.elements.totalCostEl.innerHTML = this.totalCost.toString();

            if (this.count > 0) app.element.addClass('active', this.elements.summary);
            else app.element.removeClass('active', this.elements.summary);
        }

        /**
         * Update Bundle Type = Progress
         */
        updateBundleProgress() {
            this.elements.dialCount.innerHTML = this.total.toString();
            const percentage = (this.total/this.limit * 100).toFixed(1);

            for(let i = 0; i < this.elements.percentageEls.length; i++){
                this.elements.percentageEls[i].style.width = `${percentage}%`;
            }

            if (this.total === this.limit) app.element.addClass('active', this.elements.summary);
            else app.element.removeClass('active', this.elements.summary);
        }

        /**
         * Update Bundle Type = Dial
         */
        updateBundleDial() {
            if (this.total === this.limit) app.element.addClass('active', this.elements.summary);
            else app.element.removeClass('active', this.elements.summary);

            this.elements.dialCount.innerHTML = this.total.toString();
            this.drawDial();
        }

        /**
         * CTX to draw the dial
         */
        drawDial() {
            const centerX = this.elements.dialHolder.offsetWidth / 2;
            const centerY = this.elements.dialHolder.offsetWidth / 1.8;
            const radius = 88;
            const start = 0.8 * Math.PI;
            const end = 2.2 * Math.PI;

            this.ctx.clearRect(0, 0, this.elements.dialHolder.offsetWidth, this.elements.dialHolder.offsetHeight);

            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radius, 0.8 * Math.PI, 2.2 * Math.PI, false);
            this.ctx.lineWidth = 28;
            this.ctx.strokeStyle = this.dialColor.background;
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radius, start,
                start + (this.total * ((end - start) / this.limit)), false);
            this.ctx.lineWidth = 26;
            this.ctx.strokeStyle = this.dialColor.foreground;
            this.ctx.stroke();
        }

        /**
         * Pulse the dial
         */
        dialPulse() {
            if (this.elements.dialSummaryText) {
                app.element.addClass('pulse', this.elements.dialSummaryText);
                this.elements.dialSummaryText.addEventListener('animationend', (e) => {
                    e.stopPropagation();
                    app.element.removeClass('pulse', this.elements.dialSummaryText);
                });
            }
        }

    }

    if (document.querySelector('.bundle-wrapper')) return new bundle();
    else return bundle;
});
