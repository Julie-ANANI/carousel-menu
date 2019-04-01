import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'admin-search-map',
  templateUrl: 'admin-search-map.component.html',
  styleUrls: ['admin-search-map.component.scss']
})

export class AdminSearchMapComponent {

  @Input() width = '800px';

  @Input() set countriesData (value: any) {
    this._countriesData = value;
    this.computeQuartiles();
  }

  @Output() onCountryClick = new EventEmitter<any>();

  private _hoverInfo: any = null;

  private _countriesData: any = {};

  private _quartiles: {1: number, 2: number, 3: number};

  private _boxStyle: any = {
    opacity: 0
  };

  //FIXME: use the common country.ts file when Abi merges his branch into dev
  public names = {
    'BD': 'Bangladesh', 'BE': 'Belgium', 'BF': 'Burkina Faso', 'BG': 'Bulgaria', 'BA': 'Bosnia and Herzegovina',
    'BB': 'Barbados', 'WF': 'Wallis and Futuna', 'BL': 'Saint Barthelemy', 'BM': 'Bermuda', 'BN': 'Brunei',
    'BO': 'Bolivia', 'BH': 'Bahrain', 'BI': 'Burundi', 'BJ': 'Benin', 'BT': 'Bhutan', 'JM': 'Jamaica',
    'BV': 'Bouvet Island', 'BW': 'Botswana', 'WS': 'Samoa', 'BQ': 'Bonaire, Saint Eustatius and Saba ', 'BR': 'Brazil',
    'BS': 'Bahamas', 'JE': 'Jersey', 'BY': 'Belarus', 'BZ': 'Belize', 'RU': 'Russia', 'RW': 'Rwanda', 'RS': 'Serbia',
    'TL': 'East Timor', 'RE': 'Reunion', 'TM': 'Turkmenistan', 'TJ': 'Tajikistan', 'RO': 'Romania', 'TK': 'Tokelau',
    'GW': 'Guinea-Bissau', 'GU': 'Guam', 'GT': 'Guatemala', 'GS': 'South Georgia and the South Sandwich Islands',
    'GR': 'Greece', 'GQ': 'Equatorial Guinea', 'GP': 'Guadeloupe', 'JP': 'Japan', 'GY': 'Guyana', 'GG': 'Guernsey',
    'GF': 'French Guiana', 'GE': 'Georgia', 'GD': 'Grenada', 'GB': 'United Kingdom', 'GA': 'Gabon', 'SV': 'El Salvador',
    'GN': 'Guinea', 'GM': 'Gambia', 'GL': 'Greenland', 'GI': 'Gibraltar', 'GH': 'Ghana', 'OM': 'Oman', 'TN': 'Tunisia',
    'JO': 'Jordan', 'HR': 'Croatia', 'HT': 'Haiti', 'HU': 'Hungary', 'HK': 'Hong Kong', 'HN': 'Honduras',
    'HM': 'Heard Island and McDonald Islands', 'VE': 'Venezuela', 'PR': 'Puerto Rico', 'PS': 'Palestinian Territory',
    'PW': 'Palau', 'PT': 'Portugal', 'SJ': 'Svalbard and Jan Mayen', 'PY': 'Paraguay', 'IQ': 'Iraq', 'PA': 'Panama',
    'PF': 'French Polynesia', 'PG': 'Papua New Guinea', 'PE': 'Peru', 'PK': 'Pakistan', 'PH': 'Philippines',
    'PN': 'Pitcairn', 'PL': 'Poland', 'PM': 'Saint Pierre and Miquelon', 'ZM': 'Zambia', 'EH': 'Western Sahara',
    'EE': 'Estonia', 'EG': 'Egypt', 'ZA': 'South Africa', 'EC': 'Ecuador', 'IT': 'Italy', 'VN': 'Vietnam',
    'SB': 'Solomon Islands', 'ET': 'Ethiopia', 'SO': 'Somalia', 'ZW': 'Zimbabwe', 'SA': 'Saudi Arabia', 'ES': 'Spain',
    'ER': 'Eritrea', 'ME': 'Montenegro', 'MD': 'Moldova', 'MG': 'Madagascar', 'MF': 'Saint Martin', 'MA': 'Morocco',
    'MC': 'Monaco', 'UZ': 'Uzbekistan', 'MM': 'Myanmar', 'ML': 'Mali', 'MO': 'Macao', 'MN': 'Mongolia',
    'MH': 'Marshall Islands', 'MK': 'Macedonia', 'MU': 'Mauritius', 'MT': 'Malta', 'MW': 'Malawi', 'MV': 'Maldives',
    'MQ': 'Martinique', 'MP': 'Northern Mariana Islands', 'MS': 'Montserrat', 'MR': 'Mauritania', 'IM': 'Isle of Man',
    'UG': 'Uganda', 'TZ': 'Tanzania', 'MY': 'Malaysia', 'MX': 'Mexico', 'IL': 'Israel', 'FR': 'France',
    'IO': 'British Indian Ocean Territory', 'SH': 'Saint Helena', 'FI': 'Finland', 'FJ': 'Fiji',
    'FK': 'Falkland Islands', 'FM': 'Micronesia', 'FO': 'Faroe Islands', 'NI': 'Nicaragua', 'NL': 'Netherlands',
    'NO': 'Norway', 'NA': 'Namibia', 'VU': 'Vanuatu', 'NC': 'New Caledonia', 'NE': 'Niger', 'NF': 'Norfolk Island',
    'NG': 'Nigeria', 'NZ': 'New Zealand', 'NP': 'Nepal', 'NR': 'Nauru', 'NU': 'Niue', 'CK': 'Cook Islands',
    'XK': 'Kosovo', 'CI': 'Ivory Coast', 'CH': 'Switzerland', 'CO': 'Colombia', 'CN': 'China', 'CM': 'Cameroon',
    'CL': 'Chile', 'CC': 'Cocos Islands', 'CA': 'Canada', 'CG': 'Republic of the Congo',
    'CF': 'Central African Republic', 'CD': 'Democratic Republic of the Congo', 'CZ': 'Czech Republic', 'CY': 'Cyprus',
    'CX': 'Christmas Island', 'CR': 'Costa Rica', 'CW': 'Curacao', 'CV': 'Cape Verde', 'CU': 'Cuba', 'SZ': 'Swaziland',
    'SY': 'Syria', 'SX': 'Sint Maarten', 'KG': 'Kyrgyzstan', 'KE': 'Kenya', 'SS': 'South Sudan', 'SR': 'Suriname',
    'KI': 'Kiribati', 'KH': 'Cambodia', 'KN': 'Saint Kitts and Nevis', 'KM': 'Comoros', 'ST': 'Sao Tome and Principe',
    'SK': 'Slovakia', 'KR': 'South Korea', 'SI': 'Slovenia', 'KP': 'North Korea', 'KW': 'Kuwait', 'SN': 'Senegal',
    'SM': 'San Marino', 'SL': 'Sierra Leone', 'SC': 'Seychelles', 'KZ': 'Kazakhstan', 'KY': 'Cayman Islands',
    'SG': 'Singapore', 'SE': 'Sweden', 'SD': 'Sudan', 'DO': 'Dominican Republic', 'DM': 'Dominica', 'DJ': 'Djibouti',
    'DK': 'Denmark', 'VG': 'British Virgin Islands', 'DE': 'Germany', 'YE': 'Yemen', 'DZ': 'Algeria',
    'US': 'United States', 'UY': 'Uruguay', 'YT': 'Mayotte', 'UM': 'United States Minor Outlying Islands',
    'LB': 'Lebanon', 'LC': 'Saint Lucia', 'LA': 'Laos', 'TV': 'Tuvalu', 'TW': 'Taiwan', 'TT': 'Trinidad and Tobago',
    'TR': 'Turkey', 'LK': 'Sri Lanka', 'LI': 'Liechtenstein', 'LV': 'Latvia', 'TO': 'Tonga', 'LT': 'Lithuania',
    'LU': 'Luxembourg', 'LR': 'Liberia', 'LS': 'Lesotho', 'TH': 'Thailand', 'TF': 'French Southern Territories',
    'TG': 'Togo', 'TD': 'Chad', 'TC': 'Turks and Caicos Islands', 'LY': 'Libya', 'VA': 'Vatican',
    'VC': 'Saint Vincent and the Grenadines', 'AE': 'United Arab Emirates', 'AD': 'Andorra', 'UK': 'United Kingdom',
    'AG': 'Antigua and Barbuda', 'AF': 'Afghanistan', 'AI': 'Anguilla', 'VI': 'U.S. Virgin Islands', 'IS': 'Iceland',
    'IR': 'Iran', 'AM': 'Armenia', 'AL': 'Albania', 'AO': 'Angola', 'AQ': 'Antarctica', 'AS': 'American Samoa',
    'AR': 'Argentina', 'AU': 'Australia', 'AT': 'Austria', 'AW': 'Aruba', 'IN': 'India', 'AX': 'Aland Islands',
    'AZ': 'Azerbaijan', 'IE': 'Ireland', 'ID': 'Indonesia', 'UA': 'Ukraine', 'QA': 'Qatar', 'MZ': 'Mozambique'};

