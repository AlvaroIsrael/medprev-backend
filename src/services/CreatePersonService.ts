import { hash } from 'bcryptjs';
import PeopleRepository from '../repositories/PeopleRepository';
import naturalPersonSchema from '../helpers/naturalPerson.schema';
import AppError from '../errors/AppError';
import legalPersonSchema from '../helpers/legalPerson.schema';

interface IPersonRequest {
  kind: string;
  role: string;
  document: string;
  corporateName: string;
  name: string;
  email: string;
  password: string;
  landlinePhoneNumber: string;
  mobilePhoneNumber: string;
  avatarUrl: string;
  sex: string;
  birthDate: string;
}

interface IPersonResponse {
  personId: string;
}

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
    let allFieldsAreValid;
    if (kind === 'legal') {
      allFieldsAreValid = await legalPersonSchema.validateAsync({
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
    } else {
      allFieldsAreValid = await naturalPersonSchema.validateAsync({
        kind,
        role,
        document,
        name,
        email,
        password,
        landlinePhoneNumber,
        mobilePhoneNumber,
        avatarUrl,
        sex,
        birthDate,
      });
    }

    if (!allFieldsAreValid) {
      throw new AppError(allFieldsAreValid);
    }

    const documentExists = await this.peopleRepository.findByDocument(document);

    if (documentExists) {
      throw new AppError('Document already registered.');
    }

    const hashedPassword = await hash(password, 8);

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

    return { personId: personId.toString() };
  };
}

export default CreatePersonService;
