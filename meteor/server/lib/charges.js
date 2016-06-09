const Stripe = StripeAPI(Meteor.settings.stripe.secretKey);
import Future from 'fibers/future';

ChargeHelper = class ChargeHelper {
    static create (tokenId, fileId, amount) {
        const future = new Future();

        Stripe.charges.create({
            amount,
            currency: Meteor.settings.public.stripe.currency,
            source: tokenId
        }, Meteor.bindEnvironment(function (error, charge) {
            if (error) {
                future.throw(new Meteor.Error('stripe-charge', error.toString()));
            } else {
                const chargeId = Collection.Charges.insert({
                    userId: Meteor.userId(),
                    stripeData: charge,
                    fileId
                });

                future.return(chargeId);
            }
        }));

        return future.wait();
    }
};
