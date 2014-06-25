module.exports = ($scope, API) ->
  $scope.playing = false

  $scope.pause = ->
    $scope.playing = false
    API.pause!

  $scope.play = ->
    $scope.playing = true
    API.play!

  API.state
  .then -> $scope.playing = it

