// const config = require("../../config/auth.config");
// const { set } = require("mongoose");
const fs = require('fs');
const db = require("../models");
const apiResponse = require("../utils/apiResponse");
const User = require('../models/user.model');
const Customer = db.customer;

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.createCustomer = async (req, res) => {
  try {

    let customer = await Customer.findOne(
      {
        is_deleted: false,
        project: req.body.project,
        property_id: req.body.property_id
      });

    if (customer) {
      return apiResponse.errorMessage(req.body.property_id + " already alot to an other customer.", res);
    }

    let newCustomer = await Customer.create(req.body);
    if (newCustomer) {
      return apiResponse.insertData(newCustomer, res);
    }

    return apiResponse.errorMessage("Property not alot, some issue occurred", res)
  } catch (error) {
    return apiResponse.throwError(error, res)
  }
};


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.updateCustomer = async (req, res) => {
  try {

    let customer = await Customer.findById(req.body.id);
    if (customer) {
      customer['name'] = req.body.name
      customer['phone'] = req.body.phone
      customer['cnic'] = req.body.cnic
      customer['project'] = req.body.project
      customer['property_id'] = req.body.property_id
      customer['ammount'] = req.body.ammount
      customer['transaction_status'] = req.body.transaction_status
      await customer.save();
      return apiResponse.updateRecord(customer, res);
    }

    return apiResponse.errorMessage("Customer not found!", res)
  } catch (error) {
    return apiResponse.throwError(error, res)
  }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.approveCustomer = async (req, res) => {
  try {

    let customer = await Customer.findById(req.body.id);
    if (customer) {
      customer['is_approved'] = true
      customer['approved_by'] = req.body.userId
      customer['approved_at'] = new Date();
      await customer.save();
      return apiResponse.updateRecord(customer, res);
    }

    return apiResponse.errorMessage("Customer not found!", res)
  } catch (error) {
    return apiResponse.throwError(error, res)
  }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.verifyCNIC = async (req, res) => {
  try {

    let customer = await Customer.findOne(
      {
        is_deleted: false,
        cnic: req.body.cnic
      });

    if (customer) {
      return apiResponse.successMessage("Verified Customer", res);
    }

    return apiResponse.errorMessage("Customer not found!", res)
  } catch (error) {
    return apiResponse.throwError(error, res)
  }
};


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.deleteCustomer = async (req, res) => {
  try {

    let customer = await Customer.findById(req.params.id);

    if (!customer) {
      return apiResponse.errorMessage("Customer not found!", res)
    }
    customer['is_deleted'] = true;
    await customer.save();

    return apiResponse.successMessage("Customer deleted successfully", res);

  } catch (error) {
    return apiResponse.throwError(error, res)
  }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getCustomerById = async (req, res) => {
  try {

    let customer = await Customer.findById(req.params.id);
    if (!customer) {
      return apiResponse.errorMessage("Customer not found!", res)
    }

    return apiResponse.retrieveData(customer, res);
  } catch (error) {
    return apiResponse.throwError(error, res)
  }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */

exports.verifiyPropertyId = async (req, res) => {
  try {

    let customer = await Customer.findOne(
      {
        is_deleted: false,
        property_id: req.body.property_id
      });

    if (customer) {
      return apiResponse.retrieveData(customer, res);
    }

    return apiResponse.errorMessage("Property not found!", res)
  } catch (error) {
    return apiResponse.throwError(error, res)
  }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getAllCustomers = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1; // Current page, default is 1
    const pageSize = parseInt(req.body.pageSize) || 10

    let query = {
      is_deleted: false
    }
    if (req.body.is_approved != null || req.body.is_approved != undefined) {
      query['is_approved'] = req.body.is_approved
    }

    if (req.body.search) {
      let search = req.body.search;
      query['$or'] = [
        {
          'name': { $regex: ".*" + search + ".*", '$options': 'i' }
        },
        {
          'phone': { $regex: ".*" + search + ".*", '$options': 'i' }
        },
        {
          'project': { $regex: ".*" + search + ".*", '$options': 'i' }
        },
        {
          'cnic': { $regex: ".*" + search + ".*", '$options': 'i' }
        },
        {
          'property_id': { $regex: ".*" + search + ".*", '$options': 'i' }
        }
      ]
    }

    if (req.body.project) {
      query['project'] = req.body.project
    }

    const totalItems = await Customer.count(query);
    const totalPages = Math.ceil(totalItems / pageSize);
    let customers = await Customer.find(query).skip((page - 1) * pageSize)
      .limit(pageSize);

    if (customers && customers.length) {
      let result = {
        totalRecords: totalItems,
        currentPage: page,
        pageSize: pageSize,
        totalPages: totalPages,
        reult: customers,
      }

      return apiResponse.retrieveData(result, res);
    }
    return apiResponse.errorMessage("Customers Not found.", res);
  } catch (error) {
    return apiResponse.throwError(error, res)
  }
};

exports.importCustomers = async (req, res) => {
  try {

    let user = await User.findById(req.body.userId).populate("Role")
    let isAdmin = false;
    if (!user) {
      return apiResponse.errorMessage("Not able to import", res);
    }

    if (user['Role'] && user['Role'].length) {
      let index = user['Role'].findIndex(el => el.name.toString() == "admin");
      if (index >= 0) {
        isAdmin = true;
      }
    }
    let newCustomers = [];
    let alreadyExists = [];
    let mFile = fs.readFileSync('data.json');
    let fileData = JSON.parse(mFile);

    for (const data of fileData) {
      let customer = await Customer.findOne(
        {
          // name : {$ne:data.name},
          // cnic : {$ne:data.cnic},
          is_deleted: false,
          project: data.project,
          property_id: data.property_id
        });

      if (customer) {
        alreadyExists.push(customer);
        continue
      }

      data['is_deleted'] = false;
      data['is_approved'] = isAdmin;
      data['transaction_status'] = "Paid";
      data['approved_by'] = req.body.userId;
      data['approved_at'] = new Date();
      data['approved_at'] = new Date();

      let newCustomer = await Customer.create(data);
      if (newCustomer) {
        newCustomers.push(newCustomer)
      }
    }

    return res.status(200).send({
      status: "success",
      new_customers: newCustomers,
      already_exists: alreadyExists,
      message: "Customers created successfully",
      error: ""
    })

  } catch (error) {
    return apiResponse.throwError(error, res)
  }
};
