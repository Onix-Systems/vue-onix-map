import {PlacesMenuInterface} from '@/interfaces/placesMenuInterface';

export const PLACES_MENU: PlacesMenuInterface[] = [
  {
    sectionName: {
      en: 'Chill',
      ua: 'Відпочинок',
    },
    places: {
      ps: {
        id: 0,
        name: {
          en: 'Playstation',
          ua: 'Playstation',
        },
        label: {
          en: '7 floor',
          ua: '7 поверх',
        },
        icon: 'playstation.svg',
      },

      drinks: {
        id: 1,
        name: {
          en: 'Drinks',
          ua: 'Напої',
        },
        label: {
          en: '8 floor',
          ua: '8 поверх',
        },
        icon: 'drinks.svg',
      },

      icecream: {
        id: 2,
        name: {
          en: 'Ice Cream',
          ua: 'Морозиво',
        },
        label: {
          en: '1 floor',
          ua: '1 поверх',
        },
        icon: 'ice-cream.svg',
      },

      gym: {
        id: 3,
        name: {
          en: 'Sport',
          ua: 'Спорт',
        },
        label: {
          en: '6,7 floors',
          ua: '6,7 поверхи',
        },
        icon: 'gym.svg',
      },

      foosball: {
        id: 4,
        name: {
          en: 'Foosball',
          ua: 'Настільний футбол',
        },
        label: {
          en: '6 floor',
          ua: '6 поверх',
        },
        icon: 'foosball.svg',
      },

      football: {
        id: 5,
        name: {
          en: 'Football',
          ua: 'Футбол',
        },
        label: {
          en: 'Contact us',
          ua: 'Зв\'яжіться з нами',
        },
        link: 'https://www.facebook.com',
        icon: 'football.svg',
      },

      chill: {
        id: 6,
        name: {
          en: 'Chill Room',
          ua: 'Кімнати відпочинку',
        },
        label: {
          en: '6,7,8 floors',
          ua: '6,7,8 поверхи',
        },
        icon: 'chill-room.svg',
      },

      kitchen: {
        id: 7,
        name: {
          en: 'Kitchens',
          ua: 'Кухні',
        },
        label: {
          en: 'All floors',
          ua: 'Всі поверхи',
        },
        icon: 'kitchens.svg',
      },

      wc: {
        id: 8,
        name: {
          en: 'Toilets',
          ua: 'Туалети',
        },
        label: {
          en: 'All floors',
          ua: 'Всі поверхи',
        },
        icon: 'wc.svg',
      },

      shower: {
        id: 9,
        name: {
          en: 'Shower',
          ua: 'Душ',
        },
        label: {
          en: '8 floor',
          ua: '8 поверх',
        },
        icon: 'shower.svg',
      },
    },
  },

  {
    sectionName: {
      en: 'Emergency',
      ua: 'Надзвичайна ситуація',
    },
    places: {
      extinguisher: {
        id: 10,
        name: {
          en: 'Extinguisher',
          ua: 'Вогнегасники',
        },
        label: {
          en: 'All floors',
          ua: 'Всі поверхи',
        },
        icon: 'extinguisher.svg',
      },

      medkit: {
        id: 11,
        name: {
          en: 'First Aid Kit',
          ua: 'Аптечки першої допомоги',
        },
        label: {
          en: 'All floors',
          ua: 'Всі поверхи',
        },
        icon: 'aid-kit.svg',
      },
    },
  },
];
