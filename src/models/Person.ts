abstract class Person {
  personId: string;

  kind: 'legal' | 'natural';

  role: 'admin' | 'default';

  documentNumber: string;

  documentName: 'cpf' | 'cnpj';

  name: string;

  email: string;

  password?: string;

  landlinePhoneNumber: string;

  mobilePhoneNumber: string;

  avatarUrl: string;

  createdAt: Date;

  updatedAt: Date;
}

export default Person;
