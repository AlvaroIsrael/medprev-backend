import Person from '../models/Person';
import PeopleRepository from '../repositories/PeopleRepository';
import { IListRequest } from '../interfaces/IListRequest';

class ListPeopleService {
  private peopleRepository: PeopleRepository;

  constructor(peopleRepository: PeopleRepository) {
    this.peopleRepository = peopleRepository;
  }

  public async execute({ page, pageLimit }: IListRequest): Promise<Person[]> {
    const people = await this.peopleRepository.all({ page, pageLimit });

    people.forEach(person => delete person.password);

    return people;
  }
}

export default ListPeopleService;
