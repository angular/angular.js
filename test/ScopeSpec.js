'use strict';

describe('Scope', function(){
  var root, mockHandler;

  beforeEach(function(){
    root = createScope(angular.service, {
      '$exceptionHandler': $exceptionHandlerMockFactory()
    });
    mockHandler = root.$service('$exceptionHandler');
  });


  describe('$root', function(){
    it('should point to itself', function(){
      expect(root.$root).toEqual(root);
      expect(root.hasOwnProperty('$root')).toBeTruthy();
    });


    it('should not have $root on children, but should inherit', function(){
      var child = root.$new();
      expect(child.$root).toEqual(root);
      expect(child.hasOwnProperty('$root')).toBeFalsy();
    });

  });


  describe('$parent', function(){
    it('should point to itself in root', function(){
      expect(root.$root).toEqual(root);
    });


    it('should point to parent', function(){
      var child = root.$new();
      expect(root.$parent).toEqual(null);
      expect(child.$parent).toEqual(root);
      expect(child.$new().$parent).toEqual(child);
    });
  });


  describe('$id', function(){
    it('should have a unique id', function(){
      expect(root.$id < root.$new().$id).toBeTruthy();
    });
  });


  describe('this', function(){
    it('should have a \'this\'', function(){
      expect(root['this']).toEqual(root);
    });
  });


  describe('$new()', function(){
    it('should create a child scope', function(){
      var child = root.$new();
      root.a = 123;
      expect(child.a).toEqual(123);
    });


    it('should instantiate controller and bind functions', function(){
      function Cntl($browser, name){
        this.$browser = $browser;
        this.callCount = 0;
        this.name = name;
      }
      Cntl.$inject = ['$browser'];

      Cntl.prototype = {
        myFn: function(){
          expect(this).toEqual(cntl);
          this.callCount++;
        }
      };

      var cntl = root.$new(Cntl, ['misko']);

      expect(root.$browser).toBeUndefined();
      expect(root.myFn).toBeUndefined();

      expect(cntl.$browser).toBeDefined();
      expect(cntl.name).toEqual('misko');

      cntl.myFn();
      cntl.$new().myFn();
      expect(cntl.callCount).toEqual(2);
    });
  });


  describe('$service', function(){
    it('should have it on root', function(){
      expect(root.hasOwnProperty('$service')).toBeTruthy();
    });
  });


  describe('$watch/$digest', function(){
    it('should watch and fire on simple property change', function(){
      var spy = jasmine.createSpy();
      root.$watch('name', spy);
      root.$digest();
      spy.reset();

      expect(spy).not.wasCalled();
      root.$digest();
      expect(spy).not.wasCalled();
      root.name = 'misko';
      root.$digest();
      expect(spy).wasCalledWith(root, 'misko', undefined);
    });


    it('should watch and fire on expression change', function(){
      var spy = jasmine.createSpy();
      root.$watch('name.first', spy);
      root.$digest();
      spy.reset();

      root.name = {};
      expect(spy).not.wasCalled();
      root.$digest();
      expect(spy).not.wasCalled();
      root.name.first = 'misko';
      root.$digest();
      expect(spy).wasCalled();
    });

    it('should delegate exceptions', function(){
      root.$watch('a', function(){throw new Error('abc');});
      root.a = 1;
      root.$digest();
      expect(mockHandler.errors[0].message).toEqual('abc');
      $logMock.error.logs.length = 0;
    });


    it('should fire watches in order of addition', function(){
      // this is not an external guarantee, just our own sanity
      var log = '';
      root.$watch('a', function(){ log += 'a'; });
      root.$watch('b', function(){ log += 'b'; });
      root.$watch('c', function(){ log += 'c'; });
      root.a = root.b = root.c = 1;
      root.$digest();
      expect(log).toEqual('abc');
    });


    it('should delegate $digest to children in addition order', function(){
      // this is not an external guarantee, just our own sanity
      var log = '';
      var childA = root.$new();
      var childB = root.$new();
      var childC = root.$new();
      childA.$watch('a', function(){ log += 'a'; });
      childB.$watch('b', function(){ log += 'b'; });
      childC.$watch('c', function(){ log += 'c'; });
      childA.a = childB.b = childC.c = 1;
      root.$digest();
      expect(log).toEqual('abc');
    });


    it('should repeat watch cycle while model changes are identified', function(){
      var log = '';
      root.$watch('c', function(self, v){self.d = v; log+='c'; });
      root.$watch('b', function(self, v){self.c = v; log+='b'; });
      root.$watch('a', function(self, v){self.b = v; log+='a'; });
      root.$digest();
      log = '';
      root.a = 1;
      root.$digest();
      expect(root.b).toEqual(1);
      expect(root.c).toEqual(1);
      expect(root.d).toEqual(1);
      expect(log).toEqual('abc');
    });

    it('should repeat watch cycle from the root elemnt', function(){
      var log = '';
      var child = root.$new();
      root.$watch(function(){ log += 'a'; });
      child.$watch(function(){ log += 'b'; });
      root.$digest();
      expect(log).toEqual('abab');
    });


    it('should prevent infinite recursion', function(){
      root.$watch('a', function(self, v){self.b++;});
      root.$watch('b', function(self, v){self.a++;});
      root.a = root.b = 0;

      expect(function(){
        root.$digest();
      }).toThrow('100 $digest() iterations reached. Aborting!');
    });


    it('should not fire upon $watch registration on initial $digest', function(){
      var log = '';
      root.a = 1;
      root.$watch('a', function(){ log += 'a'; });
      root.$watch('b', function(){ log += 'b'; });
      root.$digest();
      log = '';
      root.$digest();
      expect(log).toEqual('');
    });


    it('should watch objects', function(){
      var log = '';
      root.a = [];
      root.b = {};
      root.$watch('a', function(){ log +='.';});
      root.$watch('b', function(){ log +='!';});
      root.$digest();
      log = '';

      root.a.push({});
      root.b.name = '';

      root.$digest();
      expect(log).toEqual('.!');
    });


    it('should prevent recursion', function(){
      var callCount = 0;
      root.$watch('name', function(){
        expect(function(){
          root.$digest();
        }).toThrow('$digest already in progress');
        callCount++;
      });
      root.name = 'a';
      root.$digest();
      expect(callCount).toEqual(1);
    });
  });


  describe('$destroy', function(){
    var first, middle, last, log;

    beforeEach(function(){
      log = '';

      first = root.$new();
      middle = root.$new();
      last = root.$new();

      first.$watch(function(){ log += '1';});
      middle.$watch(function(){ log += '2';});
      last.$watch(function(){ log += '3';});

      root.$digest();
      log = '';
    });


    it('should ignore remove on root', function(){
      root.$destroy();
      root.$digest();
      expect(log).toEqual('123');
    });


    it('should remove first', function(){
      first.$destroy();
      root.$digest();
      expect(log).toEqual('23');
    });


    it('should remove middle', function(){
      middle.$destroy();
      root.$digest();
      expect(log).toEqual('13');
    });


    it('should remove last', function(){
      last.$destroy();
      root.$digest();
      expect(log).toEqual('12');
    });

    it('should fire a $destroy event', function(){
      var destructedScopes = [];
      middle.$on('$destroy', function(event) {
        destructedScopes.push(event.currentTarget);
      });
      middle.$destroy();
      expect(destructedScopes).toEqual([middle]);
    });

  });


  describe('$eval', function(){
    it('should eval an expression', function(){
      expect(root.$eval('a=1')).toEqual(1);
      expect(root.a).toEqual(1);

      root.$eval(function(self){self.b=2;});
      expect(root.b).toEqual(2);
    });
  });

  describe('$evalAsync', function(){

    it('should run callback before $watch', function(){
      var log = '';
      var child = root.$new();
      root.$evalAsync(function(scope){ log += 'parent.async;'; });
      root.$watch('value', function(){ log += 'parent.$digest;'; });
      child.$evalAsync(function(scope){ log += 'child.async;'; });
      child.$watch('value', function(){ log += 'child.$digest;'; });
      root.$digest();
      expect(log).toEqual('parent.async;parent.$digest;child.async;child.$digest;');
    });

    it('should cause a $digest rerun', function(){
      root.log = '';
      root.value = 0;
      root.$watch('value', 'log = log + ".";');
      root.$watch('init', function(){
        root.$evalAsync('value = 123; log = log + "=" ');
        expect(root.value).toEqual(0);
      });
      root.$digest();
      expect(root.log).toEqual('.=.');
    });

    it('should run async in the same order as added', function(){
      root.log = '';
      root.$evalAsync("log = log + 1");
      root.$evalAsync("log = log + 2");
      root.$digest();
      expect(root.log).toBe('12');
    });

  });


  describe('$apply', function(){
    it('should apply expression with full lifecycle', function(){
      var log = '';
      var child = root.$new();
      root.$watch('a', function(scope, a){ log += '1'; });
      child.$apply('$parent.a=0');
      expect(log).toEqual('1');
    });


    it('should catch exceptions', function(){
      var log = '';
      var child = root.$new();
      root.$watch('a', function(scope, a){ log += '1'; });
      root.a = 0;
      child.$apply(function(){ throw new Error('MyError'); });
      expect(log).toEqual('1');
      expect(mockHandler.errors[0].message).toEqual('MyError');
      $logMock.error.logs.shift();
    });


    describe('exceptions', function(){
      var $exceptionHandler, log;
      beforeEach(function(){
        log = '';
        $exceptionHandler = jasmine.createSpy('$exceptionHandler');
        root.$service = function(name) {
          return {$exceptionHandler:$exceptionHandler}[name];
        };
        root.$watch(function(){ log += '$digest;'; });
        root.$digest();
        log = '';
      });


      it('should execute and return value and update', function(){
        root.name = 'abc';
        expect(root.$apply(function(scope){
          return scope.name;
        })).toEqual('abc');
        expect(log).toEqual('$digest;');
        expect($exceptionHandler).not.wasCalled();
      });


      it('should catch exception and update', function(){
        var error = new Error('MyError');
        root.$apply(function(){ throw error; });
        expect(log).toEqual('$digest;');
        expect($exceptionHandler).wasCalledWith(error);
      });
    });
  });

  describe('events', function(){
    var log, child, grandChild, greatGrandChild;

    beforeEach(function(){
      log = '';
      child = root.$new();
      grandChild = child.$new();
      greatGrandChild = child.$new();

      root.id = 0;
      child.id = 1;
      grandChild.id = 2;
      greatGrandChild.id = 3;

      root.$on('myEvent', logger('<'));
      root.$on('myEvent', logger('>'), true);
      child.$on('myEvent', logger('<'));
      child.$on('myEvent', logger('>'), true);
      grandChild.$on('myEvent', logger('<'));
      grandChild.$on('myEvent', logger('>'), true);
      greatGrandChild.$on('myEvent', logger('<'));
      greatGrandChild.$on('myEvent', logger('>'), true);
    });

    function logger(text) {
      return function(event) {
        log += event.currentTarget.id + text;
      };
    }

    it('should fire event through capture and bubble phase', function(){
      grandChild.$emit('myEvent');
      expect(log).toEqual('0>1>2>2<1<0<');
    });

    it('should not propagate exceptions in bubble and capture', function(){
      child.$on('myEvent', function(){ throw 'bubbleException'; });
      child.$on('myEvent', function(){ throw 'captureException'; }, true);
      grandChild.$emit('myEvent');
      expect(log).toEqual('0>1>2>2<1<0<');
      expect(mockHandler.errors[0]).toEqual('captureException');
      expect(mockHandler.errors[1]).toEqual('bubbleException');
    });

    it('should allow cancalation of event propegation in bubble', function(){
      child.$on('myEvent', function(event){ event.cancel(); });
      grandChild.$emit('myEvent');
      expect(log).toEqual('0>1>2>2<1<');
    });

    it('should allow cancalation of event propegation in capture', function(){
      child.$on('myEvent', function(event){ event.cancel(); }, true);
      grandChild.$emit('myEvent');
      expect(log).toEqual('0>');
    });

    it('should remove event listener', function(){
      function eventFn(){
        log += 'abc;';
      }

      child.$on('abc', eventFn, true);
      child.$emit('abc');
      expect(log).toEqual('abc;');
      log = '';
      child.$removeOn('abc', eventFn, true);
      child.$emit('abc');
      expect(log).toEqual('');
    });

    it('should forward method arguments', function(){
      child.$on('abc', function(event, arg1, arg2){
        expect(arg1).toEqual('arg1');
        expect(arg2).toEqual('arg2');
      });
      child.$emit('abc', 'arg1', 'arg2');
    });

    describe('event object', function(){
      it('should have methods/properties', function(){
        var event;
        child.$on('myEvent', function(e){
          expect(e.target).toBe(grandChild);
          expect(e.currentTarget).toBe(child);
          event = e;
        });
        grandChild.$emit('myEvent');
        expect(event).toBeTruthy();
      });
    });

  });
});
