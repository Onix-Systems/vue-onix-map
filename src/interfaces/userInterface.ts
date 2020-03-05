export interface UserInterface {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  firstNameRu: string;
  lastNameRu: string;
  email: string;
  phone: string;
  additionalPhone: string;
  gmailId: string;
  skypeId: string;
  gender: string;
  groups: any;
  isVacation: boolean;
  attachment: {
    id: number;
    name: string;
    originalName: string;
    link: string;
    link200: string;
    link48: string;
    link70: string;
  };
  workStartDate: string;
  birthDate: string;
  isActive: boolean;
  workPlace: string;
  tableNumber: string;
  skills: Array<{
    idNumber: number,
    id: string,
    name: string,
    description: string,
  }>;
  technologies: Array<{
    id: string,
    name: string,
    numberId: number,
  }>;
}
