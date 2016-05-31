/**
 * Stripe checkout wrapper
 * @param handlerOptions Optional
 * @param checkoutOptions Optional
 * @constructor
 * @see https://stripe.com/docs/checkout
 */
StripeHandler = function (handlerOptions, checkoutOptions) {
    this.handler = null;

    this.checkoutOptions = _.defaults(handlerOptions || {}, {
        key: Meteor.settings.public.stripe.publishableKey,
        name: Meteor.settings.public.stripe.websiteName,
        locale: 'en',
        panelLabel: 'Pay {{amount}}'
    });

    this.handlerOptions = _.defaults(checkoutOptions || {}, {
        allowRememberMe: true,
        currency: Meteor.settings.public.stripe.curency
    });
};

/**
 * Configure Stripe before open checkout modal
 * @param callback Called on success : function (token) { ... }
 * @param options Optional, allow you to replace default options (name, image, locale, ...)
 */
StripeHandler.prototype.configure = function (callback, options) {
    this.handler = StripeCheckout.configure(_.extend({
        token: callback
    }, this.checkoutOptions, options));
};

/**
 * Open checkout modal
 * @param options Required options are description and amount, you can also set opened and closed callbacks
 */
StripeHandler.prototype.open = function (options) {
    this.handler.open(_.extend({
        email: UserHelper.getEmail(Meteor.user())
    }, this.handlerOptions, options));
};
