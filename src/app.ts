import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { StatusCodes } from 'http-status-codes';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import routes from './routes';
import AppError from './errors/AppError';
// import './database';

const app = express();
const swagger = YAML.load('./swagger.yaml');

app.use(cors());
app.use(express.json());
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swagger));
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  /* Minimun of global error handling ensuring our app will never let an unhandled exception break. */
  return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'Internal server error.',
  });
});

export default app;
