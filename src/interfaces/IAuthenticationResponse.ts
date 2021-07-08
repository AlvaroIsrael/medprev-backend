import Person from '../models/Person';

export type IAuthenticationResponse = {
  user: Person;
  token: string;
};
