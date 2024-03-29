import { StatusCodes } from 'http-status-codes';
import AppError from '../errors/AppError';
import { IPersonRequest } from '../interfaces/IPersonRequest';
import PersonRegistry from '../services/PersonRegistry';
import Person from '../models/Person';
import NaturalPerson from '../models/NaturalPerson';
import LegalPerson from '../models/LegalPerson';

type IPersonTestRequest = {
  kind?: string;
  role?: string;
  document?: string;
  corporateName?: string;
  documentName?: string;
  name?: string;
  email?: string;
  password?: string;
  landlinePhoneNumber?: string;
  mobilePhoneNumber?: string;
  avatarUrl?: string;
  sex?: string;
  birthDate?: Date;
};

let personRegistry: PersonRegistry;
let naturalPersonRequest: IPersonRequest;
let legalPersonRequest: IPersonRequest;
let genericPerson: IPersonTestRequest | any;

describe('PersonRegistry', () => {
  beforeEach(() => {
    genericPerson = {
      kind: 'wrongPersonType',
      role: 'admin',
      document: '02.032.729/0001-75',
      corporateName: 'my enterprize',
      name: 'manolo',
      email: 'manolo@gmail.com',
      password: 'mysupersecurepassword',
      landlinePhoneNumber: '55 31 3333-9999',
      mobilePhoneNumber: '55 31 99999-9999',
      avatarUrl: 'https://mysuper-url',
    };

    personRegistry = new PersonRegistry();

    naturalPersonRequest = {
      kind: 'natural',
      role: 'admin',
      document: '152.053.110-96',
      name: 'manolo',
      email: 'manolo@gmail.com',
      password: 'mysupersecurepassword',
      landlinePhoneNumber: '55 31 3333-9999',
      mobilePhoneNumber: '55 31 99999-9999',
      avatarUrl: 'https://mysuper-url',
      sex: 'masculine',
      birthDate: new Date('2020-12-05'),
    } as IPersonRequest;

    legalPersonRequest = {
      kind: 'legal',
      role: 'admin',
      document: '02.032.729/0001-75',
      corporateName: 'my enterprize',
      name: 'manolo',
      email: 'manolo@gmail.com',
      password: 'mysupersecurepassword',
      landlinePhoneNumber: '55 31 3333-9999',
      mobilePhoneNumber: '55 31 99999-9999',
      avatarUrl: 'https://mysuper-url',
    } as IPersonRequest;
  });

  it('should return error 400 if person [kind] parameter is not mapped.', () => {
    const instanciatePersonSpy = jest.spyOn(personRegistry, 'getPerson').mockImplementation(() => {
      throw new AppError('Invalid person kind');
    });

    try {
      personRegistry.getPerson(naturalPersonRequest);
    } catch (e) {
      expect(instanciatePersonSpy).toHaveBeenCalledTimes(1);
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('Invalid person kind');
    }
  });

  it('should return error 400 if person [kind] parameter is not mapped.', () => {
    try {
      personRegistry.getPerson(genericPerson);
    } catch (e) {
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('Invalid person kind');
    }
  });

  it('should be able to instanciate a natural person.', () => {
    const person: Person = personRegistry.getPerson(naturalPersonRequest);

    expect(person).toBeInstanceOf(NaturalPerson);
  });

  it('should be able to instanciate a legal person.', () => {
    const person: Person = personRegistry.getPerson(legalPersonRequest);

    expect(person).toBeInstanceOf(LegalPerson);
  });
});
