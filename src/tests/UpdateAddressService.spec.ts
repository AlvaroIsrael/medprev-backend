import { StatusCodes } from 'http-status-codes';
import UpdateAddressService from '../services/UpdateAddressService';
import AppError from '../errors/AppError';
import AddressesRepository from '../repositories/AddressesRepository';
import PeopleRepository from '../repositories/PeopleRepository';
import { IAddressRequest } from '../interfaces/IAddressRequest';
import Address from '../models/Address';
import { IPersonRequest } from '../interfaces/IPersonRequest';
import LegalPerson from '../models/LegalPerson';

type IAddressTestRequest = {
  addressId?: string;
  personId?: string;
  street?: string;
  number?: number;
  complement?: string;
  district?: string;
  city?: string;
  state?: string;
  zipCode?: string;
};

let peopleRepository: PeopleRepository;
let updateAddressService: UpdateAddressService;
let addressesRepository: AddressesRepository;
let address: IAddressRequest;
let legalPerson: IPersonRequest;
let genericAddress: IAddressTestRequest | any;

describe('UpdateAddressService', () => {
  beforeEach(() => {
    genericAddress = {
      addressId: '1',
      personId: '3',
      street: 'Engenheiro Costa Barros',
      number: 100,
      complement: 'Apto 1',
      district: 'Cajuru',
      city: 'Curitiba',
      state: 'Paraná',
      zipCode: '80995-530',
    };
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
    addressesRepository = new AddressesRepository();
    peopleRepository = new PeopleRepository();
    updateAddressService = new UpdateAddressService(addressesRepository, peopleRepository);
  });

  it('should return error 400 if [addressId] parameter is empty.', async () => {
    delete genericAddress.addressId;

    try {
      await updateAddressService.execute(genericAddress);
    } catch (e) {
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('Address not found');
    }
  });

  it('should return error 400 if address does not exist in the database.', async () => {
    const findOneByIdStub = jest
      .spyOn(addressesRepository, 'findOneById')
      .mockImplementation(async () => addressesRepository.findOneById(genericAddress.addressId))
      .mockReturnValue(Promise.resolve(null));

    try {
      await updateAddressService.execute(genericAddress);
    } catch (e) {
      expect(findOneByIdStub).toHaveBeenCalledTimes(1);
      expect(findOneByIdStub).toHaveBeenCalledWith(genericAddress.addressId);
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('Address not found');
    }
  });

  it('should return error 400 if [personId] parameter is empty.', async () => {
    delete genericAddress.personId;

    try {
      await updateAddressService.execute(genericAddress);
    } catch (e) {
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('Person not found');
    }
  });

  it('should return error 400 if person does not exist in the database.', async () => {
    const findOneByIdStub = jest
      .spyOn(peopleRepository, 'findOneById')
      .mockImplementation(async () => peopleRepository.findOneById(genericAddress.personId))
      .mockReturnValue(Promise.resolve(null));

    try {
      await updateAddressService.execute(genericAddress);
    } catch (e) {
      expect(findOneByIdStub).toHaveBeenCalledTimes(1);
      expect(findOneByIdStub).toHaveBeenCalledWith(genericAddress.personId);
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('Person not found');
    }
  });

  it('should return error 400 if address does not exist for that person in the database.', async () => {
    const findOneStub = jest
      .spyOn(addressesRepository, 'findOne')
      .mockImplementation(async () => addressesRepository.findOne(genericAddress.addressId, genericAddress.personId))
      .mockReturnValue(Promise.resolve(null));

    try {
      await updateAddressService.execute(genericAddress);
    } catch (e) {
      expect(findOneStub).toHaveBeenCalledTimes(1);
      expect(findOneStub).toHaveBeenCalledWith(genericAddress.addressId, genericAddress.personId);
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('Address not found');
    }
  });

  it('should return error 400 if [street] parameter has more than 150 characters.', async () => {
    address = {
      ...address,
      addressId: '1',
      street:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.' +
        'Um sociis natoque penatibus et magnis dis parturient.',
    };

    const addressResponse = new Address(address);

    const findOneStub = jest
      .spyOn(addressesRepository, 'findOne')
      .mockImplementation(async () => addressesRepository.findOne('1', address.personId))
      .mockReturnValue(Promise.resolve(addressResponse));

    try {
      await updateAddressService.execute(address);
    } catch (e) {
      expect(findOneStub).toHaveBeenCalledTimes(1);
      expect(findOneStub).toHaveBeenCalledWith('1', address.personId);
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('"street" length must be less than or equal to 150 characters long');
    }
  });

  it('should return error 400 if [number] parameter is not a positive number.', async () => {
    address = {
      ...address,
      addressId: '1',
      number: -1,
    };

    const addressResponse = new Address(address);

    const findOneStub = jest
      .spyOn(addressesRepository, 'findOne')
      .mockImplementation(async () => addressesRepository.findOne('1', address.personId))
      .mockReturnValue(Promise.resolve(addressResponse));

    try {
      await updateAddressService.execute(address);
    } catch (e) {
      expect(findOneStub).toHaveBeenCalledTimes(1);
      expect(findOneStub).toHaveBeenCalledWith('1', address.personId);
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('"number" must be a positive number');
    }
  });

  it('should return error 400 if [complement] parameter has more than 150 characters.', async () => {
    address = {
      ...address,
      addressId: '1',
      complement:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean ' +
        'massa. Cum sociis natoque penatibus et magnis dis parturient.',
    };

    const addressResponse = new Address(address);

    const findOneStub = jest
      .spyOn(addressesRepository, 'findOne')
      .mockImplementation(async () => addressesRepository.findOne('1', address.personId))
      .mockReturnValue(Promise.resolve(addressResponse));

    try {
      await updateAddressService.execute(address);
    } catch (e) {
      expect(findOneStub).toHaveBeenCalledTimes(1);
      expect(findOneStub).toHaveBeenCalledWith('1', address.personId);
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('"complement" length must be less than or equal to 150 characters long');
    }
  });

  it('should return error 400 if [district] parameter has more than 150 characters.', async () => {
    address = {
      ...address,
      addressId: '1',
      district:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean ' +
        'massa. Cum sociis natoque penatibus et magnis dis parturient.',
    };

    const addressResponse = new Address(address);

    const findOneStub = jest
      .spyOn(addressesRepository, 'findOne')
      .mockImplementation(async () => addressesRepository.findOne('1', address.personId))
      .mockReturnValue(Promise.resolve(addressResponse));

    try {
      await updateAddressService.execute(address);
    } catch (e) {
      expect(findOneStub).toHaveBeenCalledTimes(1);
      expect(findOneStub).toHaveBeenCalledWith('1', address.personId);
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('"district" length must be less than or equal to 150 characters long');
    }
  });

  it('should return error 400 if [district] parameter has more than 150 characters.', async () => {
    address = { ...address, addressId: '1', district: '' };

    const addressResponse = new Address(address);

    const findOneStub = jest
      .spyOn(addressesRepository, 'findOne')
      .mockImplementation(async () => addressesRepository.findOne('1', address.personId))
      .mockReturnValue(Promise.resolve(addressResponse));

    try {
      await updateAddressService.execute(address);
    } catch (e) {
      expect(findOneStub).toHaveBeenCalledTimes(1);
      expect(findOneStub).toHaveBeenCalledWith('1', address.personId);
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('"district" is not allowed to be empty');
    }
  });

  it('should return error 400 if [city] parameter has more than 50 characters.', async () => {
    address = {
      ...address,
      addressId: '1',
      city:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean ' +
        'massa. Cum sociis natoque penatibus et magnis dis parturient.',
    };

    const addressResponse = new Address(address);

    const findOneStub = jest
      .spyOn(addressesRepository, 'findOne')
      .mockImplementation(async () => addressesRepository.findOne('1', address.personId))
      .mockReturnValue(Promise.resolve(addressResponse));

    try {
      await updateAddressService.execute(address);
    } catch (e) {
      expect(findOneStub).toHaveBeenCalledTimes(1);
      expect(findOneStub).toHaveBeenCalledWith('1', address.personId);
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('"city" length must be less than or equal to 50 characters long');
    }
  });

  it('should return error 400 if [city] parameter is empty.', async () => {
    address = { ...address, addressId: '1', city: '' };

    const addressResponse = new Address(address);

    const findOneStub = jest
      .spyOn(addressesRepository, 'findOne')
      .mockImplementation(async () => addressesRepository.findOne('1', address.personId))
      .mockReturnValue(Promise.resolve(addressResponse));

    try {
      await updateAddressService.execute(address);
    } catch (e) {
      expect(findOneStub).toHaveBeenCalledTimes(1);
      expect(findOneStub).toHaveBeenCalledWith('1', address.personId);
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('"city" is not allowed to be empty');
    }
  });

  it('should return error 400 if [state] parameter has more than 50 characters.', async () => {
    address = {
      ...address,
      addressId: '1',
      state:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean ' +
        'massa. Cum sociis natoque penatibus et magnis dis parturient.',
    };

    const addressResponse = new Address(address);

    const findOneStub = jest
      .spyOn(addressesRepository, 'findOne')
      .mockImplementation(async () => addressesRepository.findOne('1', address.personId))
      .mockReturnValue(Promise.resolve(addressResponse));

    try {
      await updateAddressService.execute(address);
    } catch (e) {
      expect(findOneStub).toHaveBeenCalledTimes(1);
      expect(findOneStub).toHaveBeenCalledWith('1', address.personId);
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('"state" length must be less than or equal to 50 characters long');
    }
  });

  it('should return error 400 if [state] parameter is empty.', async () => {
    address = { ...address, addressId: '1', state: '' };

    const addressResponse = new Address(address);

    const findOneStub = jest
      .spyOn(addressesRepository, 'findOne')
      .mockImplementation(async () => addressesRepository.findOne('1', address.personId))
      .mockReturnValue(Promise.resolve(addressResponse));

    try {
      await updateAddressService.execute(address);
    } catch (e) {
      expect(findOneStub).toHaveBeenCalledTimes(1);
      expect(findOneStub).toHaveBeenCalledWith('1', address.personId);
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('"state" is not allowed to be empty');
    }
  });

  it('should be able to update an address from the database.', async () => {
    address = { ...address, addressId: '1' };

    const addressResponse = new Address(address);
    const legalPersonCreated: LegalPerson = new LegalPerson();
    legalPersonCreated.create(legalPerson);

    const findOneAddressByIdStub = jest
      .spyOn(addressesRepository, 'findOneById')
      .mockImplementation(async () => addressesRepository.findOneById(genericAddress.addressId))
      .mockReturnValue(Promise.resolve(addressResponse));

    const findOnePersonByIdStub = jest
      .spyOn(peopleRepository, 'findOneById')
      .mockImplementation(async () => peopleRepository.findOneById(genericAddress.personId))
      .mockReturnValue(Promise.resolve(legalPersonCreated));

    const findOneStub = jest
      .spyOn(addressesRepository, 'findOne')
      .mockImplementation(async () => addressesRepository.findOne('1', address.personId))
      .mockReturnValue(Promise.resolve(addressResponse));

    const updateAddressSpy = jest
      .spyOn(addressesRepository, 'update')
      .mockImplementation(async () => addressesRepository.update(address))
      .mockReturnValue(Promise.resolve(1));

    const updatedAddress = await updateAddressService.execute(address);

    expect(findOneAddressByIdStub).toHaveBeenCalledTimes(1);
    expect(findOneAddressByIdStub).toHaveBeenCalledWith(genericAddress.addressId);

    expect(findOnePersonByIdStub).toHaveBeenCalledTimes(1);
    expect(findOnePersonByIdStub).toHaveBeenCalledWith(genericAddress.personId);

    expect(findOneStub).toHaveBeenCalledTimes(1);
    expect(findOneStub).toHaveBeenCalledWith('1', address.personId);

    expect(updateAddressSpy).toHaveBeenCalledTimes(1);

    expect(updatedAddress).toHaveProperty('success');
    expect(updatedAddress).toEqual({ success: true });
  });
});
