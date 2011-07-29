describe("localized filters", function() {
  describe("es locale", function() {
    beforeEach(function() {
      browser().navigateTo("localeTest_es.html");
    });

    it('should check filters for es locale', function() {
      expect(binding('input | date:"medium"')).toBe('03/06/1977 18:07:23');
      expect(binding('input | date:"longDate"')).toBe("3 de junio de 1977");
      expect(binding('input | number')).toBe('234.234.443.432');
      expect(binding('input | currency')).toBe('€&nbsp;234.234.443.432,00');
    });
  });

  describe("cs locale", function() {
    beforeEach(function() {
      browser().navigateTo("localeTest_cs.html");
    });

    it('should check filters for cs locale', function() {
      expect(binding('input | date:"medium"')).toBe('3.6.1977 18:07:23');
      expect(binding('input | date:"longDate"')).toBe("3. června 1977");
      expect(binding('input | number')).toBe('234&nbsp;234&nbsp;443&nbsp;432');
      expect(binding('input | currency')).toBe('234&nbsp;234&nbsp;443&nbsp;432,00&nbsp;K\u010d');
    });
  });

  describe("de locale", function() {
    beforeEach(function() {
      browser().navigateTo("localeTest_de.html");
    });

    it('should check filters for de locale', function() {
      expect(binding('input | date:"medium"')).toBe('03.06.1977 18:07:23');
      expect(binding('input | date:"longDate"')).toBe("3. Juni 1977");
      expect(binding('input | number')).toBe('234.234.443.432');
      expect(binding('input | currency')).toBe('234.234.443.432,00&nbsp;€');
    });
  });

  describe("en locale", function() {
    beforeEach(function() {
      browser().navigateTo("localeTest_en.html");
    });

    it('should check filters for en locale', function() {
      expect(binding('input | date:"medium"')).toBe('Jun 3, 1977 6:07:23 PM');
      expect(binding('input | date:"longDate"')).toBe("June 3, 1977");
      expect(binding('input | number')).toBe('234,234,443,432');
      expect(binding('input | currency')).toBe('$234,234,443,432.00');
    });
  });

  describe("sk locale", function() {
    beforeEach(function() {
      browser().navigateTo("localeTest_sk.html");
    });

    it('should check filters for sk locale', function() {
      expect(binding('input | date:"medium"')).toBe('3.6.1977 18:07:23');
      expect(binding('input | date:"longDate"')).toBe("3. júna 1977");
      expect(binding('input | number')).toBe('234&nbsp;234&nbsp;443&nbsp;432');
      expect(binding('input | currency')).toBe('234&nbsp;234&nbsp;443&nbsp;432,00&nbsp;Sk');
    });
  });

  describe("zh locale", function() {
    beforeEach(function() {
      browser().navigateTo("localeTest_zh.html");
    });

    it('should check filters for zh locale', function() {
      expect(binding('input | date:"medium"')).toBe('1977-6-3 下午6:07:23');
      expect(binding('input | date:"longDate"')).toBe("1977年6月3日");
      expect(binding('input | number')).toBe('234,234,443,432');
      expect(binding('input | currency')).toBe('¥234,234,443,432.00');
    });
  });
});
