define(['ebundle', 'site', 'dom', 'app'], function(ebundle, site, dom, app) {
    describe('eBundle Item', function() {

        var bundleEl =  '<div class="bundle-wrapper">' +
            '<div class="summary-wrapper">' +
            '<div class="bundle-summary">' +
            '<div class="dial-holder">' +
            '<div class="total-cost"/>' +
            '<div class="percentage"/>' +
            '<canvas id="dial" width="220" height="220"></canvas>' +
            '<span id="dial-color" style="background-color: #fff; color: #000;"></span>' +
            '<p class="bundle-summary-text">' +
            '<span class="dial-count unfilled">0</span>' +
            '</p>' +
            '</div>' +
            '<div class="bundle-button product-button">' +
            '<span class="cat-button buynow js-buynow">' +
            '<a class="btn" href="/my.basket?buylist="></a>' +
            '</span>' +
            '</div>' +
            '<div class="categories-wrapper categories"></div>' +
            '</div>' +
            '</div>' +

            '<div class="bundle-content">' +
            '<div class="cap" data-product="100"></div>' +
            '<div id="shakes-smoothies" class="bundle-section line" data-limit="" data-error-message="">' +
            '<h3 class="widget-header title accordion-toggle">Shakes</h3>' +
            '<div class="bundle-product-wrap">' +
            '<div class="row line productlist">' +
            '<div class="item item-health-beauty column column-span2 grid thg-track js-product-simple" rel="11230040">' +
            '<div class="product-name"><a href=""></a></div>' +
            '<a href="" title="Exante Diet Banana Shake"> </a>' +
            '<div class="price bundle-active item_price"><span>£1.00</span></div>' +
            '<div class="quantity-selector line">' +
            '<div class="control minus">-</div>' +
            '<form autocomplete="off" lpformnum="1">' +
            '<label>' +
            '<input type="text" class="value" value="0">' +
            '</label>' +
            '</form>' +
            '<div class="control plus"></div>' +
            '<div class="info"></div>' +
            '<div class="product-description"/>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

        beforeEach(function () {
            dom.render();
            document.body.insertAdjacentHTML('beforeend', bundleEl);
        });

        afterEach(function () {
            site.resetSiteObject();
        });

        it('ebundle should be a function for unit test', function() {
            expect(ebundle).toEqual(jasmine.any(Function));
        });

        describe('new bundle object', function() {
            it('it should has needed variables', function () {
                var bundle = new ebundle();
                expect(bundle).toEqual(jasmine.any(Object));
                expect([bundle.total, bundle.count, bundle.totalCost, bundle.bundle, bundle.elements, bundle.limit, bundle.sections, bundle.type]).toBeDefined();

            });
        });

        describe('getElements', function() {
            it('should call getEelements and all needed elements are defined', function() {
                spyOn(ebundle.prototype, ['getElements']).and.callThrough();
                var bundle = new ebundle();
                expect(ebundle.prototype.getElements).toHaveBeenCalled();
                for (var i = 0; i < bundle.elements.length; i++){
                    expect(bundle.elements[i]).toBeDefined();
                }
            });
        });

        describe('getLimits', function() {
            it('should call getLimits and limit is defined', function() {
                spyOn(ebundle.prototype, ['getLimit']).and.callThrough();
                var bundle = new ebundle();
                expect(ebundle.prototype.getLimit).toHaveBeenCalled();
                expect(bundle.limit).toBeDefined();
            });
        });

        describe('getSections', function() {
            it('should call getSections and limit is defined', function() {
                spyOn(ebundle.prototype, ['getSections']).and.callThrough();
                var bundle = new ebundle();
                expect(ebundle.prototype.getSections).toHaveBeenCalled();
                for (var i = 0; i < bundle.sections.length; i++){
                    expect(bundle.sections[i]).toBeDefined();
                }
            });
        });

        describe('getType', function() {
            it('should call the getType', function() {
                spyOn(ebundle.prototype, ['getType']).and.callThrough();
                new ebundle();
                expect(ebundle.prototype.getType).toHaveBeenCalled();
            });

            it('should return a correct type of bundle', function() {
                var bundle = new ebundle();
                expect(bundle.type).toEqual('dial');
            });
        });

        describe('getDialColor', function() {
            it('should call getDialColor and color is defined', function() {
                spyOn(ebundle.prototype, ['getDialColor']).and.callThrough();
                var bundle = new ebundle();
                expect(ebundle.prototype.getDialColor).toHaveBeenCalled();
                expect(bundle.dialColor).toBeDefined();
            });
        });

        describe('generateCategories', function() {
            it('should call generateCategories and color is defined', function() {
                spyOn(ebundle.prototype, ['generateCategories']).and.callThrough();
                var bundle = new ebundle();
                expect(ebundle.prototype.generateCategories).toHaveBeenCalled();
            });
        });

        describe('summaryLockHandler', function() {
            it('should call summaryLockHandler and lock the category', function() {
                spyOn(ebundle.prototype, ['summaryLockHandler']).and.callThrough();
                var bundle = new ebundle();
                expect(ebundle.prototype.summaryLockHandler).toHaveBeenCalled();
                window.scrollTo(0, 1000);
                expect(bundle.categoryLock).toBe(false);
            });
        });

        describe('updateBundle', function() {
            it('should call resetData, ', function() {
                spyOn(ebundle.prototype, ['resetData']).and.callThrough();
                spyOn(ebundle.prototype, ['updateSummary']).and.callThrough();
                spyOn(ebundle.prototype, ['updateBuyLink']).and.callThrough();
                spyOn(ebundle.prototype, ['updateBundleDial']).and.callThrough();
                var bundle = new ebundle();
                bundle.updateBundle();
                expect(ebundle.prototype.resetData).toHaveBeenCalled();
                expect(ebundle.prototype.updateSummary).toHaveBeenCalled();
                expect(ebundle.prototype.updateBuyLink).toHaveBeenCalled();
                expect(ebundle.prototype.updateBundleDial).toHaveBeenCalled();
            });
        });

    });
});
