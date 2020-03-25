export interface PlaceInterface {
  id: number;
  img: string;
  name: string;
  placeGroup: string;
  placeType: string;
  description: string;
  showImg: boolean;
  rect: {
    x: number,
    y: number,
    height: number,
    width: number,
  };
  bubble: {
    x: number,
    y: number,
    width: number,
    height: number,
  };
  imgWidth: number;
  imgHeight: number;
  x: number;
  y: number;
}
