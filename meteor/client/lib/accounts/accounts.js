accountsUIBootstrap3.logoutCallback = function (error) {
    if (error) {
        console.log("Error:", error);
    }

    Router.go('home');
};

Accounts.onLogin(function () {
    Router.go('profile');
});
