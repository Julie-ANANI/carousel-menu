import { Component } from '@angular/core';
import { SearchService } from "../../../../../../services/search/search.service";
import { TranslateNotificationsService } from "../../../../../../services/notifications/notifications.service";
import { COUNTRIES } from '../../../../../shared/components/shared-search-pros/COUNTRIES';
import { first } from "rxjs/operators";

@Component({
  selector: 'app-admin-search-demo',
  templateUrl: './admin-search-demo.component.html',
  styleUrls: ['./admin-search-demo.component.scss']
})
export class AdminSearchDemoComponent {

  private _keywords: string;
  private _pros: Array<any> = [];
  private _metadata: any = [];
  public modalUpdate = false;
  public data =  [
    {
      "nbResults": 121000,
      "countryCode": "US"
    },
    {
      "nbResults": 1100,
      "countryCode": "IN"
    },
    {
      "nbResults": 10300,
      "countryCode": "CA"
    },
    {
      "nbResults": 16000,
      "countryCode": "FR"
    },
    {
      "nbResults": 7760,
      "countryCode": "DE"
    },
    {
      "nbResults": 16800,
      "countryCode": "UK"
    },
    {
      "nbResults": 6340,
      "countryCode": "BR"
    },
    {
      "nbResults": 4570,
      "countryCode": "CN"
    },
    {
      "nbResults": 8090,
      "countryCode": "IT"
    },
    {
      "nbResults": 6990,
      "countryCode": "ES"
    },
    {
      "nbResults": 8470,
      "countryCode": "AU"
    },
    {
      "nbResults": 11400,
      "countryCode": "NL"
    },
    {
      "nbResults": 4590,
      "countryCode": "ID"
    },
    {
      "nbResults": 6420,
      "countryCode": "BE"
    },
    {
      "nbResults": 4200,
      "countryCode": "NO"
    }
    ];
  private _results: any;
  private _fetchInterval = null;
  private _status: string = null;
  public continentTarget = {
    "americaSud": true,
    "americaNord": true,
    "europe": true,
    "russia": true,
    "asia": true,
    "oceania": true,
    "africa": true
  };
  private _selectedArea: string = "world";

  constructor(private _searchService: SearchService,
              private _notificationsService: TranslateNotificationsService) {}

  public displayMetadata(continent: string) {
    this._selectedArea = continent;
    this._results = continent === 'world' ?
      this._metadata :
      this._metadata.filter(result => COUNTRIES[continent].indexOf(result.countryCode) > -1);
  }

