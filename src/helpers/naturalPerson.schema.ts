import Joi from '@hapi/joi';
import AppError from '../errors/AppError';

const validateDocument = (cpf: string) => {
  const invalidDocument = 'it is not in the correct format or is invalid.';

  cpf = cpf.trim();

  if (
    !cpf ||
    cpf.length !== 11 ||
    cpf === '00000000000' ||
    cpf === '11111111111' ||
    cpf === '22222222222' ||
    cpf === '33333333333' ||
    cpf === '44444444444' ||
    cpf === '55555555555' ||
    cpf === '66666666666' ||
    cpf === '77777777777' ||
    cpf === '88888888888' ||
    cpf === '99999999999'
  ) {
    throw new Error(invalidDocument);
  }

  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i += 1) soma += parseInt(cpf.substring(i - 1, i), 10) * (11 - i);

  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) resto = 0;

  if (resto !== parseInt(cpf.substring(9, 10), 10)) {
    throw new Error(invalidDocument);
  }

  soma = 0;

  for (let i = 1; i <= 10; i += 1) soma += parseInt(cpf.substring(i - 1, i), 10) * (12 - i);

  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11), 10)) {
    throw new Error(invalidDocument);
  }

  return cpf;
};

const naturalPersonSchema = Joi.object().keys({
  kind: Joi.string().allow('legal', 'natural').required(),

  role: Joi.string().allow('admin', 'default').required(),

  name: Joi.string().min(3).max(100).required(),

  email: Joi.string().email({ minDomainSegments: 2 }).lowercase(),

  password: Joi.string().min(3).required(),

  avatarUrl: Joi.string().uri(),

  birthDate: Joi.string()
    .pattern(new RegExp('^\\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$'))
    .required()
    .error(new AppError('Date must be yyyy-MM-dd')),

  document: Joi.string().custom(validateDocument, 'validates cpf'),

  sex: Joi.string().allow('masculine', 'feminine').required(),

  landlinePhoneNumber: Joi.string()
    .trim()
    .regex(/(\(?\d{2}\)?\s)?(\d{4,5}-\d{4})/)
    .error(new AppError('Landline phone number must be formatted like: (33) 3333-3333 or 3333-3333')),

  mobilePhoneNumber: Joi.string()
    .trim()
    .regex(/(\(?\d{2}\)?\s)?(\d{4,5}-\d{4})/)
    .error(new AppError('Mobile phone number must be formatted like: (99) 99999-9999 or 99999-9999')),
});

export default naturalPersonSchema;
