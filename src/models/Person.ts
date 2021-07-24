import { IPerson } from '../interfaces/IPerson';
import { IPersonRequest } from '../interfaces/IPersonRequest';
import Address from './Address';
import { IPersonUpdateRequest } from '../interfaces/IPersonUpdateRequest';

abstract class Person implements IPerson {
  personId: string;

  kind: 'legal' | 'natural';

  role: 'admin' | 'default';

  document: string;

  documentName: 'cpf' | 'cnpj';

  name: string;

  email: string;

  password?: string;

  landlinePhoneNumber: string;

  mobilePhoneNumber: string;

  avatarUrl: string;

  createdAt: Date;

  updatedAt: Date;

  addresses: Address[];

  abstract isValid(): Promise<{ isValidPerson: boolean; error: string }>;

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

  abstract createWithId({
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
  }: IPersonUpdateRequest): void;
}

export default Person;
