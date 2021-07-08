import Joi from '@hapi/joi';
import AppError from '../errors/AppError';

const validateDocument = (cpf: string) => {
  const invalidDocument = 'it is not in the correct format or is invalid';

  cpf = cpf.trim();

  if (cpf === '') throw new Error(invalidDocument);

  if (cpf.length !== 14) throw new Error(invalidDocument);

  const numericPatter = cpf.match(/\d/g);

  cpf = numericPatter === null ? '' : numericPatter.join('');

  if (cpf.length !== 11) throw new Error(invalidDocument);

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
  kind: Joi.string().valid('legal', 'natural').required(),

  role: Joi.string().valid('admin', 'default').required(),

  name: Joi.string().min(3).max(100).required(),

  email: Joi.string().email({ minDomainSegments: 2 }).lowercase().required(),

  password: Joi.string().min(3).required(),

  avatarUrl: Joi.string().uri(),

  birthDate: Joi.date().required(),

  document: Joi.string().custom(validateDocument, 'validates cpf'),

  sex: Joi.string().valid('masculine', 'feminine').lowercase().required(),

  landlinePhoneNumber: Joi.string()
    .allow(null, '')
    .regex(/^(\(?\d{2}\)?\s)?(\(?\d{2}\)?\s)?(\d{4}-\d{4})$/)
    .error(new AppError('"landlinePhoneNumber" must be formatted like 55 44 3333-3333 or 3333-3333')),

  mobilePhoneNumber: Joi.string()
    .allow(null, '')
    .regex(/^(\(?\d{2}\)?\s)?(\(?\d{2}\)?\s)?(\d{4,5}-\d{4})$/)
    .error(new AppError('"mobilePhoneNumber" must be formatted like 77 88 99999-9999 or 99999-9999')),
});

export default naturalPersonSchema;
