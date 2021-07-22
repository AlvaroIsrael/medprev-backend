import naturalPersonSchema from '../helpers/naturalPerson.schema';
import Person from './Person';
import { IPersonRequest } from '../interfaces/IPersonRequest';

class NaturalPerson extends Person {
  sex: 'masculine' | 'feminine';

  birthDate: Date;

  public isValid = async (): Promise<{ isValidPerson: boolean; error: string }> => {
    const validation = await naturalPersonSchema.validate({
      kind: this.kind,
      role: this.role,
      document: this.document,
      name: this.name,
      email: this.email,
      password: this.password,
      landlinePhoneNumber: this.landlinePhoneNumber,
      mobilePhoneNumber: this.mobilePhoneNumber,
      avatarUrl: this.avatarUrl,
      sex: this.sex,
      birthDate: this.birthDate,
    });
    return { isValidPerson: !validation.error, error: validation.error?.message ?? '' };
  };

  create({
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
  }: IPersonRequest): void {
    this.kind = kind;
    this.role = role;
    this.document = document;
    this.documentName = 'cpf';
    this.name = name;
    this.email = email;
    this.password = password;
    this.landlinePhoneNumber = landlinePhoneNumber;
    this.mobilePhoneNumber = mobilePhoneNumber;
    this.avatarUrl = avatarUrl;
    this.sex = sex;
    this.birthDate = birthDate;
  }
}

export default NaturalPerson;
