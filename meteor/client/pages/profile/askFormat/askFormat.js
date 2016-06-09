Template.profileAskFormat.helpers({
    formats: function () {
        return _.without(
            this.doc.isAudio
                ? Meteor.settings.public.formats.audio
                : Meteor.settings.public.formats.video,
            this.doc.ext
        );
    }
});
