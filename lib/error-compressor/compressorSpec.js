var Compressor = require('./compressor.js').Compressor;

describe('Compressor', function() {
  var compressor;
  beforeEach(function() {
    compressor = new Compressor();
  });
  it('should traverse AST', function() {
    var ast = ['toplevel',
               [['defun',
                  'copy',
                  ['source', 'destination'],
                  [['if',
                    ['call', ['name', 'isWindow'], [['name', 'source']]],
                    ['throw',
                     ['new',
                      ['name', 'NgError'],
                      [['num', 14],
                       ['string', 'ErrE: This {0} is {1}'],
                       ['name', 'foo'],
                       ['string', 'bar']]
                     ]
                    ],
                   ['call', ['name', 'myFunc'], [['name', 'source'], ['string', 'bar']]]],
                   ['throw',
                    ['call',
                     ['name', 'NgError'],
                     [['num', 42],
                      ['string', 'Err2A: This never returns']]
                    ]
                   ],
                   ['return', ['name', 'destination']]
                  ]
               ]]
              ];
    compressor.extractErrorsTable(ast);
    expect(compressor.errors_seen).toEqual(2);
    expect(compressor.errors_table.length).toEqual(2);
    var first_error = compressor.errors_table[0];
    expect(first_error.err_code).toEqual(14);
    expect(first_error.message).toEqual('ErrE: This {foo} is {bar}');
    expect(first_error.min_message).toEqual('ErrE: {foo} {bar}');
    expect(first_error.prod_message).toEqual('ErrE: {0} {1}');
    expect(ast[1][0][3][0][2][1][2][1][1]).toEqual('ErrE: {0} {1}');
    var second_error = compressor.errors_table[1];
    expect(second_error.err_code).toEqual(42);
    expect(second_error.message).toEqual('Err2A: This never returns');
    expect(second_error.min_message).toEqual('Err2A');
    expect(second_error.prod_message).toEqual('Err2A');
    expect(ast[1][0][3][1][1][2][1][1]).toEqual('Err2A');
    
  });
  it('should ignore non NgErrors', function() {
    var ast = ['toplevel',
               [['defun',
                  'copy',
                  ['source', 'destination'],
                  [['if',
                    ['call', ['name', 'isWindow'], [['name', 'source']]],
                    ['throw',
                     ['new',
                      ['name', 'Error'],
                      [['string', 'This {0} is {1}'],
                       ['name', 'foo'],
                       ['string', 'bar']]
                     ]
                    ],
                   ['call', ['name', 'myFunc'], [['name', 'source'], ['string', 'bar']]]],
                   ['throw',
                    ['call',
                     ['name', 'NgError'],
                     [['num', 42],
                      ['string', 'Err2A: This never returns']]
                    ]
                   ],
                   ['return', ['name', 'destination']]
                  ]
               ]]
              ];
    compressor.extractErrorsTable(ast);
    expect(compressor.errors_seen).toEqual(1);
    expect(compressor.errors_table.length).toEqual(1);
    var second_error = compressor.errors_table[0];
    expect(second_error.err_code).toEqual(42);
    expect(second_error.message).toEqual('Err2A: This never returns');
    expect(second_error.min_message).toEqual('Err2A');
  });
  it('should parse Error Array and get error object for table', function() {
    var error_arr = ['throw',
                     ['new',
                      ['name', 'NgError'],
                      [['num', 14],
                       ['string', 'This {0} is {1}'],
                       ['name', 'foo'],
                       ['string', 'bar']]
                     ]
                    ];
    var errorObj = compressor.parseAndModifyErrorArray(error_arr);
    expect(errorObj.err_code).toEqual(14);
    expect(errorObj.message).toEqual('This {foo} is {bar}');
    expect(errorObj.min_message).toEqual('ErrE: {foo} {bar}');
    
  });
  it('should modify error array in place', function() {
    var error_arr = ['throw',
                     ['new',
                      ['name', 'NgError'],
                      [['num', 42],
                       ['string', 'This {0} is {1}'],
                       ['name', 'foo'],
                       ['string', 'bar']]
                     ]
                    ];
    compressor.parseAndModifyErrorArray(error_arr);
    expect(error_arr[1][2][1][1]).toEqual('Err2A: {0} {1}');
  });
  
});