import Joi from '@hapi/joi';

const peopleSchema = Joi.object({
  /*
   document,
   corporateName,
   landlinePhoneNumber,
   mobilePhoneNumber,
   sex,
   birthDate, */

  kind: Joi.string().allow(['legal', 'private']).required(),

  role: Joi.string().allow(['admin', 'default']).required(),

  name: Joi.string().alphanum().min(3).max(100).required(),

  email: Joi.string().email({ minDomainSegments: 2 }).lowercase(),

  password: Joi.string().min(3).required(),

  avatarUrl: Joi.string().uri(),

  birthDate: Joi.string()
    .pattern(new RegExp('^\\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$'))
    .error(() => 'Date must be yyyy-MM-dd'),
});

export default peopleSchema;
