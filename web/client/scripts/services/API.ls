'''
API Factory
-----------
Provides promise based API methods
'''

module.exports = ($http) ->
  add: $http.get '/add'
  play: $http.get '/play'
  pause: $http.get '/pause'
  toggle: $http.get '/toggle'
