import { StatusCodes } from 'http-status-codes';
import CreatePersonService from '../services/CreatePersonService';
import AppError from '../errors/AppError';
import PeopleRepository from '../repositories/PeopleRepository';
import { IPersonRequest } from '../interfaces/IPersonRequest';
import PersonRegistry from '../services/PersonRegistry';

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

let genericLegalPerson: IPersonTestRequest | any;
let legalPerson: IPersonRequest;
let naturalPerson: IPersonRequest;
let personRegistry: PersonRegistry;
let peopleRepository: PeopleRepository;
let createPersonService: CreatePersonService;

describe('CreatePersonService', () => {
  beforeEach(() => {
    genericLegalPerson = {
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
    };

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

  describe('LegalPerson', () => {
    it('should return error 400 if [role] parameter is not provided.', async () => {
      delete genericLegalPerson.role;

      try {
        await createPersonService.execute(genericLegalPerson);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('"role" is required');
      }
    });

    it('should return error 400 if [role] parameter is not [admin or default].', async () => {
      genericLegalPerson = { ...genericLegalPerson, role: 'wrong_role' };

      try {
        await createPersonService.execute(genericLegalPerson);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('"role" must be one of [admin, default]');
      }
    });

    it('should return error 400 if [document] parameter is empty.', async () => {
      genericLegalPerson = { ...genericLegalPerson, document: '' };

      try {
        await createPersonService.execute(genericLegalPerson);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('"document" is not allowed to be empty');
      }
    });

    it('should return error 400 if [document] parameter is not a valid cnpj.', async () => {
      genericLegalPerson = { ...genericLegalPerson, document: 'wrong_role' };

      try {
        await createPersonService.execute(genericLegalPerson);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual(
          '"document" failed custom validation because it is not in the correct format or is invalid',
        );
      }
    });

    it('should return error 400 if [document] parameter does not contain only numbers.', async () => {
      genericLegalPerson = { ...genericLegalPerson, document: '10aa266987' };

      try {
        await createPersonService.execute(genericLegalPerson);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual(
          '"document" failed custom validation because it is not in the correct format or is invalid',
        );
      }
    });

    it('should return error 400 if [document] parameter does not have exactly 14 digits.', async () => {
      genericLegalPerson = { ...genericLegalPerson, document: '12312312311' };

      try {
        await createPersonService.execute(genericLegalPerson);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual(
          '"document" failed custom validation because it is not in the correct format or is invalid',
        );
      }
    });

    it('should return error 400 if [corporateName] parameter is empty.', async () => {
      genericLegalPerson = { ...genericLegalPerson, corporateName: '' };

      try {
        await createPersonService.execute(genericLegalPerson);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('"corporateName" is not allowed to be empty');
      }
    });

    it('should return error 400 if [corporateName] parameter has less than 3 digits.', async () => {
      genericLegalPerson = { ...genericLegalPerson, corporateName: 'cn' };

      try {
        await createPersonService.execute(genericLegalPerson);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('"corporateName" length must be at least 3 characters long');
      }
    });

    it('should return error 400 if [corporateName] parameter has more than 100 characters.', async () => {
      genericLegalPerson = {
        ...genericLegalPerson,
        corporateName:
          'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.' +
          'Mum sociis natoque penatibus et magnis dis partur. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
      };
      try {
        await createPersonService.execute(genericLegalPerson);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('"corporateName" length must be less than or equal to 100 characters long');
      }
    });
  });
});
