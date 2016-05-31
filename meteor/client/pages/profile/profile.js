Template.profile.helpers({
    name: function () {
        return UserHelper.getFullName(this.user);
    },
    email: function () {
        return UserHelper.getEmail(this.user);
    },
    offerOptions: function () {
        return {
            panelClass: 'success',
            type: 'credits',
            icon: 'fa fa-money',
            title: 'template.offer.credits.title',
            price: {
                before: 'template.offer.credits.discount',
                after: 'template.offer.credits.price'
            },
            li: [
                'template.offer.credits.li.1',
                'template.offer.credits.li.2'
            ],
            buttonClass: 'success',
            button: 'template.offer.credits.buy',
            form: {
                value: 1,
                min: 1,
                max: 120,
                helpText: 'template.offer.credits.form.help-text',
                tooltip: 'template.offer.credits.buy'
            },
            stripe: {
                description: 'template.offer.credits.stripe.description',
                method: 'buyCredits',
                callback: function (data) {
                    openTransactionSuccessAlert({
                        data: data,
                        confirmButtonText: 'template.offer.credits.confirm',
                        callback: function () {
                            Router.go('participate');
                        }
                    });
                }
            }
        };
    }
});
