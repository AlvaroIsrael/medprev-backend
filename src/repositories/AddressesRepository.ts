import Knex from 'knex';
import connection from '../database/connection';
import { IAddressRequest } from '../interfaces/IAddressRequest';
import Address from '../models/Address';

class AddressesRepository {
  private readonly connection: Knex;

  constructor() {
    this.connection = Knex(connection);
  }

  /* Find if address exists for a person. */
  public async exists({
    personId,
    street,
    number,
    complement,
    district,
    city,
    state,
    zipCode,
  }: IAddressRequest): Promise<boolean> {
    const addressExists = await this.connection('addresses')
      .select('addressId')
      .from('addresses')
      .where({
        personId,
        street,
        number,
        complement,
        district,
        city,
        state,
        zipCode,
      })
      .limit(1);

    return addressExists[0] !== undefined;
  }

  /* Creates a new address. */
  public async create({
    personId,
    street,
    number,
    complement,
    district,
    city,
    state,
    zipCode,
  }: IAddressRequest): Promise<number> {
    const addressId = await this.connection('addresses').insert({
      personId,
      street,
      number,
      complement,
      district,
      city,
      state,
      zipCode,
    });

    return addressId[0];
  }

  /* Find one address by its id. */
  public async findOneById(addressId: string): Promise<Address | null> {
    const addresses = await this.connection('addresses').select(['*']).from('addresses').where({ addressId }).limit(1);

    let address: Address | null = null;

    addresses.forEach(addressInDataBase => {
      const { personId, street, number, complement, district, city, state, zipCode } = addressInDataBase;

      address = new Address({
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
    });

    return address;
  }

  /* Find an address by its id and personId. */
  public async findOne(addressId: string, personId: string): Promise<Address | null> {
    const addresses = await this.connection('addresses')
      .select(['*'])
      .from('addresses')
      .where({ addressId, personId })
      .limit(1);

    let address: Address | null = null;

    addresses.forEach(addressInDataBase => {
      const { street, number, complement, district, city, state, zipCode } = addressInDataBase;

      address = new Address({
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
    });

    return address;
  }

  /* Updates an address. */
  public async update({
    addressId,
    personId,
    street,
    number,
    complement,
    district,
    city,
    state,
    zipCode,
  }: IAddressRequest): Promise<number> {
    return this.connection('addresses')
      .update({
        addressId,
        personId,
        street,
        number,
        complement,
        district,
        city,
        state,
        zipCode,
      })
      .where({ addressId, personId });
  }
}

export default AddressesRepository;
