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

  return response.status(StatusCodes.OK).json({ ...address });
});

export default addressesRouter;
