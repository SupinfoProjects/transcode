Template.profile.helpers({
    name: function () {
        return UserHelper.getFullName(this.user);
    },
    email: function () {
        return UserHelper.getEmail(this.user);
    },
    credits: function () {
        return UserHelper.getCredits(this.user);
    },
    uploadFormData: function () {
        return {
            privateKey: this.user.privateKey
        };
    },
    diskUsage: function () {
        return numeral(this.user.profile.diskUsage).format('0.00 b');
    },
    gravatar: function () {
        return Gravatar.imageUrl(UserHelper.getEmail(this.user), {
            size: 75,
            default: 'mm'
        });
    }
});

Template.profile.events({
    'click #upload-from-url': function (event) {
        const input = $('#file-url');
        const url = input.val().trim();

        if (url) {
            const button = $(event.target);

            if (button.is(':disabled')) {
                return false;
            }

            button.prop('disabled', true);

            Meteor.call('uploadFromUrl', url, err => {
                if (err) {
                    swal('Error', err.reason, 'error');
                } else {
                    swal('File uploaded', 'The file has been uploaded.', 'success');
                    input.val('');
                }

                button.prop('disabled', false);
            });
        }
    }
});