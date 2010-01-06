// Copyright (C) 2008,2009 BRAT Tech LLC

UsersTest = TestCase("UsersTest");

UsersTest.prototype = {
  setUp:function(){},
  
  tearDown:function(){},
  
  testItShouldFetchCurrentUser:function(){
    expectAsserts(5);
    var user;
    var users = new nglr.Users({request:function(method, url, request, callback){
      assertEquals("GET", method);
      assertEquals("/account.json", url);
      assertEquals("{}", nglr.toJson(request));
      callback(200, {$status_code:200, user:{name:'misko'}});
    }});
    users.fetchCurrentUser(function(u){
      user = u;
      assertEquals("misko", u.name);
      assertEquals("misko", users.current.name);
    });
  }
  
};
