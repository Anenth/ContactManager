'use strict';

angular.module('ContactManager')
.controller('HomeCtrl', ['$scope','contactService', function ($scope, contactService) {
/**
* [fetchContacts Fetches all the contacts from the sever/localStorage]
* 
*/
var fetchContacts = function(){
	contactService.list().then(function(data){
			/**
			* checking the data is from server or localStorage
			* the data is stored in LocalStorage without the contact attribute
			**/
			if(data.data) 
				$scope.contacts = data.data.contacts;		
			else
				$scope.contacts = data;
		});

};

fetchContacts();
	/**
	* [delete Sends delete request to the server]
	* @param  {[string]} name [contact name, used for displaying in the confirmBox]
	* @param  {[number]} id   [used to send the delete request to server]
	* @return {[type]}      [description]
	*/
	$scope.delete = function(name, id){
		var confirmValue=confirm('You are about to delete contact for"' + name + '". Proceed ?');
		if(confirmValue){
			contactService.delete(id);
			fetchContacts();
		}
	}
}]);

/*$scope.contacts = contactService.list();
console.log($scope.contacts.contacts);*/