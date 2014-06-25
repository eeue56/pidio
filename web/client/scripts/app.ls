angular.module 'pidio', []

.factory
  API: require './services/API',
  Search: require './services/Search'

.controller
  QueueController: require './controllers/QueueController'
  SearchController: require './controllers/SearchController'
  StateController: require './controllers/StateController'

.directive
  queue: require './directives/queue'
  search: require './directives/search'
