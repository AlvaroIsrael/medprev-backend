import { StatusCodes } from 'http-status-codes';
import CreatePersonService from '../services/CreatePersonService';
import AppError from '../errors/AppError';
import PeopleRepository from '../repositories/PeopleRepository';
import { IPersonRequest } from '../interfaces/IPersonRequest';
import PersonRegistry from '../services/PersonRegistry';

let legalPerson: IPersonRequest;
let naturalPerson: IPersonRequest;
let personRegistry: PersonRegistry;
let peopleRepository: PeopleRepository;
let createPersonService: CreatePersonService;

describe('CreatePersonService', () => {
  beforeEach(() => {
    legalPerson = {
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

    naturalPerson = {
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

    personRegistry = new PersonRegistry();
    peopleRepository = new PeopleRepository();
    createPersonService = new CreatePersonService(peopleRepository, personRegistry);
  });

  it('should return error 400 if [kind] parameter is invalid.', async () => {
    const getPersonSpy = jest
      .spyOn(personRegistry, 'getPerson')
      .mockImplementation(() => personRegistry.getPerson(legalPerson))
      .mockImplementation(() => {
        throw new AppError('Invalid person kind');
      });

    try {
      await createPersonService.execute(legalPerson);
    } catch (e) {
      expect(getPersonSpy).toHaveBeenCalledTimes(1);
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('Invalid person kind');
    }
  });
});
