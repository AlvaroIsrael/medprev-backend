import Person from '../models/Person';
import PeopleRepository from '../repositories/PeopleRepository';

interface IPersonRequest {
  personId: string;
}

class ListPersonService {
  private peopleRepository: PeopleRepository;

  constructor(peopleRepository: PeopleRepository) {
    this.peopleRepository = peopleRepository;
  }

  public async execute({ personId }: IPersonRequest): Promise<Person | null> {
    const person = await this.peopleRepository.findOneById(personId);

    delete person?.password;

    return person;
  }
}

export default ListPersonService;
