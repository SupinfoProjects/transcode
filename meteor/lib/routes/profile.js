Router.route('/profile', {
    name: 'profile',
    template: 'profile',
    onBeforeAction: function () {
        if (!Meteor.userId()) {
            this.render('notFound');
            return false;
        }
        this.next();
    },
    waitOn: function () {
        return [
            Meteor.subscribe('profile')
        ];
    },
    data: function () {
        if (this.ready()) {
            return {
                user: Meteor.user()
            };
        }
    }
});