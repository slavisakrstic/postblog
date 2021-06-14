import * as Joi from "@hapi/joi";

export const envVarsSchema: Joi.ObjectSchema = Joi.object({
  PORT: Joi.number().required(),
  NODE_ENV: Joi.string().valid("development", "production", "test", "provision").default("development"),
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
});
