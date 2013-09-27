'use strict';
angular.module('ContactManager')
.factory('contactService', function($http, $q, FlashService, $location) {
  var authEmail = 'anenthvishnu@gmail.com';
  var url = 'http://ui-proj.practodev.in/contacts';
  /**
   * [sendRequestToServer Function used for sending request to the server]
   * @param  {[String]} type [ the type of request]
   * @param  {[String]} data [ the payload ]
   * @param  {[boolean]} alert [ disable/enable alerts ]
   */
   var sendRequestToServer = function(type, url, data, alert){
    $http({
      method: type,
      url:url,
      data: data,
      headers:{'X-USER':authEmail, 'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(data, status){
      if(status === 201 && alert){
        FlashService.show('Contact added', 'success');
        $location.path('../');
      }
    }).error(function(data){
      if(alert){
        for(var i in data){
          FlashService.show(data[i], 'danger');
        }
      }
    });
  };
  var search = function(DataSet, id){
    for(var i in DataSet){
      if(DataSet[i].id == id){
        return i;
      }
    }
  };

  return{
    /**
     * [list fetchs all the contacts from the server and save it to localStorage and if there is internet access , it checks if there is any data to be synced and send the request to the server]
     * @return {[object]} [contact objects from localStorage]
     */
     list: function(){
      if(navigator.onLine){
        if(localStorage.getItem('contactsAdded')){
          var data = JSON.parse(localStorage.getItem('contactsAdded'));
          for(var i in data){
            sendRequestToServer('POST', url, $.param(data[i]));
          }
          localStorage.removeItem('contactsAdded');
        }
        if(localStorage.getItem('contactsUpdated')){
          var data = JSON.parse(localStorage.getItem('contactsUpdated'));
          var urlNew;
          for(var i in data){
            urlNew = url + '/' + data[i].id;
            sendRequestToServer('PUT', urlNew, $.param(data[i]));
          }
          localStorage.removeItem('contactsUpdated');
        }
        if(localStorage.getItem('contactsDeleted')){
          var data = JSON.parse(localStorage.getItem('contactsDeleted'));
          var urlNew;
          for(var i in data){
            urlNew = url + '/' + data[i];
            sendRequestToServer('DELETE', urlNew);
          }
          localStorage.removeItem('contactsDeleted');
        }
        return $http({
          method:'GET',
          url:url,
          headers:{'X-USER':authEmail}
        }).success(function(data, status){
          if( status === 200){
            localStorage.setItem('contacts', JSON.stringify(data.contacts));
          }
        });
      }else{
        return $q.when(JSON.parse(localStorage.getItem('contacts')));
      }
    },
    /**
     * [newContact Creates new contact object in the server]
     * @param  {[js param object]} data [the object which contains all the details]
     * @return {[http object]} [http object for furture processing from the calling function]    
     */
     newContact: function(data){

      if(navigator.onLine){
        sendRequestToServer('POST',url , data, true);
      }else{
        /**
        * Covertion from param to JSON and pushing to the localStorage
        * Master data is the actual data to be on the server
        * Slave data is to be saved to the Server 
        * Slave data is been saved to the localStorage for future sync 
        **/
        var data = decodeURIComponent(data);
        var dataJson = JSON.parse('{"' + decodeURI(data).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
        var dataSetMaster = JSON.parse(localStorage.getItem('contacts'));
        var dataSetSlave = JSON.parse(localStorage.getItem('contactsAdded'));
        dataSetMaster.push(dataJson);
        //check if the localStorage exsists
        if(dataSetSlave){
          dataSetSlave.push(dataJson);
          localStorage.setItem('contactsAdded', JSON.stringify(dataSetSlave));
        }
        else{
          localStorage.setItem('contactsAdded', JSON.stringify(Array(dataJson)));
        }
        localStorage.setItem('contacts', JSON.stringify(dataSetMaster));
        FlashService.show('Contact added', 'success');
        $location.path('../');
      }
    },
    /**
     * [get fetch individual contact]
     * @param  {[number]} id [unique contact id]
     * @return {[http object]} [http object for furture processing from the calling function]
     */
     get: function(id){
      if(navigator.onLine){
        return $http({
          method:'GET',
          url:url + '/' + id,
          headers:{'X-USER':authEmail}
        });
      }else{
        var data = JSON.parse(localStorage.getItem('contacts'));
        var contact = $.grep(data, function(e){return e.id == id} );
        return $q.when(contact);
      }

    },
    /**
     * [update updates the individual contact]
     * @param  {[number]} params [unique contact id]
     * @param  {[js param object]} data   [object with changed values]
     * @return {[http object]} [http object for furture processing from the calling function]
     */
     update: function(params, data){
      if(navigator.onLine){
        var urlNew = url + '/' + params;
        sendRequestToServer('PUT', urlNew, data, true);
      }else{
        /**
        * Covertion from param to JSON and pushing to the localStorage
        * Master data is the actual data to be on the server
        * Slave data is to be saved to the Server 
        * Slave data is been saved to the localStorage for future sync 
        **/
        var data = decodeURIComponent(data);
        var dataJson = JSON.parse('{"' + decodeURI(data).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
        var dataSetMaster = JSON.parse(localStorage.getItem('contacts'));
        var dataSetSlave = JSON.parse(localStorage.getItem('contactsUpdated'));
        var i = search(dataSetMaster, params);
        dataSetMaster.splice(i, 1);
        dataSetMaster.push(dataJson);
        //check if the localStorage exsists
        if(dataSetSlave){
          dataSetSlave.push(dataJson);
          localStorage.setItem('contactsUpdated', JSON.stringify(dataSetSlave));
        }
        else{
          localStorage.setItem('contactsUpdated', JSON.stringify(Array(dataJson)));
        }
        localStorage.setItem('contacts', JSON.stringify(dataSetMaster));
        FlashService.show('Contact Updated', 'success');
        $location.path('../');
      }
    },
    /**
     * [delete deletes the contact object]
     * @param  {[number]} params [unique contact id]
     * @return {[http object]} [http object for furture processing from the calling function]
     */
     delete: function(params){
        if(navigator.onLine){
          var urlNew = url + '/' + params;
          sendRequestToServer('DELETE', urlNew, null, true);
        }else{
          /**
          * Master data is the actual data to be on the server
          * Slave data is to be saved to the Server 
          * Slave data is been saved to the localStorage for future sync 
          **/
          var dataSetMaster = JSON.parse(localStorage.getItem('contacts'));
          var dataSetSlave = JSON.parse(localStorage.getItem('contactsDeleted'));
          
          var i = search(dataSetMaster, params);
          dataSetMaster.splice(i, 1);
          //check if the localStorage exsists
          if(dataSetSlave){
            dataSetSlave.push(params);
            localStorage.setItem('contactsDeleted', JSON.stringify(dataSetSlave));
          }
          else{
            var temp = [];
            temp.push(params);
            localStorage.setItem('contactsDeleted', JSON.stringify(temp));
          }
          localStorage.setItem('contacts', JSON.stringify(dataSetMaster));
          FlashService.show('Contact Deleted', 'success');
        }
    }
  };
});