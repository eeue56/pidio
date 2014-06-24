module.exports = ($scope, Search)
  $scope.search = ''
  $scope.results = []

  $scope.validate = () ->
    Search.validate $scope.search

  $scope.executeSearch = () ->
    Search.query $scope.search
    .then (res) -> $scope.results = res
    .fail (err) -> $scope.error = err

