const Joi = require("joi");

// Schema for user registration
const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string()
    .valid("Patient", "Agent", "Doctor", "SuperAdmin", "Manufacturer")
    .required(),
  treatment_details: Joi.string().allow(null),
  status: Joi.string().allow(null),
  profile: Joi.string().allow(null),
});

// Schema for user login
const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

module.exports = { registerSchema, loginSchema };
