angular.module('flapperNews', [])
.factory('constractors', [function(){
  var o = {
    constractors: []
  };
  return o;
}])

.controller('MainCtrl', [
'$scope',
'constractors',
function($scope,constractors){
  //$scope.test = 'Hello world!';
$scope.constractors = constractors.constractors;

$scope.addConstractor = function(){
  if(!$scope.name || $scope.name === '' || !$scope.upvotes || $scope.upvotes === '') { return; }
  $scope.constractors.push({name: $scope.name, upvotes: $scope.upvotes});
  $scope.name = '';
  $scope.upvotes = '';
};



  $scope.constractors = [
  {name: 'גלעד', upvotes: 5},
  {name: 'רמי', upvotes: 2},
  {name: 'אחמד', upvotes: 15},
  {name: 'שלמה', upvotes: 9},
  {name: 'רון', upvotes: 4}

];
}]);


 