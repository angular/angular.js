angular.module('Animator', [])

  .controller('AppCtrl', function($scope) {
    $scope.items = ["Afghanistan"," Albania"," Algeria"," American Samoa"," Andorra"," Angola"," Anguilla"," Antarctica"," Antigua and Barbuda"," Argentina"," Armenia"," Aruba"," Ashmore and Cartier"," Australia"," Austria"," Azerbaijan"," Bahrain"," Baker Island"," Bangladesh"," Barbados"," Bassas da India"," Belarus"," Belgium"," Belize"," Benin"," Bermuda"," Bhutan"," Bolivia"," Bosnia and Herzegovina"," Botswana"," Bouvet Island"," Brazil"," British Indian Ocean Territory"," British Virgin Islands"," Brunei Darussalam"," Bulgaria"," Burkina Faso"," Burma"," Burundi"," Cambodia"," Cameroon"," Canada"," Cape Verde"," Cayman Islands"," Central African Republic"," Chad"," Chile"," China"," Christmas Island"," Clipperton Island"," Cocos (Keeling) Islands"," Colombia"," Comoros"," Congo, Democratic Republic of the"," Congo, Republic of the"," Cook Islands"," Coral Sea Islands"," Costa Rica"," Cote d'Ivoire"," Croatia"," Cuba"," Cyprus"," Czech Republic"," Denmark"," Djibouti"," Dominica"," Dominican Republic"," East Timor"," Ecuador"," Egypt"," El Salvador"," Equatorial Guinea"," Eritrea"," Estonia"," Ethiopia"," Europa Island"," Falkland Islands (Islas Malvinas)"," Faroe Islands"," Fiji"," Finland"," France"," France, Metropolitan"," French Guiana"," French Polynesia"," French Southern and Antarctic Lands"," Gabon"," Gaza Strip"," Georgia"," Germany"," Ghana"," Gibraltar"," Glorioso Islands"," Greece"," Greenland"," Grenada"," Guadeloupe"," Guam"," Guatemala"," Guernsey"," Guinea"," Guinea-Bissau"," Guyana"," Haiti"," Heard Island and McDonald Islands"," Holy See (Vatican City)"," Honduras"," Hong Kong (SAR)"," Howland Island"," Hungary"," Iceland"," India"," Indonesia"," Iran"," Iraq"," Ireland"," Israel"," Italy"," Jamaica"," Jan Mayen"," Japan"," Jarvis Island"," Jersey"," Johnston Atoll"," Jordan"," Juan de Nova Island"," Kazakhstan"," Kenya"," Kingman Reef"," Kiribati"," Korea, North"," Korea, South"," Kuwait"," Kyrgyzstan"," Laos"," Latvia"," Lebanon"," Lesotho"," Liberia"," Libya"," Liechtenstein"," Lithuania"," Luxembourg"," Macao"," Macedonia, The Former Yugoslav Republic of"," Madagascar"," Malawi"," Malaysia"," Maldives"," Mali"," Malta"," Man, Isle of"," Marshall Islands"," Martinique"," Mauritania"," Mauritius"," Mayotte"," Mexico"," Micronesia, Federated States of"," Midway Islands"," Miscellaneous (French)"," Moldova"," Monaco"," Mongolia"," Montenegro"," Montserrat"," Morocco"," Mozambique"," Myanmar"," Namibia"," Nauru"," Navassa Island"," Nepal"," Netherlands"," Netherlands Antilles"," New Caledonia"," New Zealand"," Nicaragua"," Niger"," Nigeria"," Niue"," Norfolk Island"," Northern Mariana Islands"," Norway"," Oman"," Pakistan"," Palau"," Palestinian Territory, Occupied"," Palmyra Atoll"," Panama"," Papua New Guinea"," Paracel Islands"," Paraguay"," Peru"," Philippines"," Pitcairn Islands"," Poland"," Portugal"," Puerto Rico"," Qatar"," Réunion"," Romania"," Russia"," Rwanda"," Saint Helena"," Saint Kitts and Nevis"," Saint Lucia"," Saint Pierre and Miquelon"," Saint Vincent and the Grenadines"," Samoa"," San Marino"," São Tomé and Príncipe"," Saudi Arabia"," Senegal"," Serbia"," Serbia and Montenegro"," Seychelles"," Sierra Leone"," Singapore"," Slovakia"," Slovenia"," Solomon Islands"," Somalia"," South Africa"," South Georgia and the South Sandwich Islands"," Spain"," Spratly Islands"," Sri Lanka"," Sudan"," Suriname"," Svalbard"," Swaziland"," Sweden"," Switzerland"," Syria"," Taiwan"," Tajikistan"," Tanzania"," Thailand"," The Bahamas"," The Gambia"," Togo"," Tokelau"," Tonga"," Trinidad and Tobago"," Tromelin Island"," Tunisia"," Turkey"," Turkmenistan"," Turks and Caicos Islands"," Tuvalu"," Uganda"," Ukraine"," United Arab Emirates"," United Kingdom"," United States"," United States Minor Outlying Islands"," Uruguay"," Uzbekistan"," Vanuatu"," Venezuela"," Vietnam"," Virgin Islands"," Virgin Islands (UK)"," Virgin Islands (US)"," Wake Island"," Wallis and Futuna"," West Bank"," Western Sahara"," Western Samoa"," Yemen"," Yugoslavia"," Zaire"," Zambia"," Zimbabwe"];

  })

  .animation('fade-enter-cb', function() {
    return {
      setup : function(element) {
        element.css({
          'opacity':0,
          'top': 100,
          'position':'absolute'
        });
      },
      start : function(element, done, memo) {
        element.animate({
          'opacity':1,
          'top':0
        }, done);
      }
    }
  })

  .animation('fade-leave-cb', function() {
    return {
      setup : function(element) {
        var height = element.height();
        return height;
        element.css({
          'opacity':1,
          'top': 0,
          'position':'absolute'
        });
      },
      start : function(element, done, memo) {
        element.animate({
          'opacity':0,
          'top':-100,
          duration: 2000
        }, done);
      }
    };
  });
