import legalPersonSchema from '../helpers/legalPerson.schema';
import Person from './Person';
import { IPersonRequest } from '../interfaces/IPersonRequest';
import { IPersonUpdateRequest } from '../interfaces/IPersonUpdateRequest';

class LegalPerson extends Person {
  corporateName: string;

  public isValid = async (): Promise<{ isValidPerson: boolean; error: string }> => {
    const validation = await legalPersonSchema.validate({
      kind: this.kind,
      role: this.role,
      document: this.document,
      corporateName: this.corporateName,
      name: this.name,
      email: this.email,
      password: this.password,
      landlinePhoneNumber: this.landlinePhoneNumber,
      mobilePhoneNumber: this.mobilePhoneNumber,
      avatarUrl: this.avatarUrl,
    });
    return { isValidPerson: !validation.error, error: validation.error?.message ?? '' };
  };

  create({
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
  }: IPersonRequest): void {
    this.kind = kind;
    this.role = role;
    this.document = document;
    this.documentName = 'cnpj';
    this.corporateName = corporateName;
    this.name = name;
    this.email = email;
    this.password = password;
    this.landlinePhoneNumber = landlinePhoneNumber;
    this.mobilePhoneNumber = mobilePhoneNumber;
    this.avatarUrl = avatarUrl;
  }

  createWithId({
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
  }: IPersonUpdateRequest): void {
    this.personId = personId;
    this.kind = kind;
    this.role = role;
    this.document = document;
    this.documentName = 'cnpj';
    this.corporateName = corporateName;
    this.name = name;
    this.email = email;
    this.password = password;
    this.landlinePhoneNumber = landlinePhoneNumber;
    this.mobilePhoneNumber = mobilePhoneNumber;
    this.avatarUrl = avatarUrl;
  }
}

export default LegalPerson;
