


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
                return Contractor.get($stateParams.id);
              }]
            }
		});

  $urlRouterProvider.otherwise('/');

  

}])


.factory('Contractor', ['$http', function($http){
  var o = {
    contractor: []
  };
  o.get = function(id) {
    return $http.get('/admin/contractors/'+id).success(function(data){
      angular.copy(data, o.contractor);
    });
  };
  o.update = function(contractor) {
    console.log(contractor)
 
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

  o.get = function(id) {
  return $http.get('/admin/contractors/' + id).then(function(res){
    return res.data;
  });
};
  return o;

}])  


.controller('ContractorCtrl', [
'$scope',
'Contractors',
'Contractor',
function($scope, Contractors, Contractor){

		$scope.contractor = Contractor.contractor
    $scope.contractor_status = [{name: 'פעיל', value: 1},{name: 'מחןק', value: 2},{name: 'ממתין', value: 0}];
    $scope.contractor.areas = $scope.contractor.areas; 
    $scope.areas_data = [ {id: 'תל אביב', label: "תל אביב"}, {id: 'השרון', label: "השרון"}, {id: 'חדרה', label: "חדרה"}];
    $scope.areas_customTexts = {buttonClasses: 'btn btn-default btn-md',buttonDefaultText: 'בחר אזורים',checkAll: 'בחר את כולם',uncheckAll: 'הסר את כולם', dynamicButtonTextSuffix: 'נבחרו'}
    

    $scope.updateContractor = function(){
      //if(!$scope.contractor.name || $scope.contractor.name === '' || !$scope.contractor.phone || $scope.contractor.phone === '' || !$scope.contractor.company_name || $scope.contractor.company_name === '' ) { return; }
      //console.log($scope.contractor)
      Contractor.update({
         _id: $scope.contractor._id,
         name: $scope.contractor.name,
         company_name: $scope.contractor.company_name,
         phone: $scope.contractor.phone,
         email: $scope.contractor.email,
         status: $scope.contractor.status,
         payment_method: $scope.contractor.payment_method,
         address: $scope.contractor.address,
         comment: $scope.contractor.comment,
         areas: $scope.contractor.areas
        });
    };



    }
    
  
])

.controller('MainCtrl', [
'$scope',
'Contractors',
function($scope,Contractors){

 $scope.contractors = Contractors.contractors;
 $scope.areas_data = [ {id: 'תל אביב', label: "תל אביב"}, {id: 'השרון', label: "השרון"}, {id: 'חדרה', label: "חדרה"}];
 $scope.areas_customTexts = {buttonClasses: 'btn btn-default btn-md',buttonDefaultText: 'בחר אזורים',checkAll: 'בחר את כולם',uncheckAll: 'הסר את כולם', dynamicButtonTextSuffix: 'נבחרו'}
 $scope.areas  = [];

 $scope.addContractor = function(){
 
  if(!$scope.name || $scope.name === '' || !$scope.phone || $scope.phone === '' || !$scope.company_name || $scope.company_name === '' ) { return; }
  Contractors.create(
  			{name: $scope.name,
         company_name: $scope.company_name,
  			 phone: $scope.phone,
  			 email: $scope.email,
         status: 0,
         areas: $scope.areas,
         address: $scope.address,
         date_created: new Date()
  			 
  			});
  $('#addcontractor').modal('hide');
  $scope.name = '';
  $scope.company_name = '';
  $scope.phone = '';
  $scope.email = '';
  $scope.address = '';

};


 
  

}]);




 