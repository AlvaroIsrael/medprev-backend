import { hash } from 'bcryptjs';
import Person from '../models/Person';
import PeopleRepository from '../repositories/PeopleRepository';
import PersonRegistry from './PersonRegistry';
import AppError from '../errors/AppError';
import { IPersonRequest } from '../interfaces/IPersonRequest';

type IPersonResponse = {
  success: boolean;
};

class UpdatePersonService {
  private peopleRepository: PeopleRepository;

  private personRegistry: PersonRegistry;

  constructor(peopleRepository: PeopleRepository, personRegistry: PersonRegistry) {
    this.peopleRepository = peopleRepository;
    this.personRegistry = personRegistry;
  }

  public execute = async ({
    personId,
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
    if (!personId) {
      throw new AppError('Person not found');
    }

    const personExists = await this.peopleRepository.findOneById(personId);

    if (!personExists) {
      throw new AppError('Person not found');
    }

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

    const hashSalt = 8;
    const hashedPassword = await hash(password, hashSalt);

    const updateSuccessful = await this.peopleRepository.update({
      personId,
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

    return { success: !!updateSuccessful };
  };
}

export default UpdatePersonService;
