import Knex from 'knex';
import LegalPerson from '../models/LegalPerson';
import Person from '../models/Person';
import connection from '../database/connection';

interface IListRequest {
  page: number;
  pageLimit: number;
}

interface IPersonRequest {
  kind: string;
  role: string;
  document: string;
  corporateName: string;
  name: string;
  email: string;
  password: string;
  landlinePhoneNumber: string;
  mobilePhoneNumber: string;
  avatarUrl: string;
  sex: string;
  birthDate: string;
}

class PeopleRepository {
  private readonly connection: Knex;

  constructor() {
    this.connection = Knex(connection);
  }

  /* Return a list of all people. */
  public async all({ page, pageLimit }: IListRequest): Promise<LegalPerson[]> {
    const people = await this.connection('people')
      .select(['*'])
      .limit(5)
      .offset((page - 1) * pageLimit);

    return Array(new LegalPerson());
  }

  /* Find a person  by it's document. */
  public async findOne(document: string): Promise<Person | null> {
    const personFound = new LegalPerson();

    return personFound || null;
  }

  /* Find a person  by it's document. */
  public async findByDocument(document: string): Promise<string | null> {
    const personFound = await this.connection('people')
      .select('personId', 'password')
      .from('people')
      .where({ document });

    if (personFound[0] === undefined) {
      return null;
    }

    return personFound[0];
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
