import Joi, { CustomHelpers } from '@hapi/joi';

const validateDocument = (cnpj: string, helper: CustomHelpers) => {
  const invalidDocument = 'it is not in the correct format or is invalid.';

  cnpj = cnpj.trim();

  if (cnpj === '') throw new Error(invalidDocument);

  if (cnpj.length !== 14) throw new Error(invalidDocument);

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
    throw new Error(invalidDocument);
  }

  let v1 = 0;
  let v2 = 0;
  let aux = false;

  for (let i = 1; cnpj.length > i; i += 1) {
    if (cnpj[i - 1] !== cnpj[i]) {
      aux = true;
    }
  }

  if (!aux) {
    throw new Error(invalidDocument);
  }

  for (let i = 0, p1 = 5, p2 = 13; cnpj.length - 2 > i; i += 1, p1 -= 1, p2 -= 1) {
    if (p1 >= 2) {
      v1 += +cnpj[i] * p1;
    } else {
      v1 += +cnpj[i] * p2;
    }
  }

  v1 %= 11;

  if (v1 < 2) {
    v1 = 0;
  } else {
    v1 = 11 - v1;
  }

  if (v1 !== +cnpj[12]) {
    throw new Error(invalidDocument);
  }

  for (let i = 0, p1 = 6, p2 = 14; cnpj.length - 1 > i; i += 1, p1 -= 1, p2 -= 1) {
    if (p1 >= 2) {
      v2 += +cnpj[i] * p1;
    } else {
      v2 += +cnpj[i] * p2;
    }
  }

  v2 %= 11;

  if (v2 < 2) {
    v2 = 0;
  } else {
    v2 = 11 - v2;
  }

  if (v2 !== +cnpj[13]) {
    throw new Error(invalidDocument);
  }

  return cnpj;
};

const legalPersonSchema = Joi.object({
  kind: Joi.string().allow('legal', 'natural').required(),

  role: Joi.string().allow('admin', 'default').required(),

  name: Joi.string().min(3).max(100).required(),

  corporateName: Joi.string().min(3).max(100).required(),

  email: Joi.string().email({ minDomainSegments: 2 }).lowercase(),

  password: Joi.string().min(3).required(),

  avatarUrl: Joi.string().uri(),

  birthDate: Joi.string()
    .pattern(new RegExp('^\\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$'))
    .required()
    .error(() => 'Date must be yyyy-MM-dd'),

  document: Joi.string().custom(validateDocument, 'validates cnpj'),

  sex: Joi.string().allow('masculine', 'feminine').required(),

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
