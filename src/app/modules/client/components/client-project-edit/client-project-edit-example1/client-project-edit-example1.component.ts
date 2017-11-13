import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-client-project-edit-example1',
  template: '<app-shared-project-description [project]="project"></app-shared-project-description>'
})
export class ClientProjectEditExample1Component implements OnInit {

  public project: any;

  constructor() {
  }

  ngOnInit() {
    this.project = {
      'domain': 'umi.us',
      'patented': true,
      'projectStatus': 1,
      'isPublic': true,
      'status': 'SUBMITTED',
      'innovationCards': [
        {
          'principal': false,
          'solution': 'En mélangeant des matériaux inertes terreux issus des chantiers du BTP et des déchets \
            organiques, nous avons recréé une terre de culture. Après plusieurs mois ou années de culture sur de \
            grandes surfaces pour l\'enrichir et lui redonner de la vie, cette terre de culture présente toutes les \
            qualités d\'une terre végétale de qualité garantie.\n\n\
            La terre de culture est fabriquée à la demande et déjà mise en culture lors de sa livraison, ce qui en \
            fait une terre fonctionnelle et vivante qui présente des propriétés physiques, chimiques et biologiques \
            appropriées (% en limon, % en argile, teneur en matière organique, vers de terre, ...).\n\n\
            Ainsi la qualité de la terre de culture est garantie : elle est prête à l\'emploi et prête à être cultivée \
            sans besoin d\'amendement supplémentaire. Sa composition, sa granulométrie et son homogénéité sont \
            parfaitement maitrisées et peuvent être adaptés en fonction du besoin.\n\n\
            La traçabilité de cette terre de culture permet de garantir l\'absence de métaux lourds, de pesticides et \
            d\'invasives grâce à une procédure de contrôle des matériaux. Selon la durée et les conditions de culture, \
            la terre peut être spécifiquement adaptée aux différentes applications (espaces verts, potagers, terres \
            agricoles, plantations, ...).\n\n\
            La terre de culture permet d\'avoir un impact environnemental positif (valorisation de matériaux minéraux \
            et organiques afin de préserver les espaces agricoles), sans impacter le critère économique \
            (coût compétitif par rapport à la terre végétale classique).',
          'problem': 'Plus de vert dans les villes, création d\'espaces paysagers, enjeu des villes durables, besoin \
            de terre pour les aménagements urbains, développement de l\'agriculture urbaine...\n\n\
            La végétalisation en ville est un enjeu de plus en plus fort. Si bien qu\'aujourd\'hui l\'offre de terre \
            fertile est inférieure à la demande.\n\n\
            L\'absence de traçabilité de l\'offre de terre végétale actuelle induit un risque de présence de polluants \
            ou d\'espèces végétales indésirées qui peuvent perturber la "productivité" de la terre une fois mise en \
            place.\n\n\
            La variabilité de l\'origine de la terre induit quant à elle une variabilité de qualité qui est \
            difficilement prévisible avant sa mise en place. De plus la qualité de la terre se dégrade souvent \
            durant son stockage (par exemple sur un stock vertical de 2 mètres de hauteur, seuls les 30 premiers \
            centimètres peuvent être réellement considérés comme de la terre végétale, un horizon riche et vivant).\n\n\
            En parallèle les chantiers du BTP génèrent des matériaux inertes terreux qui sont quasi systématiquement \
            destinés à la mise en décharge. Quels débouchés pour ces matériaux dans une démarche d\'économie \
            circulaire ?\n\n\
            Enfin de nombreux déchets organiques (compost, fumier, déchets verts...) n\'ont pas ou peu de débouchés \
            malgré leur potentiel.',
          'summary': 'Terre cultivée à partir d\'un mélange de déchets inertes de chantiers BTP et de déchets \
            organiques communs, permettant de garantir une terre vivante, de qualité et spécifiquement adaptée à \
            chaque application.',
          'title': 'Terre de culture',
          'advantages': [
            'Terre vivante, déjà cultivée, dont la qualité est garantie',
            'Absence de pesticides ou d\'espèces végétales envahissantes',
            'Caractéristiques spécifiquement adaptées à l\'usage de végétalisation souhaité',
            'Coût compétitif par rapport à la terre végétale classique provenant des espaces agricoles',
            'Impact environnemental positif et intégré dans une démarche d\'économie circulaire',
            'Disponible en vrac en toute quantité : de quelques kilogrammes à plusieurs centaines de tonnes',
            'Proximité d\'approvisionnement sur le territoire national'
          ],
          'media': [
            'app/project-example-1.jpg'
          ],
          'lang': 'fr'
        },
        {
          'principal': true,
          'solution': 'By combining inert soil materials from construction sites with organic waste, we have been \
            able to create cultivable soil. After several months or years of cultivation over a large area to enrich \
            the soil and bring it back to life, this cultivated soil presents all the qualities of a high-grade topsoil \
            with guaranteed quality.\n\n\
            This cultivable soil is created on demand and already cultivated before delivery, which ensures the soil \
            is functional and alive with all the required physical, chemical, and biological properties (% silt, % \
            clay, organic content, earthworms, etc.).\n\n\
            The quality of this cultivable soil is guaranteed: it’s ready to use and be cultivated with no need for \
            additional conditioning. Its composition, grain size and homogeneity are perfectly controlled and can be \
            adapted as needed.\n\n\
            The traceability of this cultivable soil ensures the absence of heavy metals, pesticides, and invasive \
            plants and creatures thanks to stringent testing procedures. Depending on the duration and conditions of \
            cultivation, the soil can be customized for specific applications (green spaces, allotments, agricultural \
            soils, plantations, etc.).\n\n\
            The cultivable soil has a positive environmental impact (reusing mineral and organic materials to preserve \
            agricultural spaces), without impacting economic criteria (competitive pricing in comparison to standard \
            topsoil solutions).',
          'problem': 'With more green in our towns and cities and more green open spaces being created to create \
          sustainable urban environments, there is a growing need for soil for urban developments, urban agriculture, \
          etc.\n\n\
            Urban planting is an increasing challenge, and the current availability of fertile soil is unable to keep \
            up with demand.\n\n\
            The current lack of traceability of topsoil has the potential risk of introducing pollutants or \
            undesirable plant species that may impede the “productivity” of the soil when in place.\n\n\
            Variability in the origin of the soil goes hand-in-hand with variability in its quality, which is \
            difficult to judge before the soil is put in place. The quality of the soil also degrades as it is \
            stored (for example, vertical storage 2m in depth, only the top 30cm could really be considered to be \
            topsoil with a rich, living layer).\n\n\
            At the same time, construction sites generate inert soil materials that are almost always destined for \
            landfill. What other outlets might there be for these materials using a circular economy approach?\n\n\
            And finally, most organic waste (compost, manure, green waste, etc.) has no or few outlets despite its \
            potential.',
          'summary': 'Soil cultivated from a mix of inert waste from construction sites and organic community waste \
            to provide high-quality earth that is active and specifically adapted to each application.',
          'title': 'Cultivable soil',
          'advantages': [
            'Living, pre-cultivated soil',
            'No pesticides or invasive plant species',
            'Characteristics specifically adapted to the desired planting use',
            'Competitive price in comparison to standard topsoil',
            'Positive environmental impact integrated into a circular economy approach',
            'Available loose in any quantity: from several kilograms to hundreds of tons',
            'Locally supplied around the country'
          ],
          'media': [
            'app/project-example-1.jpg'
          ],
          'lang': 'en'
        }
      ]
    }
  }

}
