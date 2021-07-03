import { Router } from 'express';
import peopleRouter from './people.routes';
import sessionsRouter from './sessions.routes';
import addressesRouter from './addresses.routes';

const routes = Router();

routes.use('/v1/people', peopleRouter);
routes.use('/v1/addresses', addressesRouter);
routes.use('/v1/sessions', sessionsRouter);

export default routes;
