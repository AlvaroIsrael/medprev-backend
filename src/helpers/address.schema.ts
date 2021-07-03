import Joi from '@hapi/joi';
import AppError from '../errors/AppError';

const addressSchema = Joi.object().keys({
  personId: Joi.string().required(),

  street: Joi.string().min(1).max(150).required(),

  number: Joi.number().positive().allow(0).required(),

  complement: Joi.string().max(150).required(),

  district: Joi.string().min(1).max(150).required(),

  city: Joi.string().min(1).max(150).required(),

  state: Joi.string().min(1).max(50).required(),

  zipCode: Joi.string()
    .trim()
    .regex(/[0-9]{5}-[0-9]{3}/)
    .error(new AppError('Zip code must be formatted like: 99999-999')),
});

export default addressSchema;
