Meteor.methods({
    buyCredits: function (tokenId, amount, quantity) {
        checkAuthorization();
        quantity = parseInt(quantity);
        checkQuantity(quantity);

        var offer = new Credits(quantity).setReductions().setTaxes();
        checkPrice(amount, offer);

        // Create charge and set subscription
        var chargeId = createCharge(tokenId, amount);
        var user = Meteor.user();

        // Updating user
        var before = _.has(user.profile, 'credits') ? parseInt(user.profile.credits) : 0;
        var after = before + quantity;

        Meteor.users.update(user._id, {
            $set: {
                'profile.credits': after
            }
        });

        // Email for subscriber
        // sendPaymentEmail(user);

        return getSuccessChargeData(chargeId, offer);
    }
});

function checkAuthorization () {
    if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
    }
}

function checkQuantity (quantity) {
    if (quantity < 1 || quantity > 120) {
        throw new Meteor.Error('bad-request');
    }
}

function checkPrice (amount, offer) {
    if (parseInt(amount) !== parseInt(offer.getCents())) {
        throw new Meteor.Error('bad-request');
    }
}

function sendPaymentEmail (user) {
    var subject = 'Payment achieved !';

    Email.send({
        to: UserHelper.getEmail(user),
        from: 'no-reply@transocde.com',
        subject: subject,
        html: getEmailHtml('payment', {
            email: UserHelper.getEmail(user),
            subject: subject
        })
    });
}