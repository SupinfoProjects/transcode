UserHelper = class UserHelper {
    static getEmail (user) {
        let type = _.keys(user.services)[0];

        if (type === 'password') {
            let emails = user instanceof Array ? user : user.emails;

            if (emails && emails.length) {
                let email = emails[0];

                if (email.address) {
                    return email.address;
                }
            }
        } else if (type === 'facebook' || type === 'google') {
            return user.services[type].email;
        } else {
            return false;
        }
    }
    static getFullName (user) {
        return _.has(user, 'profile') && user.profile.name;
    }
};