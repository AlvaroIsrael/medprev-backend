import { StatusCodes } from 'http-status-codes';
import CreateAddressService from '../services/CreateAddressService';
import AppError from '../errors/AppError';
import AddressesRepository from '../repositories/AddressesRepository';
import PeopleRepository from '../repositories/PeopleRepository';
import { IAddressRequest } from '../interfaces/IAddressRequest';

let peopleRepository: PeopleRepository;
let createAddressService: CreateAddressService;
let addressesRepository: AddressesRepository;
let address: IAddressRequest;

describe('CreateAddressService', () => {
  beforeEach(() => {
    address = {
      personId: '3',
      street: 'Engenheiro Costa Barros',
      number: 100,
      complement: 'Apto 1',
      district: 'Cajuru',
      city: 'Curitiba',
      state: 'Paraná',
      zipCode: '80995-530',
    };
    addressesRepository = new AddressesRepository();
    peopleRepository = new PeopleRepository();
    createAddressService = new CreateAddressService(addressesRepository, peopleRepository);
  });

  it('should return error 400 if [personId] parameter is empty.', async () => {
    address = { ...address, personId: '' };

    try {
      await createAddressService.execute(address);
    } catch (e) {
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('"personId" is not allowed to be empty');
    }
  });

  it('should return error 400 if [street] parameter is empty.', async () => {
    address = { ...address, street: '' };

    try {
      await createAddressService.execute(address);
    } catch (e) {
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('"street" is not allowed to be empty');
    }
  });

  it('should return error 400 if [street] has more than 150 characters.', async () => {
    address = {
      ...address,
      street:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.' +
        'Mum sociis natoque penatibus et magnis dis partur. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
    };

    try {
      await createAddressService.execute(address);
    } catch (e) {
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('"street" length must be less than or equal to 150 characters long');
    }
  });

  it('should return error 400 if [number] parameter is not positive.', async () => {
    address = { ...address, number: -1 };

    try {
      await createAddressService.execute(address);
    } catch (e) {
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('"number" must be a positive number');
    }
  });

  it('should return error 400 if [complement] parameter is empty.', async () => {
    address = { ...address, complement: '' };

    try {
      await createAddressService.execute(address);
    } catch (e) {
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('"complement" is not allowed to be empty');
    }
  });

  it('should return error 400 if [complement] has more than 150 characters.', async () => {
    address = {
      ...address,
      complement:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.' +
        'Mum sociis natoque penatibus et magnis dis partur. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
    };

    try {
      await createAddressService.execute(address);
    } catch (e) {
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('"complement" length must be less than or equal to 150 characters long');
    }
  });

  it('should return error 400 if [district] parameter is empty.', async () => {
    address = { ...address, district: '' };

    try {
      await createAddressService.execute(address);
    } catch (e) {
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('"district" is not allowed to be empty');
    }
  });

  it('should return error 400 if [district] has more than 150 characters.', async () => {
    address = {
      ...address,
      district:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.' +
        'Mum sociis natoque penatibus et magnis dis partur. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
    };

    try {
      await createAddressService.execute(address);
    } catch (e) {
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('"district" length must be less than or equal to 150 characters long');
    }
  });

  it('should return error 400 if [city] parameter is empty.', async () => {
    address = { ...address, city: '' };

    try {
      await createAddressService.execute(address);
    } catch (e) {
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('"city" is not allowed to be empty');
    }
  });

  it('should return error 400 if [city] has more than 50 characters.', async () => {
    address = {
      ...address,
      city:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.' +
        'Mum sociis natoque penatibus et magnis dis partur. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
    };

    try {
      await createAddressService.execute(address);
    } catch (e) {
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('"city" length must be less than or equal to 50 characters long');
    }
  });

  it('should return error 400 if [state] parameter is empty.', async () => {
    address = { ...address, state: '' };

    try {
      await createAddressService.execute(address);
    } catch (e) {
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('"state" is not allowed to be empty');
    }
  });

  it('should return error 400 if [state] has more than 50 characters.', async () => {
    address = {
      ...address,
      state:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.' +
        'Mum sociis natoque penatibus et magnis dis partur. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
    };

    try {
      await createAddressService.execute(address);
    } catch (e) {
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('"state" length must be less than or equal to 50 characters long');
    }
  });

  it('should return error 400 if [zipCode] parameter is empty.', async () => {
    address = { ...address, zipCode: '' };

    try {
      await createAddressService.execute(address);
    } catch (e) {
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('"zipCode" must be formatted like 99999-999');
    }
  });

  it('should return error 400 if [personId] is invalid.', async () => {
    const findByIdStub = jest
      .spyOn(peopleRepository, 'findById')
      .mockImplementation(async () => peopleRepository.findById(address.personId))
      .mockReturnValue(Promise.resolve(null));

    try {
      await createAddressService.execute(address);
    } catch (e) {
      expect(findByIdStub).toHaveBeenCalledTimes(1);
      expect(findByIdStub).toHaveBeenCalledWith(address.personId);
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('This person does not exist');
    }
  });

  it('should return error 400 if [personId] is null.', async () => {
    const findByIdStub = jest.spyOn(peopleRepository, 'findById').mockReturnValue(Promise.resolve(null));

    try {
      await createAddressService.execute(address);
    } catch (e) {
      expect(findByIdStub).toHaveBeenCalledTimes(1);
      expect(findByIdStub).toHaveBeenCalledWith(address.personId);
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('This person does not exist');
    }
  });

  it('should return error 400 if [address] already exists in the database.', async () => {
    const existsStub = jest
      .spyOn(addressesRepository, 'exists')
      .mockImplementation(async () => addressesRepository.exists(address))
      .mockReturnValue(Promise.resolve(true));

    try {
      await createAddressService.execute(address);
    } catch (e) {
      expect(existsStub).toHaveBeenCalledTimes(1);
      expect(existsStub).toHaveBeenCalledWith(address);
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('This address already exists for this person');
    }
  });

  it('should be able to save the [address] in the database and return the newly created [addressId].', async () => {
    const findByIdStub = jest
      .spyOn(peopleRepository, 'findById')
      .mockImplementation(async () => peopleRepository.findById(address.personId))
      .mockReturnValue(Promise.resolve({ personId: parseInt(address.personId, 10) }));

    const existsStub = jest
      .spyOn(addressesRepository, 'exists')
      .mockImplementation(async () => addressesRepository.exists(address))
      .mockReturnValue(Promise.resolve(false));

    const addressesRepositoryStub = jest
      .spyOn(addressesRepository, 'create')
      .mockImplementation(async () => addressesRepository.create(address))
      .mockReturnValue(Promise.resolve(1));

    const savedAddress = await createAddressService.execute(address);

    expect(findByIdStub).toHaveBeenCalledTimes(1);
    expect(findByIdStub).toHaveBeenCalledWith(address.personId);

    expect(existsStub).toHaveBeenCalledTimes(1);
    expect(existsStub).toHaveBeenCalledWith(address);

    expect(addressesRepositoryStub).toHaveBeenCalledTimes(1);
    expect(addressesRepositoryStub).toHaveBeenCalledWith(address);

    expect(savedAddress).toHaveProperty('addressId');
    expect(savedAddress).toEqual({ addressId: 1 });
  });
});
