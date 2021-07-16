import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-sidebar-scraping',
  templateUrl: './sidebar-scraping.component.html',
  styleUrls: ['./sidebar-scraping.component.scss']
})

export class SidebarScrapingComponent implements OnChanges {

  @Input() content: any = <any>{};

  @Input() sidebarState = 'inactive';

  @Input() params: any = null;

  @Output() paramsChange = new EventEmitter<any>();

  private _hideInput = false;

  // private _possibleFormattedAddress = new Array<string>();

  private _fields: any = {
    rawData: {
      label: 'Info supplémentaire brute par rapport au pro',
      toolTip: 'Extrait les infos rattachées au pro mais peut prendre plus de temps.'
    },
    formattedAddress: {
      label: 'Formatage de l’adresse postale (Payant)',
      toolTip: 'Fonctionne sur des infos brutes ou sur une catégorie d’info lié à l’adresse postale. Utilise l’API geocode de Google (coût: 4$ pour 1000 formatages).'
    },
    whereFormattedAddress: {
      label: 'Sur quelles données voulez-vous formater l’adresse ?',
      toolTip: null
    },
    dynamicHTML: {
      label: 'Dynamic HTML',
      toolTip: 'TODO exemples et explications.'
    },
    skipsMails: {
      label: 'Emails à exclure',
      toolTip: 'Pensez à rentrer l’email du site lui-même.'
    },
    specificData: {
      label: 'Extraction d’une catégorie d’information pour chaque pro',
      toolTip: null
    },
    specificDataName: {
      label: 'Créer un intitulé',
      toolTip: null
    },
    specificDataXPath: {
      label: 'Emplacement de l’information (Xpath)',
      toolTip: '1/Faites Shift + cmd + c pour ouvrir l’inspecteur de code\n' +
               '2/Sur la page Web, cliquez sur l’information à extraire du 1er mail \n' +
               '3/Clic droit sur la ligne bleu dans l’inspecteur : Copier > Xpath'
    },
    numberSpecificData: {
      label: 'Nombre de catégorie d’informations à extraire',
      toolTip: null
    },
    isCrawling: {
      label: 'Scraper plusieurs pages',
      toolTip: 'Notamment pour les sites à plusieurs pages de résultats'
    },
    maxRequest: {
      label: 'Nombre limite de pages à scraper',
      toolTip: 'Si le nombre limite est dépassé, le module s\'arrête et renvoie ce qu\'il a trouvé. [Si le champ est vide, il n\'y aura pas de limite.] Dans un premier temps, le mettre bas (quelques dizaines) pour faire des tests rapides et ajuster les paramètres en fonction des résultats. Puis, une fois que tout semble bon, le laisser vide/mettre une surestimation du nombre de page à scraper en tout.'
    },
    isSingle: {
      label: 'Nécessité de cliquer sur le profil pour trouver le mail',
      toolTip: null,
    },
    linkPro: {
      label: 'Veuillez entrer l’URL commun à tous les profils',
      toolTip: 'regardez l’URL d’au moins deux profils et sélectionnez la partie de l’URL en commun.'
    },
    isField: {
      label: 'Scraper des résultats selon différentes valeurs',
      toolTip: 'ex : rechercher dans plusieurs codes postaux'
    },
    numberFields: {
      label: 'Nombre de champs à remplir',
      toolTip: null
    },
    fieldLocator: {
      label: 'Emplacement du champ texte',
      toolTip: 'Chercher le champ "name" du champ à remplir.' +
                '[1/Faites Shift + cmd + c pour ouvrir l’inspecteur de code\n' +
                '2/Sur la page Web, cliquez sur l’information à extraire du 1er mail \n' +
                '3/Clic droit sur la ligne bleu dans l’inspecteur : Copier > Xpath.]'
    },
    fieldData: {
      label: 'indiquez les valeurs à chercher',
      toolTip: 'Séparées par une virgule.'
    }
  };

  constructor() { }

  ngOnChanges(): void {
  }

  public saveParams(event: any) {
    console.log('UPDATED');
    event.preventDefault();
    this.paramsChange.emit(this.params);
  }

  public onKeyboardPress(event: Event) {
    event.preventDefault();
    this.paramsChange.emit(this.params);
  }

  public showField(index: number): boolean {
    return (index < this.params['numberFields']);
  }

  public showSpecificData(index: number): boolean {
    return (index < this.params['numberSpecificData']);
  }

  get hideInput(): boolean {
    return this._hideInput;
  }

  get fields(): any {
    return this._fields;
  }

  public getLabel(name: string): string {
    return this._fields[name].label;
  }

  public getToolTip(name: string): string {
    return this._fields[name].toolTip;
  }
  /*
  public updatePossibleFormattedAddress(): boolean {
    // Return true if there is a data on which it can apply formatted address
    // Update the _possibleFormattedAddress value
    this._possibleFormattedAddress = [];
    if (this.params['isSpecificData']) {
      for (let index = 0; index < this.params['numberSpecificData']; index++) {
        const name = this.params['specificData'][index]['name'];
        if (name !== '') {
          this._possibleFormattedAddress.push(name);
        }
      }
    }
    if (this.params['rawData']) {
      this._possibleFormattedAddress.push('raw data');
    }
    return (this._possibleFormattedAddress !== []);
  }
   */

  public possibleFormattedAddress(): Array<string> {
    const possible = [];
    if (this.params['isSpecificData']) {
      for (let index = 0; index < this.params['numberSpecificData']; index++) {
        const name = this.params['specificData'][index]['name'];
        if (name !== '' && typeof name !== 'undefined') {
          possible.push(name);
        }
      }
    }
    if (this.params['rawData']) {
      possible.push('raw data');
    }
    return possible;
  }

}
