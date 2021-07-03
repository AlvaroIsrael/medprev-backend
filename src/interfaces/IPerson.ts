import { IPersonRequest } from './IPersonRequest';

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

  isValid(): { isValidPerson: boolean; error: string };
}
