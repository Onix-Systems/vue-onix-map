export interface PlacesMenuInterface {
  sectionName: string;
  places: {
    ps?: PlaceMenuInterface,
    drinks?: PlaceMenuInterface,
    icecream?: PlaceMenuInterface,
    chill?: PlaceMenuInterface,
    foosball?: PlaceMenuInterface,
    football?: PlaceMenuInterface,
    kitchen?: PlaceMenuInterface,
    wc?: PlaceMenuInterface,
    gym?: PlaceMenuInterface,
    shower?: PlaceMenuInterface,
    extinguisher?: PlaceMenuInterface,
    medkit?: PlaceMenuInterface,
  };
}

export interface PlaceMenuInterface {
  id: number;
  name: string;
  label: string;
  icon: string;
  link?: string;
}
