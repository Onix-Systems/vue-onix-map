import {PlacesMenuInterface} from '@/interfaces/placesMenuInterface';

export const PLACES_MENU: PlacesMenuInterface[] = [
  {
    sectionName: 'Chill',
    places: {
      ps: {
        id: 0,
        name: 'Playstation',
        label: '7 floor',
        icon: 'playstation.svg',
      },

      drinks: {
        id: 1,
        name: 'Drinks',
        label: '8 floor',
        icon: 'drinks.svg',
      },

      icecream: {
        id: 2,
        name: 'Ice Cream',
        label: '1 floor',
        icon: 'ice-cream.svg',
      },

      chill: {
        id: 3,
        name: 'Chill Room',
        label: '6 floor',
        icon: 'chill-room.svg',
      },

      foosball: {
        id: 4,
        name: 'Foosball',
        label: '6 floor',
        icon: 'foosball.svg',
      },

      football: {
        id: 5,
        name: 'Football',
        label: 'Contact us',
        link: 'https://www.facebook.com/maxim.kamenschikov',
        icon: 'football.svg',
      },

      kitchen: {
        id: 6,
        name: 'Kitchens',
        label: 'All floors',
        icon: 'kitchens.svg',
      },

      wc: {
        id: 7,
        name: 'Toilets',
        label: 'All floors',
        icon: 'wc.svg',
      },

      shower: {
        id: 8,
        name: 'Shower',
        label: '8 floor',
        icon: 'shower.svg',
      },
    },
  },

  {
    sectionName: 'Emergency',
    places: {
      extinguisher: {
        id: 9,
        name: 'Extinguisher',
        label: 'All floors',
        icon: 'extinguisher.svg',
      },

      medkit: {
        id: 10,
        name: 'First Aid Kit',
        label: 'All floors',
        icon: 'aid-kit.svg',
      },
    },
  },
];
