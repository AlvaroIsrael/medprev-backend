import Knex from 'knex';
import PersonRegistry from '../services/PersonRegistry';
import Person from '../models/Person';
import connection from '../database/connection';
import { IPersonRequest } from '../interfaces/IPersonRequest';
import { IPersonUpdateRequest } from '../interfaces/IPersonUpdateRequest';

interface IListRequest {
  page: number;
  pageLimit: number;
}

class PeopleRepository {
  private readonly connection: Knex;

  constructor() {
    this.connection = Knex(connection);
  }

  /* Return a list of people using pagination. */
  public async all({ page, pageLimit }: IListRequest): Promise<Person[]> {
    const people = await this.connection('people')
      .select(['*'])
      .limit(5)
      .offset((page - 1) * pageLimit);

    const foundPeople: Person[] = [];
    let person: Person;

    people.forEach(personInDataBase => {
      const {
        kind,
        role,
        document,
        corporateName,
        name,
        email,
        password,
        landlinePhoneNumber,
        mobilePhoneNumber,
        avatarUrl,
        sex,
        birthDate,
      } = personInDataBase;

      person = new PersonRegistry().getPerson({
        kind,
        role,
        document,
        corporateName,
        name,
        email,
        password,
        landlinePhoneNumber,
        mobilePhoneNumber,
        avatarUrl,
        sex,
        birthDate,
      });

      foundPeople.push(person);
    });

    return foundPeople;
  }

  /* Find a person  by it's id. */
  public async findById(personId: string): Promise<{ personId: number } | null> {
    const personFound = await this.connection('people').select('personId').from('people').where({ personId });

    if (personFound[0] === undefined) {
      return null;
    }

    return personFound[0];
  }

  /* Find one person by its id. */
  public async findOneById(personId: string): Promise<Person | null> {
    const people = await this.connection('people').select(['*']).from('people').where({ personId }).limit(1);

    let person: Person | null = null;

    people.forEach(personInDataBase => {
      const {
        kind,
        role,
        document,
        corporateName,
        name,
        email,
        password,
        landlinePhoneNumber,
        mobilePhoneNumber,
        avatarUrl,
        sex,
        birthDate,
      } = personInDataBase;

      person = new PersonRegistry().getPerson({
        kind,
        role,
        document,
        corporateName,
        name,
        email,
        password,
        landlinePhoneNumber,
        mobilePhoneNumber,
        avatarUrl,
        sex,
        birthDate,
      });
    });

    return person;
  }

  /* Find a person by its document. */
  public async findOne(document: string): Promise<Person | null> {
    const people = await this.connection('people').select(['*']).from('people').where({ document }).limit(1);

    let person: Person | null = null;

    people.forEach(personInDataBase => {
      const {
        personId,
        kind,
        role,
        corporateName,
        name,
        email,
        password,
        landlinePhoneNumber,
        mobilePhoneNumber,
        avatarUrl,
        sex,
        birthDate,
      } = personInDataBase;

      person = new PersonRegistry().getPersonWithId({
        personId,
        kind,
        role,
        document,
        corporateName,
        name,
        email,
        password,
        landlinePhoneNumber,
        mobilePhoneNumber,
        avatarUrl,
        sex,
        birthDate,
      });
    });

    return person;
  }

  /* Find a person id and password by its document. */
  public async findByDocument(document: string): Promise<{ personId: number; password: string } | null> {
    const personFound = await this.connection('people')
      .select('personId', 'password')
      .from('people')
      .where({ document });

    if (personFound[0] === undefined) {
      return null;
    }

    return personFound[0];
  }

  /* Deletes a person. */
  public async delete(personId: string): Promise<number> {
    return this.connection('people').where({ personId }).del();
  }

  /* Updates a person. */
  public async update({
    personId,
    kind,
    role,
    document,
    corporateName,
    name,
    email,
    password,
    landlinePhoneNumber,
    mobilePhoneNumber,
    avatarUrl,
    sex,
    birthDate,
  }: IPersonUpdateRequest): Promise<number> {
    return this.connection('people')
      .update({
        kind,
        role,
        document,
        corporateName,
        name,
        email,
        password,
        landlinePhoneNumber,
        mobilePhoneNumber,
        avatarUrl,
        sex,
        birthDate,
      })
      .where({ personId });
  }

  /* Creates a new person. */
  public async create({
    kind,
    role,
    document,
    corporateName,
    name,
    email,
    password,
    landlinePhoneNumber,
    mobilePhoneNumber,
    avatarUrl,
    sex,
    birthDate,
  }: IPersonRequest): Promise<number> {
    const personId = await this.connection('people').insert({
      kind,
      role,
      document,
      corporateName,
      name,
      email,
      password,
      landlinePhoneNumber,
      mobilePhoneNumber,
      avatarUrl,
      sex,
      birthDate,
    });

    return personId[0];
  }
}

export default PeopleRepository;
