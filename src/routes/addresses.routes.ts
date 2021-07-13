import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
// import ensureAuthenticated from '../middleares/ensureAuthenticated';
import ListAddressService from '../services/ListAddressService';
import CreateAddressService from '../services/CreateAddressService';
import PeopleRepository from '../repositories/PeopleRepository';
import AddressesRepository from '../repositories/AddressesRepository';
import UpdateAddressService from '../services/UpdateAddressService';
import DeleteAdressService from '../services/DeleteAddressService';

const peopleRepository = new PeopleRepository();
const addressesRepository = new AddressesRepository();
const createAddressService = new CreateAddressService(addressesRepository, peopleRepository);
const updateAddressService = new UpdateAddressService(addressesRepository, peopleRepository);
const deleteAddressService = new DeleteAdressService(addressesRepository);
const listAddressService = new ListAddressService(addressesRepository);

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

/* List all addressses. */
addressesRouter.get('/', async (request, response) => {
  const { page, pageLimit } = request.body;

  try {
    const addresses = await listAddressService.execute({ page, pageLimit });
    return response.status(StatusCodes.OK).json({ addresses });
  } catch (e) {
    return response.status(StatusCodes.NOT_FOUND).json({ erro: e.message });
  }
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

/* Deletes an address. */
addressesRouter.delete('/:addressId', async (request, response) => {
  const { addressId } = request.params;
  try {
    await deleteAddressService.execute({ addressId });
    return response.status(StatusCodes.NO_CONTENT).json();
  } catch (e) {
    if (e.message === 'Only admin can delete roles.') {
      return response.status(StatusCodes.UNAUTHORIZED).json({ erro: e.message });
    }
    return response.status(StatusCodes.BAD_REQUEST).json({ erro: e.message });
  }
});

export default addressesRouter;
