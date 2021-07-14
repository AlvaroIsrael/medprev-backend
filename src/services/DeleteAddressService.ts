import AddressesRepository from 'repositories/AddressesRepository';
import AppError from '../errors/AppError';

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
      throw new AppError('"addressId" is not allowed to be empty');
    }

    const addressExists = await this.addressesRepository.findOneById(addressId);

    if (!addressExists) {
      throw new AppError('address not found');
    }

    const deleteSuccessful = await this.addressesRepository.delete(addressId);

    return { success: !!deleteSuccessful };
  }
}

export default DeleteAdressService;
