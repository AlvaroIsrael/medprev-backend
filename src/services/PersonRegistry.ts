import Person from '../models/Person';
import NaturalPerson from '../models/NaturalPerson';
import AppError from '../errors/AppError';
import LegalPerson from '../models/LegalPerson';
import { IPersonRequest } from '../interfaces/IPersonRequest';

class PersonRegistry {
  private people: Map<string, Person> = new Map<string, Person>();

  constructor() {
    this.people.set('legal', new LegalPerson());
    this.people.set('natural', new NaturalPerson());
  }

  private instanciatePerson = (kind: string): Person => {
    const person = this.people.get(kind);
    if (person === undefined) {
      throw new AppError('Invalid person kind');
    }
    return person;
  };

  public getPerson = ({
    kind,
    role,
    document,
    corporateName,
    name,
    email,
    password,
    landlinePhoneNumber,
    mobilePhoneNumber,
    avatarUrl,
    sex,
    birthDate,
  }: IPersonRequest): Person => {
    const person = this.instanciatePerson(kind);

    person.create({
      kind,
      role,
      document,
      corporateName,
      name,
      email,
      password,
      landlinePhoneNumber,
      mobilePhoneNumber,
      avatarUrl,
      sex,
      birthDate,
    });

    return person;
  };
}

export default PersonRegistry;
