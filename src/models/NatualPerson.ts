import naturalPersonSchema from '../helpers/naturalPerson.schema';
import Person from './Person';
import { IPersonRequest } from '../interfaces/IPersonRequest';

class NatualPerson extends Person {
  sex: string;

  birthDate: Date;

  public isValid = (): { isValidPerson: boolean; error: string } => {
    const validation = naturalPersonSchema.validate({
      kind: this.kind,
      role: this.role,
      document: this.documentNumber,
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

export default NatualPerson;
