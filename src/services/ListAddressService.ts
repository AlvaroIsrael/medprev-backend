import Address from 'models/Address';
import AddressesRepository from 'repositories/AddressesRepository';
import { IListRequest } from '../interfaces/IListRequest';

class ListAddressService {
  private addressesRepository: AddressesRepository;

  constructor(addressesRepository: AddressesRepository) {
    this.addressesRepository = addressesRepository;
  }

  public async execute({ page, pageLimit }: IListRequest): Promise<Address[]> {
    return this.addressesRepository.all({ page, pageLimit });
  }
}

export default ListAddressService;
