@ngdoc overview
@name Developer Guide: Templates: Filters: Creating Angular Filters
@description

Writing your own filter is very easy: just register a new filter (injectable) factory function with
your module. This factory function should return a new filter function which takes the input value
as the first argument. Any filter arguments are passed in as additional arguments to the filter
function.

The following sample filter reverses a text string. In addition, it conditionally makes the
text upper-case and assigns color.

<doc:example module="MyReverseModule">
<doc:source>
<script>
  angular.module('MyReverseModule', []).
    filter('reverse', function() {
      return function(input, uppercase) {
        var out = "";
        for (var i = 0; i < input.length; i++) {
          out = input.charAt(i) + out;
        }
        // conditional based on optional argument
        if (uppercase) {
          out = out.toUpperCase();
        }
        return out;
      }
    });

  function Ctrl($scope) {
    $scope.greeting = 'hello';
  }
</script>

<div ng-controller="Ctrl">
  <input ng-model="greeting" type="greeting"><br>
  No filter: {{greeting}}<br>
  Reverse: {{greeting|reverse}}<br>
  Reverse + uppercase: {{greeting|reverse:true}}<br>
</div>
</doc:source>
<doc:scenario>
  it('should reverse greeting', function() {
    expect(binding('greeting|reverse')).toEqual('olleh');
    input('greeting').enter('ABC');
    expect(binding('greeting|reverse')).toEqual('CBA');
  });
</doc:scenario>
</doc:example>


## Related Topics

* {@link dev_guide.templates.filters Understanding Angular Filters}
* {@link compiler Angular HTML Compiler}

## Related API

* {@link api/ng.$filter Angular Filter API}
