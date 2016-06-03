Template.profileFileActions.events({
    'click .convert': function (event, template) {
        const button = $(event.target);

        if (button.is(':disabled')) {
            return false;
        }

        button.prop('disabled', true);

        // TODO: ask output format before call method
        const outputFormat = 'ogg';

        Meteor.call('convertFile', template.data.doc._id, outputFormat, error => {
            if (error) {
                // TODO: display error for user
                console.log(error);
            }

            button.prop('disabled', false);
        });
    }
});
