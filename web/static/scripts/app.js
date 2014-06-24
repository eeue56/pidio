(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
angular.module('hopper', ['ngRoute', 'firebase', 'ngSanitize', 
  'btford.markdown'])

.config(function($routeProvider) {
  $routeProvider
  .when('/auth', {
    templateUrl: '/partials/auth.html'
  })
  .when('/projects', {
    templateUrl: '/partials/projects.html',
    controller: 'ProjectsController'
  })
  .when('/project/:id', {
    templateUrl: '/partials/queues.html',
    controller: 'QueuesController'
  })
  .otherwise({
    redirectTo: '/auth'
  });
})

.factory({
  Firebase: require('./services/Firebase'),
  Notify: require('./services/Notify'),
  Modal: require('./services/Modal')
})

.filter({
  capitalize: require('./filters/capitalize')
})

.controller({
  QueuesController: require('./controllers/QueuesController'),
  ProjectsController: require('./controllers/ProjectsController'),
  CrumbController: require('./controllers/CrumbController')
})

.directive({
  draggable: require('./directives/draggable'),
  focusWhen: require('./directives/focusWhen'),
  hopperProject: require('./directives/hopperProject'),
  hopperQueue: require('./directives/hopperQueue'),
  hopperTask: require('./directives/hopperTask'),
  modal: require('./directives/modal'),
  modalManager: require('./directives/modalManager')
})

},{"./controllers/CrumbController":2,"./controllers/ProjectsController":3,"./controllers/QueuesController":4,"./directives/draggable":5,"./directives/focusWhen":6,"./directives/hopperProject":7,"./directives/hopperQueue":8,"./directives/hopperTask":9,"./directives/modal":10,"./directives/modalManager":11,"./filters/capitalize":12,"./services/Firebase":13,"./services/Modal":14,"./services/Notify":15}],2:[function(require,module,exports){
module.exports = function($rootScope, $scope) {
  $scope.crumbs = [];

  $rootScope.$on('route', function(event, route) {
    $scope.crumbs[0] = route;
  });

  $rootScope.$on('reset', function() {
    $scope.crumbs = [];
  });
}

},{}],3:[function(require,module,exports){
module.exports = function($rootScope, $scope, Firebase, Notify) {
  
  $scope.projects = Firebase.$reference.$child('projects');
  $rootScope.$broadcast('reset');
  
  $scope.create = function() {
    Notify.emit('prompt', {
      title: 'Name this project',
      options: {
        ok: function(name) { 
          $scope.projects.$add({
            name: name
          });
        }
      }
    });
  };
  
};

},{}],4:[function(require,module,exports){
module.exports = function($rootScope, $scope, $routeParams, 
  $firebase, Firebase, Notify) {
  var refString = '/project/' + $routeParams.id + '/queues'; 
   
  $scope.name = $routeParams.id; 
  $scope.queues = Firebase.$reference.$child(refString);

  $rootScope.$broadcast('route', $scope.name);
   
  $scope.create = function() {
    Notify.emit('prompt', {
      title: 'Name this queue',
      options: {
        ok: function(name) { 
          // create a new queue
          $scope.queues.$add({
            name: name,
            tasks: []
          })
        }
      }
    });
  };

};

},{}],5:[function(require,module,exports){
module.exports = function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var dragging, target, el;

      dragging = false;
      target = document.body;
      el = element[0];

      element.on('mousedown', function(e) {
        dragging = true;
        //el.style.position = 'absolute'; 
        target.addEventListener('mousemove', move);
      });

      element.on('mouseup', function(e) {
        dragging = false;
        el.style.position = 'static'; 
        target.removeEventListener('mousemove', move);
      });

      function move(event) {
        //if(dragging) {
         // element.css('top', event.clientY);
         // element.css('left', event.clientX);
       // }
      }

    }
  }
}

},{}],6:[function(require,module,exports){
module.exports = function() {
  return {
    restrict: 'A',
    scope: {
      focusWhen: '=focusWhen'
    },
    link: function(scope, element, attrs) {
      var el = element[0];
      scope.$watch('focusWhen', function() {
        if(scope.focusWhen) {
          el.focus();
        }
      });
    }
  }
};

},{}],7:[function(require,module,exports){
module.exports = function() {
  return {
    restrict: 'A',
    templateUrl: '/partials/project.html',
    scope: {
      project: '=hopperProject'
    }
  }
};

},{}],8:[function(require,module,exports){
module.exports = function(Firebase) {
  return {
    restrict: 'A',
    templateUrl: '/partials/queue.html',
    scope: {
      queue: '&hopperQueue'
    },
    controller: function($scope) {
      $scope.tasks = $scope.queue().$child('/tasks');
      $scope.queue = $scope.queue();
      $scope.length = 0;
    
      $scope.tasks.$on('change', updateLength); 
      $scope.tasks.$on('loaded', updateLength);

      $scope.addTask = function() {
        $scope.tasks.$add({
          body: 'Speed is Key'
        });
      };

      function updateLength(tasks) {
        $scope.length = Object.keys(tasks).length; 
      }

    }
  }
};

},{}],9:[function(require,module,exports){
module.exports = function() {
  return {
    restrict: 'A',
    templateUrl: '/partials/task.html',
    scope: {
      id: '=taskId',
      task: '&hopperTask'
    },
    controller: function($scope, Firebase) {
      $scope.editing = false;
      $scope.task = $scope.task(); 
      
      $scope.delete = function() {
        $scope.task.$remove();
      };

      $scope.beginEdit = function() {
        if(!$scope.task.lock) {
          $scope.editing = true;
        }
      };

      $scope.endEdit = function() {
        $scope.editing = false;
        $scope.task.$save();
      };

      $scope.lock = function() {
        $scope.task.lock = !$scope.task.lock;
        $scope.task.$save();
      };
    }
  }
};

},{}],10:[function(require,module,exports){
module.exports = function() {
  return {
    restrict: 'A',
    templateUrl: '/partials/modal.html',
    scope: {
      modal: '=modal'
    },
    controller: function($scope) {
      $scope.visible = true;

      $scope.exit = function() {
        $scope.visible = false;
      };
    }
  }
};

},{}],11:[function(require,module,exports){
module.exports = function() {
  return {
    restrict: 'A',
    templateUrl: '/partials/modals.html',
    controller: function($scope, Notify, Modal) { 
      $scope.modals = []; 

      Notify.on('prompt', function(options) {
        var modal = new Modal({
          title: options.title,
          message: options.message,
          options: options.options
        });

        $scope.modals.push(modal);
      });
    }

  }
}

},{}],12:[function(require,module,exports){
module.exports = function() {
  return function(text) {
    return text[0].toUpperCase() + text.slice(1);
  }
};

},{}],13:[function(require,module,exports){
module.exports = function($firebase) {
  var reference;

  reference = new Firebase('https://hopper.firebaseio.com/');

  return {
    reference: reference,
    $reference: $firebase(reference)
  }
};

},{}],14:[function(require,module,exports){
module.exports = function() {
  return function(config) {
    this.title = config.title || 'Untitled';
    this.message = config.message || '';
    this.options = config.options || {};
  }
};

},{}],15:[function(require,module,exports){
module.exports = function() {
  var events = {};

  function register(name) {
    if(!(events[name] instanceof Array)) {
      events[name] = [];
    }
    return events[name];
  }

  function on(name, handler) {
    var handlers = register(name);
    handlers.push(handler); 
  }

  function emit(name, data) {
    var index, handlers, args;
    
    args = [].slice.call(arguments, 1);
    handlers = register(name);
    for(index = 0; index < handlers.length; index++) {
      handlers[index].apply(null, args);
    }
  }

  return {
    on: on,
    emit: emit
  }
}

},{}]},{},[1])