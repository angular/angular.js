function $ResourceProvider() {
  this.$get = ['$interpolate', '$parse', '$http', '$injector',
          function($interpolate, $parse, $http, $injector) {

    return (function resourceFactoryFactory(optionList) {
      function resourceFactory(options, decorator) {
        options = options || {};
        options.$decorate = decorator;
        return resourceFactoryFactory(concat(optionList, [options]))
      }
      resourceFactory.create = function(Resource) {
        Resource = Resource || function(data){ extend(this, data); };
        forEach(optionList, function(options) {
          (options.$decorate || noop)(Resource, methodFactory);
        });
        return Resource;

        ////////////////////////////////////////////////////////////

        function methodFactory(methodParameters, methodOptions) {
          return function() {
            var self = this,
              context = {self: self},
              methodArgs = arguments,
              argOptions = {},
              extract = optionExtractor($interpolate,
                [].concat({self: self, returns: Resource}, optionList, methodOptions || {}, argOptions)),
              Type,
              reuse,
              externalize,
              internalize,
              requestFn;

            // Read method parameters into context
            if (methodParameters) {
              if (isString(methodParameters)) {
                methodParameters = methodParameters.split(',');
              }
              forEach(methodParameters, function(exp, index) {
                var assign = $parse(exp).assign;
                assign(argOptions, methodArgs[index]);
                assign(context, methodArgs[index]);
              });
            }

            // Determine the Type we are going to use
            Type = extract('returns');
            reuse = Type == 'self';
            if (reuse) {
              Type = self.constructor;
            } else if (isString(Type)) {
              Type = $injector.get(Type);
            }
            externalize = Type && Type.externalize || copy;
            internalize = Type && Type.internalize || extend;

            if (requestFn = extract('request')) {
              context.data = externalize(context.self = extract('self'));
            }


            return extract('connector')({
              method:  extract('method', context),
              url:     extract('url', context),
              params:  extract('params', context),
              data:    context.data &&  execute(requestFn, context.data), // TODO: change to extract('request', context)
              headers: extract('headers', context),
              cache:   extract('cache', context)
            }).then(function(response) {
                var responseFn = extract('response'),
                  rawData;

                if (responseFn && Type) {
                  context.response = response;
                  rawData = execute(responseFn, response.data);
                  if ((isArray(self) || isFunction(self)) && isArray(rawData)) {
                    var value = [];
                    forEach(rawData, function(item, i) {
                      //TODO: merge this with the same few lines lower.
                      value.push(processResponse(self[i], item));
                    });
                    return value;
                  } else {
                    return processResponse(self, rawData);
                  }
                }
                ////////////////////////////////////

                function processResponse(self, data) {
                  var obj = reuse ? self : new Type();
                  internalize(obj, context.self, data);
                  return obj;
                }
              });

            function execute(expression, defaultValue) {
              if (isFunction(expression)) {
                return expression(context);
              } else if (isString(expression)) {
                return $parse(expression)({}, context);
              } else {
                return defaultValue;
              }
            }
          }
        }
      };
      return resourceFactory;
    })([{
      connector: $http,
      method: 'GET',
      url: '/',
      response: 'response.data'
    }]);
  }];
}

function optionExtractor($interpolate, options) {
  return function(key, context) {
    var value, previousValue;

    forEach(options, function(option) {
      // skip if we don't have anything on this level;
      if (!option.hasOwnProperty(key)) return;
      previousValue = value;
      value = option[key];
      if (context && isString(value)) value = $interpolate(value);
      if (context && isFunction(value)) value = value(context);

      // if object then merge with previousValue
      if (isObject(value)) {
        var dst = isObject(previousValue) ? shallowCopy(previousValue) : value;
        forEach(value, function(value, key) {
          if (context && isString(value)) value = $interpolate(value);
          if (context && isFunction(value)) value = value(context);

          dst[key] = value;
        });
        value = dst;
      }
      if (context) context[key] = value;
    });
    // if it is function execute it.
    if (context && isFunction(value)) value = value(context);
    return value;
  }
}

// TODO: allow to always have request, and ignore when no data (or data is function)
