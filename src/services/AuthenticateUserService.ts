import { sign } from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import PeopleRepository from '../repositories/PeopleRepository';
import AppError from '../errors/AppError';
import authConfig from '../config/auth';
import { IAuthenticationRequest } from '../interfaces/IAuthenticationRequest';
import { IAuthenticationResponse } from '../interfaces/IAuthenticationResponse';

class AuthenticateUserService {
  private peopleRepository: PeopleRepository;

  constructor(peopleRepository: PeopleRepository) {
    this.peopleRepository = peopleRepository;
  }

  public execute = async ({ document, password }: IAuthenticationRequest): Promise<IAuthenticationResponse> => {
    const user = await this.peopleRepository.findOne(document);

    if (!user) {
      throw new AppError('Incorrect email or password');
    }

    if (!user.password) {
      throw new AppError('Incorrect email or password');
    }

    const passwordMatches = await compare(password, user.password);

    if (!passwordMatches) {
      throw new AppError('Incorrect email or password');
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
