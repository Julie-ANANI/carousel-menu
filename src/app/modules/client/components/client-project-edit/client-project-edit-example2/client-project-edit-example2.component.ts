import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-client-project-edit-example2',
  template: '<app-shared-project-description [project]="project"></app-shared-project-description>'
})
export class ClientProjectEditExample2Component implements OnInit {

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
          'solution': 'Nous avons développé une nouvelle peinture luminescente qui permet d\'assurer un meilleur \
            niveau de confort et de sécurité en améliorant la signalétique en conditions de visibilité dégradée.\n\n\
            Cette peinture luminescente emmagasine la lumière solaire la journée et celle des phares la nuit, et la \
            restitue en cas de visibilité dégradée (nuit, brouillard, pluie, neige...).\n\n\
            Notre technologie repose sur une chimie différente des solutions concurrentes ce qui lui permet d\'être \
            beaucoup plus résistante aux UV et à l\'humidité.\n\n\
            Les premières preuves de concept ont permis de valider la bonne tenue de la peinture en conditions \
            réelles sur une durée prolongée.\n\n\
            Cette nouvelle peinture est adaptée à l\'arrivée des véhicules autonomes sur les routes. Ces derniers se \
            repérant majoritairement grâce au marquage qui doit être infaillible.\n\n\
            De plus, cette peinture permet de s\'affranchir d\'éclairage dans certaines zones tout en maintenant un \
            niveau de confort et de sécurité suffisant; ce qui entraîne d\'importants gains sur la consommation \
            d\'énergie et la simplicité d\'installation.',
          'problem': 'Le marquage routier existant n\'est pas optimal pour le confort et la sécurité des usagers en \
            conditions de visibilité dégradée (nuit, brouillard, pluie, neige,...).\n\n\
            Les méthodes de marquage actuelles sont insuffisantes, obsolètes et ne conviennent pas aux véhicules \
            autonomes qui nécessitent un système de marquage au sol parfaitement visible 100% du temps pour \
            fonctionner.\n\n\
            Des peintures luminescentes ont été développées notamment en Europe du Nord, mais ne sont pas \
            aujourd\'hui suffisamment résistantes pour être implantées durablement sur le réseau routier ou \
            autoroutier (tenue de quelques semaines maximum avant de se dégrader).',
          'summary': 'Renforcement de la sécurité et du confort des usagers de la route en conditions de visibilité \
            dégradée (nuit, brouillard, pluie, neige, ...) grâce à une nouvelle peinture luminescente, résistante aux \
            UV et à l\'humidité.',
          'title': 'Peinture routière luminescente',
          'advantages': [
            'Amélioration de la sécurité et du confort des usagers de la route',
            'Beaucoup plus durable et résistante que les premières peintures luminescentes développées',
            'Adaptée à l\'arrivée des véhicules autonomes',
            'Gains en consommation d\'énergie et installation d\'éclairage',
            'Solution environnementale',
            'Technologie protégée'
          ],
          'media': [
            {
              '_id': '0123456789',
              'cloudinary': {
                'public_id': 'app/project-example-2.jpg'
              }
            }
          ],
          'principalMediaIdx': '0',
          'lang': 'fr'
        },
        {
          'principal': true,
          'solution': 'We have developed a new luminescent paint that provides a higher level of comfort and safety \
            for road users by increasing the visibility of road markings in low visibility conditions.\n\n\
            This luminescent paint stores solar light during the day and light from headlights at night, releasing \
            the stored light in low visibility conditions (night, fog, rain, snow, etc.).\n\n\
            Our technology is based on a different chemical composition from that of competing solutions, which \
            enables it to be much more resistant to UV and damp conditions.\n\n\
            The first proofs of concept demonstrated the high durability of the paint under real conditions over a \
            prolonged period.\n\n\
            This new paint is suitable for use with the new autonomous vehicles due to arrive on the road. These \
            autonomous vehicles rely heavily on clear, visible road markings to navigate.\n\n\
            In addition, this paint avoids the need to install lighting in some areas whilst still maintaining a \
            sufficient level of safety and comfort, which enables significant reductions in energy consumption and \
            increased ease of installation.',
          'problem': 'Existing road markings fail to provide optimal safety and comfort for road users in low \
            visibility conditions (night, fog, rain, snow, etc.).\n\n\
            Current road marking methods are insufficient, obsolete and unsuitable for autonomous vehicles which \
            require clear road markings visible 100% of the time to function.\n\n\
            Luminescent road paint has been developed in the past, largely in northern Europe, but these paints are \
            not sufficiently resistant for sustained use on roads and highway networks, only lasting a matter of \
            weeks before beginning to degrade.',
          'summary': 'Improve comfort and safety for road users in low visibility conditions (night, fog, rain, snow, \
            etc.) using new luminescent paint technology resistant to UV and damp conditions.',
          'title': 'Luminescent road paint',
          'advantages': [
            'Improves safety and comfort for road users',
            'Much more durable and resistant than earlier luminescent paints that have been developed',
            'Designed to be suitable for the imminent arrival of autonomous vehicles',
            'Reduces energy consumption and the need to install lighting',
            'An environmentally-friendly solution',
            'Proprietary technology'
          ],
          'media': [
            {
              '_id': '0123456789',
              'cloudinary': {
                'public_id': 'app/project-example-2.jpg'
              }
            }
          ],
          'principalMediaIdx': '0',
          'lang': 'en'
        },
      ]
    }
  }

}
