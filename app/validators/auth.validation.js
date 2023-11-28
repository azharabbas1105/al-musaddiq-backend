const Joi = require('joi');


const signUpValidation = Joi.object().keys({
  email: Joi.string().email().required(),
  Role: Joi.array().required(),
  password: Joi.string().required()
});

const updateRolesValidation = Joi.object().keys({
  id: Joi.string().required(),
  Role: Joi.array().required()
});

const signinValidation = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});


const userPasswordResetValidation = Joi.object().keys({
  id: Joi.string().required(),
  old_password: Joi.string().required(),
  new_password: Joi.string().required()
});


module.exports = {
  signUpValidation,
  updateRolesValidation,
  signinValidation,
  userPasswordResetValidation,
};
