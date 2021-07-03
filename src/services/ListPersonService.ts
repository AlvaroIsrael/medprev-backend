import Person from '../models/Person';
import PeopleRepository from '../repositories/PeopleRepository';

interface IPersonRequest {
  page: number;
  pageLimit: number;
}

interface IPersonResponse {
  peopleId: string;
}

class ListPersonService {
  private peopleRepository: PeopleRepository;

  constructor(peopleRepository: PeopleRepository) {
    this.peopleRepository = peopleRepository;
  }

  public async execute({ page, pageLimit }: IPersonRequest): Promise<Person[]> {
    return this.peopleRepository.all({ page, pageLimit });
  }
}

export default ListPersonService;
