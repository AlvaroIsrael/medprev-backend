import { Router } from 'express';
import peopleRouter from './people.routes';
import sessionsRouter from './sessions.routes';

const routes = Router();

routes.use('/api/v1/people', peopleRouter);
routes.use('/api/v1/sessions', sessionsRouter);

export default routes;
