import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import DeletePersonService from '../services/DeletePersonService';
import PersonRegistry from '../services/PersonRegistry';
import CreatePersonService from '../services/CreatePersonService';
// import ensureAuthenticated from '../middleares/ensureAuthenticated';
import PeopleRepository from '../repositories/PeopleRepository';
import ListPersonService from '../services/ListPersonService';
import ListPeopleService from '../services/ListPeopleService';
import UpdatePersonService from '../services/UpdatePersonService';

const peopleRepository = new PeopleRepository();
const personRegistry = new PersonRegistry();
const listPersonService = new ListPersonService(peopleRepository);
const listPeopleService = new ListPeopleService(peopleRepository);
const deletePersonService = new DeletePersonService(peopleRepository);
const updatePersonService = new UpdatePersonService(peopleRepository, personRegistry);
const createPersonService = new CreatePersonService(peopleRepository, personRegistry);

const peopleRouter = Router();

/* Creates a person. */
peopleRouter.post('/', async (request, response) => {
  const {
    kind,
    role,
    document,
    corporateName,
    name,
    email,
    password,
    landlinePhoneNumber,
    mobilePhoneNumber,
    avatarUrl,
    sex,
    birthDate,
  } = request.body;

  let user;
  try {
    user = await createPersonService.execute({
      kind,
      role,
      document,
      corporateName,
      name,
      email,
      password,
      landlinePhoneNumber,
      mobilePhoneNumber,
      avatarUrl,
      sex,
      birthDate,
    });
  } catch (e) {
    return response.status(StatusCodes.NOT_FOUND).json({ erro: e.message });
  }

  return response.status(StatusCodes.OK).json({ ...user });
});

/* Gets all people. */
peopleRouter.get('/', async (request, response) => {
  const { page, pageLimit } = request.body;

  try {
    const people = await listPeopleService.execute({ page, pageLimit });

    return response.status(StatusCodes.OK).json({ people });
  } catch (e) {
    if (e.message === 'Only admin can update roles.') {
      return response.status(StatusCodes.UNAUTHORIZED).json({ erro: e.message });
    }
    return response.status(StatusCodes.NOT_FOUND).json({ erro: e.message });
  }
});

/* Gets a person. */
peopleRouter.get('/:personId', async (request, response) => {
  const { personId } = request.params;

  try {
    const people = await listPersonService.execute({ personId });

    return response.status(StatusCodes.OK).json({ people });
  } catch (e) {
    if (e.message === 'Only admin can update roles.') {
      return response.status(StatusCodes.UNAUTHORIZED).json({ erro: e.message });
    }
    return response.status(StatusCodes.NOT_FOUND).json({ erro: e.message });
  }
});

/* Updates a person. */
peopleRouter.patch('/:personId', async (request, response) => {
  const { personId } = request.params;
  const {
    kind,
    role,
    document,
    corporateName,
    name,
    email,
    password,
    landlinePhoneNumber,
    mobilePhoneNumber,
    avatarUrl,
    sex,
    birthDate,
  } = request.body;

  try {
    await updatePersonService.execute({
      personId,
      kind,
      role,
      document,
      corporateName,
      name,
      email,
      password,
      landlinePhoneNumber,
      mobilePhoneNumber,
      avatarUrl,
      sex,
      birthDate,
    });

    return response.status(StatusCodes.NO_CONTENT).json();
  } catch (e) {
    if (e.message === 'Only admin can update roles.') {
      return response.status(StatusCodes.UNAUTHORIZED).json({ erro: e.message });
    }
    return response.status(StatusCodes.BAD_REQUEST).json({ erro: e.message });
  }
});

/* Deletes a person. */
peopleRouter.delete('/:personId', async (request, response) => {
  const { personId } = request.params;

  try {
    await deletePersonService.execute({ personId });

    return response.status(StatusCodes.NO_CONTENT).json();
  } catch (e) {
    return response.status(StatusCodes.BAD_REQUEST).json({ erro: e.message });
  }
});

export default peopleRouter;
