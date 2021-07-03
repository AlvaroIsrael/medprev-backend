import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import AppError from '../errors/AppError';
import authConfig from '../config/auth';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(request: Request, response: Response, next: NextFunction): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Missing JWT token.');
  }

  const [, token] = authHeader.split(' ');

  try {
    const decodedToken = verify(token, authConfig.jwt.secret);

    /* If you need to add new fields here, insert here and update fields in @types/express.d.ts */
    const { sub } = decodedToken as TokenPayload;

    request.user = {
      id: sub,
      /* If you need to add new fields to the token, insert here and update fields in @types/express.d.ts */
    };

    return next();
  } catch {
    throw new AppError('Invalid JWT token.');
  }
}
