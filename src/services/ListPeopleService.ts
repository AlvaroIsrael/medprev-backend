import Person from '../models/Person';
import PeopleRepository from '../repositories/PeopleRepository';

interface IPersonRequest {
  page: number;
  pageLimit: number;
}

class ListPeopleService {
  private peopleRepository: PeopleRepository;

  constructor(peopleRepository: PeopleRepository) {
    this.peopleRepository = peopleRepository;
  }

  public async execute({ page, pageLimit }: IPersonRequest): Promise<Person[]> {
    const people = await this.peopleRepository.all({ page, pageLimit });

    people.forEach(person => delete person.password);

    return people;
  }
}

export default ListPeopleService;
