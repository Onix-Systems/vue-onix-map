export interface TableInterface {
  id: number;
  img: string;
  rect: {
    x: number,
    y: number,
    height: number,
    width: number,
  };
  imgWidth: number;
  imgHeight: number;
  x: number;
  y: number;
}
