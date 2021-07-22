import { IAddressRequest } from '../interfaces/IAddressRequest';
import addressSchema from '../helpers/address.schema';

class Address {
  addressId: string;

  personId: string;

  street: string;

  number: number;

  complement: string;

  district: string;

  city: string;

  state: string;

  zipCode: string;

  createdAt: Date;

  updatedAt: Date;

  constructor({ personId, street, number, complement, district, city, state, zipCode }: IAddressRequest) {
    this.personId = personId;
    this.street = street;
    this.number = number;
    this.complement = complement;
    this.district = district;
    this.city = city;
    this.state = state;
    this.zipCode = zipCode;
  }

  public isValid = async (): Promise<{ isValidAddress: boolean; error: string }> => {
    const validation = await addressSchema.validate({
      personId: this.personId,
      street: this.street,
      number: this.number,
      complement: this.complement,
      district: this.district,
      city: this.city,
      state: this.state,
      zipCode: this.zipCode,
    });
    return { isValidAddress: !validation.error, error: validation.error?.message ?? '' };
  };
}

export default Address;
