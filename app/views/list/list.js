var dialogsModule = require("ui/dialogs");
var observableModule = require("data/observable")
var ObservableArray = require("data/observable-array").ObservableArray;
var GroceryListViewModel = require("../../shared/view-models/grocery-list-view-model");
var socialShare = require("nativescript-social-share");
var swipeDelete = require("../../shared/utils/ios-swipe-delete");

var page;

var groceryListStatic = new ObservableArray([
		{name: "egg"},
		{name: "bread"},
		{name: "cereal"}
	]);

var groceryListServer = new GroceryListViewModel([]);

var pageData = new observableModule.fromObject({
    groceryList: groceryListServer,
    grocery: ""
});

exports.loaded = function(args) {
   	console.log("loading...");
    page = args.object;

    // Enabling swipe to delete for iOS
    if (page.ios) {
	    var listView = page.getViewById("groceryList");
	    swipeDelete.enable(listView, function(index) {
	        groceryList.delete(index);
	    });
	}
	
    var listView = page.getViewById("groceryList");
    page.bindingContext = pageData;

    groceryListServer.empty();
   	pageData.set("isLoading", true);
	groceryListServer.load().then(function() {
	    pageData.set("isLoading", false);
	    listView.animate({
	    	opacity: 1,
	    	duration: 1000
	    });
	});	

};

exports.add = function() {
   	console.log("adding...");
     // Check for empty submissions
     if (pageData.get("grocery").trim() === "") {
         dialogsModule.alert({
             message: "Enter a grocery item",
             okButtonText: "OK"
         });
         return;
     }

    // Dismiss the keyboard
    page.getViewById("grocery").dismissSoftInput();
    groceryListServer.add(pageData.get("grocery"))
        .catch(function() {
            dialogsModule.alert({
                message: "An error occurred while adding an item to your list.",
                okButtonText: "OK"
            });
        });

    // Empty the input field
    pageData.set("grocery", "");
};

exports.share = function() {
   	console.log("sharing...");
    var list = [];
    var finalList = "";
    for (var i = 0, size = groceryListServer.length; i < size ; i++) {
        list.push(groceryListServer.getItem(i).name);
    }
    var listString = list.join(", ").trim();
    console.log("share: ", listString);
    socialShare.shareText(listString);
};

exports.delete = function(args){
   	console.log("deleting...");
	var item = args.view.bindingContext;
	var index = groceryListServer.indexOf(item);
	groceryListServer.delete(index);
}