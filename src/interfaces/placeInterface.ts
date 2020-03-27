import {TranslationInterface} from '@/interfaces/translationInterface';

export interface PlaceInterface {
  id: number;
  img: string;
  name: TranslationInterface;
  placeGroup: string;
  placeType: string;
  description: TranslationInterface;
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
