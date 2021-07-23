import { StatusCodes } from 'http-status-codes';
import UpdatePersonService from '../services/UpdatePersonService';
import AppError from '../errors/AppError';
import PeopleRepository from '../repositories/PeopleRepository';
import { IPersonRequest } from '../interfaces/IPersonRequest';
import PersonRegistry from '../services/PersonRegistry';
import LegalPerson from '../models/LegalPerson';
import NaturalPerson from '../models/NaturalPerson';

type IPersonTestRequest = {
  personId?: string;
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
let updatePersonService: UpdatePersonService;

describe('UpdatePersonService', () => {
  beforeEach(() => {
    genericLegalPerson = {
      personId: '1',
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
      personId: '1',
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
    updatePersonService = new UpdatePersonService(peopleRepository, personRegistry);
  });

  it('should return error 400 if [personId] parameter is empty.', async () => {
    delete genericLegalPerson.personId;

    try {
      await updatePersonService.execute(genericLegalPerson);
    } catch (e) {
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('Person not found');
    }
  });

  it('should return error 400 if person does not exist in the database.', async () => {
    const findOneByIdStub = jest
      .spyOn(peopleRepository, 'findOneById')
      .mockImplementation(async () => peopleRepository.findOneById(genericLegalPerson.personId))
      .mockReturnValue(Promise.resolve(null));

    try {
      await updatePersonService.execute(genericLegalPerson);
    } catch (e) {
      expect(findOneByIdStub).toHaveBeenCalledTimes(1);
      expect(findOneByIdStub).toHaveBeenCalledWith(genericLegalPerson.personId);
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('Person not found');
    }
  });

  it('should return error 400 if [kind] parameter from person is invalid.', async () => {
    const legalPersonCreated: LegalPerson = new LegalPerson();
    legalPersonCreated.create(legalPerson);

    const findOneByIdStub = jest
      .spyOn(peopleRepository, 'findOneById')
      .mockImplementation(async () => peopleRepository.findOneById(genericLegalPerson.personId))
      .mockReturnValue(Promise.resolve(legalPersonCreated));

    const getPersonSpy = jest
      .spyOn(personRegistry, 'getPerson')
      .mockImplementation(() => personRegistry.getPerson(legalPerson))
      .mockImplementation(() => {
        throw new AppError('Invalid person kind');
      });

    try {
      await updatePersonService.execute(genericLegalPerson);
    } catch (e) {
      expect(findOneByIdStub).toHaveBeenCalledTimes(1);
      expect(findOneByIdStub).toHaveBeenCalledWith(genericLegalPerson.personId);
      expect(getPersonSpy).toHaveBeenCalledTimes(1);
      expect(getPersonSpy).toHaveBeenCalledWith(legalPerson);
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('Invalid person kind');
    }
  });

  it('should return error 400 if [role] parameter is invalid.', async () => {
    genericLegalPerson = { ...genericLegalPerson, role: 'wrong_person_role' };
    const legalPersonCreated: LegalPerson = new LegalPerson();
    legalPersonCreated.create(genericLegalPerson);

    const findOneByIdStub = jest
      .spyOn(peopleRepository, 'findOneById')
      .mockImplementation(async () => peopleRepository.findOneById(genericLegalPerson.personId))
      .mockReturnValue(Promise.resolve(legalPersonCreated));

    const getPersonSpy = jest
      .spyOn(personRegistry, 'getPerson')
      .mockImplementation(() => personRegistry.getPerson(genericLegalPerson))
      .mockReturnValue(legalPersonCreated);

    try {
      await updatePersonService.execute(genericLegalPerson);
    } catch (e) {
      expect(findOneByIdStub).toHaveBeenCalledTimes(1);
      expect(findOneByIdStub).toHaveBeenCalledWith(genericLegalPerson.personId);
      expect(getPersonSpy).toHaveBeenCalledTimes(1);
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('"role" must be one of [admin, default]');
    }
  });

  it('should return error 400 if [email] parameter is not an email.', async () => {
    genericLegalPerson = { ...genericLegalPerson, email: 'dude this is not an email!' };
    const legalPersonCreated: LegalPerson = new LegalPerson();
    legalPersonCreated.create(genericLegalPerson);

    const findOneByIdStub = jest
      .spyOn(peopleRepository, 'findOneById')
      .mockImplementation(async () => peopleRepository.findOneById(genericLegalPerson.personId))
      .mockReturnValue(Promise.resolve(legalPersonCreated));

    const getPersonSpy = jest
      .spyOn(personRegistry, 'getPerson')
      .mockImplementation(() => personRegistry.getPerson(genericLegalPerson))
      .mockReturnValue(legalPersonCreated);

    try {
      await updatePersonService.execute(genericLegalPerson);
    } catch (e) {
      expect(findOneByIdStub).toHaveBeenCalledTimes(1);
      expect(findOneByIdStub).toHaveBeenCalledWith(genericLegalPerson.personId);
      expect(getPersonSpy).toHaveBeenCalledTimes(1);
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('"email" must be a valid email');
    }
  });

  it('should return error 400 if [name] parameter has more than 100 characters.', async () => {
    genericLegalPerson = {
      ...genericLegalPerson,
      name:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. ' +
        'Tum sociis natoque penatibus et magnis dis parturient.',
    };
    const legalPersonCreated: LegalPerson = new LegalPerson();
    legalPersonCreated.create(genericLegalPerson);

    const findOneByIdStub = jest
      .spyOn(peopleRepository, 'findOneById')
      .mockImplementation(async () => peopleRepository.findOneById(genericLegalPerson.personId))
      .mockReturnValue(Promise.resolve(legalPersonCreated));

    const getPersonSpy = jest
      .spyOn(personRegistry, 'getPerson')
      .mockImplementation(() => personRegistry.getPerson(genericLegalPerson))
      .mockReturnValue(legalPersonCreated);

    try {
      await updatePersonService.execute(genericLegalPerson);
    } catch (e) {
      expect(findOneByIdStub).toHaveBeenCalledTimes(1);
      expect(findOneByIdStub).toHaveBeenCalledWith(genericLegalPerson.personId);
      expect(getPersonSpy).toHaveBeenCalledTimes(1);
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('"name" length must be less than or equal to 100 characters long');
    }
  });

  it('should return error 400 if [name] parameter has less than 3 characters.', async () => {
    genericLegalPerson = { ...genericLegalPerson, name: 'Lo' };
    const legalPersonCreated: LegalPerson = new LegalPerson();
    legalPersonCreated.create(genericLegalPerson);

    const findOneByIdStub = jest
      .spyOn(peopleRepository, 'findOneById')
      .mockImplementation(async () => peopleRepository.findOneById(genericLegalPerson.personId))
      .mockReturnValue(Promise.resolve(legalPersonCreated));

    const getPersonSpy = jest
      .spyOn(personRegistry, 'getPerson')
      .mockImplementation(() => personRegistry.getPerson(genericLegalPerson))
      .mockReturnValue(legalPersonCreated);

    try {
      await updatePersonService.execute(genericLegalPerson);
    } catch (e) {
      expect(findOneByIdStub).toHaveBeenCalledTimes(1);
      expect(findOneByIdStub).toHaveBeenCalledWith(genericLegalPerson.personId);
      expect(getPersonSpy).toHaveBeenCalledTimes(1);
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('"name" length must be at least 3 characters long');
    }
  });

  it('should return error 400 if [password] parameter has less than 3 characters.', async () => {
    genericLegalPerson = { ...genericLegalPerson, password: 'Lo' };
    const legalPersonCreated: LegalPerson = new LegalPerson();
    legalPersonCreated.create(genericLegalPerson);

    const findOneByIdStub = jest
      .spyOn(peopleRepository, 'findOneById')
      .mockImplementation(async () => peopleRepository.findOneById(genericLegalPerson.personId))
      .mockReturnValue(Promise.resolve(legalPersonCreated));

    const getPersonSpy = jest
      .spyOn(personRegistry, 'getPerson')
      .mockImplementation(() => personRegistry.getPerson(genericLegalPerson))
      .mockReturnValue(legalPersonCreated);

    try {
      await updatePersonService.execute(genericLegalPerson);
    } catch (e) {
      expect(findOneByIdStub).toHaveBeenCalledTimes(1);
      expect(findOneByIdStub).toHaveBeenCalledWith(genericLegalPerson.personId);
      expect(getPersonSpy).toHaveBeenCalledTimes(1);
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('"password" length must be at least 3 characters long');
    }
  });

  it('should return error 400 if [avatarUrl] is an invalid uri.', async () => {
    genericLegalPerson = { ...genericLegalPerson, avatarUrl: 'dude this is not an uri, see rfc 3986' };
    const legalPersonCreated: LegalPerson = new LegalPerson();
    legalPersonCreated.create(genericLegalPerson);

    const findOneByIdStub = jest
      .spyOn(peopleRepository, 'findOneById')
      .mockImplementation(async () => peopleRepository.findOneById(genericLegalPerson.personId))
      .mockReturnValue(Promise.resolve(legalPersonCreated));

    const getPersonSpy = jest
      .spyOn(personRegistry, 'getPerson')
      .mockImplementation(() => personRegistry.getPerson(genericLegalPerson))
      .mockReturnValue(legalPersonCreated);

    try {
      await updatePersonService.execute(genericLegalPerson);
    } catch (e) {
      expect(findOneByIdStub).toHaveBeenCalledTimes(1);
      expect(findOneByIdStub).toHaveBeenCalledWith(genericLegalPerson.personId);
      expect(getPersonSpy).toHaveBeenCalledTimes(1);
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('"avatarUrl" must be a valid uri');
    }
  });

  it('should return error 400 if [landlinePhoneNumber] parameter is not valid.', async () => {
    genericLegalPerson = { ...genericLegalPerson, landlinePhoneNumber: 'This is not a valid landlinePhoneNumber!' };
    const legalPersonCreated: LegalPerson = new LegalPerson();
    legalPersonCreated.create(genericLegalPerson);

    const findOneByIdStub = jest
      .spyOn(peopleRepository, 'findOneById')
      .mockImplementation(async () => peopleRepository.findOneById(genericLegalPerson.personId))
      .mockReturnValue(Promise.resolve(legalPersonCreated));

    const getPersonSpy = jest
      .spyOn(personRegistry, 'getPerson')
      .mockImplementation(() => personRegistry.getPerson(genericLegalPerson))
      .mockReturnValue(legalPersonCreated);

    try {
      await updatePersonService.execute(genericLegalPerson);
    } catch (e) {
      expect(findOneByIdStub).toHaveBeenCalledTimes(1);
      expect(findOneByIdStub).toHaveBeenCalledWith(genericLegalPerson.personId);
      expect(getPersonSpy).toHaveBeenCalledTimes(1);
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('"landlinePhoneNumber" must be formatted like 55 44 3333-3333 or 3333-3333');
    }
  });

  it('should return error 400 if [mobilePhoneNumber] parameter is not valid.', async () => {
    genericLegalPerson = { ...genericLegalPerson, mobilePhoneNumber: 'This is not a valid mobilePhoneNumber!' };
    const legalPersonCreated: LegalPerson = new LegalPerson();
    legalPersonCreated.create(genericLegalPerson);

    const findOneByIdStub = jest
      .spyOn(peopleRepository, 'findOneById')
      .mockImplementation(async () => peopleRepository.findOneById(genericLegalPerson.personId))
      .mockReturnValue(Promise.resolve(legalPersonCreated));

    const getPersonSpy = jest
      .spyOn(personRegistry, 'getPerson')
      .mockImplementation(() => personRegistry.getPerson(genericLegalPerson))
      .mockReturnValue(legalPersonCreated);

    try {
      await updatePersonService.execute(genericLegalPerson);
    } catch (e) {
      expect(findOneByIdStub).toHaveBeenCalledTimes(1);
      expect(findOneByIdStub).toHaveBeenCalledWith(genericLegalPerson.personId);
      expect(getPersonSpy).toHaveBeenCalledTimes(1);
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('"mobilePhoneNumber" must be formatted like 77 88 99999-9999 or 99999-9999');
    }
  });

  describe('LegalPerson', () => {
    it('should return error 400 if [corporateName] parameter has more than 100 characters.', async () => {
      genericLegalPerson = {
        ...genericLegalPerson,
        corporateName:
          'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. ' +
          'Aenean massa. Tum sociis natoque penatibus et magnis dis parturient.',
      };
      const legalPersonCreated: LegalPerson = new LegalPerson();
      legalPersonCreated.create(genericLegalPerson);

      const findOneByIdStub = jest
        .spyOn(peopleRepository, 'findOneById')
        .mockImplementation(async () => peopleRepository.findOneById(genericLegalPerson.personId))
        .mockReturnValue(Promise.resolve(legalPersonCreated));

      const getPersonSpy = jest
        .spyOn(personRegistry, 'getPerson')
        .mockImplementation(() => personRegistry.getPerson(genericLegalPerson))
        .mockReturnValue(legalPersonCreated);

      try {
        await updatePersonService.execute(genericLegalPerson);
      } catch (e) {
        expect(findOneByIdStub).toHaveBeenCalledTimes(1);
        expect(findOneByIdStub).toHaveBeenCalledWith(genericLegalPerson.personId);
        expect(getPersonSpy).toHaveBeenCalledTimes(1);
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('"corporateName" length must be less than or equal to 100 characters long');
      }
    });

    it('should return error 400 if [corporateName] parameter has less than 3 characters.', async () => {
      genericLegalPerson = { ...genericLegalPerson, corporateName: 'Lo' };
      const legalPersonCreated: LegalPerson = new LegalPerson();
      legalPersonCreated.create(genericLegalPerson);

      const findOneByIdStub = jest
        .spyOn(peopleRepository, 'findOneById')
        .mockImplementation(async () => peopleRepository.findOneById(genericLegalPerson.personId))
        .mockReturnValue(Promise.resolve(legalPersonCreated));

      const getPersonSpy = jest
        .spyOn(personRegistry, 'getPerson')
        .mockImplementation(() => personRegistry.getPerson(genericLegalPerson))
        .mockReturnValue(legalPersonCreated);

      try {
        await updatePersonService.execute(genericLegalPerson);
      } catch (e) {
        expect(findOneByIdStub).toHaveBeenCalledTimes(1);
        expect(findOneByIdStub).toHaveBeenCalledWith(genericLegalPerson.personId);
        expect(getPersonSpy).toHaveBeenCalledTimes(1);
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('"corporateName" length must be at least 3 characters long');
      }
    });

    it('should return error 400 if [document] parameter is not a valid cnpj.', async () => {
      genericLegalPerson = { ...genericLegalPerson, document: 'dude this is not a valid document!' };
      const legalPersonCreated: LegalPerson = new LegalPerson();
      legalPersonCreated.create(genericLegalPerson);

      const findOneByIdStub = jest
        .spyOn(peopleRepository, 'findOneById')
        .mockImplementation(async () => peopleRepository.findOneById(genericLegalPerson.personId))
        .mockReturnValue(Promise.resolve(legalPersonCreated));

      const getPersonSpy = jest
        .spyOn(personRegistry, 'getPerson')
        .mockImplementation(() => personRegistry.getPerson(genericLegalPerson))
        .mockReturnValue(legalPersonCreated);

      try {
        await updatePersonService.execute(genericLegalPerson);
      } catch (e) {
        expect(findOneByIdStub).toHaveBeenCalledTimes(1);
        expect(findOneByIdStub).toHaveBeenCalledWith(genericLegalPerson.personId);
        expect(getPersonSpy).toHaveBeenCalledTimes(1);
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual(
          '"document" failed custom validation because it is not in the correct format or is invalid',
        );
      }
    });

    it('should be able to update a legal person from the database.', async () => {
      const legalPersonCreated: LegalPerson = new LegalPerson();
      legalPersonCreated.create(genericLegalPerson);

      const findOneByIdStub = jest
        .spyOn(peopleRepository, 'findOneById')
        .mockImplementation(async () => peopleRepository.findOneById(genericLegalPerson.personId))
        .mockReturnValue(Promise.resolve(legalPersonCreated));

      const getPersonSpy = jest
        .spyOn(personRegistry, 'getPerson')
        .mockImplementation(() => personRegistry.getPerson(genericLegalPerson))
        .mockReturnValue(legalPersonCreated);

      const updatedPersonSpy = jest
        .spyOn(peopleRepository, 'update')
        .mockImplementation(async () => peopleRepository.update(genericLegalPerson))
        .mockReturnValue(Promise.resolve(1));

      const updatedPerson = await updatePersonService.execute(genericLegalPerson);

      expect(findOneByIdStub).toHaveBeenCalledTimes(1);
      expect(findOneByIdStub).toHaveBeenCalledWith(genericLegalPerson.personId);

      expect(getPersonSpy).toHaveBeenCalledTimes(1);
      expect(updatedPersonSpy).toHaveBeenCalledTimes(1);

      expect(updatedPerson).toHaveProperty('success');
      expect(updatedPerson).toEqual({ success: true });
    });
  });

  describe('NaturalPerson', () => {
    it('should return error 400 if [document] parameter is not a valid cpf.', async () => {
      genericNaturalPerson = { ...genericNaturalPerson, document: 'dude this is not a valid document!' };
      const naturalPersonCreated: NaturalPerson = new NaturalPerson();
      naturalPersonCreated.create(genericNaturalPerson);

      const findOneByIdStub = jest
        .spyOn(peopleRepository, 'findOneById')
        .mockImplementation(async () => peopleRepository.findOneById(genericNaturalPerson.personId))
        .mockReturnValue(Promise.resolve(naturalPersonCreated));

      const getPersonSpy = jest
        .spyOn(personRegistry, 'getPerson')
        .mockImplementation(() => personRegistry.getPerson(genericNaturalPerson))
        .mockReturnValue(naturalPersonCreated);

      try {
        await updatePersonService.execute(genericNaturalPerson);
      } catch (e) {
        expect(findOneByIdStub).toHaveBeenCalledTimes(1);
        expect(findOneByIdStub).toHaveBeenCalledWith(genericNaturalPerson.personId);
        expect(getPersonSpy).toHaveBeenCalledTimes(1);
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual(
          '"document" failed custom validation because it is not in the correct format or is invalid',
        );
      }
    });

    it('should return error 400 if [birthDate] parameter is not a valid date.', async () => {
      genericNaturalPerson = { ...genericNaturalPerson, birthDate: 'dude this is not a valid date!' };
      const naturalPersonCreated: NaturalPerson = new NaturalPerson();
      naturalPersonCreated.create(genericNaturalPerson);

      const findOneByIdStub = jest
        .spyOn(peopleRepository, 'findOneById')
        .mockImplementation(async () => peopleRepository.findOneById(genericNaturalPerson.personId))
        .mockReturnValue(Promise.resolve(naturalPersonCreated));

      const getPersonSpy = jest
        .spyOn(personRegistry, 'getPerson')
        .mockImplementation(() => personRegistry.getPerson(genericNaturalPerson))
        .mockReturnValue(naturalPersonCreated);

      try {
        await updatePersonService.execute(genericLegalPerson);
      } catch (e) {
        expect(findOneByIdStub).toHaveBeenCalledTimes(1);
        expect(findOneByIdStub).toHaveBeenCalledWith(genericNaturalPerson.personId);
        expect(getPersonSpy).toHaveBeenCalledTimes(1);
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual(
          '"birthDate" must be a valid date',
        );
      }
    });

    it('should return error 400 if [sex] parameter is invalid.', async () => {
      genericNaturalPerson = { ...genericNaturalPerson, sex: 'dude this is not a valid sex!' };
      const naturalPersonCreated: NaturalPerson = new NaturalPerson();
      naturalPersonCreated.create(genericNaturalPerson);

      const findOneByIdStub = jest
        .spyOn(peopleRepository, 'findOneById')
        .mockImplementation(async () => peopleRepository.findOneById(genericNaturalPerson.personId))
        .mockReturnValue(Promise.resolve(naturalPersonCreated));

      const getPersonSpy = jest
        .spyOn(personRegistry, 'getPerson')
        .mockImplementation(() => personRegistry.getPerson(genericNaturalPerson))
        .mockReturnValue(naturalPersonCreated);
      try {
        await updatePersonService.execute(genericNaturalPerson);
      } catch (e) {
        expect(findOneByIdStub).toHaveBeenCalledTimes(1);
        expect(findOneByIdStub).toHaveBeenCalledWith(genericNaturalPerson.personId);
        expect(getPersonSpy).toHaveBeenCalledTimes(1);
        expect(e).toBeInstanceOf(AppError);
        expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(e.message).toEqual('"sex" must be one of [masculine, feminine]');
      }
    });

    it('should be able to update a natural person from the database.', async () => {
      const naturalPersonCreated: NaturalPerson = new NaturalPerson();
      naturalPersonCreated.create(genericNaturalPerson);

      const findOneByIdStub = jest
        .spyOn(peopleRepository, 'findOneById')
        .mockImplementation(async () => peopleRepository.findOneById(genericNaturalPerson.personId))
        .mockReturnValue(Promise.resolve(naturalPersonCreated));

      const getPersonSpy = jest
        .spyOn(personRegistry, 'getPerson')
        .mockImplementation(() => personRegistry.getPerson(genericNaturalPerson))
        .mockReturnValue(naturalPersonCreated);

      const updatedPersonSpy = jest
        .spyOn(peopleRepository, 'update')
        .mockImplementation(async () => peopleRepository.update(genericNaturalPerson))
        .mockReturnValue(Promise.resolve(1));

      const updatedPerson = await updatePersonService.execute(genericNaturalPerson);

      expect(findOneByIdStub).toHaveBeenCalledTimes(1);
      expect(findOneByIdStub).toHaveBeenCalledWith(genericNaturalPerson.personId);

      expect(getPersonSpy).toHaveBeenCalledTimes(1);
      expect(updatedPersonSpy).toHaveBeenCalledTimes(1);

      expect(updatedPerson).toHaveProperty('success');
      expect(updatedPerson).toEqual({ success: true });
    });
  });
});
