import {Component, Input, OnChanges} from '@angular/core';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-sidebar-scraping',
  templateUrl: './sidebar-scraping.component.html',
  styleUrls: ['./sidebar-scraping.component.scss']
})

export class SidebarScrapingComponent implements OnChanges {

  @Input() params: any = null;

  private _showToggleMoreData = false;
  // private _possibleFormattedAddress = new Array<string>();

  private _tooltipXPath: string =
    '1/ Faites Shift + cmd + c pour ouvrir l’inspecteur de code\n' +
    '2/ Sur la page Web, cliquez sur l’information à extraire du 1er mail\n' +
    '3/ Clic droit sur la ligne bleu dans l’inspecteur : Copier > Xpath';

  private _fields: any = {
    rawData: {
      label: 'Extraction automatique d\'informations brutes',
      toolTip: 'Extrait toutes les infos rattachées au pro mais peut prendre plus de temps.'
    },
    dynamicHTML: {
      label: 'Dernier recours',
      toolTip: 'Checkbox à cocher si rien ne semble marcher comme il le faudrait. Prend plus de temps.'
    },
    specificDataName: {
      label: 'Créer un intitulé',
      toolTip: 'Correspond au nom de la futur colonne dans l‘affichage des résultats.'
    },
    specificDataXPath: {
      label: 'Emplacement de l’information (Xpath)',
      toolTip: this._tooltipXPath,
    },
    numberSpecificData: {
      label: 'J\'ai besoin d\'extraire combien de catégorie d’informations ?',
      toolTip: null
    },
    isCrawling: {
      label: 'J\'ai besoin de scraper plusieurs pages',
      toolTip: 'Notamment pour les sites à plusieurs pages de résultats'
    },
    isSingle: {
      label: 'J\'ai besoin de cliquer sur le profil pour trouver le mail',
      toolTip: null,
    },
    linkPro: {
      label: 'Veuillez entrer l’URL commun à tous les profils',
      toolTip: 'regardez l’URL d’au moins deux profils et sélectionnez la partie de l’URL en commun.'
    },
    numberFields: {
      label: 'J\'ai besoin de remplir combien de champ pour charger la page à scraper ?',
      toolTip: 'ex : champ avec un code postal à remplir'
    },
    fieldLocator: {
      label: 'Emplacement du champ texte (Xpath)',
      toolTip: this._tooltipXPath,
    },
    fieldData: {
      label: 'Valeurs à remplir',
      toolTip: 'Séparées les valeurs par une virgule.'
    },
    loadMore: {
      label: 'Emplacement d\'un bouton permettant de charger plus de pros (Xpath)',
      toolTip: 'Rentrer le XPath lié à ce bouton: \n' + this._tooltipXPath,
    }
    // specificData: {
    //   label: 'Extraction d’une catégorie d’information pour chaque pro',
    //   toolTip: null
    // },
    // formattedAddress: {
    //   label: 'Formatage de l’adresse postale (Payant)',
    //   toolTip: 'Fonctionne sur des infos brutes ou sur une catégorie d’info lié à l’adresse postale. Utilise l’API geocode de Google
    //   (coût: 4$ pour 1000 formatages).'
    // },
    // whereFormattedAddress: {
    //   label: 'Sur quelles données voulez-vous formater l’adresse ?',
    //   toolTip: null
    // },
    // skipsMails: {
    //   label: 'Emails à exclure',
    //   toolTip: 'Pensez à rentrer l’email du site lui-même.'
    // },
    // maxRequest: {
    //   label: 'Nombre limite de pages à scraper',
    //   toolTip: 'Si le nombre limite est dépassé, le module s\'arrête et renvoie ce qu\'il a trouvé. [Si le champ est vide, il n\'y
    //   aura pas de limite.] Dans un premier temps, le mettre bas (quelques dizaines) pour faire des tests rapides et ajuster les
    //   paramètres en fonction des résultats. Puis, une fois que tout semble bon, le laisser vide/mettre une surestimation du nombre de
    //   page à scraper en tout.'
    // },
    // isField: {
    //   label: 'Scraper des résultats selon différentes valeurs',
    //   toolTip: 'ex : rechercher dans plusieurs codes postaux'
    // },
  };

  constructor() { }

  ngOnChanges(): void {
  }

  /**
   * This function return true if index is less than the number of field.
   * It helps to show correctly the number of field in the HTML code.
   * @param index
   */
  public showField(index: number): boolean {
    return (index < this.params['numberFields']);
  }

  /**
   * This function return true if index is less than the number of specific data.
   * It helps to show correctly the number of specific data in the HTML code.
   * @param index
   */
  public showSpecificData(index: number): boolean {
    return (index < this.params['numberSpecificData']);
  }

  /**
   * This function return the label according to the variable _fields associate to name.
   * It helps to show the correct label of the input in the HTML code.
   * @param name
   */
  public getLabel(name: string): string {
    return this._fields[name].label;
  }

  /**
   * This function return the tooltip according to the variable _fields associate to name.
   * It helps to show the correct tooltip of the input in the HTML code.
   * @param name
   */
  public getToolTip(name: string): string {
    return this._fields[name].toolTip;
  }

  get showToggleMoreData(): boolean {
    return this._showToggleMoreData;
  }

  onClickToggleMoreData() {
    this._showToggleMoreData = !this._showToggleMoreData;
  }

  // public possibleFormattedAddress(): Array<string> {
  //   const possible = [];
  //   if (this.params['isSpecificData']) {
  //     for (let index = 0; index < this.params['numberSpecificData']; index++) {
  //       const name = this.params['specificData'][index]['name'];
  //       if (name !== '' && typeof name !== 'undefined') {
  //         possible.push(name);
  //       }
  //     }
  //   }
  //   if (this.params['rawData']) {
  //     possible.push('raw data');
  //   }
  //   return possible;
  // }

}
