import AppError from '../errors/AppError';
import { IAddressRequest } from '../interfaces/IAddressRequest';
import Address from '../models/Address';
import AddressesRepository from '../repositories/AddressesRepository';
import PeopleRepository from '../repositories/PeopleRepository';

type IAddressResponse = {
  addressId: number;
};

class CreateAddressService {
  private addressesRepository: AddressesRepository;

  private peopleRepository: PeopleRepository;

  constructor(addressesRepository: AddressesRepository, peopleRepository: PeopleRepository) {
    this.addressesRepository = addressesRepository;
    this.peopleRepository = peopleRepository;
  }

  public execute = async ({
    personId,
    street,
    number,
    complement,
    district,
    city,
    state,
    zipCode,
  }: IAddressRequest): Promise<IAddressResponse> => {
    const address = new Address({
      personId,
      street,
      number,
      complement,
      district,
      city,
      state,
      zipCode,
    });

    const { isValidAddress, error } = await address.isValid();

    if (!isValidAddress) {
      throw new AppError(error);
    }

    const personExists = await this.peopleRepository.findById(address.personId.toString());

    if (!personExists) {
      throw new AppError('This person does not exist');
    }

    const addressExists = await this.addressesRepository.exists({
      personId,
      street,
      number,
      complement,
      district,
      city,
      state,
      zipCode,
    });

    if (addressExists) {
      throw new AppError('This address already exists for this person');
    }

    const addressId = await this.addressesRepository.create({
      personId,
      street,
      number,
      complement,
      district,
      city,
      state,
      zipCode,
    });
    return { addressId };
  };
}

export default CreateAddressService;
