import {TranslationInterface} from '@/interfaces/translationInterface';

export interface PlacesMenuInterface {
  sectionName: TranslationInterface;
  places: {
    ps?: PlaceMenuInterface;
    drinks?: PlaceMenuInterface;
    icecream?: PlaceMenuInterface;
    chill?: PlaceMenuInterface;
    foosball?: PlaceMenuInterface;
    football?: PlaceMenuInterface;
    kitchen?: PlaceMenuInterface;
    wc?: PlaceMenuInterface;
    gym?: PlaceMenuInterface;
    shower?: PlaceMenuInterface;
    standingTable?: PlaceMenuInterface;
    extinguisher?: PlaceMenuInterface;
    medkit?: PlaceMenuInterface;
  };
}

export interface PlaceMenuInterface {
  id: number;
  name: TranslationInterface;
  label: TranslationInterface;
  icon: string;
  link?: string;
}
