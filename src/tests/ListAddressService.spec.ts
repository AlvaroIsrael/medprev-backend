import AddressesRepository from '../repositories/AddressesRepository';
import { IAddressRequest } from '../interfaces/IAddressRequest';
import ListAddressService from '../services/ListAddressService';
import Address from '../models/Address';
import { IListRequest } from '../interfaces/IListRequest';

let addressesRepository: AddressesRepository;
let listAddressService: ListAddressService;
let address: IAddressRequest;

describe('ListAddressService', () => {
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
    listAddressService = new ListAddressService(addressesRepository);
  });

  it('should return an empty array if there are no addresses to list.', async () => {
    const pagination: IListRequest = { page: 1, pageLimit: 1 };
    const addressesResponse: Address[] = [];

    const addressesRepositorySpy = jest
      .spyOn(addressesRepository, 'all')
      .mockImplementation(async () => addressesRepository.all(pagination))
      .mockReturnValue(Promise.resolve(addressesResponse));

    const addresses = await listAddressService.execute(pagination);

    expect(addressesRepositorySpy).toHaveBeenCalledTimes(1);
    expect(addressesRepositorySpy).toHaveBeenCalledWith(pagination);

    expect(addresses).toStrictEqual(addressesResponse);
  });

  it('should return an addresses array.', async () => {
    const pagination: IListRequest = { page: 1, pageLimit: 1 };
    const addressesResponse: Address[] = [];

    addressesResponse.push(new Address(address));

    const addressesRepositorySpy = jest
      .spyOn(addressesRepository, 'all')
      .mockImplementation(async () => addressesRepository.all(pagination))
      .mockReturnValue(Promise.resolve(addressesResponse));

    const addresses = await listAddressService.execute(pagination);

    expect(addressesRepositorySpy).toHaveBeenCalledTimes(1);
    expect(addressesRepositorySpy).toHaveBeenCalledWith(pagination);

    expect(addresses).toStrictEqual(addressesResponse);
  });
});
