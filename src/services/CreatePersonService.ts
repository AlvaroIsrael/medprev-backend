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

  private personRegistry: PersonRegistry;

  constructor(peopleRepository: PeopleRepository, personRegistry: PersonRegistry) {
    this.peopleRepository = peopleRepository;
    this.personRegistry = personRegistry;
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
      person = this.personRegistry.getPerson({
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

    const { isValidPerson, error } = await person.isValid();

    if (!isValidPerson) {
      throw new AppError(error);
    }

    const personExists = await this.peopleRepository.findByDocument(document);

    if (personExists) {
      throw new AppError('Person already registered');
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
