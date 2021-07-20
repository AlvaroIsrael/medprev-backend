import ListPersonService from '../services/ListPersonService';
import Person from '../models/Person';
import PeopleRepository from '../repositories/PeopleRepository';
import { IPersonRequest } from '../interfaces/IPersonRequest';
import NaturalPerson from '../models/NaturalPerson';

let peopleRepository: PeopleRepository;
let listPersonService: ListPersonService;
let naturalPerson: IPersonRequest;

describe('ListPersonService', () => {
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
    listPersonService = new ListPersonService(peopleRepository);
  });

  it('should return null if there is no person to list.', async () => {
    const peopleRepositorySpy = jest
      .spyOn(peopleRepository, 'findOneById')
      .mockImplementation(async () => peopleRepository.findOneById('1'))
      .mockReturnValue(Promise.resolve(null));

    const addresses = await listPersonService.execute({ personId: '1' });

    expect(peopleRepositorySpy).toHaveBeenCalledTimes(1);
    expect(peopleRepositorySpy).toHaveBeenCalledWith('1');

    expect(addresses).toBeNull();
  });

  it('should return a person without password showing up.', async () => {
    const personResponse: Person = new NaturalPerson();
    personResponse.create(naturalPerson);
    delete personResponse.password;

    const peopleRepositorySpy = jest
      .spyOn(peopleRepository, 'findOneById')
      .mockImplementation(async () => peopleRepository.findOneById('1'))
      .mockReturnValue(Promise.resolve(personResponse));

    const addresses = await listPersonService.execute({ personId: '1' });

    expect(peopleRepositorySpy).toHaveBeenCalledTimes(1);
    expect(peopleRepositorySpy).toHaveBeenCalledWith('1');

    expect(addresses).toStrictEqual(personResponse);
  });
});
