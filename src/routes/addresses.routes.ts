import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
// import ensureAuthenticated from '../middleares/ensureAuthenticated';
import CreateAddressService from '../services/CreateAddressService';
import PeopleRepository from '../repositories/PeopleRepository';
import AddressesRepository from '../repositories/AddressesRepository';

const peopleRepository = new PeopleRepository();
const addressesRepository = new AddressesRepository();
const createAddressService = new CreateAddressService(addressesRepository, peopleRepository);

const addressesRouter = Router();

/* Creates an address. */
addressesRouter.post('/', async (request, response) => {
  const { personId, street, number, complement, district, city, state, zipCode } = request.body;

  try {
    const address = await createAddressService.execute({
      personId,
      street,
      number,
      complement,
      district,
      city,
      state,
      zipCode,
    });

    return response.status(StatusCodes.OK).json({ address });
  } catch (e) {
    return response.status(StatusCodes.BAD_REQUEST).json({ erro: e.message });
  }
});

export default addressesRouter;
