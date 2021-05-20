export interface PlacesBusyInterface {
  [key: string]: {
    busy: [
      {
        start: string,
        end: string
      }
    ],
    errors?: any, // I don't know this type
  },
  error?: any, // I don't know this type
}