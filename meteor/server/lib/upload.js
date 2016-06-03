Meteor.startup(function () {
    UploadServer.init({
        tmpDir: `${Meteor.settings.data}/tmp`,
        uploadDir: Meteor.settings.data,
        checkCreateDirectories: true
    });
});
