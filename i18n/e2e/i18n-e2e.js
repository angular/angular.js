'use strict';

describe('localized filters', function() {
  describe('es locale', function() {
    beforeEach(function() {
      browser().navigateTo('localeTest_es.html');
    });

    it('should check filters for es locale', function() {
      expect(binding('input | date:"medium"')).toBe('03/06/1977 18:07:23');
      expect(binding('input | date:"longDate"')).toBe('3 de junio de 1977');
      expect(binding('input | number')).toBe('234.234.443.432');
      expect(binding('input | currency')).toBe('€\u00a0234.234.443.432,00');
    });
  });

  describe('cs locale', function() {
    beforeEach(function() {
      browser().navigateTo('localeTest_cs.html');
    });

    it('should check filters for cs locale', function() {
      expect(binding('input | date:"medium"')).toBe('3.6.1977 18:07:23');
      expect(binding('input | date:"longDate"')).toBe('3. června 1977');
      expect(binding('input | number')).toBe('234\u00a0234\u00a0443\u00a0432');
      expect(binding('input | currency')).toBe('234\u00a0234\u00a0443\u00a0432,00\u00a0K\u010d');
    });
  });

  describe('de locale', function() {
    beforeEach(function() {
      browser().navigateTo('localeTest_de.html');
    });

    it('should check filters for de locale', function() {
      expect(binding('input | date:"medium"')).toBe('03.06.1977 18:07:23');
      expect(binding('input | date:"longDate"')).toBe('3. Juni 1977');
      expect(binding('input | number')).toBe('234.234.443.432');
      expect(binding('input | currency')).toBe('234.234.443.432,00\u00a0€');
    });
  });

  describe('en locale', function() {
    beforeEach(function() {
      browser().navigateTo('localeTest_en.html');
    });

    it('should check filters for en locale', function() {
      expect(binding('input | date:"medium"')).toBe('Jun 3, 1977 6:07:23 PM');
      expect(binding('input | date:"longDate"')).toBe('June 3, 1977');
      expect(binding('input | number')).toBe('234,234,443,432');
      expect(binding('input | currency')).toBe('$234,234,443,432.00');
    });


    describe('ng:pluralize for en locale', function() {
      it('should show pluralized strings', function() {
        expect(element('ng-pluralize:first').html()).toBe('You have one email!');

        input('plInput').enter('0');
        expect(element('ng-pluralize:first').html()).toBe('You have no email!');

        input('plInput').enter('3');
        expect(element('ng-pluralize:first').html()).toBe('You have 3 emails!');
      });

      it('should show pluralized strings with offsets', function() {
        expect(element('ng-pluralize:last').html()).toBe('Shanjian is viewing!');

        input('plInput2').enter('0');
        expect(element('ng-pluralize:last').html()).toBe('Nobody is viewing!');

        input('plInput2').enter('2');
        expect(element('ng-pluralize:last').html()).toBe('Shanjian and Di are viewing!');

        input('plInput2').enter('3');
        expect(element('ng-pluralize:last').html()).
            toBe('Shanjian, Di and one other person are viewing!');

        input('plInput2').enter('4');
        expect(element('ng-pluralize:last').html()).
            toBe('Shanjian, Di and 2 other people are viewing!');
      });

      it('should show pluralized strings with correct data-binding', function() {
        input('plInput2').enter('2');
        expect(element('ng-pluralize:last').html()).toBe('Shanjian and Di are viewing!');

        input('person1').enter('Igor');
        expect(element('ng-pluralize:last').html()).toBe('Igor and Di are viewing!');

        input('person2').enter('Vojta');
        expect(element('ng-pluralize:last').html()).toBe('Igor and Vojta are viewing!');
      });
    });
  });

  describe('sk locale', function() {
    beforeEach(function() {
      browser().navigateTo('localeTest_sk.html');
    });

    it('should check filters for sk locale', function() {
      expect(binding('input | date:"medium"')).toBe('3.6.1977 18:07:23');
      expect(binding('input | date:"longDate"')).toBe('3. júna 1977');
      expect(binding('input | number')).toBe('234\u00a0234\u00a0443\u00a0432');
      expect(binding('input | currency')).toBe('234\u00a0234\u00a0443\u00a0432,00\u00a0Sk');
    });


    describe('ng:pluralize for sk locale', function() {
      it('should show pluralized strings', function() {
        expect(element('ng-pluralize').html()).toBe('Mas jeden email!');

        input('plInput').enter('0');
        expect(element('ng-pluralize:first').html()).toBe('Mas 0 emailov!');

        input('plInput').enter('3');
        expect(element('ng-pluralize:first').html()).toBe('Mas 3 emaily!');

        input('plInput').enter('4');
        expect(element('ng-pluralize:first').html()).toBe('Mas 4 emaily!');

        input('plInput').enter('6');
        expect(element('ng-pluralize:first').html()).toBe('Mas 6 emailov!');
      });

      it('should show pluralized strings with offsets', function() {
        //TODO(Igor): add offsets for sk
      });

      it('should show pluralized strings with correct data-binding', function() {
      });
    });
  });

  describe('zh locale', function() {
    beforeEach(function() {
      browser().navigateTo('localeTest_zh.html');
    });

    it('should check filters for zh locale', function() {
      expect(binding('input | date:"medium"')).toBe('1977-6-3 下午6:07:23');
      expect(binding('input | date:"longDate"')).toBe('1977年6月3日');
      expect(binding('input | number')).toBe('234,234,443,432');
      expect(binding('input | currency')).toBe('¥234,234,443,432.00');
    });


    describe('ng:pluralize for zh locale', function() {
      it('should show pluralized strings', function() {
        expect(element('ng-pluralize:first').html()).toBe('1人在浏览该文件!');

        input('plInput').enter('0');
        expect(element('ng-pluralize:first').html()).toBe('0人在浏览该文件!');

        input('plInput').enter('3');
        expect(element('ng-pluralize:first').html()).toBe('3人在浏览该文件!');
      });

      it('should show pluralized strings with offsets', function() {
        expect(element('ng-pluralize:last').html()).toBe('Shanjian 在浏览该文件!');

        input('plInput2').enter('0');
        expect(element('ng-pluralize:last').html()).toBe('没有人在浏览该文件!');

        input('plInput2').enter('2');
        expect(element('ng-pluralize:last').html()).toBe('Shanjian 和 Di 在浏览该文件!');

        input('plInput2').enter('3');
        expect(element('ng-pluralize:last').html()).
            toBe('Shanjian, Di 还有其他1 人在浏览该文件!');
      });

      it('should show pluralized strings with correct data-binding', function() {
        input('plInput2').enter('2');
        expect(element('ng-pluralize:last').html()).toBe('Shanjian 和 Di 在浏览该文件!');

        input('person1').enter('彭迪');
        expect(element('ng-pluralize:last').html()).toBe('彭迪 和 Di 在浏览该文件!');

        input('person2').enter('一哥');
        expect(element('ng-pluralize:last').html()).toBe('彭迪 和 一哥 在浏览该文件!');
      });
    });
  });
});