  public searchPros(event: Event) {
    event.preventDefault();
    this._searchService.inHouseSearch(this._keywords).pipe(first()).subscribe((pros: any) => {
      /*
      const pros: Array<any> = [
        {
          "_id": "5c790a88c497ba2f55d3056e",
          "person": {
            "_id": "584eac7662358f0100150cc4",
            "company": {
              "_id": "584eac7562358f0100150ca2",
              "domain": "celonova.com",
              "industry": "",
              "name": "CeloNova BioSciences, Inc.",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_initial last_name",
                "first_name . last_name"
              ],
              "allDomains": [
                "celonova.com",
                "bizapedia.com",
                "bbb.org",
                "businesswire.com",
                "smartrecruiters.com",
                "clinicaltrials.gov",
                "corporationwiki.com",
                "trademarkia.com",
                "pharmamedtechbi.com",
                "dicardiology.com",
                "news.bostonscientific.com",
                "whalewisdom.com",
                "local.com",
                "bionews-tx.com",
                "cmocro.com",
                "nextcaller.com",
                "news-medical.net",
                "corporateshopping.com",
                "freshpatents.com",
                "medwowglobal.com",
                "crunchbase.com",
                "formds.com"
              ],
              "created": "2016-12-12T13:56:05.590Z",
              "id": "584eac7562358f0100150ca2"
            },
            "email": "sviney@cbinsights.com",
            "emailConfidence": 80,
            "emailState": "Mail trouvé",
            "firstName": "Stephane",
            "fullName": "Stephane VINEY",
            "jobTitle": "Sales Manager France",
            "lastName": "VINEY",
            "pattern": "first_initial last_name",
            "profileUrl": "https://fr.linkedin.com/in/stephane-viney-5823ba16",
            "cost": {
              "totalCost": 0.0172,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 1,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 2,
              "step": 3,
              "googleQuery": 2
            },
            "created": "2016-12-12T13:56:06.526Z",
            "id": "584eac7662358f0100150cc4"
          },
          "country": [
            "FR"
          ],
          "score": 3.808333333333333,
          "countries": [],
          "keywords": [
            "medical devices orthopedics ",
            "orthopedics medical devices implant",
            "orthopedic medical device implant",
            "Medical Sales Distributors surgery ",
            "Medical Sales Distributors orthopedics",
            "Medical Device Opportunity orthopedic surgery ",
            "Orthopedic transplant surgery"
          ],
          "created": "2019-03-04T16:40:11.950Z",
          "id": "5c790a88c497ba2f55d3056e"
        },
        {
          "_id": "5c790bc8c497ba2f55d9d501",
          "person": {
            "_id": "5901e5c37f6b900100635a3d",
            "company": {
              "_id": "57cf68e5845bf0010062e5e6",
              "domain": "medicalex.info",
              "industry": "",
              "name": "Medicalex-Francemed, Paris, FRANCE",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_initial . last_name"
              ],
              "allDomains": [],
              "created": "2016-09-07T01:09:57.378Z",
              "id": "57cf68e5845bf0010062e5e6"
            },
            "country": "FR",
            "email": "oscar.ramirez@medicalex.info",
            "emailConfidence": 100,
            "emailState": "sent",
            "firstName": "Oscar",
            "fullName": "Oscar RAMIREZ",
            "jobTitle": "Medical Device Design Engineer - Medicalex, Paris",
            "keywords": "\"orthopedic implant\"",
            "lastName": "RAMIREZ",
            "pattern": "first_name . last_name",
            "profileUrl": "https://fr.linkedin.com/in/oscar-ramirez-phd-84703a39",
            "cost": {
              "totalCost": 0.01,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 2,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 0,
              "step": 1,
              "googleQuery": 0
            },
            "created": "2017-04-27T12:36:19.609Z",
            "id": "5901e5c37f6b900100635a3d"
          },
          "country": [
            "FR"
          ],
          "score": 3.3083333333333336,
          "countries": [],
          "keywords": [
            "orthopedic implant",
            "orthopedic medical device implant",
            "Medical Device Opportunity orthopedic surgery ",
            "Orthopedic implant",
            "Medical Device Opportunity r&d surgery ",
            "Medical Device Opportunity r&d orthopedic",
            "surgery biomedical bone"
          ],
          "created": "2019-03-04T16:40:11.951Z",
          "id": "5c790bc8c497ba2f55d9d501"
        },
        {
          "_id": "5c790bc8c497ba2f55d9d540",
          "person": {
            "_id": "5901e5c37f6b900100635a3b",
            "company": {
              "_id": "58ac3adb162ca80100765956",
              "domain": "clariance-spine.com",
              "industry": "",
              "name": "Clariance Spine",
              "profileUrl": "",
              "type": "",
              "pattern": [],
              "allDomains": [
                "clariance-spine.com",
                "clariance-spine.us",
                "titanspine.com",
                "erismalpevolution.com"
              ],
              "created": "2017-02-21T13:04:27.427Z",
              "id": "58ac3adb162ca80100765956"
            },
            "country": "FR",
            "emailState": "Mail non trouvé",
            "firstName": "Clarisse",
            "fullName": "Clarisse Demarcq",
            "jobTitle": "Project manager",
            "keywords": "\"orthopedic implant\"",
            "lastName": "Demarcq",
            "pattern": "first_name . last_name",
            "profileUrl": "https://fr.linkedin.com/in/clarissedemarcq",
            "cost": {
              "totalCost": 0,
              "emailFormatQuery": 1,
              "hubucoQuery": 1,
              "neverBounceQuery": 0,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 2,
              "step": 1,
              "googleQuery": 2
            },
            "created": "2017-04-27T12:36:19.608Z",
            "id": "5901e5c37f6b900100635a3b"
          },
          "country": [
            "FR"
          ],
          "score": 3.3083333333333336,
          "countries": [],
          "keywords": [
            "orthopedic implant",
            "orthopedic medical device implant",
            "Professionals in the Pharmaceutical and Biotech Industry packaging ",
            "Medical Device Opportunity orthopedic surgery ",
            "Orthopedic implant",
            "Medical Device Opportunity r&d surgery ",
            "Medical Device Opportunity r&d orthopedic",
            "packaging pharmaceutical industry Professionals in the Pharmaceutical and Biotech Industry ",
            "sport medicine surgery",
            "sport medicine orthopaedic",
            "sport medicine surgeon",
            "medical devices dosage ",
            "pharmaceutical dosage packaging ",
            "medical device dosage ",
            "pharmaceutics packaging medical devices ",
            "pharmaceutics packaging medical device",
            "product manager pharmaceutical laboratory hospital ",
            "product manager devices clinical chemistry ",
            "medical devices surgical clinic "
          ],
          "created": "2019-03-04T16:40:11.951Z",
          "id": "5c790bc8c497ba2f55d9d540"
        },
        {
          "_id": "5c790a7bc497ba2f55d2c224",
          "person": {
            "_id": "584eafa962358f01001517b3",
            "company": {
              "_id": "583dfa6f7f0c7701008bacfc",
              "domain": "groupe-saint-george.org",
              "industry": "",
              "name": "CLINIQUE SAINT-GEORGE",
              "profileUrl": "",
              "type": "",
              "pattern": [],
              "allDomains": [
                "groupe-saint-george.org",
                "esthetique-saint-george.com",
                "clinique-saint-george.com",
                "privco.com",
                "le-guide-sante.org",
                "clave-henri.com",
                "endocontrol-medical.com",
                "ncbi.nlm.nih.gov",
                "chpsaintgregoire.com",
                "lepoint.fr",
                "alexa.com",
                "phonepages.ca",
                "sputniknews.com",
                "freemedicalsearch.com",
                "justacote.com",
                "nubium.raphas.net",
                "imcas.com",
                "booking.com",
                "actifit.info",
                "cxvascular.com",
                "onetravelsource.com",
                "doctoralia-fr.com",
                "cdc-la-serena.com",
                "lignesdazur.com",
                "logic-immo.com"
              ],
              "created": "2016-11-29T22:00:15.490Z",
              "id": "583dfa6f7f0c7701008bacfc"
            },
            "emailState": "Mail non trouvé",
            "firstName": "Arnaud",
            "fullName": "Arnaud Clavé",
            "jobTitle": "Chirurgien orthopédiste chez CLINIQUE SAINT-GEORGE",
            "lastName": "Clavé",
            "pattern": "first_name . last_name",
            "profileUrl": "https://fr.linkedin.com/in/clavearnaud",
            "cost": {
              "totalCost": 0,
              "emailFormatQuery": 1,
              "hubucoQuery": 1,
              "neverBounceQuery": 0,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 2,
              "step": 1,
              "googleQuery": 2
            },
            "created": "2016-12-12T14:09:45.461Z",
            "id": "584eafa962358f01001517b3"
          },
          "country": [
            "FR"
          ],
          "score": 3.291666666666666,
          "countries": [],
          "keywords": [
            "medical devices orthopedics ",
            "orthopedics medical devices implant",
            "hip surgery",
            "Orthopaedic Trauma Association (OTA)",
            "orthopedic medical equipment",
            "Prosthetics dental",
            "orthopedic surgery bone",
            "Orthopaedic Trauma Association",
            "3D supplies dental",
            "CNRS microscopy ",
            "scanning electron microscopy ",
            "reconstruction surgery bone",
            "electron microscopy ",
            "clinical research bone orthopaedic",
            "trauma surgery",
            "surgery surgical Biomaterials",
            "surgical Biomaterial",
            "fractures surgical",
            "dental medical devices supply",
            "Spectroscopy ",
            "surgeon orthopedic specialist "
          ],
          "created": "2019-03-04T16:40:11.951Z",
          "id": "5c790a7bc497ba2f55d2c224"
        },
        {
          "_id": "5c790a7dc497ba2f55d2d106",
          "person": {
            "_id": "584eadcd62358f0100151130",
            "company": {
              "_id": "584eadcc62358f0100151128",
              "domain": "laprovence.com",
              "industry": "",
              "name": "Institut du Mouvement, Hôpital Sainte Marguerite",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_initial last_name"
              ],
              "allDomains": [
                "laprovence.com",
                "orthopedie-lyon.fr"
              ],
              "created": "2016-12-12T14:01:48.700Z",
              "id": "584eadcc62358f0100151128"
            },
            "email": "ppinelli@laprovence.com",
            "emailConfidence": 80,
            "emailState": "Mail trouvé",
            "firstName": "Pierre-Olivier",
            "fullName": "Pierre-Olivier PINELLI",
            "jobTitle": "Chirurgien Orthopédiste, Hanche et Genou",
            "lastName": "PINELLI",
            "pattern": "first_initial last_name",
            "profileUrl": "https://fr.linkedin.com/in/pierre-olivier-pinelli-3a277516",
            "cost": {
              "totalCost": 0.0172,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 1,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 2,
              "step": 3,
              "googleQuery": 2
            },
            "created": "2016-12-12T14:01:49.097Z",
            "id": "584eadcd62358f0100151130"
          },
          "country": [
            "FR"
          ],
          "score": 3.2666666666666666,
          "countries": [],
          "keywords": [
            "medical devices orthopedics ",
            "Orthopedic Surgeon hip ",
            "medical device hip surgery",
            "hip replacement",
            "orthopedic medical equipment",
            "orthopedic surgery bone",
            "Medical Device Opportunity orthopedic surgery ",
            "reconstructive surgery bone",
            "reconstruction surgery bone",
            "reconstruction surgeon bone",
            "clinical research bone surgeon",
            "clinical research bone orthopaedic",
            "knee surgery "
          ],
          "created": "2019-03-04T16:40:11.951Z",
          "id": "5c790a7dc497ba2f55d2d106"
        },
        {
          "_id": "5c79072ec497ba2f55cd7cd0",
          "person": {
            "_id": "57aa5162cbccee0100a031d9",
            "company": {
              "_id": "57aa4975cbccee0100a02a9f",
              "domain": "eos-imaging.com",
              "industry": "",
              "name": "EOS imaging",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_name  . last_name ",
                "first_initial last_name"
              ],
              "allDomains": [
                "eos-imaging.com",
                "businesswire.com",
                "tradingsat.com",
                "boursedirect.fr",
                "capital.fr",
                "chop.edu",
                "youtube.com",
                "abcbourse.com",
                "fr.news.yahoo.com",
                "easybourse.com",
                "france-biotech.org",
                "itespresso.fr",
                "alternancemploi.com",
                "rchsd.org",
                "news.google.fr"
              ],
              "created": "2016-08-09T21:21:57.847Z",
              "id": "57aa4975cbccee0100a02a9f"
            },
            "email": "shenry@eos-imaging.com",
            "emailConfidence": 80,
            "emailState": "sent",
            "firstName": "Sébastien",
            "fullName": "Sébastien Henry",
            "jobTitle": "Vice President Advanced Orthopedic Solutions at EOS imaging",
            "lastName": "Henry",
            "pattern": "first_initial last_name",
            "profileUrl": "https://fr.linkedin.com/in/henrysebastien",
            "cost": {
              "totalCost": 0.0172,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 1,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 2,
              "step": 3,
              "googleQuery": 2
            },
            "created": "2016-08-09T21:55:46.161Z",
            "id": "57aa5162cbccee0100a031d9"
          },
          "country": [
            "FR"
          ],
          "score": 3.2083333333333335,
          "countries": [],
          "keywords": [
            "Medical Devices Startups spine",
            "Medical Device Opportunity spine",
            "Medical Device Field - MDField spine",
            "spine surgery instruments",
            "orthopedics medical devices implant",
            "medical device hip instruments",
            "medical device hip surgery",
            "implants hip instruments",
            "orthopedic medical device implant",
            "Medical Device Opportunity r&d orthopedic",
            "Medical Sales Distributors orthopedics",
            "Aujourd'hui 1 an Founder ",
            "Aujourd'hui 1 an start-up ",
            "Aujourd'hui 1 an Directeur Général entrepreneur ",
            "3D printing manufacturing ",
            "additive manufacturing ",
            "metal injection molding",
            "motion analysis healthcare",
            "motion analysis",
            "orthopedic prosthesis"
          ],
          "created": "2019-03-04T16:40:11.951Z",
          "id": "5c79072ec497ba2f55cd7cd0"
        },
        {
          "_id": "5c790bc1c497ba2f55d9b9d8",
          "person": {
            "_id": "5901e94c7f6b900100635d0f",
            "company": {
              "_id": "57aa4ca2cbccee0100a02e3f",
              "domain": "olympusbiotech.eu",
              "industry": "",
              "name": "Olympus Biotech",
              "profileUrl": "",
              "type": "",
              "pattern": [],
              "allDomains": [
                "olympusbiotech.eu",
                "olympus-global.com",
                "olympusbiotech.com",
                "youtube.com",
                "orega-biotech.com",
                "olympusbioscapes.com",
                "prnewswire.com",
                "olympus.co.uk",
                "nextcaller.com",
                "lyonbiopole.com",
                "biopharma-reporter.com",
                "news-medical.net",
                "grainedepub.com",
                "aderly.fr",
                "presse.onlylyon.org",
                "delpharm.com",
                "aderly.com",
                "annuaire-horaire.fr",
                "lyon.cci.fr",
                "ellisphere.fr",
                "pidc-construction.com",
                "biomup.com",
                "capital.fr",
                "ryortho.com",
                "marques.expert",
                "posomed.fr"
              ],
              "created": "2016-08-09T21:35:30.524Z",
              "id": "57aa4ca2cbccee0100a02e3f"
            },
            "country": "FR",
            "emailState": "Mail non trouvé",
            "firstName": "Cécile",
            "fullName": "Cécile Ripoll",
            "jobTitle": "Marketing Product Manager Regenerative Medicine at Olympus Biotech",
            "keywords": "\"orthopedics\" \"medical devices\" \"implant\"",
            "lastName": "Ripoll",
            "pattern": "first_name . last_name",
            "profileUrl": "https://fr.linkedin.com/in/cecileripoll-medicaldevice",
            "cost": {
              "totalCost": 0,
              "emailFormatQuery": 1,
              "hubucoQuery": 0,
              "neverBounceQuery": 1,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 2,
              "step": 1,
              "googleQuery": 2
            },
            "created": "2017-04-27T12:51:24.218Z",
            "id": "5901e94c7f6b900100635d0f"
          },
          "country": [
            "FR"
          ],
          "score": 3.183333333333333,
          "countries": [],
          "keywords": [
            "orthopedics medical devices implant",
            "orthopedic medical device implant",
            "Medical Device Opportunity orthopedic surgery ",
            "regenerative medicine surgery",
            "regenerative medicine orthopedic",
            "regenerative medicine orthopaedic",
            "regenerative medicine orthopedics",
            "new business development medical device product management "
          ],
          "created": "2019-03-04T16:40:11.951Z",
          "id": "5c790bc1c497ba2f55d9b9d8"
        },
        {
          "_id": "5c79075bc497ba2f55ceb723",
          "person": {
            "_id": "57d958151747730100f619ec",
            "company": {
              "_id": "57d958131747730100f619d7",
              "domain": "",
              "industry": "",
              "name": "SARLConsult Philip Procter",
              "profileUrl": "",
              "type": "",
              "pattern": [],
              "allDomains": [],
              "created": "2016-09-14T14:00:51.092Z",
              "id": "57d958131747730100f619d7"
            },
            "emailState": "Domaine non trouvé",
            "firstName": "Philip",
            "fullName": "Philip Procter",
            "jobTitle": "SARL Consult Philip Procter",
            "lastName": "Procter",
            "pattern": "",
            "profileUrl": "https://fr.linkedin.com/in/philip-procter-19307b9",
            "cost": {
              "totalCost": 0,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 0,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 0,
              "step": 0,
              "googleQuery": 0
            },
            "created": "2016-09-14T14:00:53.002Z",
            "id": "57d958151747730100f619ec"
          },
          "country": [
            "FR"
          ],
          "score": 3.1666666666666665,
          "countries": [],
          "keywords": [
            "bone surgery instruments",
            "bone cement",
            "bone surgery equipment",
            "spine surgery instruments",
            "market introduction new product",
            "orthopedics medical devices implant",
            "orthopedic medical device implant",
            "orthopedics spine graft",
            "bone substitute",
            "Medical Device Opportunity r&d orthopedic",
            "bone graft orthopedic",
            "bone graft",
            "orthopaedic graft",
            "surgery surgical Biomaterials",
            "fracture surgical",
            "fracture Biomaterials",
            "surgery biomedical bone",
            "fractures surgical",
            "surgical graft",
            "product design design control"
          ],
          "created": "2019-03-04T16:40:11.951Z",
          "id": "5c79075bc497ba2f55ceb723"
        },
        {
          "_id": "5c790bc4c497ba2f55d9c324",
          "person": {
            "_id": "5903408cbd458701002ebb0d",
            "company": {
              "_id": "5903408cbd458701002ebae0",
              "domain": "ncbi.nlm.nih.gov",
              "industry": "",
              "name": "Joseph Ducuing hospital",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_initial last_name"
              ],
              "allDomains": [
                "ncbi.nlm.nih.gov",
                "hjd.asso.fr",
                "whatclinic.com"
              ],
              "created": "2017-04-28T13:15:56.571Z",
              "id": "5903408cbd458701002ebae0"
            },
            "country": "FR",
            "email": "ggiordano@ncbi.nlm.nih.gov",
            "emailConfidence": 80,
            "emailState": "Mail trouvé",
            "firstName": "Gérard",
            "fullName": "Gérard Giordano",
            "jobTitle": "Orthopeadic Surgeon - Head of the orthopedic department of Joseph Ducuing Hospital",
            "keywords": "\"hip surgery\"",
            "lastName": "Giordano",
            "pattern": "first_initial last_name",
            "profileUrl": "https://fr.linkedin.com/in/g%C3%A9rard-giordano-44121365",
            "cost": {
              "totalCost": 0.0123,
              "emailFormatQuery": 0,
              "hubucoQuery": 1,
              "neverBounceQuery": 0,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 2,
              "step": 3,
              "googleQuery": 2
            },
            "created": "2017-04-28T13:15:56.837Z",
            "id": "5903408cbd458701002ebb0d"
          },
          "country": [
            "FR"
          ],
          "score": 2.6666666666666665,
          "countries": [],
          "keywords": [
            "Orthopedic Surgeon hip ",
            "hip surgery",
            "chef de service centre hospitalier ",
            "orthopaedic surgeon orthopaedics",
            "Biologic Orthopedic Society",
            "regenerative medicine surgery",
            "regenerative medicine orthopaedics",
            "regenerative medicine orthopedic",
            "regenerative medicine surgeon",
            "regenerative medicine bone",
            "regenerative medicine orthopaedic",
            "regenerative medicine orthopedics",
            "surgery surgical Biomaterials",
            "surgery Biomaterials ",
            "surgeon Biomaterials",
            "knee surgery "
          ],
          "created": "2019-03-04T16:40:11.951Z",
          "id": "5c790bc4c497ba2f55d9c324"
        },
        {
          "_id": "5c79075fc497ba2f55cecb0a",
          "person": {
            "_id": "57d96e3a1747730100f62c5b",
            "company": {
              "_id": "5748f1d25958ae0100112502",
              "domain": "accuray.com",
              "industry": "",
              "name": "Accuray",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_initial last_name",
                "first_initial  last_name "
              ],
              "allDomains": [
                "accuray.com",
                "accurayexchange.com",
                "investors.accuray.com",
                "glassdoor.com",
                "tomotherapy.com"
              ],
              "created": "2016-05-28T01:18:10.627Z",
              "id": "5748f1d25958ae0100112502"
            },
            "email": "fhirigoyenberry-lanson@accuray.com",
            "emailConfidence": 80,
            "emailState": "sent",
            "firstName": "Fabienne",
            "fullName": "Fabienne Hirigoyenberry-Lanson",
            "jobTitle": "Vice President Clinical Development at Accuray",
            "lastName": "Hirigoyenberry-Lanson",
            "pattern": "first_initial last_name",
            "profileUrl": "https://fr.linkedin.com/in/fabienne-hirigoyenberry-lanson-phd-b79a459",
            "cost": {
              "totalCost": 0.0172,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 1,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 2,
              "step": 3,
              "googleQuery": 2
            },
            "created": "2016-09-14T15:35:22.772Z",
            "id": "57d96e3a1747730100f62c5b"
          },
          "country": [
            "FR"
          ],
          "score": 2.583333333333333,
          "countries": [],
          "keywords": [
            "bone surgery equipment",
            "medical devices orthopedics ",
            "orthopedics medical devices implant",
            "hip implant",
            "medical device hip surgery",
            "orthopedic medical device implant",
            "orthopedic medical equipment",
            "clinical research bone surgery ",
            "vascular oncology research ",
            "Radiology medical devices equipment medical imaging ",
            "Radiology medical device equipment medical imaging "
          ],
          "created": "2019-03-04T16:40:11.951Z",
          "id": "5c79075fc497ba2f55cecb0a"
        },
        {
          "_id": "5c790a7dc497ba2f55d2d465",
          "person": {
            "_id": "584eb0f062358f0100151c30",
            "company": {
              "_id": "584eb0f062358f0100151c27",
              "domain": "hemosquid.com",
              "industry": "",
              "name": "Hemosquid",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_name . last_name"
              ],
              "allDomains": [
                "hemosquid.com",
                "hemosquid.fr",
                "inovallee.com",
                "grenoble-isere.com",
                "reseau-entreprendre-isere.fr",
                "grenoble.cci.fr",
                "bizmedtech.com",
                "medicinoxy.com",
                "inovallee-letarmac.blogspot.com",
                "cami-labex.fr",
                "fondationeovi-mcd.org",
                "grain-incubation.com",
                "robtex.com",
                "mapado.com",
                "comunlundi.com",
                "multimedia.enseignementsup-recherche.gouv.fr",
                "eventbrite.fr",
                "bodacc.fr",
                "rotary1780.com",
                "secteur-sante.univ-grenoble-alpes.fr",
                "pepinieres-ra.fr"
              ],
              "created": "2016-12-12T14:15:12.493Z",
              "id": "584eb0f062358f0100151c27"
            },
            "email": "francois.urvoy@hemosquid.com",
            "emailConfidence": 80,
            "emailState": "Mail trouvé",
            "firstName": "François",
            "fullName": "François Urvoy",
            "jobTitle": "Co-founder, President & CEO at Hemosquid",
            "lastName": "Urvoy",
            "pattern": "first_name . last_name",
            "profileUrl": "https://fr.linkedin.com/in/francoisurvoy",
            "cost": {
              "totalCost": 0.0172,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 1,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 2,
              "step": 3,
              "googleQuery": 2
            },
            "created": "2016-12-12T14:15:12.615Z",
            "id": "584eb0f062358f0100151c30"
          },
          "country": [
            "FR"
          ],
          "score": 2.5416666666666665,
          "countries": [],
          "keywords": [
            "medical devices orthopedics ",
            "Marketing Director new product ",
            "business developer strategy innovation market ",
            "orthopedic medical equipment",
            "drug packaging",
            "Medical Sales Distributors orthopedics",
            "Medical Device Opportunity r&d orthopedic",
            "Product management pharmaceutical industry r&d ",
            "Aujourd'hui 4 ans CEO start-up ",
            "Aujourd'hui 4 ans CEO Founder ",
            "Aujourd'hui 4 ans co founder start-up ",
            "Aujourd'hui 4 ans co founder CEO ",
            "commercial business development business director "
          ],
          "created": "2019-03-04T16:40:11.951Z",
          "id": "5c790a7dc497ba2f55d2d465"
        },
        {
          "_id": "5c790c07c497ba2f55db39a5",
          "person": {
            "_id": "5919a5dcd98c6a0100533a25",
            "company": {
              "_id": "5919a5dbd98c6a0100533a0e",
              "domain": "",
              "industry": "",
              "name": "Medextens SARL-Paris / LTD-London",
              "profileUrl": "",
              "type": "",
              "pattern": [],
              "allDomains": [],
              "created": "2017-05-15T12:58:03.783Z",
              "id": "5919a5dbd98c6a0100533a0e"
            },
            "country": "FR",
            "emailState": "Mail non trouvé",
            "firstName": "Frederic",
            "fullName": "Frederic Daoud",
            "jobTitle": "MD, MSc. Consultant in biometrics, clinical, outcomes and epidemiological research. Clinical decision analysis & HTA",
            "keywords": "\"orthopedic\" \"medical device\" \"implant\"",
            "lastName": "Daoud",
            "pattern": "first_name . last_name",
            "profileUrl": "https://fr.linkedin.com/in/frederic-c-daoud-695572127",
            "cost": {
              "totalCost": 0,
              "emailFormatQuery": 1,
              "hubucoQuery": 1,
              "neverBounceQuery": 0,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 2,
              "step": 1,
              "googleQuery": 2
            },
            "created": "2017-05-15T12:58:04.063Z",
            "id": "5919a5dcd98c6a0100533a25"
          },
          "country": [
            "FR"
          ],
          "score": 2.5416666666666665,
          "countries": [],
          "keywords": [
            "orthopedic medical device implant",
            "orthopedic surgery bone",
            "Medical Device Opportunity r&d orthopedic",
            "Orthopedic transplant surgery",
            "allergy medical device",
            "Epidemiology allergy"
          ],
          "created": "2019-03-04T16:40:11.952Z",
          "id": "5c790c07c497ba2f55db39a5"
        },
        {
          "_id": "5c790765c497ba2f55cede47",
          "person": {
            "_id": "57d983cc1747730100f63a09",
            "company": {
              "_id": "56e0654cd01f8701008d3af2",
              "__v": 0,
              "domain": "efor.com.tr",
              "industry": "",
              "name": "EFOR",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_initial last_name",
                "first_name . last_name"
              ],
              "allDomains": [
                "efor.com.tr",
                "eforpowerplants.com",
                "eforservices35.fr",
                "eformen.com",
                "efor.es",
                "eforfair.com",
                "eforyem.com.tr",
                "expertforum.ro",
                "larousse.fr",
                "tripadvisor.fr",
                "editionsdidier.com",
                "qapa.fr",
                "youtube.com"
              ],
              "created": "2016-03-09T18:02:52.501Z",
              "id": "56e0654cd01f8701008d3af2"
            },
            "email": "bchampdavoine@efor.com.tr",
            "emailConfidence": 80,
            "emailState": "Mail trouvé",
            "firstName": "Bastien",
            "fullName": "Bastien Champdavoine",
            "jobTitle": "Responsable Technique DM at EFOR",
            "lastName": "Champdavoine",
            "pattern": "first_initial last_name",
            "profileUrl": "https://fr.linkedin.com/in/bastien-champdavoine-a1b21588",
            "cost": {
              "totalCost": 0.0123,
              "emailFormatQuery": 0,
              "hubucoQuery": 1,
              "neverBounceQuery": 0,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 2,
              "step": 3,
              "googleQuery": 2
            },
            "created": "2016-09-14T17:07:24.150Z",
            "id": "57d983cc1747730100f63a09"
          },
          "country": [
            "FR"
          ],
          "score": 2.5,
          "countries": [],
          "keywords": [
            "robotic medical device",
            "additive manufacturing ",
            "medical devices orthopedics ",
            "orthopedics medical devices implant",
            "hip implant",
            "orthopedic medical device implant",
            "Medical Device Opportunity r&d orthopedic",
            "additive manufacturing steel ",
            "IMPLANTS EVENT - International conference on innovation, manufacturing and purchasing strategies "
          ],
          "created": "2019-03-04T16:40:11.952Z",
          "id": "5c790765c497ba2f55cede47"
        },
        {
          "_id": "5c79074bc497ba2f55ce7366",
          "person": {
            "_id": "57cf4779845bf0010062ca80",
            "company": {
              "_id": "57cf4776845bf0010062ca26",
              "domain": "dediennesante.com",
              "industry": "",
              "name": "Dedienne Sante ( Menix Group)",
              "profileUrl": "",
              "type": "",
              "pattern": [],
              "allDomains": [
                "dediennesante.com",
                "serf.fr"
              ],
              "created": "2016-09-06T22:47:18.121Z",
              "id": "57cf4776845bf0010062ca26"
            },
            "email": "toledo@dediennesante.com",
            "emailConfidence": 100,
            "emailState": "rejected",
            "firstName": "Ludovic",
            "fullName": "Ludovic Toledo",
            "jobTitle": "--",
            "lastName": "Toledo",
            "pattern": "last_name",
            "profileUrl": "https://fr.linkedin.com/in/ludovic-toledo-1282a41b/en",
            "cost": {
              "totalCost": 0.02,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 4,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 0,
              "step": 1,
              "googleQuery": 0
            },
            "created": "2016-09-06T22:47:21.268Z",
            "id": "57cf4779845bf0010062ca80"
          },
          "country": [
            "FR"
          ],
          "score": 2.4583333333333335,
          "countries": [],
          "keywords": [
            "Medical Device Development, Marketing And Sales",
            "orthopedics medical devices implant",
            "medical device hip surgery",
            "orthopedic medical device implant",
            "Medical Sales Distributors orthopedics",
            "Medical Device Opportunity r&d orthopedic"
          ],
          "created": "2019-03-04T16:40:11.952Z",
          "id": "5c79074bc497ba2f55ce7366"
        },
        {
          "_id": "5c790bc8c497ba2f55d9d4c6",
          "person": {
            "_id": "5901e5c37f6b900100635a3c",
            "company": {
              "_id": "55ae0243ef3f490100385f1d",
              "__v": 3,
              "domain": "onera.fr",
              "industry": "",
              "name": "ONERA",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_name . last_name",
                "first_name  . last_name ",
                "first_initial last_name"
              ],
              "allDomains": [
                "onera.fr",
                "onerasystem.com",
                "grc.nasa.gov",
                "baincapitalventures.com"
              ],
              "created": "2015-07-21T08:26:43.681Z",
              "id": "55ae0243ef3f490100385f1d"
            },
            "country": "FR",
            "email": "julien.berthe@onera.fr",
            "emailConfidence": 90,
            "emailState": "Mail trouvé",
            "firstName": "Julien",
            "fullName": "Julien Berthe",
            "jobTitle": "Ingénieur de Recherche à l'ONERA",
            "keywords": "\"orthopedic implant\"",
            "lastName": "Berthe",
            "pattern": "first_name . last_name",
            "profileUrl": "https://fr.linkedin.com/in/julien-berthe-9603b421",
            "cost": {
              "totalCost": 0.0061,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 1,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 1,
              "step": 2,
              "googleQuery": 0
            },
            "created": "2017-04-27T12:36:19.609Z",
            "id": "5901e5c37f6b900100635a3c"
          },
          "country": [
            "FR"
          ],
          "score": 2.25,
          "countries": [],
          "keywords": [
            "orthopedic implant",
            "hip replacement",
            "bureau d'études mécanique ",
            "CFRP r&d",
            "matrix composite",
            "bone remodeling",
            "Orthopedic implant",
            "Aerospace resin ",
            "orthopedic prosthesis"
          ],
          "created": "2019-03-04T16:40:11.952Z",
          "id": "5c790bc8c497ba2f55d9d4c6"
        },
        {
          "_id": "5c790efcc497ba2f55e577de",
          "person": {
            "_id": "59c3b4754514d7010029dadf",
            "company": {
              "_id": "59c3b4754514d7010029dade",
              "domain": "",
              "industry": "",
              "name": "MICHELET CENTER, UNIVERSITY OF BORDEAUX",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_initial last_name"
              ],
              "allDomains": [],
              "created": "2017-09-21T12:45:41.126Z",
              "id": "59c3b4754514d7010029dade"
            },
            "country": "FR",
            "email": "chussein@alamy.com",
            "emailConfidence": 80,
            "emailState": "Mail trouvé",
            "firstName": "CHOUGHRI",
            "fullName": "CHOUGHRI HUSSEIN",
            "jobTitle": "HAND SURGERY- HEAD OF THE HAND UNIT- DEPARTMENT OF PLASTIC SURGERY-UNIVERSITY OF BORDEAUX-FRANCE",
            "keywords": "\"orthopedic doctor\" \"surgery\"",
            "lastName": "HUSSEIN",
            "pattern": "first_initial last_name",
            "profileUrl": "https://fr.linkedin.com/in/choughri-hussein-53358112",
            "cost": {
              "totalCost": 0.0123,
              "emailFormatQuery": 0,
              "hubucoQuery": 1,
              "neverBounceQuery": 0,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 2,
              "step": 3,
              "googleQuery": 2
            },
            "created": "2017-09-21T12:45:41.197Z",
            "id": "59c3b4754514d7010029dadf"
          },
          "country": [
            "FR"
          ],
          "score": 2.083333333333333,
          "countries": [],
          "keywords": [
            "orthopedic doctor surgery",
            "surgery university orthopedic",
            "grafting surgeon",
            "reconstructive surgery graft",
            "orthopaedic graft",
            "graft surgeon",
            "grafting surgery",
            "reconstructive surgery grafting",
            "trauma surgery",
            "orthopaedic grafting",
            "aesthetic surgery ",
            "fracture surgeon",
            "Aesthetic surgery ",
            "orthopedic prosthesis"
          ],
          "created": "2019-03-04T16:40:11.952Z",
          "id": "5c790efcc497ba2f55e577de"
        },
        {
          "_id": "5c790bc7c497ba2f55d9d2e2",
          "person": {
            "_id": "5901ef907f6b900100636361",
            "company": {
              "_id": "5901ef907f6b90010063633c",
              "domain": "ch-sens.fr",
              "industry": "",
              "name": "Hopital de SENS",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_initial last_name"
              ],
              "allDomains": [
                "ch-sens.fr",
                "le-guide-sante.org",
                "keskeces.com",
                "clinique-paul-picquet.fr"
              ],
              "created": "2017-04-27T13:18:08.301Z",
              "id": "5901ef907f6b90010063633c"
            },
            "country": "FR",
            "email": "ykhelif@ch-sens.fr",
            "emailConfidence": 80,
            "emailState": "Mail trouvé",
            "firstName": "Youcef Rédha",
            "fullName": "Youcef Rédha KHELIF",
            "jobTitle": "MD, Consultant in orthopedic and trauma Surgery. France.",
            "keywords": "\"Orthopaedic Trauma Association (OTA)\"",
            "lastName": "KHELIF",
            "pattern": "first_initial last_name",
            "profileUrl": "https://fr.linkedin.com/in/youcef-r%C3%A9dha-khelif-99404124",
            "cost": {
              "totalCost": 0.0172,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 1,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 2,
              "step": 3,
              "googleQuery": 2
            },
            "created": "2017-04-27T13:18:08.618Z",
            "id": "5901ef907f6b900100636361"
          },
          "country": [
            "FR"
          ],
          "score": 2.083333333333333,
          "countries": [],
          "keywords": [
            "Orthopaedic Trauma Association (OTA)",
            "surgery university orthopedic",
            "Orthopaedic Trauma Association",
            "trauma surgery",
            "surgeon orthopedic joints",
            "orthopedic prosthesis"
          ],
          "created": "2019-03-04T16:40:11.952Z",
          "id": "5c790bc7c497ba2f55d9d2e2"
        },
        {
          "_id": "5c791e54c497ba2f5500d54f",
          "person": {
            "_id": "5b213a5141f9f34d76839a0b",
            "firstName": "Peter",
            "lastName": "Millett",
            "fullName": "Peter Millett",
            "jobTitle": "Orthopedic Surgeon and Sports Medicine Specialist Steadman Clinic",
            "profileUrl": "https://fr.linkedin.com/in/petermillettorthopedicsurgeon",
            "pattern": "first_initial last_name",
            "country": "FR",
            "keywords": "\"surgeon\" \"orthopedic\" \"joints\"",
            "company": {
              "_id": "5903418cbd458701002ec0e1",
              "domain": "thesteadmanclinic.com",
              "industry": "",
              "name": "the Steadman Clinic",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_initial last_name"
              ],
              "allDomains": [
                "thesteadmanclinic.com",
                "vvmc.com",
                "ghs.org",
                "bbb.org",
                "blogs.denverpost.com"
              ],
              "created": "2017-04-28T13:20:12.487Z",
              "id": "5903418cbd458701002ec0e1"
            },
            "emailState": "Mail non trouvé",
            "cost": {
              "totalCost": 0,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 5,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 0,
              "step": 1,
              "googleQuery": 0
            },
            "created": "2018-06-13T15:37:53.120Z",
            "id": "5b213a5141f9f34d76839a0b"
          },
          "country": [
            "FR"
          ],
          "score": 2.0416666666666665,
          "countries": [],
          "keywords": [
            "surgeon orthopedic clinic joints",
            "knee specialist",
            "surgeon orthopedic joints",
            "orthopedic prosthesis"
          ],
          "created": "2019-03-04T16:40:11.952Z",
          "id": "5c791e54c497ba2f5500d54f"
        },
        {
          "_id": "5c791e55c497ba2f5500d655",
          "person": {
            "_id": "5b213a5141f9f36c06839a0c",
            "firstName": "Qais",
            "lastName": "Naziri",
            "fullName": "Qais Naziri",
            "jobTitle": "Orthopaedic Surgery Resident at SUNY Downstate Medical Center",
            "profileUrl": "https://fr.linkedin.com/in/qais-naziri-md-mba-76493b69",
            "pattern": "first_name . last_name",
            "country": "FR",
            "keywords": "\"surgeon\" \"orthopedic\" \"joints\"",
            "company": {
              "_id": "57cf8af9845bf0010062f621",
              "domain": "downstate.edu",
              "industry": "",
              "name": "SUNY Downstate Medical Center",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_name . last_name",
                "first_initial last_name",
                "first_name  . last_name "
              ],
              "allDomains": [
                "downstate.edu",
                "suny.edu",
                "downstatesurgery.org",
                "grad-schools.usnews.rankingsandreviews.com",
                "downstategi.org",
                "dspace.sunyconnect.suny.edu",
                "downstatepahiv.wordpress.com",
                "us.jobs",
                "omicsonline.org",
                "maunakeatech.com",
                "kidney.org",
                "facs.org",
                "bigfuture.collegeboard.org",
                "hok.com",
                "starprogram.nyc",
                "aidsetc.org",
                "noodle.com",
                "alarconlab.com",
                "healthgrades.com",
                "collegeview.com",
                "rotatingroom.com",
                "groupon.com"
              ],
              "created": "2016-09-07T03:35:21.153Z",
              "id": "57cf8af9845bf0010062f621"
            },
            "email": "qais.naziri@downstate.edu",
            "emailConfidence": 100,
            "emailState": "Mail trouvé",
            "cost": {
              "totalCost": 0.005,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 1,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 0,
              "step": 1,
              "googleQuery": 0
            },
            "created": "2018-06-13T15:37:53.123Z",
            "id": "5b213a5141f9f36c06839a0c"
          },
          "country": [
            "FR"
          ],
          "score": 2.0416666666666665,
          "countries": [],
          "keywords": [
            "surgeon orthopedic clinic joints",
            "manufacturer medical devices prosthesis",
            "surgeon orthopedic joints",
            "prosthetic joints",
            "orthopedic prosthesis"
          ],
          "created": "2019-03-04T16:40:11.952Z",
          "id": "5c791e55c497ba2f5500d655"
        },
        {
          "_id": "5c790bc3c497ba2f55d9c020",
          "person": {
            "_id": "59034181bd458701002ec035",
            "company": {
              "_id": "59034181bd458701002ec023",
              "domain": "mtlebanon.org",
              "industry": "",
              "name": "MOUNT LEBANON HOSPITAL",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_initial last_name"
              ],
              "allDomains": [
                "mtlebanon.org",
                "mlh.com.lb"
              ],
              "created": "2017-04-28T13:20:01.381Z",
              "id": "59034181bd458701002ec023"
            },
            "country": "FR",
            "emailState": "Mail non trouvé",
            "firstName": "Bachir",
            "fullName": "Bachir Ghostine",
            "jobTitle": "MD Orthopaedic Surgeon",
            "keywords": "\"Orthopedic Surgeon\" \"hip\" \"Région de Paris\"",
            "lastName": "Ghostine",
            "pattern": "first_initial last_name",
            "profileUrl": "https://fr.linkedin.com/in/bachir-ghostine-2b1ab583",
            "cost": {
              "totalCost": 0,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 5,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 0,
              "step": 1,
              "googleQuery": 0
            },
            "created": "2017-04-28T13:20:01.510Z",
            "id": "59034181bd458701002ec035"
          },
          "country": [
            "FR"
          ],
          "score": 2,
          "countries": [],
          "keywords": [
            "Orthopedic Surgeon hip ",
            "orthopaedic surgeon orthopaedics",
            "Biologic Orthopedic Society",
            "surgeon orthopedic specialist "
          ],
          "created": "2019-03-04T16:40:11.952Z",
          "id": "5c790bc3c497ba2f55d9c020"
        },
        {
          "_id": "5c790efcc497ba2f55e57a07",
          "person": {
            "_id": "59c3b07c4514d7010029cc89",
            "company": {
              "_id": "59c3b07c4514d7010029cc88",
              "domain": "fregis.com",
              "industry": "",
              "name": "Centre Hospitalier Vétérinaire Frégis",
              "profileUrl": "",
              "type": "",
              "pattern": [],
              "allDomains": [
                "fregis.com",
                "ncbi.nlm.nih.gov"
              ],
              "created": "2017-09-21T12:28:44.782Z",
              "id": "59c3b07c4514d7010029cc88"
            },
            "country": "FR",
            "email": "gragetly@fregis.com",
            "emailConfidence": 100,
            "emailState": "Mail trouvé",
            "firstName": "Guillaume",
            "fullName": "Guillaume Ragetly",
            "jobTitle": "Chirurgien vétérinaire et chef d'entreprise au Centre Hospitalier Vétérinaire Frégis",
            "keywords": "\"bone grafting\" \"orthopedic\"",
            "lastName": "Ragetly",
            "pattern": "first_name . last_name",
            "profileUrl": "https://fr.linkedin.com/in/guillaume-ragetly-32a58333",
            "cost": {
              "totalCost": 0.01,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 2,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 0,
              "step": 1,
              "googleQuery": 0
            },
            "created": "2017-09-21T12:28:44.834Z",
            "id": "59c3b07c4514d7010029cc89"
          },
          "country": [
            "FR"
          ],
          "score": 2,
          "countries": [],
          "keywords": [
            "orthopedic surgery bone",
            "bone grafting orthopedic",
            "grafting surgeon",
            "clinical research bone surgery ",
            "bone grafting",
            "grafting surgery",
            "clinical research grafting",
            "clinical research bone surgeon",
            "surgical grafting",
            "antibacterial coating",
            "surgeon orthopedic specialist "
          ],
          "created": "2019-03-04T16:40:11.952Z",
          "id": "5c790efcc497ba2f55e57a07"
        },
        {
          "_id": "5c790a7ec497ba2f55d2d72f",
          "person": {
            "_id": "584eabe762358f0100150ade",
            "company": {
              "_id": "584eabe562358f0100150a98",
              "domain": "invivox.com",
              "industry": "",
              "name": "INVIVOX",
              "profileUrl": "",
              "type": "",
              "pattern": [],
              "allDomains": [
                "invivox.com",
                "crunchbase.com",
                "levillagebyca.com",
                "isai.fr",
                "thefatexperts.com",
                "invest-in-bordeaux.com",
                "twicial.com",
                "youbuyfrance.com",
                "bigbooster.org",
                "frenchtechhub.com",
                "fusacq.com",
                "hairlosstalk.com",
                "dicardiology.com",
                "motivaimplants.com",
                "sfcardio.fr",
                "imrhis2016.com",
                "raspaldo.fr"
              ],
              "created": "2016-12-12T13:53:41.754Z",
              "id": "584eabe562358f0100150a98"
            },
            "email": "jdelpech@invivox.com",
            "emailConfidence": 100,
            "emailState": "sent",
            "firstName": "Julien",
            "fullName": "Julien Delpech",
            "jobTitle": "Cofounder & CEO at INVIVOX",
            "lastName": "Delpech",
            "pattern": "first_initial last_name",
            "profileUrl": "https://fr.linkedin.com/in/julien-delpech-89994a",
            "cost": {
              "totalCost": 0.015,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 3,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 0,
              "step": 1,
              "googleQuery": 0
            },
            "created": "2016-12-12T13:53:43.031Z",
            "id": "584eabe762358f0100150ade"
          },
          "country": [
            "FR"
          ],
          "score": 2,
          "countries": [],
          "keywords": [
            "medical devices orthopedics ",
            "regenerative medicine orthopedic",
            "regenerative medicine surgeon",
            "regenerative medicine orthopedics",
            "aesthetic plastic surgeon ",
            "Aujourd'hui 2 ans founder "
          ],
          "created": "2019-03-04T16:40:11.952Z",
          "id": "5c790a7ec497ba2f55d2d72f"
        },
        {
          "_id": "5c79075dc497ba2f55cec3d2",
          "person": {
            "_id": "57d958141747730100f619e9",
            "company": {
              "_id": "57d958121747730100f619d5",
              "domain": "em-consulte.com",
              "industry": "",
              "name": "Clinique des Cèdres, Cornebarrieu, TOULOUSE, FRANCE",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_name . last_name"
              ],
              "allDomains": [
                "em-consulte.com"
              ],
              "created": "2016-09-14T14:00:50.900Z",
              "id": "57d958121747730100f619d5"
            },
            "email": "xavier.cassard@grenoble.cci.fr",
            "emailConfidence": 80,
            "emailState": "Mail trouvé",
            "firstName": "Xavier",
            "fullName": "Xavier Cassard",
            "jobTitle": "Knee Surgeon, Clinique des Cèdres, Cornebarrieu, TOULOUSE, FRANCE",
            "lastName": "Cassard",
            "pattern": "first_name . last_name",
            "profileUrl": "https://fr.linkedin.com/in/xavier-cassard-8416252a",
            "cost": {
              "totalCost": 0.0172,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 1,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 2,
              "step": 3,
              "googleQuery": 2
            },
            "created": "2016-09-14T14:00:52.903Z",
            "id": "57d958141747730100f619e9"
          },
          "country": [
            "FR"
          ],
          "score": 2,
          "countries": [],
          "keywords": [
            "bone cement",
            "Orthopedic Surgeon hip ",
            "orthopedic surgery bone",
            "bone graft orthopedic",
            "bone graft",
            "graft surgery ",
            "graft surgeon",
            "reconstruction surgery bone",
            "reconstruction surgeon bone",
            "clinical research bone surgeon",
            "clinical research graft",
            "clinical research bone surgery ",
            "clinical research bone orthopaedic",
            "fracture surgical",
            "fracture surgery ",
            "fractures surgical",
            "surgical graft",
            "fracture surgeon",
            "knee surgery "
          ],
          "created": "2019-03-04T16:40:11.952Z",
          "id": "5c79075dc497ba2f55cec3d2"
        },
        {
          "_id": "5c790bc3c497ba2f55d9c05f",
          "person": {
            "_id": "59034181bd458701002ec037",
            "company": {
              "_id": "59034181bd458701002ec028",
              "domain": "ch-argenteuil.com",
              "industry": "",
              "name": "Victor Dupouy Hospital",
              "profileUrl": "",
              "type": "",
              "pattern": [],
              "allDomains": [
                "ch-argenteuil.com",
                "vinci-uk.com",
                "vinci.com",
                "medcraveonline.com",
                "stm.sciencemag.org",
                "clinicaltrials.gov"
              ],
              "created": "2017-04-28T13:20:01.386Z",
              "id": "59034181bd458701002ec028"
            },
            "country": "FR",
            "emailState": "Mail non trouvé",
            "firstName": "Farshid",
            "fullName": "Farshid Moshiri",
            "jobTitle": "Orthopedic surgeon",
            "keywords": "\"Orthopedic Surgeon\" \"hip\" \"Région de Paris\"",
            "lastName": "Moshiri",
            "pattern": "first_name . last_name",
            "profileUrl": "https://fr.linkedin.com/in/farshid-moshiri-1b59b1a",
            "cost": {
              "totalCost": 0,
              "emailFormatQuery": 1,
              "hubucoQuery": 1,
              "neverBounceQuery": 0,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 2,
              "step": 1,
              "googleQuery": 2
            },
            "created": "2017-04-28T13:20:01.540Z",
            "id": "59034181bd458701002ec037"
          },
          "country": [
            "FR"
          ],
          "score": 2,
          "countries": [],
          "keywords": [
            "Orthopedic Surgeon hip ",
            "Orthopedic transplant surgery",
            "orthopaedic transplant",
            "Orthopedic transplant surgeon",
            "ophthalmology surgeon "
          ],
          "created": "2019-03-04T16:40:11.952Z",
          "id": "5c790bc3c497ba2f55d9c05f"
        },
        {
          "_id": "5c790a7cc497ba2f55d2caf9",
          "person": {
            "_id": "584eac7662358f0100150cc7",
            "company": {
              "_id": "584eac7562358f0100150c94",
              "domain": "orthopaediclist.com",
              "industry": "",
              "name": "DEDIENNE SANTE",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_initial last_name"
              ],
              "allDomains": [
                "orthopaediclist.com",
                "serf.fr",
                "dediennesante.com",
                "news-medical.net",
                "pdf.medicalexpo.com",
                "thestreet.com",
                "alfamedical.org",
                "unquote.com",
                "orthoworld.com",
                "freepatentsonline.com",
                "medicaldevices24.com",
                "youbuyfrance.com",
                "medicalexpo.com",
                "siparex.com",
                "invest-in-montpellier.com",
                "groupe-lepine.com",
                "eurobiomed.org",
                "carmatsa.com",
                "medwowglobal.com",
                "prnewswire.com",
                "chiroplant.de",
                "oilpro.com",
                "medgadget.com",
                "globalortho.com.au",
                "fusacq.com",
                "massdevice.com"
              ],
              "created": "2016-12-12T13:56:05.555Z",
              "id": "584eac7562358f0100150c94"
            },
            "emailState": "Mail non trouvé",
            "firstName": "Maud",
            "fullName": "Maud Humbert",
            "jobTitle": "Quality and Regulatory Affairs Director at Dedienne Santé",
            "lastName": "Humbert",
            "pattern": "first_initial last_name",
            "profileUrl": "https://fr.linkedin.com/in/maudhumbert",
            "cost": {
              "totalCost": 0,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 6,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 0,
              "step": 1,
              "googleQuery": 0
            },
            "created": "2016-12-12T13:56:06.537Z",
            "id": "584eac7662358f0100150cc7"
          },
          "country": [
            "FR"
          ],
          "score": 1.9583333333333333,
          "countries": [],
          "keywords": [
            "medical devices orthopedics ",
            "implant manufacturer orthopedic",
            "orthopedic medical device implant"
          ],
          "created": "2019-03-04T16:40:11.953Z",
          "id": "5c790a7cc497ba2f55d2caf9"
        },
        {
          "_id": "5c790ec2c497ba2f55e507c1",
          "person": {
            "_id": "59bbdc6b4514d701002875c0",
            "company": {
              "_id": "59bbdc6a4514d701002875b0",
              "domain": "clinique-alma.com",
              "industry": "",
              "name": "Clinique de l'ALMA",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_name  . last_name "
              ],
              "allDomains": [
                "clinique-alma.com",
                "health-tourism.com"
              ],
              "created": "2017-09-15T13:58:02.929Z",
              "id": "59bbdc6a4514d701002875b0"
            },
            "country": "FR",
            "email": "vytautas.gasiunas@clinique-alma.com",
            "emailConfidence": 70,
            "emailState": "Mail trouvé",
            "firstName": "Vytautas",
            "fullName": "Vytautas Gasiunas",
            "jobTitle": "Surgery of the Hand, Wrist, Elbow and Shoulder. Microsurgery. Peripheral Nerve and Brachial Plexus Surgery.",
            "keywords": "\"orthopaedic surgeon\" \"orthopaedics\"",
            "lastName": "Gasiunas",
            "pattern": "first_name  . last_name ",
            "profileUrl": "https://fr.linkedin.com/in/vytautas-gasiunas-929b522a",
            "cost": {
              "totalCost": 0.0272,
              "emailFormatQuery": 1,
              "hubucoQuery": 0,
              "neverBounceQuery": 1,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 2,
              "step": 4,
              "googleQuery": 2
            },
            "created": "2017-09-15T13:58:03.331Z",
            "id": "59bbdc6b4514d701002875c0"
          },
          "country": [
            "FR"
          ],
          "score": 1.958333333333333,
          "countries": [],
          "keywords": [
            "orthopaedic surgeon orthopaedics",
            "Biologic Orthopedic Society",
            "trauma surgeon",
            "trauma surgery",
            "reconstructive surgery surgeon ",
            "fractures surgical",
            "Neurophysiology & Neurology Researchers",
            "medical devices surgical clinic ",
            "surgeon orthopedic clinic joints",
            "surgeon orthopedic joints"
          ],
          "created": "2019-03-04T16:40:11.953Z",
          "id": "5c790ec2c497ba2f55e507c1"
        },
        {
          "_id": "5c790ab0c497ba2f55d41408",
          "person": {
            "_id": "586f46c40971e00100975846",
            "company": {
              "_id": "586f46c40971e0010097583f",
              "domain": "",
              "industry": "",
              "name": "French Foot and Ankle Society (AFCP)",
              "profileUrl": "",
              "type": "",
              "pattern": [],
              "allDomains": [],
              "created": "2017-01-06T07:27:00.513Z",
              "id": "586f46c40971e0010097583f"
            },
            "emailState": "Domaine non trouvé",
            "firstName": "François",
            "fullName": "François Lintz",
            "jobTitle": "Consultant Orthopaedic Surgeon, Foot and Ankle Surgery",
            "lastName": "Lintz",
            "pattern": "",
            "profileUrl": "https://fr.linkedin.com/in/fran%C3%A7ois-lintz-7054465a",
            "cost": {
              "totalCost": 0,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 0,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 0,
              "step": 0,
              "googleQuery": 0
            },
            "created": "2017-01-06T07:27:00.620Z",
            "id": "586f46c40971e00100975846"
          },
          "country": [
            "FR"
          ],
          "score": 1.958333333333333,
          "countries": [],
          "keywords": [
            "Foot and Ankle Clinical Research",
            "orthopedic medical device implant",
            "spine surgery hospital",
            "Biologic Orthopedic Society",
            "surgeon orthopedic specialist "
          ],
          "created": "2019-03-04T16:40:11.953Z",
          "id": "5c790ab0c497ba2f55d41408"
        },
        {
          "_id": "5c790f00c497ba2f55e586af",
          "person": {
            "_id": "59c3b9644514d7010029dc99",
            "company": {
              "_id": "59c3b9634514d7010029dc8f",
              "domain": "ceiso.fr",
              "industry": "",
              "name": "CEISO",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_initial last_name"
              ],
              "allDomains": [
                "ceiso.fr",
                "plants.usda.gov",
                "cmocro.com",
                "casio.com",
                "cisco.com"
              ],
              "created": "2017-09-21T13:06:43.920Z",
              "id": "59c3b9634514d7010029dc8f"
            },
            "country": "FR",
            "emailState": "Mail trouvé",
            "firstName": "Sophie",
            "fullName": "Sophie Mathonniere",
            "jobTitle": "Project Manager Medical Device - Regulatory affairs",
            "keywords": "\"Medical Device Opportunity\" \"orthopedic\" \"surgery\" \"Région de Lyon\"",
            "lastName": "Mathonniere",
            "pattern": "first_initial last_name",
            "profileUrl": "https://fr.linkedin.com/in/sophie-mathonniere-40099036",
            "email": "smathonniere@ceiso.fr",
            "emailConfidence": 80,
            "cost": {
              "totalCost": 0.0172,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 1,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 2,
              "step": 3,
              "googleQuery": 2
            },
            "created": "2017-09-21T13:06:44.290Z",
            "id": "59c3b9644514d7010029dc99"
          },
          "country": [
            "FR"
          ],
          "score": 1.9333333333333333,
          "countries": [],
          "keywords": [
            "Medical Device Opportunity r&d surgery ",
            "Medical Device Opportunity r&d orthopedic",
            "Medical Device Opportunity orthopedic surgery ",
            "clinical research bone surgery ",
            "clinical research bone orthopaedic",
            "clean room quality assurance",
            "clean room ISO 9001 quality management",
            "ISO 13485 quality management clean room",
            "Product management cell culture",
            "Product launch cell culture",
            "dentistry prosthesis",
            "dentistry supplier surgery",
            "prosthesis dental",
            "traceability marking",
            "quality traceability marking",
            "surgery Biomaterials ",
            "surgery biomedical bone",
            "dental medical devices product management ",
            "dentistry medical devices ",
            "dental medical devices product manager ",
            "Dental sales management product ",
            "dental medical device ",
            "dentistry medical device",
            "dentistry sales management",
            "Dental sales management medical devices ",
            "Dental sales management medical device ",
            "orthopedic prosthesis"
          ],
          "created": "2019-03-04T16:40:11.953Z",
          "id": "5c790f00c497ba2f55e586af"
        },
        {
          "_id": "5c790769c497ba2f55ceea96",
          "person": {
            "_id": "57d95f211747730100f61fcc",
            "company": {
              "_id": "57d95f201747730100f61fb8",
              "domain": "clinique-tanjombato.com",
              "industry": "",
              "name": "Clinique Medico-Chirurgicale",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_initial last_name"
              ],
              "allDomains": [
                "clinique-tanjombato.com",
                "clinique-charcot.fr",
                "clinbruay.com",
                "cliniquevalere.ch",
                "clinique-ares.com",
                "pagesmed.com",
                "le-guide-sante.org",
                "doctoralia-fr.com",
                "chru-lille.fr",
                "medicochirurgical.com",
                "doc.fr",
                "lexpress.fr",
                "clinique-chirurgicale-des7vallees.fr",
                "cliniquemetivet.com",
                "cliniquelesfontaines.com",
                "kaahe.org",
                "alleray-labrouste.com",
                "mms-europe-rouen.com",
                "goafricaonline.com",
                "filao.biz",
                "tzanck.org",
                "informationhospitaliere.com",
                "franceivoire.com",
                "118000.fr",
                "fondation-misericorde.com",
                "conseilssantevoyage.com"
              ],
              "created": "2016-09-14T14:30:56.091Z",
              "id": "57d95f201747730100f61fb8"
            },
            "email": "jepinette@clinique-tanjombato.com",
            "emailConfidence": 80,
            "emailState": "Mail trouvé",
            "firstName": "Jean-Alain",
            "fullName": "Jean-Alain Epinette",
            "jobTitle": "Orthopaedic Surgeon",
            "lastName": "Epinette",
            "pattern": "first_initial last_name",
            "profileUrl": "https://fr.linkedin.com/in/jean-alain-epinette-30046217",
            "cost": {
              "totalCost": 0.0172,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 1,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 2,
              "step": 3,
              "googleQuery": 2
            },
            "created": "2016-09-14T14:30:57.907Z",
            "id": "57d95f211747730100f61fcc"
          },
          "country": [
            "FR"
          ],
          "score": 1.9333333333333331,
          "countries": [],
          "keywords": [
            "arthroplasty spine",
            "medical devices orthopedics ",
            "Orthopedic Surgeon hip ",
            "medical device hip surgery",
            "book editor ",
            "orthopaedic surgeon orthopaedics",
            "Medical Device Opportunity orthopedic surgery ",
            "reconstructive surgery bone",
            "clinical research bone surgery ",
            "clinical research bone surgeon",
            "clinical research bone orthopaedic",
            "reconstructive surgery surgeon ",
            "surgeon biomedical bone",
            "surgery Biomaterials ",
            "surgery biomedical bone",
            "surgeon Biomaterials"
          ],
          "created": "2019-03-04T16:40:11.953Z",
          "id": "5c790769c497ba2f55ceea96"
        },
        {
          "_id": "5c79075bc497ba2f55cebbd3",
          "person": {
            "_id": "57cf7c50845bf0010062f114",
            "company": {
              "_id": "57cf7c4f845bf0010062f106",
              "domain": "fhorthopedics.com",
              "industry": "",
              "name": "FH Orthopedics",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_initial . last_name"
              ],
              "allDomains": [
                "fhorthopedics.com",
                "fhortho.com",
                "fhorthopedics.fr",
                "pdf.medicalexpo.fr",
                "meilleures-entreprises.com",
                "ansm.sante.fr",
                "alsaeco.com",
                "chu-rouen.fr",
                "lejournaldesentreprises.com",
                "yelp.fr"
              ],
              "created": "2016-09-07T02:32:47.638Z",
              "id": "57cf7c4f845bf0010062f106"
            },
            "email": "t.barre@fhorthopedics.com",
            "emailConfidence": 80,
            "emailState": "sent",
            "firstName": "Thierry",
            "fullName": "Thierry BARRE",
            "jobTitle": "National Sales Director chez FH Orthopedics",
            "lastName": "BARRE",
            "pattern": "first_initial . last_name",
            "profileUrl": "https://fr.linkedin.com/in/thierry-barre-68833222",
            "cost": {
              "totalCost": 0.0172,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 1,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 2,
              "step": 3,
              "googleQuery": 2
            },
            "created": "2016-09-07T02:32:48.563Z",
            "id": "57cf7c50845bf0010062f114"
          },
          "country": [
            "FR"
          ],
          "score": 1.9166666666666665,
          "countries": [],
          "keywords": [
            "Medical Devices Startups spine",
            "medical devices orthopedics ",
            "orthopedics medical devices implant",
            "orthopedic medical device implant"
          ],
          "created": "2019-03-04T16:40:11.953Z",
          "id": "5c79075bc497ba2f55cebbd3"
        },
        {
          "_id": "5c790a80c497ba2f55d2df0e",
          "person": {
            "_id": "584eabe662358f0100150ac3",
            "company": {
              "_id": "559e37423901970100032e05",
              "__v": 2,
              "domain": "bostonscientific.com",
              "industry": "Twitter",
              "name": "Boston Scientific",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_initial last_name",
                "first_name _ last_name"
              ],
              "allDomains": [
                "bostonscientific.com",
                "jobs.bostonscientific.com"
              ],
              "created": "2015-07-09T08:56:34.568Z",
              "id": "559e37423901970100032e05"
            },
            "emailState": "Mail non trouvé",
            "firstName": "Jeanine",
            "fullName": "Jeanine George-Plane",
            "jobTitle": "Regional Marketing Manager",
            "lastName": "George-Plane",
            "pattern": "first_initial last_name",
            "profileUrl": "https://fr.linkedin.com/in/jeanine-george-plane-dba-6522664",
            "cost": {
              "totalCost": 0,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 14,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 0,
              "step": 1,
              "googleQuery": 0
            },
            "created": "2016-12-12T13:53:42.339Z",
            "id": "584eabe662358f0100150ac3"
          },
          "country": [
            "FR"
          ],
          "score": 1.9166666666666665,
          "countries": [],
          "keywords": [
            "medical devices orthopedics ",
            "orthopedics medical devices implant",
            "hip implant",
            "orthopedic medical device implant"
          ],
          "created": "2019-03-04T16:40:11.953Z",
          "id": "5c790a80c497ba2f55d2df0e"
        },
        {
          "_id": "5c790a7cc497ba2f55d2cb41",
          "person": {
            "_id": "584eadcc62358f010015112b",
            "company": {
              "_id": "57aa4531cbccee0100a025ad",
              "domain": "wright.com",
              "industry": "",
              "name": "Wright Medical",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_name . last_name",
                "first_initial last_name"
              ],
              "allDomains": [
                "wright.com",
                "ir.wright.com",
                "francais.wright.com",
                "wrightmedical.org",
                "italiano.wright.com",
                "deutsch.wright.com",
                "wrightmedicalservices.com",
                "wright-medical.com",
                "wrightmed.co",
                "espanol.wright.com",
                "wrighton-bi-loup.com",
                "ansm.sante.fr",
                "wrightmedical.co.uk",
                "wmt-emea.com",
                "beckersspine.com",
                "globenewswire.com",
                "gand.uscourts.gov",
                "drugwatch.com",
                "footandanklefixation.com",
                "archives.varmatin.com",
                "youscribe.com",
                "123pages.fr",
                "businessfinder.al.com",
                "thestreet.com",
                "healthcarepackaging.com"
              ],
              "created": "2016-08-09T21:03:45.622Z",
              "id": "57aa4531cbccee0100a025ad"
            },
            "email": "ggueugnon@wright.com",
            "emailConfidence": 80,
            "emailState": "Mail trouvé",
            "firstName": "Gabriel",
            "fullName": "Gabriel GUEUGNON",
            "jobTitle": "R&D MANAGER chez BIOTECH ORTHO | a WRIGHT MEDICAL company",
            "lastName": "GUEUGNON",
            "pattern": "first_initial last_name",
            "profileUrl": "https://fr.linkedin.com/in/gabriel-gueugnon-91081b31",
            "cost": {
              "totalCost": 0.0172,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 1,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 2,
              "step": 3,
              "googleQuery": 2
            },
            "created": "2016-12-12T14:01:48.846Z",
            "id": "584eadcc62358f010015112b"
          },
          "country": [
            "FR"
          ],
          "score": 1.9166666666666665,
          "countries": [],
          "keywords": [
            "medical devices orthopedics ",
            "chef de projet R&D ",
            "orthopedics medical devices implant",
            "orthopedic medical device implant",
            "fabrication additive "
          ],
          "created": "2019-03-04T16:40:11.953Z",
          "id": "5c790a7cc497ba2f55d2cb41"
        },
        {
          "_id": "5c79075bc497ba2f55cebc0f",
          "person": {
            "_id": "57d975ea1747730100f6316d",
            "company": {
              "_id": "57ab231bcbccee0100a07627",
              "domain": "mesa-medical.com",
              "industry": "",
              "name": "MESA – Medical Equipment Solutions and Applications",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_initial last_name"
              ],
              "allDomains": [
                "mesa-medical.com",
                "news-medical.net",
                "mesa-medical.blogspot.ch",
                "mesa-medical.blogspot.com",
                "news.cision.com",
                "prnewswire.com",
                "prnewswire.co.uk",
                "dotmed.com"
              ],
              "created": "2016-08-10T12:50:35.716Z",
              "id": "57ab231bcbccee0100a07627"
            },
            "email": "mbaldini@mesa-medical.com",
            "emailConfidence": 80,
            "emailState": "Mail trouvé",
            "firstName": "Marc",
            "fullName": "Marc Baldini",
            "jobTitle": "Country Manager France at MESA",
            "lastName": "Baldini",
            "pattern": "first_initial last_name",
            "profileUrl": "https://fr.linkedin.com/in/marcbaldini",
            "cost": {
              "totalCost": 0.0172,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 1,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 2,
              "step": 3,
              "googleQuery": 2
            },
            "created": "2016-09-14T16:08:10.542Z",
            "id": "57d975ea1747730100f6316d"
          },
          "country": [
            "FR"
          ],
          "score": 1.9166666666666665,
          "countries": [],
          "keywords": [
            "bone surgery instruments",
            "medical devices orthopedics ",
            "orthopedic medical equipment",
            "Medical Device Opportunity r&d orthopedic",
            "vascular oncology research ",
            "vascular oncology researcher",
            "test laboratory pharmaceutical",
            "test laboratory health",
            "gynecology researcher",
            "gynecology medical device ",
            "medical device gynecology ",
            "new business development gynecology",
            "pharmaceutical gynecology ",
            "new business development medical device product management ",
            "medical device product development business development electronics",
            "electronic medical devices product development ",
            "Radiology medical devices equipment medical imaging ",
            "Radiology medical device equipment medical imaging ",
            "image processing space imaging ",
            "medical devices operating room manager",
            "medical imaging devices ultrasound"
          ],
          "created": "2019-03-04T16:40:11.953Z",
          "id": "5c79075bc497ba2f55cebc0f"
        },
        {
          "_id": "5c790a87c497ba2f55d3033e",
          "person": {
            "_id": "584eac7662358f0100150cbd",
            "company": {
              "_id": "58432b62fc8a240100920e14",
              "domain": "biotech-dental.com",
              "industry": "",
              "name": "Biotech Dental",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_initial . last_name",
                "first_name - last_name"
              ],
              "allDomains": [
                "biotech-dental.com",
                "bizapedia.com",
                "royaldentalgroup.com",
                "biotechdentalprosthetics.com",
                "biotechdental.ca",
                "dentosmile.fr",
                "myotechdental.com",
                "dentalxp.com",
                "biotechxray.com",
                "cascade-dental.net",
                "dentalparts.com",
                "osseosource.com",
                "dentalcare.com",
                "biotech-implant-patient.com",
                "biotechclinical.com",
                "healthbiotechpharmacy.com",
                "mapquest.com",
                "neobiotech.net",
                "carifree.com",
                "bnlbio.com",
                "rpiparts.com",
                "buzzfile.com",
                "canadapages.com",
                "grandcanyoninn.com",
                "globalclinicrating.com"
              ],
              "created": "2016-12-03T20:30:26.206Z",
              "id": "58432b62fc8a240100920e14"
            },
            "email": "r.maisonneuve@biotech-dental.com",
            "emailConfidence": 80,
            "emailState": "Mail trouvé",
            "firstName": "Robin",
            "fullName": "Robin Maisonneuve",
            "jobTitle": "Directeur Marketing & Communication chez Biotech Dental",
            "lastName": "Maisonneuve",
            "pattern": "first_initial . last_name",
            "profileUrl": "https://fr.linkedin.com/in/robin-maisonneuve-70623210",
            "cost": {
              "totalCost": 0.0172,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 1,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 2,
              "step": 3,
              "googleQuery": 2
            },
            "created": "2016-12-12T13:56:06.290Z",
            "id": "584eac7662358f0100150cbd"
          },
          "country": [
            "FR"
          ],
          "score": 1.9166666666666665,
          "countries": [],
          "keywords": [
            "medical devices orthopedics ",
            "orthopedics medical devices implant",
            "orthopedic medical device implant",
            "dental implant ",
            "dental medical device ",
            "Dental sales manager medical device ",
            "Dental sales manager medical devices ",
            "Dental Implant Professionals "
          ],
          "created": "2019-03-04T16:40:11.953Z",
          "id": "5c790a87c497ba2f55d3033e"
        },
        {
          "_id": "5c790732c497ba2f55cd9c43",
          "person": {
            "_id": "57aa5974cbccee0100a03843",
            "company": {
              "_id": "57aa5973cbccee0100a03833",
              "domain": "",
              "industry": "",
              "name": "Consulting for Medical Devices Business Dev.",
              "profileUrl": "",
              "type": "",
              "pattern": [],
              "allDomains": [],
              "created": "2016-08-09T22:30:11.142Z",
              "id": "57aa5973cbccee0100a03833"
            },
            "emailState": "Domaine non trouvé",
            "firstName": "Stéphane",
            "fullName": "Stéphane VALDES",
            "jobTitle": "Consultant for Medical Devices Companies and active job search",
            "lastName": "VALDES",
            "pattern": "",
            "profileUrl": "https://fr.linkedin.com/in/st%C3%A9phane-valdes-1249744b",
            "cost": {
              "totalCost": 0,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 0,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 0,
              "step": 0,
              "googleQuery": 0
            },
            "created": "2016-08-09T22:30:12.098Z",
            "id": "57aa5974cbccee0100a03843"
          },
          "country": [
            "FR"
          ],
          "score": 1.8916666666666666,
          "countries": [],
          "keywords": [
            "Medical Device Networkers spine",
            "Smith & nephew spine",
            "Medical Device Field - MDField spine",
            "spinal surgery",
            "spine surgery instruments",
            "spine distributors",
            "medical devices orthopedics ",
            "Medical Device Opportunity orthopedic surgery ",
            "Medical Sales Distributors surgery ",
            "Medical Sales Distributors orthopedics",
            "new business development medical device product management "
          ],
          "created": "2019-03-04T16:40:11.953Z",
          "id": "5c790732c497ba2f55cd9c43"
        },
        {
          "_id": "5c790a80c497ba2f55d2dd3d",
          "person": {
            "_id": "584eabe662358f0100150ac4",
            "company": {
              "_id": "5591451b51c3cc01009667ad",
              "__v": 0,
              "domain": "stago-us.com",
              "industry": "France",
              "name": "Stago",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_name . last_name",
                "first_name  . last_name "
              ],
              "allDomains": [
                "stago-us.com",
                "webca.stago.com",
                "stago.com",
                "stagogmbh.de",
                "stago-clarity.com",
                "webit.stago.com",
                "diamonddiagnostics.com",
                "extranet.stago.com",
                "stegoindustries.com",
                "webde.stago.com",
                "instago.in",
                "stego.de",
                "stago-edvantage.com",
                "medicalexpo.com",
                "labroots.com",
                "tcoag.com",
                "labwrench.com",
                "fda.gov",
                "tractors.wikia.com",
                "medscape.com",
                "unitedlabs.com.kw",
                "labx.biz",
                "islalab.com"
              ],
              "created": "2015-06-29T13:16:11.630Z",
              "id": "5591451b51c3cc01009667ad"
            },
            "email": "olivier.camus@stago-us.com",
            "emailConfidence": 80,
            "emailState": "Mail trouvé",
            "firstName": "Olivier",
            "fullName": "Olivier CAMUS",
            "jobTitle": "Responsable ventes internationales chez Stago",
            "lastName": "CAMUS",
            "pattern": "first_name . last_name",
            "profileUrl": "https://fr.linkedin.com/in/oliviercamus",
            "cost": {
              "totalCost": 0.0172,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 1,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 2,
              "step": 3,
              "googleQuery": 2
            },
            "created": "2016-12-12T13:53:42.340Z",
            "id": "584eabe662358f0100150ac4"
          },
          "country": [
            "FR"
          ],
          "score": 1.875,
          "countries": [],
          "keywords": [
            "medical devices orthopedics ",
            "Medical Device Opportunity r&d orthopedic",
            "Medical Sales Distributors orthopedics"
          ],
          "created": "2019-03-04T16:40:11.953Z",
          "id": "5c790a80c497ba2f55d2dd3d"
        },
        {
          "_id": "5c79072dc497ba2f55cd7759",
          "person": {
            "_id": "57aa4cbacbccee0100a02e63",
            "company": {
              "_id": "57aa4cbacbccee0100a02e62",
              "domain": "asbh.de",
              "industry": "",
              "name": "DePuySynthes a Johnson &Johnson company",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_name  . last_name ",
                "first_initial last_name"
              ],
              "allDomains": [
                "asbh.de",
                "dasoertliche.de",
                "newikis.com",
                "lifehelix.org",
                "aami.org",
                "p-r-i.org",
                "rotman.technainstitute.com",
                "sec.gov",
                "services.corporate-ir.net",
                "search.jobs.northjersey.com",
                "academia.edu"
              ],
              "created": "2016-08-09T21:35:54.743Z",
              "id": "57aa4cbacbccee0100a02e62"
            },
            "emailState": "Mail trouvé",
            "firstName": "Bernard",
            "fullName": "Bernard Chaminadour",
            "jobTitle": "Medical Device Industry",
            "lastName": "Chaminadour",
            "pattern": "first_initial last_name",
            "profileUrl": "https://fr.linkedin.com/in/bernard-chaminadour-61aa8233",
            "email": "bchaminadour@asbh.de",
            "emailConfidence": 80,
            "cost": {
              "totalCost": 0.0123,
              "emailFormatQuery": 0,
              "hubucoQuery": 1,
              "neverBounceQuery": 0,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 2,
              "step": 3,
              "googleQuery": 2
            },
            "created": "2016-08-09T21:35:54.917Z",
            "id": "57aa4cbacbccee0100a02e63"
          },
          "country": [
            "FR"
          ],
          "score": 1.85,
          "countries": [],
          "keywords": [
            "Medical Devices Startups spine",
            "Medical Device Networkers spine",
            "Medical Devices Group spine",
            "Medical Device Guru spine",
            "spine distributors",
            "medical devices orthopedics ",
            "Medical Device Opportunity orthopedic surgery ",
            "Medical Device Opportunity r&d surgery ",
            "Medical Device Opportunity r&d orthopedic",
            "Product management pharmaceutical industry r&d ",
            "new business development medical device product management ",
            "medical devices physiotherapy",
            "medical device physiotherapy",
            "robotic medical devices equipment ",
            "Medical Device Guru "
          ],
          "created": "2019-03-04T16:40:11.953Z",
          "id": "5c79072dc497ba2f55cd7759"
        },
        {
          "_id": "5c790c07c497ba2f55db383a",
          "person": {
            "_id": "5919a5dbd98c6a0100533a1e",
            "company": {
              "_id": "56d616b1deb91b010007926e",
              "__v": 0,
              "domain": "noraker.com",
              "industry": "",
              "name": "NORAKER",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_initial . last_name"
              ],
              "allDomains": [
                "noraker.com",
                "noraker.no",
                "sodimed.com",
                "dirigeants.bfmtv.com",
                "aderly.fr",
                "strava.com",
                "lyonbiopole.com",
                "gazettelabo.fr",
                "novacite.com",
                "marques.expert",
                "lyon.cci.fr",
                "europages.fr",
                "leprogres.fr",
                "118218.fr",
                "allocine.fr",
                "amazon.fr",
                "filmotv.fr",
                "enviscope.com",
                "leparisien.fr",
                "littletimberart.com",
                "pdf.medicalexpo.com",
                "lyon-entreprises.com",
                "comete.com",
                "insavalor.fr"
              ],
              "created": "2016-03-01T22:24:49.166Z",
              "id": "56d616b1deb91b010007926e"
            },
            "country": "FR",
            "email": "a.lesiourd@noraker.com",
            "emailConfidence": 100,
            "emailState": "Mail trouvé",
            "firstName": "Anaïs",
            "fullName": "Anaïs LESIOURD",
            "jobTitle": "R&D Project Manager at NORAKER",
            "keywords": "\"orthopedic\" \"medical device\" \"implant\"",
            "lastName": "LESIOURD",
            "pattern": "first_initial . last_name",
            "profileUrl": "https://fr.linkedin.com/in/ana%C3%AFs-lesiourd-b7ba2331",
            "cost": {
              "totalCost": 0.005,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 1,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 0,
              "step": 1,
              "googleQuery": 0
            },
            "created": "2017-05-15T12:58:03.990Z",
            "id": "5919a5dbd98c6a0100533a1e"
          },
          "country": [
            "FR"
          ],
          "score": 1.8083333333333336,
          "countries": [],
          "keywords": [
            "orthopedic medical device implant",
            "Medical Device Opportunity orthopedic surgery ",
            "Medical Device Opportunity r&d surgery ",
            "Medical Device Opportunity r&d orthopedic",
            "surgery Biomaterials ",
            "surgeon Biomaterials",
            "polymer R&D manager ",
            "H2020 SME instrument "
          ],
          "created": "2019-03-04T16:40:11.953Z",
          "id": "5c790c07c497ba2f55db383a"
        },
        {
          "_id": "5c79072ec497ba2f55cd7b09",
          "person": {
            "_id": "57aa5162cbccee0100a031dc",
            "company": {
              "_id": "57aa4532cbccee0100a025c8",
              "domain": "medicrea.com",
              "industry": "",
              "name": "Medicrea",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_initial last_name"
              ],
              "allDomains": [
                "medicrea.com",
                "actusnews.com",
                "boursedirect.fr"
              ],
              "created": "2016-08-09T21:03:46.427Z",
              "id": "57aa4532cbccee0100a025c8"
            },
            "email": "csoulaine@medicrea.com",
            "emailConfidence": 100,
            "emailState": "sent",
            "firstName": "Cyrielle",
            "fullName": "Cyrielle Soulaine",
            "jobTitle": "R&D Project Manager, Medical Devices",
            "lastName": "Soulaine",
            "pattern": "first_initial last_name",
            "profileUrl": "https://fr.linkedin.com/in/cyrielle-soulaine-a6441924",
            "cost": {
              "totalCost": 0.015,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 3,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 0,
              "step": 1,
              "googleQuery": 0
            },
            "created": "2016-08-09T21:55:46.346Z",
            "id": "57aa5162cbccee0100a031dc"
          },
          "country": [
            "FR"
          ],
          "score": 1.8083333333333336,
          "countries": [],
          "keywords": [
            "Medical Devices Startups spine",
            "Medical Device Opportunity spine",
            "additive manufacturing ",
            "3D printing mechanical ",
            "additive manufacturing engineer ",
            "additive manufacturing mechanical ",
            "orthopedic medical device implant",
            "Dental 3D Printing ",
            "3D printing design mechanical ",
            "spine surgery hospital",
            "Medical Device Opportunity r&d surgery ",
            "Medical Device Opportunity r&d orthopedic",
            "Medical Device Opportunity orthopedic surgery ",
            "medical devices Product Lifecycle Management ",
            "3D Medical, Dental and Medicine Printing Forum"
          ],
          "created": "2019-03-04T16:40:11.953Z",
          "id": "5c79072ec497ba2f55cd7b09"
        },
        {
          "_id": "5c790bd5c497ba2f55da1ab0",
          "person": {
            "_id": "590aea93801df901000e00e4",
            "company": {
              "_id": "5576a73b602a82010083d15e",
              "__v": 4,
              "domain": "baxter.com",
              "industry": "Pharmaceuticals",
              "name": "Baxter International Inc.",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_name  _ last_name ",
                "first_initial last_name",
                "first_name _ last_name",
                "first_name . last_name"
              ],
              "allDomains": [
                "baxter.com",
                "bloomberg.com",
                "zonebourse.com",
                "marketwatch.com",
                "finance.yahoo.com",
                "nasdaq.com",
                "jobs.baxter.com",
                "quotes.wsj.com"
              ],
              "created": "2015-06-09T08:43:39.890Z",
              "id": "5576a73b602a82010083d15e"
            },
            "country": "FR",
            "email": "jessica_delaplace@baxter.com",
            "emailConfidence": 70,
            "emailState": "Mail trouvé",
            "firstName": "Jessica",
            "fullName": "Jessica DELAPLACE",
            "jobTitle": "Ingénieur Développement - Dispositifs Médicaux",
            "keywords": "\"conception mécanique\" \"prototypage\" \"Région de Lyon\"",
            "lastName": "DELAPLACE",
            "pattern": "first_name  _ last_name ",
            "profileUrl": "https://fr.linkedin.com/in/jessica-delaplace-a224225b",
            "cost": {
              "totalCost": 0.0272,
              "emailFormatQuery": 1,
              "hubucoQuery": 0,
              "neverBounceQuery": 1,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 2,
              "step": 4,
              "googleQuery": 2
            },
            "created": "2017-05-04T08:47:15.765Z",
            "id": "590aea93801df901000e00e4"
          },
          "country": [
            "FR"
          ],
          "score": 1.8083333333333336,
          "countries": [],
          "keywords": [
            "conception mécanique prototypage ",
            "orthopedic medical device implant",
            "Medical Device Opportunity r&d surgery ",
            "Medical Device Opportunity r&d orthopedic",
            "Medical Device Opportunity orthopedic surgery ",
            "product design design control"
          ],
          "created": "2019-03-04T16:40:11.954Z",
          "id": "5c790bd5c497ba2f55da1ab0"
        },
        {
          "_id": "5c790bc8c497ba2f55d9d487",
          "person": {
            "_id": "5901e5c37f6b900100635a3a",
            "company": {
              "_id": "56ba5e571d5b70010062924b",
              "__v": 0,
              "domain": "decathlon.fr",
              "industry": "",
              "name": "DECATHLON FRANCE",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_name . last_name",
                "first_name  . last_name ",
                "first_initial last_name"
              ],
              "allDomains": [
                "decathlon.fr",
                "mydecathlon.com",
                "decathlon.be",
                "easybreath.decathlon.com",
                "decathlonpro.fr",
                "solardecathlon2014.fr",
                "grenoble.cci.fr",
                "franceloisirsplus.com",
                "corporate.decathlon.com",
                "trocathlon.fr",
                "google.com",
                "netguide.com",
                "evous.fr",
                "score3.fr",
                "shopalike.fr",
                "yelp.fr",
                "ruecodepromo.com",
                "pubeco.fr",
                "fr.sportsdirect.com",
                "lsa-conso.fr",
                "top-code-promo.com"
              ],
              "created": "2016-02-09T21:47:03.831Z",
              "id": "56ba5e571d5b70010062924b"
            },
            "country": "FR",
            "emailState": "Mail non trouvé",
            "firstName": "Arthur",
            "fullName": "Arthur Pham",
            "jobTitle": "Hiking Department Manager at Décathlon Colomiers, FRANCE",
            "keywords": "\"orthopedic implant\"",
            "lastName": "Pham",
            "pattern": "first_name . last_name",
            "profileUrl": "https://fr.linkedin.com/in/arthur-pham-aa593166",
            "cost": {
              "totalCost": 0,
              "emailFormatQuery": 0,
              "hubucoQuery": 5,
              "neverBounceQuery": 0,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 0,
              "step": 1,
              "googleQuery": 0
            },
            "created": "2017-04-27T12:36:19.607Z",
            "id": "5901e5c37f6b900100635a3a"
          },
          "country": [
            "FR"
          ],
          "score": 1.5,
          "countries": [],
          "keywords": [
            "orthopedic implant",
            "Orthopedic implant"
          ],
          "created": "2019-03-04T16:40:11.954Z",
          "id": "5c790bc8c497ba2f55d9d487"
        },
        {
          "_id": "5c79072ec497ba2f55cd82d3",
          "person": {
            "_id": "57aa497dcbccee0100a02acd",
            "company": {
              "_id": "559fc5b239019701000336bb",
              "__v": 0,
              "domain": "implanet.com",
              "industry": "marquage CE",
              "name": "Scient'x Alphatecspine",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_initial last_name"
              ],
              "allDomains": [
                "implanet.com",
                "sites.google.com",
                "implanet-invest.com",
                "scientx.com",
                "cadresonline.com",
                "legimobile.fr",
                "alineabyluxia.fr"
              ],
              "created": "2015-07-10T13:16:34.547Z",
              "id": "559fc5b239019701000336bb"
            },
            "email": "schampain@implanet.com",
            "emailConfidence": 80,
            "emailState": "Mail trouvé",
            "firstName": "Sabina",
            "fullName": "Sabina Champain",
            "jobTitle": "Clinical affairs & scientific comunication manager",
            "lastName": "Champain",
            "pattern": "first_initial last_name",
            "profileUrl": "https://fr.linkedin.com/in/sabina-champain-9700a819",
            "cost": {
              "totalCost": 0.0172,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 1,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 2,
              "step": 3,
              "googleQuery": 2
            },
            "created": "2016-08-09T21:22:05.206Z",
            "id": "57aa497dcbccee0100a02acd"
          },
          "country": [
            "FR"
          ],
          "score": 1.4166666666666665,
          "countries": [],
          "keywords": [
            "Ortho-Spine NET",
            "at zimmer engineer",
            "at zimmer spine",
            "at zimmer R&D",
            "medical devices orthopedics ",
            "orthopedic prosthesis"
          ],
          "created": "2019-03-04T16:40:11.954Z",
          "id": "5c79072ec497ba2f55cd82d3"
        },
        {
          "_id": "5c79072ec497ba2f55cd7981",
          "person": {
            "_id": "57aa5162cbccee0100a031d2",
            "company": {
              "_id": "57aa4531cbccee0100a025ad",
              "domain": "wright.com",
              "industry": "",
              "name": "Wright Medical",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_name . last_name",
                "first_initial last_name"
              ],
              "allDomains": [
                "wright.com",
                "ir.wright.com",
                "francais.wright.com",
                "wrightmedical.org",
                "italiano.wright.com",
                "deutsch.wright.com",
                "wrightmedicalservices.com",
                "wright-medical.com",
                "wrightmed.co",
                "espanol.wright.com",
                "wrighton-bi-loup.com",
                "ansm.sante.fr",
                "wrightmedical.co.uk",
                "wmt-emea.com",
                "beckersspine.com",
                "globenewswire.com",
                "gand.uscourts.gov",
                "drugwatch.com",
                "footandanklefixation.com",
                "archives.varmatin.com",
                "youscribe.com",
                "123pages.fr",
                "businessfinder.al.com",
                "thestreet.com",
                "healthcarepackaging.com"
              ],
              "created": "2016-08-09T21:03:45.622Z",
              "id": "57aa4531cbccee0100a025ad"
            },
            "email": "laurent.mouillac@wright.com",
            "emailConfidence": 80,
            "emailState": "sent",
            "firstName": "Laurent",
            "fullName": "Laurent Mouillac",
            "jobTitle": "Group Marketing Manager, Upper Extremity",
            "lastName": "Mouillac",
            "pattern": "first_name . last_name",
            "profileUrl": "https://fr.linkedin.com/in/laurentmouillac",
            "cost": {
              "totalCost": 0.0172,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 1,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 2,
              "step": 3,
              "googleQuery": 2
            },
            "created": "2016-08-09T21:55:46.000Z",
            "id": "57aa5162cbccee0100a031d2"
          },
          "country": [
            "FR"
          ],
          "score": 1.4166666666666665,
          "countries": [],
          "keywords": [
            "Medical Devices Startups spine",
            "Opportunities in Spine, Ortho and Ortho-Biologics",
            "at zimmer manufacturing",
            "medical devices orthopedics ",
            "surgeon biomedical bone",
            "orthopedic prosthesis"
          ],
          "created": "2019-03-04T16:40:11.954Z",
          "id": "5c79072ec497ba2f55cd7981"
        },
        {
          "_id": "5c79072ec497ba2f55cd7df0",
          "person": {
            "_id": "57aa4533cbccee0100a025f6",
            "company": {
              "_id": "57aa4531cbccee0100a025aa",
              "domain": "",
              "industry": "",
              "name": "Clinique du Dos Bordeaux-Orthopole-polyclinique Jean Villar",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_initial last_name"
              ],
              "allDomains": [],
              "created": "2016-08-09T21:03:45.595Z",
              "id": "57aa4531cbccee0100a025aa"
            },
            "emailState": "Mail non trouvé",
            "firstName": "Ibrahim",
            "fullName": "Ibrahim Obeid",
            "jobTitle": "Spine surgery. ibrahim.obeid@gmail.com http://www.clinique-du-dos-bordeaux.fr +33556285914",
            "lastName": "Obeid",
            "pattern": "first_initial last_name",
            "profileUrl": "https://fr.linkedin.com/in/ibrahim-obeid-70aa833b",
            "cost": {
              "totalCost": 0,
              "emailFormatQuery": 1,
              "hubucoQuery": 1,
              "neverBounceQuery": 0,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 2,
              "step": 1,
              "googleQuery": 2
            },
            "created": "2016-08-09T21:03:47.909Z",
            "id": "57aa4533cbccee0100a025f6"
          },
          "country": [
            "FR"
          ],
          "score": 1.4166666666666665,
          "countries": [],
          "keywords": [
            "Ortho-Spine NET",
            "The SPINE GROUP",
            "spinal surgery",
            "spine surgery apparatus",
            "arthroplasty spine",
            "medical devices orthopedics ",
            "Orthopaedic Trauma Association (OTA)",
            "rachis lombaire",
            "Orthopaedic Trauma Association",
            "traumatology surgery",
            "fracture surgical",
            "fractures surgical",
            "orthopedic prosthesis"
          ],
          "created": "2019-03-04T16:40:11.954Z",
          "id": "5c79072ec497ba2f55cd7df0"
        },
        {
          "_id": "5c790ab0c497ba2f55d41319",
          "person": {
            "_id": "586f46c40971e00100975844",
            "company": {
              "_id": "561e29ac2b1bf0010040d324",
              "__v": 0,
              "domain": "tfc.info",
              "industry": "Hôtellerie/Restauration/Loisir/Tourisme",
              "name": "Toulouse Football Club",
              "profileUrl": "http://fr.viadeo.com/fr/company/toulouse-football-club",
              "type": "51-100",
              "pattern": [
                "first_initial last_name"
              ],
              "allDomains": [],
              "created": "2015-10-14T10:08:44.462Z",
              "id": "561e29ac2b1bf0010040d324"
            },
            "email": "jamann@tfc.info",
            "emailConfidence": 80,
            "emailState": "Mail trouvé",
            "firstName": "Julien",
            "fullName": "Julien Amann",
            "jobTitle": "Physiotherapist & osteopath",
            "lastName": "Amann",
            "pattern": "first_initial last_name",
            "profileUrl": "https://fr.linkedin.com/in/julien-amann-3069394",
            "cost": {
              "totalCost": 0.0172,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 1,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 2,
              "step": 3,
              "googleQuery": 2
            },
            "created": "2017-01-06T07:27:00.568Z",
            "id": "586f46c40971e00100975844"
          },
          "country": [
            "FR"
          ],
          "score": 1.4166666666666665,
          "countries": [],
          "keywords": [
            "Foot and Ankle Clinical Research",
            "Orthopedic Orthotics",
            "Biologic Orthopedic Society"
          ],
          "created": "2019-03-04T16:40:11.954Z",
          "id": "5c790ab0c497ba2f55d41319"
        },
        {
          "_id": "5c790ab1c497ba2f55d41ca2",
          "person": {
            "_id": "586f47780971e00100975b06",
            "company": {
              "_id": "586f47780971e00100975afe",
              "domain": "chiv.fr",
              "industry": "",
              "name": "Hopital Villeneuve Saint Georges",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_name . last_name"
              ],
              "allDomains": [
                "chiv.fr",
                "pagesmed.com",
                "linternaute.com",
                "liberation.fr",
                "journaldesfemmes.com"
              ],
              "created": "2017-01-06T07:30:00.089Z",
              "id": "586f47780971e00100975afe"
            },
            "email": "elodie.gaumetou@chiv.fr",
            "emailConfidence": 80,
            "emailState": "Mail trouvé",
            "firstName": "Elodie",
            "fullName": "Elodie Gaumetou",
            "jobTitle": "PH orthopédie pédiatrique chez Hopital Villeneuve Saint Georges",
            "lastName": "Gaumetou",
            "pattern": "first_name . last_name",
            "profileUrl": "https://fr.linkedin.com/in/elodie-gaumetou-15876351",
            "cost": {
              "totalCost": 0.0172,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 1,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 2,
              "step": 3,
              "googleQuery": 2
            },
            "created": "2017-01-06T07:30:00.197Z",
            "id": "586f47780971e00100975b06"
          },
          "country": [
            "FR"
          ],
          "score": 1.4166666666666665,
          "countries": [],
          "keywords": [
            "Orthopedic Orthotics",
            "Orthopedic Surgeon hip ",
            "fracture surgery ",
            "fracture surgical",
            "fractures surgical",
            "fracture surgeon"
          ],
          "created": "2019-03-04T16:40:11.954Z",
          "id": "5c790ab1c497ba2f55d41ca2"
        },
        {
          "_id": "5c790bccc497ba2f55d9ee3a",
          "person": {
            "_id": "5903418fbd458701002ec11e",
            "company": {
              "_id": "5903418fbd458701002ec11b",
              "domain": "clinique-bourgoin.com",
              "industry": "",
              "name": "Clinique saint vincent de paul Bourgoin Jallieu",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_initial last_name"
              ],
              "allDomains": [
                "clinique-bourgoin.com",
                "lepole-bourgoin.com",
                "critizr.com",
                "doctolib.fr",
                "doctoralia-fr.com"
              ],
              "created": "2017-04-28T13:20:15.046Z",
              "id": "5903418fbd458701002ec11b"
            },
            "country": "FR",
            "email": "memmanuel@clinique-bourgoin.com",
            "emailConfidence": 80,
            "emailState": "Mail trouvé",
            "firstName": "Marchetti",
            "fullName": "Marchetti Emmanuel",
            "jobTitle": "Chirurgie de la hanche et du genou chez Clinique saint vincent de paul Bourgoin Jallieu (Nord isère)",
            "keywords": "\"Orthopedic Surgeon\" \"hip\" \"Région de Lyon\"",
            "lastName": "Emmanuel",
            "pattern": "first_initial last_name",
            "profileUrl": "https://fr.linkedin.com/in/marchetti-emmanuel-2b5a8648",
            "cost": {
              "totalCost": 0.0123,
              "emailFormatQuery": 0,
              "hubucoQuery": 1,
              "neverBounceQuery": 0,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 2,
              "step": 3,
              "googleQuery": 2
            },
            "created": "2017-04-28T13:20:15.102Z",
            "id": "5903418fbd458701002ec11e"
          },
          "country": [
            "FR"
          ],
          "score": 1.4166666666666665,
          "countries": [],
          "keywords": [
            "Orthopedic Surgeon hip ",
            "prothèse maxillo-facial",
            "orthopedics surgeon",
            "knee surgery ",
            "chirurgien plasticien "
          ],
          "created": "2019-03-04T16:40:11.955Z",
          "id": "5c790bccc497ba2f55d9ee3a"
        },
        {
          "_id": "5c790efdc497ba2f55e57cec",
          "person": {
            "_id": "59c3b0da4514d7010029cd60",
            "company": {
              "_id": "59c3b0da4514d7010029cd50",
              "domain": "aphp.fr",
              "industry": "",
              "name": "AP-HP Assistance Publique - Hopitaux de Paris",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_name . last_name"
              ],
              "allDomains": [
                "aphp.fr",
                "appadvice.com",
                "nemo-europe.com",
                "bionity.com",
                "alfresco.com",
                "publicnow.com"
              ],
              "created": "2017-09-21T12:30:18.633Z",
              "id": "59c3b0da4514d7010029cd50"
            },
            "country": "FR",
            "email": "tazio.talamonti@aphp.fr",
            "emailConfidence": 80,
            "emailState": "Mail trouvé",
            "firstName": "Tazio",
            "fullName": "Tazio Talamonti",
            "jobTitle": "Orthopaedic Surgeon (Assistant Specialiste at AP-HP)",
            "keywords": "\"orthopedic surgery\" \"bone\"",
            "lastName": "Talamonti",
            "pattern": "first_name . last_name",
            "profileUrl": "https://fr.linkedin.com/in/tazio-talamonti-b9981997",
            "cost": {
              "totalCost": 0.0172,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 1,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 2,
              "step": 3,
              "googleQuery": 2
            },
            "created": "2017-09-21T12:30:18.925Z",
            "id": "59c3b0da4514d7010029cd60"
          },
          "country": [
            "FR"
          ],
          "score": 1.4166666666666665,
          "countries": [],
          "keywords": [
            "orthopedic surgery bone",
            "clinical research bone surgeon",
            "clinical research bone orthopaedic",
            "orthopedic prosthesis"
          ],
          "created": "2019-03-04T16:40:11.955Z",
          "id": "5c790efdc497ba2f55e57cec"
        },
        {
          "_id": "5c79075bc497ba2f55cebb3e",
          "person": {
            "_id": "57d975ea1747730100f6316b",
            "company": {
              "_id": "57d975e81747730100f63155",
              "domain": "orthopedie-lyon.fr",
              "industry": "",
              "name": "Centre Albert Trillat",
              "profileUrl": "",
              "type": "",
              "pattern": [],
              "allDomains": [
                "orthopedie-lyon.fr",
                "medicalfootball.com",
                "chu-lyon.fr",
                "ncbi.nlm.nih.gov",
                "tribunedelyon.fr",
                "kelest.fr",
                "bizapedia.com",
                "yelp.fr"
              ],
              "created": "2016-09-14T16:08:08.361Z",
              "id": "57d975e81747730100f63155"
            },
            "emailState": "Mail non trouvé",
            "firstName": "Sebastien",
            "fullName": "Sebastien Lustig",
            "jobTitle": "Professor, Orthopaedic Surgeon, Hip and Knee Surgery.",
            "lastName": "Lustig",
            "pattern": "first_name . last_name",
            "profileUrl": "https://fr.linkedin.com/in/sebastien-lustig-7591aa2a",
            "cost": {
              "totalCost": 0,
              "emailFormatQuery": 1,
              "hubucoQuery": 1,
              "neverBounceQuery": 0,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 2,
              "step": 1,
              "googleQuery": 2
            },
            "created": "2016-09-14T16:08:10.465Z",
            "id": "57d975ea1747730100f6316b"
          },
          "country": [
            "FR"
          ],
          "score": 1.4166666666666665,
          "countries": [],
          "keywords": [
            "bone surgery instruments",
            "Orthopedic Surgeon hip ",
            "Intraoperative surgery medical devices",
            "orthopaedic surgeon orthopaedics",
            "orthopedics surgeon",
            "bone healing medical",
            "bone healing",
            "reconstruction surgery bone",
            "reconstruction surgeon bone",
            "clinical research bone surgery ",
            "clinical research bone surgeon",
            "clinical research bone orthopaedic",
            "precision surface ",
            "knee surgery ",
            "infrared camera",
            "medical devices surgical clinic "
          ],
          "created": "2019-03-04T16:40:11.955Z",
          "id": "5c79075bc497ba2f55cebb3e"
        },
        {
          "_id": "5c790a59c497ba2f55d234c0",
          "person": {
            "_id": "584327cdfc8a24010092096e",
            "company": {
              "_id": "584327c2fc8a2401009208ff",
              "domain": "mines-stetienne.fr",
              "industry": "",
              "name": "Mines Saint-Etienne",
              "profileUrl": "",
              "type": "",
              "pattern": [
                "first_name . last_name"
              ],
              "allDomains": [
                "mines-stetienne.fr",
                "mines-telecom.fr",
                "mines-saint-etienne.org",
                "emse.fr",
                "dtic.mil",
                "al9ahira.files.wordpress.com",
                "trec.nist.gov",
                "academicpositions.eu",
                "booking.com",
                "orgbio.eu",
                "osti.gov",
                "lucintel.com",
                "prezi.com",
                "easycounter.com",
                "sites.google.com",
                "infomine.com",
                "collectorzpedia.com",
                "hippostcard.com",
                "angel.co",
                "thermosymposium.nist.gov"
              ],
              "created": "2016-12-03T20:14:58.610Z",
              "id": "584327c2fc8a2401009208ff"
            },
            "email": "jean.geringer@mines-stetienne.fr",
            "emailConfidence": 80,
            "emailState": "sent",
            "firstName": "Jean",
            "fullName": "Jean Geringer",
            "jobTitle": "Assistant professor: Materials Science / Medical devices (Teaching<​->R&D<​->Business)",
            "lastName": "Geringer",
            "pattern": "first_name . last_name",
            "profileUrl": "https://fr.linkedin.com/in/jean-geringer-b269887",
            "cost": {
              "totalCost": 0.0172,
              "emailFormatQuery": 0,
              "hubucoQuery": 0,
              "neverBounceQuery": 1,
              "verifyMailQuery": 0,
              "yahooQuery": 0,
              "bingQuery": 2,
              "step": 3,
              "googleQuery": 2
            },
            "created": "2016-12-03T20:15:09.850Z",
            "id": "584327cdfc8a24010092096e"
          },
          "country": [
            "FR"
          ],
          "score": 1.4166666666666665,
          "countries": [],
          "keywords": [
            "additive manufacturing ",
            "medical devices orthopedics ",
            "additive manufacturing metals powder",
            "additive manufacturing engineer ",
            "additive manufacturing mechanical ",
            "3D printing mechanical ",
            "materials research polymers materials science",
            "corrosion surfaces ",
            "Caractérisation surfaces ",
            "3D printing polymer ",
            "3D printing design mechanical ",
            "Polymer Chemistry materials ",
            "scanning electron microscopy ",
            "additive manufacturing steel ",
            "Electrochemistry microscopy ",
            "electron microscopy ",
            "Atomic Force Microscopy ",
            "prosthesis ceramic",
            "Spectroscopy nanomaterials ",
            "thin films microscopy ",
            "nanotechnology microscopy ",
            "nanomaterials ",
            "Caractérisation surface ",
            "surgeon biomedical bone",
            "surgeon Biomaterials",
            "Materials Science ceramic ",
            "Materials Science ceramics ",
            "Ceramic Characterization ",
            "ceramic biomedical",
            "ceramic manufacturing ceramics ",
            "ceramic medical ceramics",
            "test ",
            "“polymer engineering” ",
            "Spectroscopy ",
            "orthopedic prosthesis"
          ],
          "created": "2019-03-04T16:40:11.955Z",
          "id": "5c790a59c497ba2f55d234c0"
        }
      ];
      */
      this._pros = pros.map(pro => {
        pro.isLoading = true;
        return pro;
      });
      this._pros.forEach((pro, index) => {
        this.formatPro(pro, index);
      });
    });
  }

