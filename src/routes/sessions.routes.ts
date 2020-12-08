import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import AuthenticateUserService from '../services/AuthenticateUserService';
import PeopleRepository from '../repositories/PeopleRepository';

const peopleRepository = new PeopleRepository();
const authenticateUser = new AuthenticateUserService(peopleRepository);

const sessionsRouter = Router();

/* Creates a new session. */
sessionsRouter.post('/', async (request, response) => {
  try {
    const { document, email, password } = request.body;

    const { user, token } = await authenticateUser.execute({ document, email, password });

    delete user.password;

    return response.status(StatusCodes.OK).json({ user, token });
  } catch (e) {
    return response.status(StatusCodes.BAD_REQUEST).json({ erro: e.message });
  }
});

export default sessionsRouter;
