import { StatusCodes } from 'http-status-codes';
import AppError from '../errors/AppError';
import AddressesRepository from '../repositories/AddressesRepository';
import { IAddressRequest } from '../interfaces/IAddressRequest';
import DeleteAdressService from '../services/DeleteAddressService';
import Address from '../models/Address';

let addressesRepository: AddressesRepository;
let deleteAddressService: DeleteAdressService;
let address: IAddressRequest;

describe('DeleteAddressService', () => {
  beforeEach(() => {
    address = {
      addressId: '2',
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
    deleteAddressService = new DeleteAdressService(addressesRepository);
  });

  it('should return error 400 if [addressId] parameter is empty.', async () => {
    try {
      await deleteAddressService.execute({ addressId: '' });
    } catch (e) {
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('"addressId" is not allowed to be empty');
    }
  });

  it('should return error 400 if [addressId] parameter does not exist in the database.', async () => {
    const addressId = '2';
    const addressesRepositorySpy = jest
      .spyOn(addressesRepository, 'findOneById')
      .mockImplementation(async () => addressesRepository.findOneById(addressId))
      .mockReturnValue(Promise.resolve(null));

    try {
      await deleteAddressService.execute({ addressId });
    } catch (e) {
      expect(addressesRepositorySpy).toHaveBeenCalledTimes(1);
      expect(addressesRepositorySpy).toHaveBeenCalledWith(addressId);
      expect(e).toBeInstanceOf(AppError);
      expect(e.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(e.message).toEqual('address not found');
    }
  });

  it('should be able to delete the [address] from the database.', async () => {
    const addressId = '2';
    const addressesRepositoryfindOneByIdSpy = jest
      .spyOn(addressesRepository, 'findOneById')
      .mockImplementation(async () => addressesRepository.findOneById(addressId))
      .mockReturnValue(Promise.resolve(new Address(address)));

    const addressesRepositoryDeleteSpy = jest
      .spyOn(addressesRepository, 'delete')
      .mockImplementation(async () => addressesRepository.delete(addressId))
      .mockReturnValue(Promise.resolve(1));

    const deletedAddress = await deleteAddressService.execute({ addressId });

    expect(addressesRepositoryfindOneByIdSpy).toHaveBeenCalledTimes(1);
    expect(addressesRepositoryfindOneByIdSpy).toHaveBeenCalledWith(addressId);

    expect(addressesRepositoryDeleteSpy).toHaveBeenCalledTimes(1);
    expect(addressesRepositoryDeleteSpy).toHaveBeenCalledWith(addressId);

    expect(deletedAddress).toHaveProperty('success');
    expect(deletedAddress).toEqual({ success: true });
  });
});
