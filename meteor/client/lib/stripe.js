StripeHandler = class StripeHandler {
    constructor(handlerOptions = {}, checkoutOptions = {}) {
        this.handler = null;

        this.checkoutOptions = _.defaults(handlerOptions, {
            key: Meteor.settings.public.stripe.publishableKey,
            name: Meteor.settings.public.stripe.websiteName,
            locale: 'auto'
        });

        this.handlerOptions = _.defaults(checkoutOptions, {
            allowRememberMe: true,
            currency: Meteor.settings.public.stripe.currency
        });
    }

    configure(callback, options) {
        this.handler = StripeCheckout.configure(_.extend({
            token: callback
        }, this.checkoutOptions, options));
    }

    open(options) {
        this.handler.open(_.extend({
            email: UserHelper.getEmail(Meteor.user())
        }, this.handlerOptions, options));
    }

    static checkout(fileId, outputFormat, price, onSuccess) {
        const handler = new StripeHandler();

        // Configure callback
        handler.configure(token => {
            Meteor.call('convertFile', token.id, fileId, outputFormat, (error, result) => {
                if (error) {
                    swal('Error', error.reason, 'error');
                } else {
                    onSuccess(result);
                }
            });
        });

        // Open checkout modal
        handler.open({
            description: 'Convert your file',
            amount: price * 100
        });
    }
};
