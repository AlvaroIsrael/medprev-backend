import { StatusCodes } from 'http-status-codes';
import { hash } from 'bcryptjs';
import AuthenticateUserService from '../services/AuthenticateUserService';
import AppError from '../errors/AppError';
import PeopleRepository from '../repositories/PeopleRepository';
import { IAuthenticationRequest } from '../interfaces/IAuthenticationRequest';
import NaturalPerson from '../models/NaturalPerson';
import { IPersonRequest } from '../interfaces/IPersonRequest';
import Person from '../models/Person';

let peopleRepository: PeopleRepository;
let authenticateUserService: AuthenticateUserService;
let naturalPerson: IPersonRequest;

describe('AuthenticateUserService', () => {
  beforeEach(() => {
    peopleRepository = new PeopleRepository();
    authenticateUserService = new AuthenticateUserService(peopleRepository);
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
  });

  it('should return error 400 if [document] is empty.', async () => {
    const user: IAuthenticationRequest = { document: '', password: 'mysupersecurepassword' };

    const findOneSpy = jest
      .spyOn(peopleRepository, 'findOne')
      .mockImplementation(async () => peopleRepository.findOne(user.document))
      .mockReturnValue(Promise.resolve(null));

    try {
      await authenticateUserService.execute(user);
    } catch (e) {
      expect(findOneSpy).toHaveBeenCalledTimes(1);
      expect(findOneSpy).toHaveBeenCalledWith(user.document);
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('Incorrect email or password');
    }
  });

  it('should return error 400 if [document] does not exist in the database.', async () => {
    const user: IAuthenticationRequest = {
      document: `dude this is not a person's document`,
      password: 'mysupersecurepassword',
    };

    const findOneSpy = jest
      .spyOn(peopleRepository, 'findOne')
      .mockImplementation(async () => peopleRepository.findOne(user.document))
      .mockReturnValue(Promise.resolve(null));

    try {
      await authenticateUserService.execute(user);
    } catch (e) {
      expect(findOneSpy).toHaveBeenCalledTimes(1);
      expect(findOneSpy).toHaveBeenCalledWith(user.document);
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('Incorrect email or password');
    }
  });

  it('should return error 400 if [password] provided is somehow null.', async () => {
    const user: IAuthenticationRequest = { document: naturalPerson.document, password: '9w8e7rryqNo2' };

    const natualPersonCreated: Person = new NaturalPerson();
    natualPersonCreated.create(naturalPerson);
    delete natualPersonCreated.password;

    const findOneSpy = jest
      .spyOn(peopleRepository, 'findOne')
      .mockImplementation(async () => peopleRepository.findOne(user.document))
      .mockReturnValue(Promise.resolve(natualPersonCreated));

    try {
      await authenticateUserService.execute(user);
    } catch (e) {
      expect(findOneSpy).toHaveBeenCalledTimes(1);
      expect(findOneSpy).toHaveBeenCalledWith(user.document);
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('Incorrect email or password');
    }
  });

  it('should return error 400 if [password] provided is incorrect.', async () => {
    const user: IAuthenticationRequest = { document: naturalPerson.document, password: '9w8e7rryqNo2' };

    const natualPersonCreated: Person = new NaturalPerson();
    natualPersonCreated.create(naturalPerson);

    const findOneSpy = jest
      .spyOn(peopleRepository, 'findOne')
      .mockImplementation(async () => peopleRepository.findOne(user.document))
      .mockReturnValue(Promise.resolve(natualPersonCreated));

    try {
      await authenticateUserService.execute(user);
    } catch (e) {
      expect(findOneSpy).toHaveBeenCalledTimes(1);
      expect(findOneSpy).toHaveBeenCalledWith(user.document);
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('Incorrect email or password');
    }
  });

  it('should return the user with its access token.', async () => {
    const user: IAuthenticationRequest = { document: naturalPerson.document, password: naturalPerson.password };

    const naturalPersonCreated: NaturalPerson = new NaturalPerson();
    naturalPersonCreated.create(naturalPerson);

    const hashSalt = 8;
    naturalPersonCreated.personId = '1';
    naturalPersonCreated.password = await hash(naturalPerson.password, hashSalt);

    const findOneSpy = jest
      .spyOn(peopleRepository, 'findOne')
      .mockImplementation(async () => peopleRepository.findOne(user.document))
      .mockReturnValue(Promise.resolve(naturalPersonCreated));

    const authenticatedUser = await authenticateUserService.execute(user);

    expect(findOneSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).toHaveBeenCalledWith(user.document);
    expect(authenticatedUser).toHaveProperty('user');
    expect(authenticatedUser).toHaveProperty('token');
    expect(authenticatedUser.user).toBeInstanceOf(Person);
    expect(typeof authenticatedUser.token).toBe('string');
  });
});
