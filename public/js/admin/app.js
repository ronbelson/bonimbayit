


angular.module('Admin', ['ui.router','angularjs-dropdown-multiselect'])

.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'home.html',
      controller: 'MainCtrl',
      resolve: {
          contractorsPromise: ['Contractors', function(Contractors){
            return Contractors.getAll();
          }]
        }
    });
 
 $stateProvider
  .state('contractor', {
	  url: '/contractor/{id}',
	  templateUrl: '/contractor.html',
	  controller: 'ContractorCtrl',
    resolve: {
              ContractorPromise: ['$stateParams', 'Contractor', function($stateParams, Contractor) {
                return Contractor.getByid($stateParams.id);
              }]
            }
		});

  $stateProvider
  .state('user', {
    url: '/user/{emailorphone}',
    templateUrl: '/user.html',
    controller: 'UserCtrl',
    resolve: {
              UserPromise: ['$stateParams', 'User', function($stateParams, User) {
                return User.getByPhoneOrEmail($stateParams.emailorphone);
              }]
            }
    });

  $urlRouterProvider.otherwise('/');

  

}])

.factory("AdminService",['$http', function($http){
  var areas =[ {id: 'תל אביב', label: "תל אביב"}, {id: 'השרון', label: "השרון"}, {id: 'חדרה', label: "חדרה"}];
  var contractor_status = [{label: 'רק הוכנס', id: '1111'},{label: 'פעיל', id: '2222'},{label: 'מחוק', id: '3333'},{label: 'ממתין לממליצים מהקבלן', id: '4444'},{label: 'עדיין לא נוצר קשר עם הקבלן', id: '5555'},{label: 'הקבלן בישק לחזור אליו', id: '6666'},{label: 'הקבלן אמור להתקשר להמשך הטיפול', id: '7777'}];
  var areas_customTexts = {buttonClasses: 'btn btn-default btn-md',buttonDefaultText: 'בחר אזורים',checkAll: 'בחר את כולם',uncheckAll: 'הסר את כולם', dynamicButtonTextSuffix: 'נבחרו'}  
  var types_customTexts =  {buttonClasses: 'btn btn-default btn-md',buttonDefaultText: 'בחר סוג קבלן',checkAll: 'בחר את כולם',uncheckAll: 'הסר את כולם', dynamicButtonTextSuffix: 'נבחרו'}  
  return {
    get_areas: function() {
      return areas;
    },
    get_contractor_status: function() {
      return contractor_status;
    },
    get_areas_customTexts: function() {
      return areas_customTexts;
    },
    get_types_customTexts: function() {
      return types_customTexts;
    },
    
  }

}])


