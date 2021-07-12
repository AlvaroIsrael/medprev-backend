import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
// import ensureAuthenticated from '../middleares/ensureAuthenticated';
import CreateAddressService from '../services/CreateAddressService';
import PeopleRepository from '../repositories/PeopleRepository';
import AddressesRepository from '../repositories/AddressesRepository';
import UpdateAddressService from '../services/UpdateAddressService';

const peopleRepository = new PeopleRepository();
const addressesRepository = new AddressesRepository();
const createAddressService = new CreateAddressService(addressesRepository, peopleRepository);
const updateAddressService = new UpdateAddressService(addressesRepository, peopleRepository);

const addressesRouter = Router();

/* Creates an address. */
addressesRouter.post('/', async (request, response) => {
  const { personId, street, number, complement, district, city, state, zipCode } = request.body;
  let address;
  try {
    address = await createAddressService.execute({
      personId,
      street,
      number,
      complement,
      district,
      city,
      state,
      zipCode,
    });
  } catch (e) {
    return response.status(StatusCodes.NOT_FOUND).json({ erro: e.message });
  }

  return response.status(StatusCodes.OK).json({ ...address });
});

/* Updates an address. */
addressesRouter.patch('/:addressId', async (request, response) => {
  const { addressId } = request.params;
  const { personId, street, number, complement, district, city, state, zipCode } = request.body;

  try {
    await updateAddressService.execute({
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

    return response.status(StatusCodes.NO_CONTENT).json();
  } catch (e) {
    if (e.message === 'Only admin can update roles.') {
      return response.status(StatusCodes.UNAUTHORIZED).json({ erro: e.message });
    }
    return response.status(StatusCodes.BAD_REQUEST).json({ erro: e.message });
  }
});

export default addressesRouter;
