export type IPersonRequest = {
  kind: 'legal' | 'natural';
  role: 'admin' | 'default';
  corporateName: string;
  document: string;
  documentName?: 'cpf' | 'cnpj';
  name: string;
  email: string;
  password: string;
  landlinePhoneNumber: string;
  mobilePhoneNumber: string;
  avatarUrl: string;
  sex: 'masculine' | 'feminine';
  birthDate: Date;
};
