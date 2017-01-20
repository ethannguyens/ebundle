define(['ebundle', 'ebundleSection', 'site', 'dom', 'app'], function(ebundle, ebundleSection, site, dom, app) {
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

        it('ebundleSection should be a function for unit test', function() {
            expect(ebundleSection).toEqual(jasmine.any(Function));
        });

        describe('new bundleSection object', function() {
            it('it should has needed variables', function () {
                var bundle = new ebundle();
                var bundleSection = new ebundleSection(bundle, bundle.elements.sections[0]);
                expect(bundleSection).toEqual(jasmine.any(Object));
                expect(bundleSection.bundle).toBeDefined();
                expect(bundleSection.section).toBeDefined();
                expect(bundleSection.total).toBeDefined();
                expect(bundleSection.count).toBeDefined();
                expect(bundleSection.totalCost).toBeDefined();
                expect(bundleSection.elements).toBeDefined();
                expect(bundleSection.limit).toBeDefined();
                expect(bundleSection.categoryEl).toBeDefined();
                expect(bundleSection.items).toBeDefined();
            });
        });

        describe('update bundleSection', function() {
            it('it should call updateData, updateInfo, resetData', function () {
                var bundle = new ebundle();
                spyOn(ebundleSection.prototype, ['updateData']).and.callThrough();
                spyOn(ebundleSection.prototype, ['updateInfo']).and.callThrough();
                spyOn(ebundleSection.prototype, ['resetData']).and.callThrough();
                var bundleSection = new ebundleSection(bundle, bundle.elements.sections[0]);
                bundleSection.updateSection();
                expect(ebundleSection.prototype.updateData).toHaveBeenCalled();
                expect(ebundleSection.prototype.updateInfo).toHaveBeenCalled();
                expect(ebundleSection.prototype.resetData).toHaveBeenCalled();
            });
        });

    });
});
