'use strict';

angular.module('ContactManager')
.controller('AddCtrl',['$scope', 'contactService', '$location', function ($scope, contactService, $location) {
	$scope.addContact = function(){
		contactService.newContact($.param({
			contact_name : $scope.inputName,
			contact_phone : $scope.inputPhone,
			contact_email : $scope.inputEmail
		}));
		
	};
}]);
