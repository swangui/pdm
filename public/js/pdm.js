var pdm = angular.module('pdm', [])

.config(function($interpolateProvider){
        $interpolateProvider.startSymbol('{%').endSymbol('%}');
    }
)

.controller('HomeCtrl', function($scope) {
  $scope.hello = 'hello world';
  $scope.conf = conf;
  $scope.conf.app_loginurl = $scope.conf.app_loginurl.replace(/&amp;/g,'&');
})
