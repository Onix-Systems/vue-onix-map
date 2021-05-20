export interface TableInterface {
  id: number;
  img: string;
  rect: {
    x: number,
    y: number,
    height: number,
    width: number,
  };
  balloon: {
    male: {
      x: number,
      y: number,
      height: number,
      width: number,
    },
    female: {
      x: number,
      y: number,
      height: number,
      width: number,
    },
  };
  popupOffset: {
    x: number,
    y: number,
  };
  imgWidth: number;
  imgHeight: number;
  x: number;
  y: number;
}
