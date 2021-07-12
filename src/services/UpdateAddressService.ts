import PeopleRepository from '../repositories/PeopleRepository';
import AppError from '../errors/AppError';
import AddressesRepository from '../repositories/AddressesRepository';
import { IAddressRequest } from '../interfaces/IAddressRequest';

type IAddressResponse = {
  success: boolean;
};

class UpdateAddressService {
  private addressesRepository: AddressesRepository;

  private peopleRepository: PeopleRepository;

  constructor(addressesRepository: AddressesRepository, peopleRepository: PeopleRepository) {
    this.addressesRepository = addressesRepository;
    this.peopleRepository = peopleRepository;
  }

  public execute = async ({
    addressId,
    personId,
    street,
    number,
    complement,
    district,
    city,
    state,
    zipCode,
  }: IAddressRequest): Promise<IAddressResponse> => {
    if (!addressId) {
      throw new AppError('Address not found');
    }

    const addressExists = await this.addressesRepository.findOneById(addressId);

    if (!addressExists) {
      throw new AppError('Address not found');
    }

    if (!personId) {
      throw new AppError('Person not found');
    }

    const personExists = await this.peopleRepository.findOneById(personId);

    if (!personExists) {
      throw new AppError('Person not found');
    }

    const address = await this.addressesRepository.findOne(addressId, personId);

    if (!address) {
      throw new AppError('Address not found');
    }

    const { isValidAddress, error } = address.isValid();

    if (!isValidAddress) {
      throw new AppError(error);
    }

    const updateSuccessful = await this.addressesRepository.update({
      addressId,
      personId,
      street,
      number,
      complement,
      district,
      city,
      state,
      zipCode,
    });

    return { success: !!updateSuccessful };
  };
}

export default UpdateAddressService;
