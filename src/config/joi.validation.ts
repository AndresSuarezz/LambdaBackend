import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  OPNENIA_API_KEY: Joi.string(),
  OPENIA_ORGANIZATION_ID: Joi.string().required(),
  OPENIA_PROJECT_ID: Joi.string().required(),

  RESEND_API_KEY: Joi.string().required(),
  STREAM_API_SECRET: Joi.string(),
  CHAT_API_KEY: Joi.string(),
});
