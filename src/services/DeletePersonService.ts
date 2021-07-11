import PeopleRepository from '../repositories/PeopleRepository';
import AppError from '../errors/AppError';

interface IPersonRequest {
  personId: number;
}

type IPersonResponse = {
  success: boolean;
};

class DeletePersonService {
  private peopleRepository: PeopleRepository;

  constructor(peopleRepository: PeopleRepository) {
    this.peopleRepository = peopleRepository;
  }

  public execute = async ({ personId }: IPersonRequest): Promise<IPersonResponse> => {
    if (!personId) {
      throw new AppError('Person not found');
    }

    const personExists = await this.peopleRepository.findOneById(personId);

    if (!personExists) {
      throw new AppError('Person not found');
    }

    const deleteSuccessful = await this.peopleRepository.delete(personId);

    return { success: !!deleteSuccessful };
  };
}

export default DeletePersonService;
