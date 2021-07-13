import AddressesRepository from 'repositories/AddressesRepository';

interface IAddressRequest {
  addressId: string;
}

type IAddressResponse = {
  success: boolean;
};

class DeleteAdressService {
  private addressesRepository: AddressesRepository;

  constructor(addressesRepository: AddressesRepository) {
    this.addressesRepository = addressesRepository;
  }

  public async execute({ addressId }: IAddressRequest): Promise<IAddressResponse> {
    if (!addressId) {
      throw new Error('Address id is required');
    }

    const addressExists = await this.addressesRepository.findOneById(addressId);

    if (!addressExists) {
      throw new Error(`Address not found`);
    }

    const deleteSuccessful = await this.addressesRepository.delete(addressId);

    return { success: !!deleteSuccessful };
  }
}
export default DeleteAdressService;
