import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  OPNENIA_API_KEY: Joi.string(),
  RESEND_API_KEY: Joi.string().required(),
  STREAM_API_SECRET: Joi.string(),
  CHAT_API_KEY: Joi.string(),
});
