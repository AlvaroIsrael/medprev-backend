import { IPerson } from '../interfaces/IPerson';
import { IPersonRequest } from '../interfaces/IPersonRequest';

abstract class Person implements IPerson {
  personId: string;

  kind: 'legal' | 'natural';

  role: 'admin' | 'default';

  documentNumber: string;

  documentName: 'cpf' | 'cnpj';

  name: string;

  email: string;

  password?: string;

  landlinePhoneNumber: string;

  mobilePhoneNumber: string;

  avatarUrl: string;

  createdAt: Date;

  updatedAt: Date;

  abstract isValid(): { isValidPerson: boolean; error: string };

  abstract create({
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
  }: IPersonRequest): void;
}

export default Person;
