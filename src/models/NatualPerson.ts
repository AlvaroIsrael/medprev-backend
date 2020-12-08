import { IDocument } from './interfaces/IDocument';
import Person from './Person';

class NatualPerson extends Person implements IDocument {
  sex: string;

  birthDate: Date;

  documentValidate(): boolean {
    return this.documentName === 'cpf';
  }
}

export default NatualPerson;
