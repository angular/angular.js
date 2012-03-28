'use strict';

describe('resource', function() {
  var $rootScope, $httpBackend;

  beforeEach(function() {
    this.addMatchers({
      toPromise: function(Type, expected) {
        var value;
        var resolved;
        Type = Type || Object;
        this.actual.then(function(v) { resolved = true; value = v; }, function(e) { console.log(arguments); throw e });
        $rootScope.$digest();
        $httpBackend.flush();
        this.message = function() {
          if (resolved) {
            return 'Expected ' + Type.name + '(' + toJson(expected) + ') but was ' +
              (value ? (value.constructor.name + '(' + toJson(value) + ')') : toJson(value));
          } else {
            return 'Expected ' + toJson(expected) + ' but was not resolved.';
          }
        };
        return angular.equals(value, expected) &&
          (Type ? value instanceof Type : true);
      }
    });
  });

  beforeEach(module(function() {
    return function($injector) {
      $rootScope = $injector.get('$rootScope');
      $httpBackend = $injector.get('$httpBackend');
    }
  }));

  describe('methods', function() {
    var connect, Author, Book;

    beforeEach(module(function($provide){
      Author = function Author(){};
      Book = function Book(){};

      $provide.factory('Author', function($resource) {
        return $resource({url: '/Author/'}, function(Resource, method) {
          connect = method;
        }).create(Author);
      });

      $provide.factory('Book', function($resource) {
        $resource({url: '/Book/', returns: Book});
        return Book;
      });

    }));

    it('should return new instance', inject(function(Author) {
      Author.get = connect('id', {url:"{{url}}{{id}}", response:'response.data.data'});
      $httpBackend.expect('GET', '/Author/42').respond({data: {name: 'Fitzgerald'}});
      expect(Author.get(42)).toPromise(Author, {name: 'Fitzgerald'});
    }));

    describe('externalize/internalize', function(){
      it('should copy object if no externalize/internalize defined', inject(function(Author) {
        Author.create = connect('self', {method:'POST', request: 'data'});
        $httpBackend.expect('POST', '/Author/', {name:'Twain'}).respond({name:'Mark'});
        expect(Author.create({name:'Twain'})).toPromise(Author, {name:'Mark'});
      }));


      it('should execute static externalize/internalize', inject(function(Author) {
        Author.externalize = function(author) {
          return {
            name: uppercase(author.name)
          };
        }

        Author.internalize = function(author, request, data) {
          author.name = lowercase(data.name);
        }
        Author.create = connect('self', {method:'POST', request: true});
        $httpBackend.expect('POST', '/Author/', {name:'TWAIN'}).respond({name:'Mark'});
        expect(Author.create({name:'Twain'})).toPromise(Author, {name:'mark'});
      }));


      it('should execute instance externalize/internalize', inject(function(Author) {
        Author.externalize = function(author) {
          return {
            name: uppercase(author.name)
          };
        }

        Author.internalize = function(author, request, data) {
          author.name = lowercase(data.name);
        }
        Author.prototype.create = connect('patch', {method:'POST', request: true, returns: 'self'});
        var author = new Author();
        author.name = 'NoName';

        $httpBackend.expect('POST', '/Author/', {name:'NONAME'}).respond({name:'SomeName'});
        expect(author.create()).toPromise(Author, {name:'somename'});
        // verify that instance was updated
        expect(author.name).toEqual('somename');

        // verify that same instance was returned.
        $httpBackend.expect('POST', '/Author/', {name:'SOMENAME'}).respond({});
        expect(author.create()).toPromise(Author, author);
      }));

      it('should return type other then itself', inject(function(Author) {
        Author.prototype.books = connect('', {url:'/Book/', params: {authorId:'{{self.id}}'}, returns: 'Author'});
        var author = new Author();
        author.id = 123;
        $httpBackend.expect('GET', '/Book/?authorId=123').respond({name: 'Fitzgerald'});
        expect(author.books()).toPromise(Author, {id: 123, name: 'Fitzgerald'});
      }));

    });

    describe('request/response', function() {
      it('should translate request/response using parse', inject(function(Author) {
        Author.prototype.save = connect('', {
          url:'{{url}}{{data.id}}',
          method:'PUT',
          request:'{bits: data}',
          response:'response.data.myBits'});
        Author.externalize = function(author) {
          return extend(copy(author), {id: 12});
        };
        var author = new Author();
        author.name = 'Misko';
        $httpBackend.
          expect('PUT', '/Author/12', {bits: {id: 12, name: 'Misko'}}).
          respond({myBits: {name: 'Igor'}});
        expect(author.save()).toPromise(Author, {name:'Igor'});
      }));


      it('should translate request/response using function', inject(function(Author) {
        Author.prototype.save = connect('', {
          url:function(locals) { return locals.url + locals.data.id; },
          method:function() { return 'PUT'},
          request:function(locals) {return {bits: locals.data};},
          response:function(locals) { return locals.response.data.myBits; }
        });
        Author.externalize = function(author) {
          return extend(copy(author), {id: 12});
        };
        var author = new Author();
        author.name = 'Misko';
        $httpBackend.
          expect('PUT', '/Author/12', {bits: {id: 12, name: 'Misko'}}).
          respond({myBits: {name: 'Igor'}});
        expect(author.save()).toPromise(Author, {name:'Igor'});
      }));
    });

  });

  describe('extractor', function() {
    var extractor;

    beforeEach(inject(function($interpolate) {
      extractor = bind(null, optionExtractor, $interpolate);
    }));


    it('should get value', function() {
      expect(extractor([{key:'value'}])('key', {})).toEqual('value');
      expect(extractor([{key:'value'}, {key:'override'}])('key', {})).toEqual('override');
    });


    it('should get interpolate', function() {
      expect(extractor([{url:'{{1+2}}'}])('url', {})).toEqual('3');
      expect(extractor([{url:'{{1+2}}'}, {url:'/{{url}}/abc'}])('url', {})).toEqual('/3/abc');
      expect(extractor([{url:'{{1+2}}'}, {url:'/{{url}}/{{a}}'}])('url', {a:'xyz'})).toEqual('/3/xyz');
    });

    it('should merge objects', function() {
      expect(extractor([{h:{a:1}}])('h', {})).toEqual({a:1});
      expect(extractor([{h:{a:1}}, {h:{b:2}}])('h', {})).toEqual({a:1, b:2});
      expect(extractor([{h:{a:1}}, {h:{a:'{{x}}', b:2}}])('h', {x:'X'})).toEqual({a:'X', b:2});

      // shallow only clobber deep parts
      expect(extractor([{h:{a:{deep:1}}}, {h:{a:{deep:3}, b:2}}], true)('h', {})).toEqual({a:{deep:3}, b:2});
    });
  });

  describe('DSL', function() {
    var Book;

    beforeEach(module(function($provide) {
      $provide.factory('Book', function($resource) {
        return $resource({url:'/Book', response:'response.data.data'}, function(Resource, method){
          Resource.get = method(['objectId'], {url:'{{url}}/{{objectId}}'});
          Resource.query = method(['where'], {params: { where: '{{where}}' }});

          var prototype = Resource.prototype;

          prototype.refresh = method([],{url:'{{url}}/{{self.id}}', returns: 'self' });
          prototype.create = method('self', {method:'POST', request: 'data', returns: 'self'});
          prototype.save = method('self', {method:valueFn('PUT'), url:'{{url}}/{{self.id}}', request:'data', returns: 'self'});
        }).create(function Book() {});
      });
      return function ($injector) {
        Book = $injector.get('Book');
      }
    }));


    describe('static methods', function() {
      describe('return instance', function() {
        it('should execute .get() and return Book instance', inject(function(){
          $httpBackend.
              expect('GET', '/Book/123').
              respond({ data: { name: 'Moby'} });

          var book;
          Book.get(123).then(function(b) { book = b; });

          $rootScope.$apply();
          $httpBackend.flush();

          expect(book.name).toEqual('Moby');
        }));
      });


      describe('return array', function() {
        it('should execute .query() and return array of Books', inject(function(){
          $httpBackend.
              expect('GET', '/Book?where=%7B%22limit%22%3A10%7D').
              respond({ data: [ {name: 'Moby'}, {name: 'Gatsby'} ] });

          var books;
          Book.query({limit:10}).then(function(b) { books = b; });

          $rootScope.$apply();
          $httpBackend.flush();

          expect(books.length).toEqual(2);

          expect(books[0].name).toEqual('Moby');
          expect(books[0] instanceof Book).toBe(true);

          expect(books[1].name).toEqual('Gatsby');
          expect(books[1] instanceof Book).toBe(true);
        }));
      });
    });


    describe('instance methods', function() {
      describe('update self', function() {
        it('should execute .refresh() and return self', inject(function(){
          $httpBackend.
              expect('GET', '/Book/123').
              respond({ data: { name: 'Moby'} });

          var book = new Book();
          extend(book, {id:123, author:'Herman Melville'});
          var returnedBook;
          book.refresh().then(function(v) { returnedBook = v; });

          $rootScope.$apply();
          $httpBackend.flush();

          expect(book).toBe(returnedBook);
          expect(book.id).toEqual(123);
          expect(book.author).toEqual('Herman Melville');
          expect(book.name).toEqual('Moby');
        }));


        it('should execute .save() and update id', inject(function(){
          $httpBackend.
              expect('PUT', '/Book/123', {id: 123, author:'Herman Melville'}).
              respond({ data: { name: 'Moby'} });

          var book = new Book();
          book.id = 123;
          var returnedBook;
          book.save({author:'Herman Melville'}).then(function(v) { returnedBook = v; });

          expect(book.author).toBeUndefined();

          $rootScope.$apply();
          $httpBackend.flush();

          expect(book).toBe(returnedBook);
          expect(book.id).toEqual(123);
          expect(book.author).toEqual('Herman Melville');
          expect(book.name).toEqual('Moby');
        }));


        it('should execute .save() and update id', inject(function(){
          $httpBackend.
              expect('POST', '/Book', {name: 'Moby', author:'Herman Melville'}).
              respond({ data: { id: 123} });

          var book = new Book();
          book.name = 'Moby';
          var returnedBook;
          book.create({author:'Herman Melville'}).then(function(v) { returnedBook = v; });

          expect(book.author).toBeUndefined();

          $rootScope.$apply();
          $httpBackend.flush();

          expect(book).toBe(returnedBook);
          expect(book.id).toEqual(123);
          expect(book.author).toEqual('Herman Melville');
          expect(book.name).toEqual('Moby');
        }));
      });
    });


    describe('collection methods', function() {
      // POST 1.0
    });

  });


  describe('strategy', function() {
    it('should extend methods on Resource', function() {
      module(function($resourceProvider, $provide){
        $provide.factory('myResource', function($resource) {
          return $resource({}, function(Resource, method) {
            Resource.prototype.myMethod = 'MyMethod';
          });
        });

        $provide.factory('MyResource', function(myResource) {
          function MyResource(){
            this.type = 'MyResource';
          }
          return myResource.create(MyResource);
        });
      });
      inject(function(MyResource) {
        var rsrc = new MyResource();
        expect(rsrc.type).toEqual('MyResource');
        expect(rsrc.myMethod).toEqual('MyMethod');
      });
    });
  });


  describe('REST strategy', function() {
    var Author;

    beforeEach(module(function($provide) {
      $provide.factory('$restResource', ['$resource', function($resource) {
        return $resource({}, function(Resource, method) {
          Resource.retrieve = method('id', {url: '{{url}}{{id}}'});
          Resource.list = method('params');
          Resource.create = method('self', { method: 'POST', request: 'data' });
          Resource.replace = method('self', { method: 'PUT', url:'{{url}}{{self.id}}', request:'data' });
          Resource.remove = method('id', { method: 'DELETE', url:'{{url}}{{id}}', returns: null });

          var prototype = Resource.prototype;

          prototype.create = method('self', { method: 'POST', request:'data', returns: 'self'});
          prototype.replace = method('self', { method: 'PUT', url:'{{url}}{{self.id}}', request: 'data', returns: 'self' });
          prototype.remove = method('', { method: 'DELETE', url:'{{url}}{{self.id}}', returns: null });
        });
      }]);
      $provide.factory('Author', function($restResource) {
        return $restResource({url:'/Author/'}).create();
      });

      return function($injector) {
        Author = $injector.get('Author');
      }
    }));


    it('should have retrieve', inject(function() {
      $httpBackend.
          expect('GET', '/Author/1').
          respond({name: 'Mark Twain'});

      var author;
      Author.retrieve(1).then(function(b) { author = b; });

      $rootScope.$apply();
      $httpBackend.flush();

      expect(author instanceof Author).toBe(true);
      expect(author.name).toEqual('Mark Twain');
    }));


    it('should have list', inject(function() {
      $httpBackend.
          expect('GET', '/Author/?a=1').
          respond([{name: 'Mark Twain'}]);

      var authors;
      Author.list({a:1}).then(function(b) { authors = b; });

      $rootScope.$apply();
      $httpBackend.flush();

      expect(authors.length).toBe(1);
      expect(authors[0] instanceof Author).toBe(true);
      expect(authors[0].name).toEqual('Mark Twain');
    }));


    it('should have instance create', inject(function() {
      $httpBackend.
          expect('POST', '/Author/', {
                name: 'Mark Twain',
                pseudonim: true }).
          respond({id: 123, pseudonim:true});

      var author = new Author({name: 'Mark Twain'});
      author.create({pseudonim:true}).then(function(b) {
        expect(b).toBe(author);
      });

      expect(author).toEqualData({
        name: 'Mark Twain'
      });

      $rootScope.$apply();
      $httpBackend.flush();

      expect(author).toEqualData({
        id: 123,
        name: 'Mark Twain',
        pseudonim: true
      });
    }));


    it('should have static create', inject(function() {
      $httpBackend.
          expect('POST', '/Author/', {
                name: 'Fitzgerald'}).
          respond({id: 234, name: 'Fitzgerald'});

      var author;
      Author.create({name: 'Fitzgerald'}).then(function(a) {author = a;});

      $rootScope.$apply();
      $httpBackend.flush();

      expect(author).toEqualData({
        id: 234,
        name: 'Fitzgerald'
      });
    }));


    it('should have instance replace', inject(function() {
      $httpBackend.
          expect('PUT', '/Author/123', {
                id: 123,
                name: 'Mark Twain',
                pseudonim: true }).
          respond({id: 123, pseudonim:true});

      var author = new Author({id: 123, name: 'Mark Twain'});
      author.replace({pseudonim:true}).then(function(b) {
        expect(b).toBe(author);
      });

      expect(author).toEqualData({
        id: 123,
        name: 'Mark Twain'
      });

      $rootScope.$apply();
      $httpBackend.flush();

      expect(author).toEqualData({
        id: 123,
        name: 'Mark Twain',
        pseudonim: true
      });
    }));


    it('should have static replace', inject(function() {
      $httpBackend.
          expect('PUT', '/Author/234', {
                id: 234,
                name: 'Fitzgerald'}).
          respond({id: 234, name: 'Fitzgerald'});

      var author;
      Author.replace({id: 234, name: 'Fitzgerald'}).then(function(a) {author = a;});

      $rootScope.$apply();
      $httpBackend.flush();

      expect(author).toEqualData({
        id: 234,
        name: 'Fitzgerald'
      });
    }));


    it('should have instance delete', inject(function() {
      $httpBackend.
          expect('DELETE', '/Author/123').
          respond('OK');

      var author = new Author({id: 123, name: 'Mark Twain'});
      author.remove().then(function(a) {author = a;});

      expect(author).toEqualData({
        id: 123,
        name: 'Mark Twain'
      });

      $rootScope.$apply();
      $httpBackend.flush();

      expect(author).toBeUndefined();
    }));


    it('should have static delete', inject(function() {
      $httpBackend.
          expect('DELETE', '/Author/234').
          respond('OK');

      var author = 'abc';
      Author.remove(234).then(function(a) {author = a;});

      $rootScope.$apply();
      $httpBackend.flush();

      expect(author).toBeUndefined();
    }));
  });
});



//TODO: change all tests to new test style with promise matcher
//TODO: write tests for merging request data back into object
//TODO: change copy/merge to ignore $ properties
