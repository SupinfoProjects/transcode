var parameters = [{
    service: 'google',
    key: 'google',
    setKey: 'clientId'
}, {
    service: 'facebook',
    key: 'facebook',
    setKey: 'appId'
}];

parameters.forEach(function (options) {
    var values = {
        loginStyle: 'popup',
        secret: Meteor.settings[options.key].secret
    };

    values[options.setKey] = Meteor.settings[options.key].clientId;

    ServiceConfiguration.configurations.upsert(
        { service: options.service },
        { $set: values }
    );
});
