import Address from 'models/Address';
import AddressesRepository from 'repositories/AddressesRepository';

interface IAddressRequest {
  page: number;
  pageLimit: number;
}

class ListAddressService {
  private addressesRepository: AddressesRepository;

  constructor(addressesRepository: AddressesRepository) {
    this.addressesRepository = addressesRepository;
  }

  public async execute({ page, pageLimit }: IAddressRequest): Promise<Address[]> {
    return this.addressesRepository.all({ page, pageLimit });
  }
}

export default ListAddressService;
