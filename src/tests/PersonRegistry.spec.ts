import { StatusCodes } from 'http-status-codes';
import AppError from '../errors/AppError';
import { IPersonRequest } from '../interfaces/IPersonRequest';
import PersonRegistry from '../services/PersonRegistry';
import Person from '../models/Person';
import NatualPerson from '../models/NatualPerson';
import LegalPerson from '../models/LegalPerson';

let personRegistry: PersonRegistry;
let naturalPersonRequest: IPersonRequest;
let legalPersonRequest: IPersonRequest;

describe('PersonRegistry', () => {
  beforeEach(() => {
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
      sex: 'm',
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

  it('should return error 400 if person [kind] parameter is not mapped.', async () => {
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

  it('should be able to instanciate a natural person.', async () => {
    const person: Person = personRegistry.getPerson(naturalPersonRequest);

    expect(person).toBeInstanceOf(NatualPerson);
  });

  it('should be able to instanciate a legal person.', async () => {
    const person: Person = personRegistry.getPerson(legalPersonRequest);

    expect(person).toBeInstanceOf(LegalPerson);
  });
});
