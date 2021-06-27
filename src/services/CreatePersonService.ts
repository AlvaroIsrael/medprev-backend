import { hash } from 'bcryptjs';
import Person from '../models/Person';
import PeopleRepository from '../repositories/PeopleRepository';
import PersonRegistry from './PersonRegistry';
import AppError from '../errors/AppError';
import { IPersonRequest } from '../interfaces/IPersonRequest';

type IPersonResponse = {
  personId: number;
};

class CreatePersonService {
  private peopleRepository: PeopleRepository;

  constructor(peopleRepository: PeopleRepository) {
    this.peopleRepository = peopleRepository;
  }

  public execute = async ({
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
  }: IPersonRequest): Promise<IPersonResponse> => {
    let person: Person;

    try {
      person = new PersonRegistry().getPerson({
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
    } catch (e) {
      throw new AppError(e.message);
    }

    const { isValidPerson, error } = person.isValid();

    if (!isValidPerson) {
      throw new AppError(error);
    }

    const personExists = await this.peopleRepository.findByDocument(document);

    if (personExists) {
      throw new AppError('Person already registered.');
    }

    const hashSalt = 8;
    const hashedPassword = await hash(password, hashSalt);

    const personId = await this.peopleRepository.create({
      kind,
      role,
      document,
      corporateName,
      name,
      email,
      password: hashedPassword,
      landlinePhoneNumber,
      mobilePhoneNumber,
      avatarUrl,
      sex,
      birthDate,
    });

    return { personId };
  };
}

export default CreatePersonService;