.factory('Contractor', ['$http', function($http){
  var o = {
    contractor: []
  };
  o.getByid = function(id) {
    o.contractor = {};
    return $http.get('/admin/contractors/'+id).success(function(data){
      angular.copy(data, o.contractor);

    });
  };
  
  o.feedDelete = function(feedback) {
    //console.log(feedback) 
    return $http.post('/admin/contractors/feedback/delete', feedback).success(function(data){
      console.log(data) 
    }).
      error(function(data, status, headers, config) {
        console.log(data);
        console.log(status);
        console.log(headers);
        console.log(config);
        
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
  };
  o.feedAdd = function(contractor_feedback) {
  //console.log(contractor_feedback)
  return $http.post('/admin/contractors/feedback', contractor_feedback).success(function(data){
      o.contractor.feedbacks.unshift(data);
      $('#feedbacksAdd').toggle( "slow", function() {
           

        });
       
    }).
      error(function(data, status, headers, config) {
        console.log(data);
        console.log(status);
        console.log(headers);
        console.log(config);
        
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
  };
  o.update = function(contractor) {
 
  return $http.post('/admin/contractors/update', contractor).success(function(data){

      $('#message').show( "slow", function() {
          setInterval(function() {
                $('#message').hide(500);
          }, 4000);

        });
    }).
      error(function(data, status, headers, config) {
        console.log(data);
        console.log(status);
        console.log(headers);
        console.log(config);
        
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
  };
   
  return o;
}])

.factory('Contractors', ['$http', function($http){
  var o = {
    contractors: []
  };
  o.getAll = function() {

    return $http.get('/admin/contractors').success(function(data){
      angular.copy(data, o.contractors);
    });
  };
  o.create = function(contractor) {
  return $http.post('/admin/contractors', contractor).success(function(data){
      o.contractors.unshift(data);
    });
  };

 
  return o;

}])  

.factory('User', ['$http', function($http){
  var o = {
    user: []
  };
  o.getByPhoneOrEmail = function(emailorphone) {
    o.user= [];
    return $http.get('/admin/userfind/'+angular.lowercase(emailorphone)).success(function(data){
      angular.copy(data, o.user);
    });
  };
  
  return o;

}])  

 

.controller('ContractorCtrl', [
'$scope',
'Contractors',
'Contractor',
'AdminService',
'$http',
function($scope, Contractors, Contractor, AdminService,$http){
    $scope.contractor = null
    $scope.contractor = Contractor.contractor;
    $scope.contractor_status = AdminService.get_contractor_status();
   
    $scope.areas_data = [];
    $http.get('/json/areas_types.json').success(function(data) {
          $scope.areas_data =  angular.fromJson(data);
         
      });
    $scope.contractor_status = AdminService.get_contractor_status();
    $scope.areas_customTexts = AdminService.get_areas_customTexts();
    $scope.types_customtexts = AdminService.get_types_customTexts();
    $scope.contractor_types_data =[]
    $http.get('/json/contractor_types.json').success(function(data) {
        $scope.contractor_types_data =  angular.fromJson(data);
        
    });
    
     $scope.forwardsToggle= function(){
      
        $( "#forwardsToogleDiv" ).toggle( "slow", function() {
           
        });
      
     }

    $scope.Deletefeedback = function(_id,index,contractor_id){
      
      Contractor.feedDelete(
          {
             _id: _id,
             index:index,
             contractor_id:contractor_id
          }
       
        ).then(function (response){
          $scope.contractor.feedbacks.splice(index, 1);
         });
      
    }

    $scope.Addfeedback = function(){
      if(!$scope.contractor.feedback || $scope.contractor.feedback.feed === '' || !$scope.contractor.feedback.author || $scope.contractor.feedback.author ===''){ return; }
      var _id = $scope.contractor._id;
      var feedback = JSON.stringify($scope.contractor.feedback)
      Contractor.feedAdd(
          {
             _id: _id,
             feedbacks: feedback
          }
       
        )
      //console.log(feedback)
      $scope.contractor.feedback.feed = '';
      $scope.contractor.feedback.phone = '';
      $scope.contractor.feedback.email = '';
      $scope.contractor.feedback.town = '';
      $scope.contractor.feedback.author = '';
      
    }

    $scope.updateContractor = function(){
      if(!$scope.contractor.name || $scope.contractor.name === '' || !$scope.contractor.phone || $scope.contractor.phone === '' || !$scope.contractor.company_name || $scope.contractor.company_name === '' ) { return; }
      //console.log($scope.contractor)
      Contractor.update({
         _id: $scope.contractor._id,
         name: $scope.contractor.name,
         company_name: $scope.contractor.company_name,
         phone: $scope.contractor.phone,
         contractor_types: $scope.contractor.contractor_types,
         email: $scope.contractor.email,
         status: $scope.contractor.status,
         payment_method: $scope.contractor.payment_method,
         address: $scope.contractor.address,
         comment: $scope.contractor.comment,
         areas: $scope.contractor.areas,
         date_published: $scope.contractor.date_published 

        });
    };



    }
    
  
])



.controller('UserCtrl', [
'$scope',
'User',
'AdminService',
'$http',
function($scope,User,AdminService,$http){
 
 $scope.user = User.user;

 

  

}])

.controller('MainCtrl', [
'$scope',
'Contractors',
'AdminService',
'$http',
function($scope,Contractors,AdminService,$http){

 $scope.contractor_status = AdminService.get_contractor_status();
 $scope.contractors = Contractors.contractors;
 $scope.areas_data = [];
 $http.get('/json/areas_types.json').success(function(data) {
        $scope.areas_data =  angular.fromJson(data);
       
    });
 $scope.types_customtexts = AdminService.get_types_customTexts();
 $scope.areas_customTexts = AdminService.get_areas_customTexts();
 $scope.contractor_types_data =[]
 $http.get('/json/contractor_types.json').success(function(data) {
        $scope.contractor_types_data =  angular.fromJson(data);
       
    });
 
 $scope.areas  = [];
 $scope.contractor_types  = [];


 $scope.addContractor = function(){
 
  if(!$scope.contractor_types || $scope.contractor_types === ''  || !$scope.name || $scope.name === '' || !$scope.phone || $scope.phone === '' || !$scope.company_name || $scope.company_name === '' ) { return; }
  Contractors.create(
  			{name: $scope.name,
         company_name: $scope.company_name,
  			 phone: $scope.phone,
  			 email: $scope.email,
         areas: $scope.areas,
         address: $scope.address,
         contractor_types: $scope.contractor_types,
         date_created: new Date()
  			 
  			});
  $('#addcontractor').modal('hide');
  $scope.name = '';
  $scope.company_name = '';
  $scope.phone = '';
  $scope.email = '';
  $scope.address = '';
  $scope.comment = '';
  $scope.status = 0;
  $scope.areas = [];
  $scope.contractor_types=[];


};


 
  

}]);




 