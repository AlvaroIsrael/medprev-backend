import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import PersonRegistry from '@services/PersonRegistry';
import CreatePersonService from '../services/CreatePersonService';
// import ensureAuthenticated from '../middleares/ensureAuthenticated';
import PeopleRepository from '../repositories/PeopleRepository';

const peopleRepository = new PeopleRepository();
const personRegistry = new PersonRegistry();
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

  const user = await createPersonService.execute({
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

  return response.status(StatusCodes.OK).json({ ...user });
});

/* Gets a person. */
/* peopleRouter.get('/:id', ensureAuthenticated, async (request, response) => {
 const { id } = request.params;
 const { name, password } = request.body;

 const updateUserService = new ListPersonService();

 try {
 const people = await listPersonService.execute({ page, pageLimit });

 return response.status(StatusCodes.OK).json({ people });
 } catch (e) {
 if (e.message === 'Only admin can update roles.') {
 return response.status(StatusCodes.UNAUTHORIZED).json({ erro: e.message });
 }
 return response.status(StatusCodes.NOT_FOUND).json({ erro: e.message });
 }
 }); */

/* Updates a person. */
/* peopleRouter.put('/:id', ensureAuthenticated, async (request, response) => {
 const { id } = request.params;
 const { name, password } = request.body;

 const updateUserService = new UpdatePersonService();

 try {
 await updateUserService.execute({ id, name, password });

 return response.status(StatusCodes.NO_CONTENT).json();
 } catch (e) {
 if (e.message === 'Only admin can update roles.') {
 return response.status(StatusCodes.UNAUTHORIZED).json({ erro: e.message });
 }
 return response.status(StatusCodes.BAD_REQUEST).json({ erro: e.message });
 }
 }); */

/* Deletes a person. */
/* peopleRouter.delete('/:id', ensureAuthenticated, async (request, response) => {
 const { id } = request.params;

 //const usersRepository = getRepository(Person);

 try {
 await usersRepository.delete(id);

 return response.status(StatusCodes.NO_CONTENT).json();
 } catch (e) {
 return response.status(StatusCodes.BAD_REQUEST).json({ erro: e.message });
 }
 }); */

export default peopleRouter;
