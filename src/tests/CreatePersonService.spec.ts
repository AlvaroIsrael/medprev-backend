import { StatusCodes } from 'http-status-codes';
import CreatePersonService from '../services/CreatePersonService';
import AppError from '../errors/AppError';
import PeopleRepository from '../repositories/PeopleRepository';
import { IPersonRequest } from '../interfaces/IPersonRequest';
import PersonRegistry from '../services/PersonRegistry';
import LegalPerson from '../models/LegalPerson';
import NaturalPerson from '../models/NaturalPerson';

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
let genericNaturalPerson: IPersonTestRequest | any;
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

    genericNaturalPerson = {
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
      sex: 'masculine',
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

  it('should return error 400 if a person already exists in the database.', async () => {
    const legalPersonCreated: LegalPerson = new LegalPerson();
    legalPersonCreated.create(legalPerson);

    const getPersonSpy = jest
      .spyOn(personRegistry, 'getPerson')
      .mockImplementation(() => personRegistry.getPerson(legalPerson))
      .mockReturnValue(legalPersonCreated);

    const findByDocumentSpy = jest
      .spyOn(peopleRepository, 'findByDocument')
      .mockImplementation(() => peopleRepository.findByDocument(legalPersonCreated.document))
      .mockReturnValue(
        Promise.resolve({
          personId: 1,
          password: 'passwordhashverysecure!',
        }),
      );

    try {
      await createPersonService.execute(legalPerson);
    } catch (e) {
      expect(getPersonSpy).toHaveBeenCalledTimes(1);
      expect(findByDocumentSpy).toHaveBeenCalledTimes(1);
      expect(findByDocumentSpy).toHaveBeenCalledWith(legalPersonCreated.document);
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('Person already registered');
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

    it('should return error 400 if [email] parameter is empty.', async () => {
      genericLegalPerson = { ...genericLegalPerson, email: '' };

      try {
        await createPersonService.execute(genericLegalPerson);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('"email" is not allowed to be empty');
      }
    });

    it('should return error 400 if [email] parameter has invalid domain.', async () => {
      genericLegalPerson = { ...genericLegalPerson, email: 'corporate@gmail' };

      try {
        await createPersonService.execute(genericLegalPerson);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('"email" must be a valid email');
      }
    });

    it('should return error 400 if [email] parameter is not an email.', async () => {
      genericLegalPerson = { ...genericLegalPerson, email: 'dude this is not an email!' };

      try {
        await createPersonService.execute(genericLegalPerson);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('"email" must be a valid email');
      }
    });

    it('should return error 400 if [password] is empty.', async () => {
      genericLegalPerson = { ...genericLegalPerson, password: '' };

      try {
        await createPersonService.execute(genericLegalPerson);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('"password" is not allowed to be empty');
      }
    });

    it('should return error 400 if [password] has less than 3 digits.', async () => {
      genericLegalPerson = { ...genericLegalPerson, password: '12' };

      try {
        await createPersonService.execute(genericLegalPerson);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('"password" length must be at least 3 characters long');
      }
    });

    it('should return error 400 if [avatarUrl] is an invalid uri.', async () => {
      genericLegalPerson = { ...genericLegalPerson, avatarUrl: 'dude this is not an uri, see rfc 3986' };

      try {
        await createPersonService.execute(genericLegalPerson);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('"avatarUrl" must be a valid uri');
      }
    });

    it('should return error 400 if [landlinePhoneNumber] is not valid.', async () => {
      genericLegalPerson = { ...genericLegalPerson, landlinePhoneNumber: 'dude this is not a valid number' };

      try {
        await createPersonService.execute(genericLegalPerson);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('"landlinePhoneNumber" must be formatted like 55 44 3333-3333 or 3333-3333');
      }
    });

    it('should return error 400 if [mobilePhoneNumber] is not valid.', async () => {
      genericLegalPerson = { ...genericLegalPerson, mobilePhoneNumber: 'dude this is not a valid number' };

      try {
        await createPersonService.execute(genericLegalPerson);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('"mobilePhoneNumber" must be formatted like 77 88 99999-9999 or 99999-9999');
      }
    });

    it('should be able to save the [person] in the database and return the newly created [personId].', async () => {
      const legalPersonCreated: LegalPerson = new LegalPerson();
      legalPersonCreated.create(legalPerson);

      const getPersonSpy = jest
        .spyOn(personRegistry, 'getPerson')
        .mockImplementation(() => personRegistry.getPerson(legalPerson))
        .mockReturnValue(legalPersonCreated);

      const findByDocumentSpy = jest
        .spyOn(peopleRepository, 'findByDocument')
        .mockImplementation(() => peopleRepository.findByDocument(legalPersonCreated.document))
        .mockReturnValue(Promise.resolve(null));

      const createPersonSpy = jest
        .spyOn(peopleRepository, 'create')
        .mockImplementation(() => peopleRepository.create(legalPerson))
        .mockReturnValue(Promise.resolve(1));

      const savedPerson = await createPersonService.execute(legalPerson);

      expect(getPersonSpy).toHaveBeenCalledTimes(1);
      expect(getPersonSpy).toHaveBeenCalledWith(legalPerson);

      expect(findByDocumentSpy).toHaveBeenCalledTimes(1);
      expect(findByDocumentSpy).toHaveBeenCalledWith(legalPersonCreated.document);

      expect(createPersonSpy).toHaveBeenCalledTimes(1);

      expect(savedPerson).toHaveProperty('personId');
      expect(savedPerson).toEqual({ personId: 1 });
    });
  });

  describe('NaturalPerson', () => {
    it('should return error 400 if [role] parameter is not provided.', async () => {
      delete genericNaturalPerson.role;

      try {
        await createPersonService.execute(genericNaturalPerson);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('"role" is required');
      }
    });

    it('should return error 400 if [role] parameter is not [admin or default].', async () => {
      genericNaturalPerson = { ...genericNaturalPerson, role: 'wrong_role' };

      try {
        await createPersonService.execute(genericNaturalPerson);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('"role" must be one of [admin, default]');
      }
    });

    it('should return error 400 if [document] parameter is empty.', async () => {
      genericNaturalPerson = { ...genericNaturalPerson, document: '' };

      try {
        await createPersonService.execute(genericNaturalPerson);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('"document" is not allowed to be empty');
      }
    });

    it('should return error 400 if [document] parameter is not a valid cnpj.', async () => {
      genericNaturalPerson = { ...genericNaturalPerson, document: 'wrong_role' };

      try {
        await createPersonService.execute(genericNaturalPerson);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual(
          '"document" failed custom validation because it is not in the correct format or is invalid',
        );
      }
    });

    it('should return error 400 if [document] parameter does not contain only numbers.', async () => {
      genericNaturalPerson = { ...genericNaturalPerson, document: '10aa266987' };

      try {
        await createPersonService.execute(genericNaturalPerson);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual(
          '"document" failed custom validation because it is not in the correct format or is invalid',
        );
      }
    });

    it('should return error 400 if [document] parameter does not have exactly 11 digits.', async () => {
      genericNaturalPerson = { ...genericNaturalPerson, document: '15205311096' };

      try {
        await createPersonService.execute(genericNaturalPerson);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual(
          '"document" failed custom validation because it is not in the correct format or is invalid',
        );
      }
    });

    it('should return error 400 if [name] parameter is empty.', async () => {
      genericNaturalPerson = { ...genericNaturalPerson, name: '' };

      try {
        await createPersonService.execute(genericNaturalPerson);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('"name" is not allowed to be empty');
      }
    });

    it('should return error 400 if [name] parameter has less than 3 digits.', async () => {
      genericNaturalPerson = { ...genericNaturalPerson, name: 'cn' };

      try {
        await createPersonService.execute(genericNaturalPerson);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('"name" length must be at least 3 characters long');
      }
    });

    it('should return error 400 if [name] parameter has more than 100 characters.', async () => {
      genericNaturalPerson = {
        ...genericNaturalPerson,
        name:
          'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.' +
          'Mum sociis natoque penatibus et magnis dis partur. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
      };
      try {
        await createPersonService.execute(genericNaturalPerson);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('"name" length must be less than or equal to 100 characters long');
      }
    });

    it('should return error 400 if [email] parameter is empty.', async () => {
      genericNaturalPerson = { ...genericNaturalPerson, email: '' };

      try {
        await createPersonService.execute(genericNaturalPerson);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('"email" is not allowed to be empty');
      }
    });

    it('should return error 400 if [email] parameter has invalid domain.', async () => {
      genericNaturalPerson = { ...genericNaturalPerson, email: 'corporate@gmail' };

      try {
        await createPersonService.execute(genericNaturalPerson);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('"email" must be a valid email');
      }
    });

    it('should return error 400 if [email] parameter is not an email.', async () => {
      genericNaturalPerson = { ...genericNaturalPerson, email: 'dude this is not an email!' };

      try {
        await createPersonService.execute(genericNaturalPerson);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('"email" must be a valid email');
      }
    });

    it('should return error 400 if [password] is empty.', async () => {
      genericNaturalPerson = { ...genericNaturalPerson, password: '' };

      try {
        await createPersonService.execute(genericNaturalPerson);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('"password" is not allowed to be empty');
      }
    });

    it('should return error 400 if [password] has less than 3 digits.', async () => {
      genericNaturalPerson = { ...genericNaturalPerson, password: '12' };

      try {
        await createPersonService.execute(genericNaturalPerson);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('"password" length must be at least 3 characters long');
      }
    });

    it('should return error 400 if [avatarUrl] is an invalid uri.', async () => {
      genericNaturalPerson = { ...genericNaturalPerson, avatarUrl: 'dude this is not an uri, see rfc 3986' };

      try {
        await createPersonService.execute(genericNaturalPerson);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('"avatarUrl" must be a valid uri');
      }
    });

    it('should return error 400 if [landlinePhoneNumber] is not valid.', async () => {
      genericNaturalPerson = { ...genericNaturalPerson, landlinePhoneNumber: 'dude this is not a valid number' };

      try {
        await createPersonService.execute(genericNaturalPerson);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('"landlinePhoneNumber" must be formatted like 55 44 3333-3333 or 3333-3333');
      }
    });

    it('should return error 400 if [mobilePhoneNumber] is not valid.', async () => {
      genericNaturalPerson = { ...genericNaturalPerson, mobilePhoneNumber: 'dude this is not a valid number' };

      try {
        await createPersonService.execute(genericNaturalPerson);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('"mobilePhoneNumber" must be formatted like 77 88 99999-9999 or 99999-9999');
      }
    });

    it('should be able to save the [person] in the database and return the newly created [personId].', async () => {
      const natualPersonCreated: NaturalPerson = new NaturalPerson();
      natualPersonCreated.create(naturalPerson);

      const getPersonSpy = jest
        .spyOn(personRegistry, 'getPerson')
        .mockImplementation(() => personRegistry.getPerson(naturalPerson))
        .mockReturnValue(natualPersonCreated);

      const findByDocumentSpy = jest
        .spyOn(peopleRepository, 'findByDocument')
        .mockImplementation(() => peopleRepository.findByDocument(natualPersonCreated.document))
        .mockReturnValue(Promise.resolve(null));

      const createPersonSpy = jest
        .spyOn(peopleRepository, 'create')
        .mockImplementation(() => peopleRepository.create(naturalPerson))
        .mockReturnValue(Promise.resolve(1));

      const savedPerson = await createPersonService.execute(naturalPerson);

      expect(getPersonSpy).toHaveBeenCalledTimes(1);
      expect(getPersonSpy).toHaveBeenCalledWith(naturalPerson);

      expect(findByDocumentSpy).toHaveBeenCalledTimes(1);
      expect(findByDocumentSpy).toHaveBeenCalledWith(natualPersonCreated.document);

      expect(createPersonSpy).toHaveBeenCalledTimes(1);

      expect(savedPerson).toHaveProperty('personId');
      expect(savedPerson).toEqual({ personId: 1 });
    });
  });
});
