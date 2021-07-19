import ListPeopleService from '../services/ListPeopleService';
import Person from '../models/Person';
import { IListRequest } from '../interfaces/IListRequest';
import PeopleRepository from '../repositories/PeopleRepository';
import { IPersonRequest } from '../interfaces/IPersonRequest';
import NaturalPerson from '../models/NaturalPerson';

let peopleRepository: PeopleRepository;
let listAddressService: ListPeopleService;
let naturalPerson: IPersonRequest;

describe('ListPeopleService', () => {
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
    listAddressService = new ListPeopleService(peopleRepository);
  });

  it('should return an empty array if there are no people to list.', async () => {
    const pagination: IListRequest = { page: 1, pageLimit: 1 };
    const personResponse: Person[] = [];

    const addressesRepositorySpy = jest
      .spyOn(peopleRepository, 'all')
      .mockImplementation(async () => peopleRepository.all(pagination))
      .mockReturnValue(Promise.resolve(personResponse));

    const addresses = await listAddressService.execute(pagination);

    expect(addressesRepositorySpy).toHaveBeenCalledTimes(1);
    expect(addressesRepositorySpy).toHaveBeenCalledWith(pagination);

    expect(addresses).toStrictEqual(personResponse);
  });

  it('should return a people array without password showing up.', async () => {
    const pagination: IListRequest = { page: 1, pageLimit: 1 };
    const personResponse: Person[] = [];
    const natualPersonCreated: NaturalPerson = new NaturalPerson();
    natualPersonCreated.create(naturalPerson);
    delete natualPersonCreated.password;

    personResponse.push(natualPersonCreated);

    const addressesRepositorySpy = jest
      .spyOn(peopleRepository, 'all')
      .mockImplementation(async () => peopleRepository.all(pagination))
      .mockReturnValue(Promise.resolve(personResponse));

    const addresses = await listAddressService.execute(pagination);

    expect(addressesRepositorySpy).toHaveBeenCalledTimes(1);
    expect(addressesRepositorySpy).toHaveBeenCalledWith(pagination);

    expect(addresses).toStrictEqual(personResponse);
  });
});
