export interface CurrentUserInterface {
  id: number;
  sub: number;
  username: string;
  firstName: string;
  lastName: string;
  family_name: string;
  given_name: string;
  name: string;
  nickname: string;
  preferred_username: string;
  email: string;
  phone: string;
  groups: any;
  attachment: {
    id: number;
    name: string;
    originalName: string;
    link: string;
    link200: string;
    link48: string;
    link70: string;
  };
}
