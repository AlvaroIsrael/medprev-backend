import { IPersonRequest } from './IPersonRequest';
import { IPersonUpdateRequest } from './IPersonUpdateRequest';

export interface IPerson {
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
    sex,
    birthDate,
  }: IPersonRequest): void;

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
    sex,
    birthDate,
  }: IPersonUpdateRequest): void;

  isValid(): Promise<{ isValidPerson: boolean; error: string }>;
}
