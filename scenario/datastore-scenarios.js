angular.scenarioDef.datastore = {
  $before:[
    {Given:"dataset",
      dataset:{
        Book:[{$id:'moby', name:"Moby Dick"},
              {$id:'gadsby', name:'Great Gadsby'}]
      }
    },
    {Given:"browser", at:"datastore.html#book=moby"},
  ],
  checkLoadBook:[
    {Then:"drainRequestQueue"},

    {Then:"text", at:"{{book.$id}}", should_be:"moby"},
    {Then:"text", at:"li[$index=0] {{book.name}}", should_be:"Great Gahdsby"},
    {Then:"text", at:"li[$index=0] {{book.name}}", should_be:"Moby Dick"},

  ]
};
