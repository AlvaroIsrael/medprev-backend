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

  /**
   * Checks if all parameters are present. If they are not undefined or null.
   * @param { personId, street, number, complement, district, city, state, zipCode }: IAddressRequest - Um objeto do
   * tipo IAddressRequest.
   * @returns boolean - False if one or more arguments are missing, otherwise return True.
   */
  private missingArguments = ({
    personId,
    street,
    number,
    complement,
    district,
    city,
    state,
    zipCode,
  }: IAddressRequest) => {
    return personId && street && number && complement && district && city && state && zipCode;
  };

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
    if (this.missingArguments({ personId, street, number, complement, district, city, state, zipCode })) {
      throw new AppError('Invalid request.');
    }

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

    const { isValidAddress, error } = address.isValid();

    if (!isValidAddress) {
      throw new AppError(error);
    }

    const personExists = await this.peopleRepository.findById(personId);

    if (!personExists) {
      throw new AppError('This person does not exist.');
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
