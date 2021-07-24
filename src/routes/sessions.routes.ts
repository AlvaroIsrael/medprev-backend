import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import AuthenticateUserService from '../services/AuthenticateUserService';
import PeopleRepository from '../repositories/PeopleRepository';

const peopleRepository = new PeopleRepository();
const authenticateUser = new AuthenticateUserService(peopleRepository);

const sessionsRouter = Router();

/* Creates a new session. */
sessionsRouter.post('/', async (request, response) => {
  const { document, password } = request.body;

  const { user, token } = await authenticateUser.execute({ document, password });

  return response.status(StatusCodes.OK).json({ user, token });
});

export default sessionsRouter;