  public formatPro(pro, index) {
    if (!pro.person.email) {
      // Si le pro n'a pas d'email, on en génère un faux (de toute façon il est flouté donc illisible)
      if(!pro.person.company.domain) {
        pro.person.company.domain = "unknown.com";
      }
      pro.person.email = `${pro.person.firstName.toLowerCase()}.${pro.person.lastName.toLowerCase()}@${pro.person.company.domain}`;
    }
    // On cherche le logo de la société via clearbit
    if(pro.person.company.domain && pro.person.company.domain != "unknown.com") {
      pro.person.company.logoUrl = `https://logo.clearbit.com/${pro.person.company.domain}?size=64`;
    }
    setTimeout(() => {
      pro.isLoading = false;
      this._pros[index] = pro;
    }, index * 150);
  }

  public searchMetadata(event: Event) {
    event.preventDefault();
    this._searchService.metadataSearch(this._keywords).pipe(first()).subscribe((request: any) => {
      this._status = request.status;
      this._notificationsService.success('Requête ajoutée', 'La requête a bien été ajoutée à la file d\'attente');
      this._fetchInterval = setInterval(() => this.fetchRequest(request._id), 3000);
    });
  }

  public fetchRequest(requestId: string) {
    this._searchService.getMetadataRequest(requestId).pipe(first()).subscribe((request: any) => {
      console.log(request);
      this._status = request.status;
      this._metadata = request.metadata;
      if (this._status === "DONE") {
        clearInterval(this._fetchInterval);
      }
    });
  }

  public updateDatabase() {
    this._searchService.updateDatabase().pipe(first()).subscribe(_=> {
      console.log("OK");
    });
  }

  get selectedArea(): string { return this._selectedArea }
  get status(): string { return this._status }
  get results(): string { return this._results }
  get pros(): Array<any> { return this._pros }
  get keywords(): string { return this._keywords }
  set keywords(value: string) { this._keywords = value }
}
