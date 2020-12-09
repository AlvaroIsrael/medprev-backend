import Joi, { CustomHelpers } from '@hapi/joi';

const validateDocument = (cnpj: string, helper: CustomHelpers) => {
  if (cnpj === '') return helper.error('Invalid CPF');

  if (cnpj.length !== 14) return helper.error('Invalid CPF');

  if (
    cnpj === '00000000000000' ||
    cnpj === '11111111111111' ||
    cnpj === '22222222222222' ||
    cnpj === '33333333333333' ||
    cnpj === '44444444444444' ||
    cnpj === '55555555555555' ||
    cnpj === '66666666666666' ||
    cnpj === '77777777777777' ||
    cnpj === '88888888888888' ||
    cnpj === '99999999999999'
  ) {
    return helper.error('Invalid CPF');
  }

  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i -= 1) {
    soma += +numeros.charAt(tamanho - i) * (pos -= 1);
    if (pos < 2) {
      pos = 9;
    }
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

  if (resultado !== +digitos.charAt(0)) {
    return helper.error('Invalid CPF');
  }

  tamanho += 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i -= 1) {
    soma += +numeros.charAt(tamanho - i) * (pos -= 1);
    if (pos < 2) {
      pos = 9;
    }
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

  if (resultado !== +digitos.charAt(1)) {
    return helper.error('Invalid CPF');
  }

  return cnpj;
};

const legalPersonSchema = Joi.object({
  kind: Joi.string().allow(['legal', 'private']).required(),

  role: Joi.string().allow(['admin', 'default']).required(),

  name: Joi.string().alphanum().min(3).max(100).required(),

  corporateName: Joi.string().alphanum().min(3).max(100).required(),

  email: Joi.string().email({ minDomainSegments: 2 }).lowercase(),

  password: Joi.string().min(3).required(),

  avatarUrl: Joi.string().uri(),

  birthDate: Joi.string()
    .pattern(new RegExp('^\\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$'))
    .required()
    .error(() => 'Date must be yyyy-MM-dd'),

  document: Joi.string().custom(validateDocument, 'validates cnpj'),

  sex: Joi.string().allow(['masculine', 'feminine']).required(),

  landlinePhoneNumber: Joi.string()
    .trim()
    .regex(/(\(?\d{2}\)?\s)?(\d{4,5}-\d{4})/)
    .error(() => 'Landline phone number must be formatted like: (33) 3333-3333 or 3333-3333'),

  mobilePhoneNumber: Joi.string()
    .trim()
    .regex(/(\(?\d{2}\)?\s)?(\d{4,5}-\d{4})/)
    .error(() => 'Mobile phone number must be formatted like: (99) 99999-9999 or 99999-9999'),
});

export default legalPersonSchema;
