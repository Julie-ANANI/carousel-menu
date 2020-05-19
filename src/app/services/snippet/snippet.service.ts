import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class SnippetService {

  public static storyboard(field: string, lang: string = 'en'): string {
    if (field) {
      switch (field) {

        case 'OBJECTIVE':
          return lang === 'fr' ? 'L’objectif du test marché était de' : 'The objective of the market test was to';

        case 'PITCH':
          return lang === 'fr' ? 'Voici le projet :' : 'Here is your project:';

        case 'TARGETING':
          return lang === 'fr'
            ? 'Nous avons contacté des professionnels qualifiés dans le secteur de ### en  France, ##, ##,##, et collecté XX réponses.'
            : 'We contacted professionals concerned with ### in specific countries including ###, ###, ###, ###. ' +
            'and collected XX responses.';

        case 'PROFESSIONAL':
          return lang === 'fr'
            ? 'Notre analyse est basée sur un, panel de XX répondants issus de secteurs comme ##,##,##,... Parmi eux, ' +
            'voici quatre professionnels particulièrement interessants.'
            : 'We based our analysis on this panel of XX professionals, from sectors such as XX, XX, XX, XX,... ' +
            'Here are 4 profiles of professionals of particular interest.';

        case 'CONCLUSION':
          return lang === 'fr'
            ? 'Votre solution de XX répond bien à une problématique validée par le marché. Si plus de solutions XX sont attendues, ' +
            'la vôtre peut être vue comme une solution XX si le XX est XX. XX serait la première zone géographique pour ' +
            'commencer l\'évaluation marché.'
            : 'Your XX solution answers an important issue validated by the market. If more XX solutions are expected, ' +
            'yours can be used as a XX solution if the XX is XX. XX would be the best area to start accessing the market.';

      }
    }
    return '';
  }

}
