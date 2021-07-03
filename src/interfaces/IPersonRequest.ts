export type IPersonRequest = {
  kind: 'legal' | 'natural';
  role: 'admin' | 'default';
  document: string;
  corporateName: string;
  documentName?: 'cpf' | 'cnpj';
  name: string;
  email: string;
  password: string;
  landlinePhoneNumber: string;
  mobilePhoneNumber: string;
  avatarUrl: string;
  sex: string;
  birthDate: Date;
};
