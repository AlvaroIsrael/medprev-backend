import { sign } from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import PeopleRepository from '../repositories/PeopleRepository';
import Person from '../models/Person';
import AppError from '../errors/AppError';
import authConfig from '../config/auth';

interface IRequest {
  email: string;
  password: string;
  document: string;
}

interface IResponse {
  user: Person;
  token: string;
}

class AuthenticateUserService {
  private peopleRepository: PeopleRepository;

  constructor(peopleRepository: PeopleRepository) {
    this.peopleRepository = peopleRepository;
  }

  public execute = async ({ document, password }: IRequest): Promise<IResponse> => {
    const user = await this.peopleRepository.findOne(document);

    if (!user) {
      throw new AppError('Incorrect email or password.');
    }

    const passwordMatches = await compare(password, user?.password ?? '');

    if (!passwordMatches) {
      throw new AppError('Incorrect email or password.');
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign(
      {
        /* If you need to add new fields to the token, insert here and update fields in @types/express.d.ts */
      },
      secret,
      {
        subject: user.personId,
        expiresIn,
      },
    );

    return { user, token };
  };
}

export default AuthenticateUserService;
