# filter:currency
formats a number as a currency (ie $1,234.56)

@format _expression_ | currency

<example>
<input type="text" name="amount" value="1234.56"/> <br/>
{{amount | currency}}
</example>

<test>
 it('should init with 1234.56', function(){
   expect(bind('amount')).toEqual('$1,234.56');
 });
 it('should update', function(){
   element(':input[name=amount]').value('-1234');
   expect(bind('amount')).toEqual('-$1,234.00');
   expect(bind('amount')).toHaveColor('red');
 });
</test>