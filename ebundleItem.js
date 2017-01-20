/**
 * Created by ethannguyen on 06/10/2016.
 */

define(['app', 'bundleQuickView', 'bundleCategoriesView', 'ePopup', 'tabs'], function(app, bundleQuickView, bundleCategoriesView, ePopup, tabs) {

    /**
     * Bundle Item Class
     */
    class bundleItem {
        /**
         * Bundle Item Constructor
         * @param section
         * @param item
         */
        constructor(section, item) {
            this.section = section;
            this.item = item;
            this.total = 0;
            this.count = 0;
            this.totalCost = 0;
            this.soldout = this.item.querySelector('.sold-out');
            this.quantitySelector = this.item.querySelector('.quantity-selector');
            this.elements = this.getItemElements();
            this.itemNo = parseInt(this.item.getAttribute('rel'));
            this.price = parseFloat(this.elements.price.innerHTML.replace(/[$€£kr]/, ''));
            this.packQuantity = this.elements.packQuantity ? parseInt(this.elements.packQuantity.getAttribute('data-value')) : 1;
            this.quickView = this.getQuickView();
            this.ie = this.ieBrowser();
            this.info = this.elements.info ? true : false;

            this.disableItemClick();
            this.clickHandler();
            this.infoHandler();
        }

        /**
         *
         * @returns {{price: Element, input: Element, plus: Element, minus: Element, link: Element, quantity: Element, info: Element, description: Element, ingredients: Element, nutrition: Element, suggestedUse: Element, keyBenefits: Element}}
         */
        getItemElements() {
            const elements = {
                price: this.item.querySelector('.price span'),
                input: this.item.querySelector('input'),
                plus: this.item.querySelector('.plus'),
                minus: this.item.querySelector('.minus'),
                link: this.item.querySelector('.product-name a'),
                quantity: this.item.querySelector('.pack-quantity'),
                info: this.item.querySelector('.info'),
                description: this.item.querySelector('.product-description'),
                ingredients: this.item.querySelector('.product-ingredients'),
                nutrition: this.item.querySelector('.product-nutrition'),
                suggestedUse: this.item.querySelector('.product-suggested-use'),
                keyBenefits: this.item.querySelector('.product-key-benefits')
            };

            return elements;
        }

        /**
         * Disable product click
         */
        disableItemClick() {
            this.elements.link.setAttribute('onclick', 'return false;');
        }

        /**
         /**
         * Generate bundle quick-view using handlebars template
         */
        getQuickView() {
            const title = this.elements.link.innerHTML;

            if (siteObj.siteIsMobile) {
                const tabsContent = [];

                if (this.checkItemInfoContent(this.elements.description)) tabsContent.push(this.getItemInfoContent(this.elements.description, 'description', 'Description'));
                if (this.checkItemInfoContent(this.elements.ingredients)) tabsContent.push(this.getItemInfoContent(this.elements.ingredients, 'ingredients', 'Ingredients'));
                if (this.checkItemInfoContent(this.elements.nutrition)) tabsContent.push(this.getItemInfoContent(this.elements.nutrition, 'nutrition', 'Nutrition'));
                if (this.checkItemInfoContent(this.elements.suggestedUse)) tabsContent.push(this.getItemInfoContent(this.elements.suggestedUse, 'suggestedUse', 'Suggested Use'));
                if (this.checkItemInfoContent(this.elements.keyBenefits)) tabsContent.push(this.getItemInfoContent(this.elements.keyBenefits, 'keyBenefits', 'Key Benefits'));

                return bundleQuickView({
                    product: {
                        title: title
                    },
                    tabs: tabsContent
                });
            } else {
                return bundleQuickView({
                    product: {
                        title: title,
                        description: this.elements.description ? this.elements.description.innerHTML : null,
                        ingredients: this.elements.ingredients ? this.elements.ingredients.innerHTML : null,
                        nutrition: this.elements.nutrition ? this.elements.nutrition.innerHTML : null,
                        suggestedUse: this.elements.suggestedUse ? this.elements.suggestedUse.innerHTML : null
                    }
                });
            }
        }

        /**
         * Check if the item has certain info
         * @param element
         * @returns {boolean}
         */
        checkItemInfoContent(element) {
            if (element) {
                if (element.innerHTML.length > 20) return true;
                else return false;
            } else return false;
        }

        /**
         * Get the item info
         * @param element
         * @param key
         * @param title
         * @returns {{key: *, title: *, content: *}}
         */
        getItemInfoContent(element, key, title) {
            return {
                key: key,
                title: title,
                content: element.innerHTML
            };
        }

        /**
         * Enable info button to popup bundle quick-view
         */
        infoHandler() {
            if (this.info) {
                this.elements.info.addEventListener('click', () => {
                    if (siteObj.siteIsMobile) {
                    new ePopup(this.quickView, 'bundleQuickView', false);
                    tabs.init();
                } else {
                    new ePopup(this.quickView, 'bundleQuickView', true);
                    tabs.init({
                        tabHeading: '.tabs__heading',
                        tabBody: '.tabs__content',
                        speed: 400
                    });
                }
            });
            }
        }

        /**
         * Item click handler
         */
        clickHandler() {
            this.item.addEventListener('click', (e) => {
                const controlExclusion = '.info, .quantity-selector *';
            const exclusion = this.ie ? e.target.msMatchesSelector(controlExclusion) : e.target.matches(controlExclusion);
            if (!exclusion && !this.soldout) {
                if (app.element.hasClass('active', this.item)) this.inactive();
                else this.active();
            }
        });
        }

        /**
         * Item Active
         */
        active() {
            const newTotal = this.getNewTotal(1, false);

            if (this.updateValidation(newTotal)) {
                this.updateTotal(newTotal);
                app.element.addClass('active', this.item);
                if (!this.quantitySelectorHandlerInt && this.quantitySelector) this.quantitySelectorHandler();
            }

            if (this.quantitySelector)
                this.elements.input.value = this.count;
        }

        /**
         * Item Inactive
         */
        inactive() {
            this.total = 0;
            this.count = 0;
            this.totalCost = 0;

            this.section.updateSection();
            app.element.removeClass('active', this.item);
            if (this.quantitySelector)
                this.elements.input.value = this.count;
        }

        /**
         * Item Quantity Selector For Inout, +, -
         */
        quantitySelectorHandler() {
            this.quantitySelectorHandlerInt = true;

            this.elements.plus.addEventListener('click', (e) => {
                e.stopPropagation();
            this.updateItem(1, false);
        });

            this.elements.minus.addEventListener('click', (e) => {
                e.stopPropagation();
            this.updateItem(-1, false);
        });

            this.elements.input.addEventListener('change', (e) => {
                e.stopPropagation();
            const newTotal = parseInt(this.elements.input.value);
            this.updateItem(newTotal, true);
        });
        }

        /**
         * Update Item
         * @param count
         * @param manual
         */
        updateItem(count, manual) {
            const newTotal = this.getNewTotal(count, manual);

            if (this.updateValidation(newTotal)) this.updateTotal(newTotal);

            if (this.quantitySelector)
                this.elements.input.value = this.count;
        }

        /**
         * Get New Potential New Item Total
         * @param count
         * @param manual
         * @returns {*}
         */
        getNewTotal(count, manual) {
            if (isNaN(count)) return this.total;

            let newTotal = this.total + (count * this.packQuantity);

            if (manual) {
                switch (true) {
                    case ( count > 0):
                        newTotal = count * this.packQuantity;
                        break;
                    case ( count === 0):
                        newTotal = 0;
                        break;
                    default:
                        newTotal = this.total;
                }
            }
            return newTotal;
        }

        /**
         * Validate New Total
         * @param newTotal
         * @returns true/false
         */
        updateValidation(newTotal) {
            return this.section.updateValidation(this, newTotal);
        }

        /**
         * Update the Item Total After Validate Successfully
         * @param newTotal
         */
        updateTotal(newTotal) {
            if (newTotal === 0) this.inactive();

            this.total = newTotal;
            this.count = this.total / this.packQuantity;
            this.totalCost = this.count * this.price;
            this.section.updateSection();
        }

        /**
         *
         * @returns {boolean}
         */
        ieBrowser() {
            if (/MSIE 10/i.test(navigator.userAgent)) {
                // This is internet explorer 10
                return true;
            }

            if (/MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent)) {
                // This is internet explorer 9 or 11
                return true;
            }

            if (/Edge\/\d./i.test(navigator.userAgent)) {
                // This is Microsoft Edge
                return true;
            }
            return false;
        }
    }

    return bundleItem;
});
