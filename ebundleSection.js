/**
 * Created by ethannguyen on 30/09/2016.
 */
define(['app', 'bundleCategoriesView', 'ebundleItem'], function (app, bundleCategoriesView, ebundleItem) {
    /**
     * Bundle Section Class
     */
    class bundleSection {
        /**
         * Bundle Section Construction
         * @param bundle
         * @param section
         */
        constructor(bundle, section) {
            this.bundle = bundle;
            this.section = section;
            this.total = 0;
            this.count = 0;
            this.totalCost = 0;
            this.elements = this.getElements();
            this.limit = this.getLimit();
            this.categoryEl = this.getCategory();
            this.items = this.getItems();
        }

        /**
         * Get Section Elements
         * @returns {{sectionCheck: Element, items: NodeList, hash: (*|string), text: Element}}
         */
        getElements() {
            const elements = {
                sectionCheck: this.section.querySelector('.section-check'),
                items: this.section.querySelectorAll('.item'),
                hash: this.section.getAttribute('id'),
                text: this.section.querySelector('.widget-header')
            };

            return elements;
        }

        /**
         * Get Section Limit
         * @returns {Number}
         */
        getLimit() {
            const limit = parseInt(this.section.getAttribute('data-limit'));

            if (!this.limit || this.limit < 0) this.limit = this.bundle.limit;

            return limit;
        }

        /**
         *
         * @returns {*}
         */
        getCategory() {
            const categoryEl = bundleCategoriesView({
                sectionHash: this.section.getAttribute('id'),
                sectionText: this.section.querySelector('.widget-header').innerHTML
            });

            return categoryEl;
        }

        /**
         * Generate bundle items
         * @returns {Array}
         */
        getItems() {
            const items = [];

            for (let i = 0; i < this.elements.items.length; i++) {
                items[i] = new ebundleItem(this, this.elements.items[i]);
            }

            return items;
        }

        /**
         * Update Validation. Get Called by Item Object
         * @param item
         * @param newCount
         * @returns {*}
         */
        updateValidation(item, newCount) {
            let newTotal = this.total + newCount - item.total;

            if (newTotal < 0 || newTotal > this.limit) {
                this.pulse();
                return false;
            } else {
                return this.bundle.updateValidation(item, newCount);
            }
        }

        /**
         * Update Section. Get Called by Item Object
         */
        updateSection() {
            this.updateData();
            this.updateInfo();
            this.bundle.updateBundle();
        }

        /**
         * Update Data: Total, Count, Cost
         */
        updateData() {
            this.resetData();

            this.items.map((item) => {
                this.total += item.total;
                this.count += item.count;
                this.totalCost += item.totalCost;
            });
        }

        /**
         * Reset Section Data: Total, Count, Cost
         */
        resetData() {
            this.total = 0;
            this.count = 0;
            this.totalCost = 0;
        }

        /**
         * Update Section Info
         */
        updateInfo() {
            if (this.elements.sectionCheck) {
                switch (true) {
                    case ( this.total === 0):
                        app.element.removeClass('completed', this.section);
                        this.elements.sectionCheck.innerHTML = `Choose ${this.limit} items`;
                        break;
                    case ( this.total === this.limit):
                        app.element.addClass('completed', this.section);
                        this.elements.sectionCheck.innerHTML = `${this.total} of ${this.limit} chosen`;
                        break;
                    default:
                        app.element.removeClass('completed', this.section);
                        this.elements.sectionCheck.innerHTML = `${this.total} of ${this.limit} chosen`;
                }
            }
        }

        /**
         * Pulse animation if update validation is false
         */
        pulse() {
            app.element.addClass('pulse', this.section);

            this.section.addEventListener('animationend', (e) => {
                e.stopPropagation();
                app.element.removeClass('pulse', this.section);
            });
        }

    }

    return bundleSection;
});
