'use strict';

angular.module('ContactManager')
.controller('EditCtrl',['$scope', 'contactService', '$routeParams', '$location', function ($scope, contactService, $routeParams, $location) {
	/**
	 * Get the data for the given id
	 */
	contactService.get($routeParams.id).then(function(data,status){
			if(data.contacts)
				data = data.contacts;
			else
				data = data[0];
			$scope.inputName = data.contact_name;
			$scope.inputPhone = data.contact_phone;
			$scope.inputEmail = data.contact_email;
			$scope.id = data.id;
			$scope.editPage = true; // for displaying the edit button 
		
	});
/**
 * [addContact overrides the function in the addContactPage ]
 */
	$scope.addContact = function(){
		contactService.update($routeParams.id, $.param({
			contact_name : $scope.inputName,
			contact_phone : $scope.inputPhone,
			contact_email : $scope.inputEmail,
			id : $scope.id
		}));
	};
}]);
