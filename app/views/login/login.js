var frameModule = require("ui/frame");
var dialogsModule = require("ui/dialogs");
var UserViewModel = require("../../shared/view-models/user-view-model");
var user = new UserViewModel();

// To mock user details
// var Observable = require("data/observable").Observable;
// var user = new Observable({
//     email: "user@domain.com",
//     password: "password"
// });

var page;
var email;

exports.loaded = function(args) {
    console.log("login is loading...");
    page = args.object;
    if (page.ios) {
	    var navigationBar = frameModule.topmost().ios.controller.navigationBar;
	    navigationBar.barStyle = UIBarStyle.UIBarStyleBlack;
	}
    page.bindingContext = user;
};

exports.signIn = function() {
    console.log("Signing in ...");
    user.login()
    	.catch(function(error) {
            console.log(error);
            dialogsModule.alert({
                message: "Unfortunately we could not find your account.",
                okButtonText: "OK"
            });
            return Promise.reject();
        })
    	.then(function() {
            frameModule.topmost().navigate("views/list/list");
        });
};

exports.register = function() {
   	console.log("registering...");
    var topmost = frameModule.topmost();
    topmost.navigate("views/register/register");
};