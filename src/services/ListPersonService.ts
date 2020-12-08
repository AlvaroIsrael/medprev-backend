import Person from '@/models/Person';
import PeopleRepository from '../repositories/PeopleRepository';

interface IPersonRequest {
  name: string;
  email: string;
  password: string;
}

interface IPersonResponse {
  peopleId: string;
}

class ListPersonService {
  private peopleRepository: PeopleRepository;

  constructor(peopleRepository: PeopleRepository) {
    this.peopleRepository = peopleRepository;
  }

  public async execute(): Promise<Person[]> {
    return this.peopleRepository.all({ page: 1, pageLimit: 5 });
  }
}

export default ListPersonService;
