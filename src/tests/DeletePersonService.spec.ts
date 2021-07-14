import { StatusCodes } from 'http-status-codes';
import AppError from '../errors/AppError';
import DeletePersonService from '../services/DeletePersonService';
import PeopleRepository from '../repositories/PeopleRepository';
import { IPersonRequest } from '../interfaces/IPersonRequest';
import NaturalPerson from '../models/NaturalPerson';

let peopleRepository: PeopleRepository;
let deletePersonService: DeletePersonService;
let naturalPerson: IPersonRequest;

describe('DeletePersonService', () => {
  beforeEach(() => {
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
    peopleRepository = new PeopleRepository();
    deletePersonService = new DeletePersonService(peopleRepository);
  });

  it('should return error 400 if [personId] parameter is empty.', async () => {
    try {
      await deletePersonService.execute({ personId: '' });
    } catch (e) {
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('"personId" is not allowed to be empty');
    }
  });

  it('should return error 400 if [personId] parameter does not exist in the database.', async () => {
    const personId = '2';
    const peopleRepositorySpy = jest
      .spyOn(peopleRepository, 'findOneById')
      .mockImplementation(async () => peopleRepository.findOneById(personId))
      .mockReturnValue(Promise.resolve(null));

    try {
      await deletePersonService.execute({ personId });
    } catch (e) {
      expect(peopleRepositorySpy).toHaveBeenCalledTimes(1);
      expect(peopleRepositorySpy).toHaveBeenCalledWith(personId);
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('person not found');
    }
  });

  it('should be able to delete the [person] from the database.', async () => {
    const personId = '2';
    const natualPersonCreated: NaturalPerson = new NaturalPerson();
    natualPersonCreated.create(naturalPerson);

    const peopleRepositoryfindOneByIdSpy = jest
      .spyOn(peopleRepository, 'findOneById')
      .mockImplementation(async () => peopleRepository.findOneById(personId))
      .mockReturnValue(Promise.resolve(natualPersonCreated));

    const peopleRepositoryDeleteSpy = jest
      .spyOn(peopleRepository, 'delete')
      .mockImplementation(async () => peopleRepository.delete(personId))
      .mockReturnValue(Promise.resolve(1));

    const deletedPerson = await deletePersonService.execute({ personId });

    expect(peopleRepositoryfindOneByIdSpy).toHaveBeenCalledTimes(1);
    expect(peopleRepositoryfindOneByIdSpy).toHaveBeenCalledWith(personId);

    expect(peopleRepositoryDeleteSpy).toHaveBeenCalledTimes(1);
    expect(peopleRepositoryDeleteSpy).toHaveBeenCalledWith(personId);

    expect(deletedPerson).toHaveProperty('success');
    expect(deletedPerson).toEqual({ success: true });
  });
});
