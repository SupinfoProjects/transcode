Template.offer.onCreated(function () {
    this.data.value                 = new ReactiveVar(this.data.form ? this.data.form.value : 1);
    this.data.offer                 = new ReactiveVar();
    this.data.offerWithoutReduction = new ReactiveVar();

    this.computation = null;
    var self = this;

    self.autorun(function () {
        self.data.offer.set(getOffer(self.data).setReductions().setTaxes());
        self.data.offerWithoutReduction.set(getOffer(self.data).setTaxes());
    });
});

Template.offer.helpers({
    priceWithReduction: function () {
        return this.offer.get().getTotal();
    },
    priceWithoutReduction: function () {
        return this.offerWithoutReduction.get().getTotal();
    },
    formValue: function () {
        return this.value.get();
    },
    helpTextCount: function () {
        return parseInt(this.value.get());
    },
    discount: function () {
        return this.offer.get().getCents() < this.offerWithoutReduction.get().getCents();
    }
});

Template.offer.events({
    'click .buy': function (event, template) {
        var form = template.$('.form-buy');

        if (form.length) {
            // Flip others
            $('.form-info').not(form).each(function () {
                if ($(this).is(':visible')) {
                    $(this).hide().removeClass('animated flipInX');
                    $(this).closest('div').find('.info').show().addClass('animated flipInX');
                }
            });

            // Flip target
            $(event.target).hide().removeClass('animated flipInX');
            form.show().addClass('animated flipInX');
        }
    },
    'click .increase-number': function (event, template) {
        event.stopPropagation();
        var value = parseInt(template.data.value.get());

        // Check max
        if (value >= template.data.form.max) {
            return false;
        }

        // Increase value
        value++;
        template.data.value.set(value);
    },
    'keydown .number, keyup .number, change .number': function(event, template) {
        var input = $(event.target);
        var value = input.val();

        // Check min
        if (value && value < template.data.form.min) {
            template.data.value.set(template.data.form.min);
            return false;
        }

        // Check max
        if (value && value > template.data.form.max) {
            input.val(template.data.form.max);
            template.data.value.set(template.data.form.max);
            return false;
        }

        // Set value
        if (value) {
            template.data.value.set(value);
        }
    },
    'submit .form-buy': function (event, template) {
        event.preventDefault();
        var form = $(event.target);
        toggleButtonState(form);
        openCheckoutModal(template.data, event, function () {
            toggleButtonState(form);
        });
    }
});

function toggleButtonState (container) {
    var buttons = findButtons(container);

    // Toggle state
    buttons.each(function () {
        var button = $(this);
        var state = button.attr('data-state');

        setButtonState(button, state !== 'enabled');
    });
}

function setButtonState (button, enable) {
    if (typeof button === 'string') {
        button = $(button);
    }

    var disabledClass = button.attr('data-disabled-class');

    if (enable) {
        button.attr('data-state', 'enabled').prop('disabled', false);
        disabledClass && button.removeClass(disabledClass);
    } else {
        button.attr('data-state', 'disabled').prop('disabled', true);
        disabledClass && button.addClass(disabledClass);
    }
}

function findButtons (container) {
    if (container === undefined) {
        container = 'body';
    }

    if (typeof container === 'string') {
        container = $(container);
    }

    return container.find('button[data-state]');
}

function openCheckoutModal (data, event, callback) {
    // Log in
    if (!Meteor.user()) {
        Alert.open('info.not-connected');
        callback();
        return false;
    }

    var handler = new StripeHandler();
    var offer = getOffer(data);

    // Configure success callback
    handler.configure(function (token) {
        Meteor.call(data.stripe.method, token.id, offer.getCents(), offer.quantity, function (error, result) {
            if (error) {
                Alert.open(error);
                return false;
            }

            data.stripe.callback(result);
        });
    });

    // Open checkout modal
    handler.open({
        description: TAPi18n.__(data.stripe.description, {
            count: parseInt(offer.quantity)
        }),
        amount: offer.setTaxes().getCents(),
        closed: function () {
            callback();
        }
    });
}

function getOffer (data) {
    var type = getType(data.type);

    return new type(data.value.get());
}

function getType (type) {
    var result = null;

    switch (type) {
        case 'credits':
            result = Credits;
            break;
        default:
            throw new Error('Invalid type');
    }

    return result;
}
