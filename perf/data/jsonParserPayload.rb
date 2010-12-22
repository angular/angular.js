def generate_object(f, objName, iterations)
  f.write("var #{objName}='[");
 
  iterations.times do |i| 
    f.write('{')

    f.write('"simpleStringProperty":')     #23
    f.write('"some string value ' + ('%07d' % i) + '"')  #27
    f.write(',')
    
    f.write('"stringWithQuotes":')         #19
    f.write('"some string with \\\\"quotes\\\\" ' + ('%07d' % i) + '"')  #36
    f.write(',')
 
    f.write('"stringWithUnicode":')
    f.write('"short string with \\u1234 unicode \\u2345 chars ' +  ('%07d' % i) + '"')
    f.write(',')

    f.write('"aNumber":')  #10
    f.write(i)  #?
    f.write(',')
   
    f.write('"smallArray":')
    f.write('["a",23,"b",42,' + i.to_s + ']')
    f.write(',')

    f.write('"smallObj":')
    f.write('{"foo":"bar","baz":543,"num":' + i.to_s + ',"fuz":"fuz buz huz duz ' + i.to_s + '"}')
    f.write(',')

    f.write('"timeStamp":')
    f.write('"2010-12-22T04:58:01.' + ("%03d" % (i%1000)) + '"')

    f.write('},')
  end

  f.write('"just a padding string"]\';' + "\n\n");
end

file_path = File.join(File.dirname(__FILE__), 'jsonParserPayload.js')

File.open(file_path, 'w') do |f|
  generate_object(f, 'superTinyJsonString', 1)  #~300b
  generate_object(f, 'tinyJsonString', 3)       #~1kb
  generate_object(f, 'smallJsonString', 30)     #~10kb
  generate_object(f, 'mediumJsonString', 600)   #~200kb
  generate_object(f, 'largeJsonString', 2000)   #~650kb
end

