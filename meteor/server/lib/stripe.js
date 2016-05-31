Stripe = StripeAPI(Meteor.settings.stripe.secretKey);
var Future = Meteor.npmRequire('fibers/future');

createCharge = function (tokenId, amount) {
    var future = new Future();

    Stripe.charges.create({
        amount: amount,
        currency: Meteor.settings.public.stripe.currency,
        source: tokenId
    }, Meteor.bindEnvironment(function (error, charge) {
        if (error) {
            future.throw(new Meteor.Error('stripe-charge'));
            return false;
        }

        var id = Charges.insert(charge);

        future.return(id);
    }));

    return future.wait();
};

getSuccessChargeData = function (chargeId, offer) {
    var charge = Charges.findOne(chargeId);

    return {
        email: UserHelper.getEmail(Meteor.user()),
        last4: charge.source.last4,
        id: charge.id.replace('ch_', ''),
        amount: offer.getTotal()
    };
};

getStripeBalance = function () {
    var future = new Future();

    Stripe.balance.retrieve(function(error, balance) {
        if (error) {
            future.throw(Meteor.Error('stripe-balance'));
            return false;
        }

        var total = (balance.pending[0].amount + balance.available[0].amount) / 100;

        return future.return(total);
    });

    return future.wait();
};