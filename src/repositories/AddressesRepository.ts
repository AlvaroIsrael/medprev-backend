import Knex from 'knex';
import connection from '../database/connection';
import { IAddressRequest } from '../interfaces/IAddressRequest';

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
}

export default AddressesRepository;
