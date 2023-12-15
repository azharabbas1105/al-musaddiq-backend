const Joi = require('joi');

const createCustomerValidation = Joi.object().keys({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  cnic: Joi.string().required(),
  project: Joi.string().required(),
  property_type : Joi.string().required(),
  property_id: Joi.string().required(),
  ammount: Joi.string().required(),
  transaction_status: Joi.string().required()
});

const updateCustomerValidation = Joi.object().keys({
  id: Joi.string().required(),
  name: Joi.string().required(),
  phone: Joi.string().required(),
  cnic: Joi.string().required(),
  project: Joi.string().required(),
  property_type : Joi.string().required(),
  property_id: Joi.string().required(),
  ammount: Joi.number().required(),
  transaction_status: Joi.string().required()
});

const cnicValidation = Joi.object().keys({
  cnic: Joi.string().required(),
});

const propertyIdValidation = Joi.object().keys({
  property_id: Joi.string().required(),
});

const getCustomerValidation = Joi.object().keys({
  search: Joi.string().optional().allow(null),
  page: Joi.number().required(),
  pageSize: Joi.number().required(),
  project: Joi.string().optional(),
  is_approved: Joi.boolean().required(),
});

const approvedCustomerValidation = Joi.object().keys({
  id: Joi.string().required(),
});

module.exports = {
  createCustomerValidation,
  updateCustomerValidation,
  cnicValidation,
  propertyIdValidation,
  getCustomerValidation,
  approvedCustomerValidation
};