  constructor() {}

  private computeQuartiles(): void {
    const orderedCountries = Object.keys(this._countriesData).sort((a, b) => this._countriesData[a] - this._countriesData[b]);
    const quartileSize = (orderedCountries.length / 4);
    this._quartiles = {
      1: this._countriesData[orderedCountries[Math.ceil(quartileSize)]],
      2: this._countriesData[orderedCountries[Math.ceil(2 * quartileSize)]],
      3: this._countriesData[orderedCountries[Math.ceil(3 * quartileSize)]]
    };
  }

  public getClass (country: string) {
    let intensity = 0;
    if (this.countriesData[country]) {
      if (this.countriesData[country] >= this._quartiles[3]) {
        intensity = 3;
      } else if (this.countriesData[country] >= this._quartiles[2]) {
        intensity = 2;
      } else if (this.countriesData[country] >= this._quartiles[1]) {
        intensity = 1;
      }
    }
    return `country intensity${intensity} ${country}`;
  }

  public clickOnCountry(event: Event) {
    event.preventDefault();
    const foo: any = event.srcElement.className;
    const country = foo.baseVal.slice(-2);
    console.log(country);
  }

  public hoverCountry(event: any) {
    event.preventDefault();
    const foo: any = event.srcElement.className;
    const country = foo.baseVal.slice(-2);
    const countryName = this.names[country];
    this._hoverInfo = {
      country: countryName,
      number: this._countriesData[country] || 'NA'
    };
    this._boxStyle = {
      top: `${event.pageY - 40}px`,
      left: `${event.pageX - countryName.length * 2.6}px`
    };
  }

  public leaveHover(event: Event) {
    event.preventDefault();
    this._hoverInfo = null;
    this._boxStyle = {
      opacity: 0
    };
  }

  get hoverInfo(): any {
    return this._hoverInfo;
  }

  get boxStyle(): any {
    return this._boxStyle;
  }

  get countriesData(): any {
    return this._countriesData;
  }
}
