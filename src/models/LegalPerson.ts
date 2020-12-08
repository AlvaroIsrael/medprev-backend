import { IDocument } from './interfaces/IDocument';
import Person from './Person';

class LegalPerson extends Person implements IDocument {
  corporateName: string;

  documentValidate(): boolean {
    return this.documentName === 'cnpj';
  }
}

export default LegalPerson;
