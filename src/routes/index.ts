import { Router } from 'express';
import peopleRouter from './people.routes';
import sessionsRouter from './sessions.routes';

const routes = Router();

routes.use('/v1/people', peopleRouter);
routes.use('/v1/sessions', sessionsRouter);

export default routes;
