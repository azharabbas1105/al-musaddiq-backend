const validator = async (req, res, next, Validator) => {
    try {
        if (Validator) {
          await Validator.validateAsync(req.body)
        }
        return next()
      } catch (error) {
        return res.send({
          success: false,
          data: { message: error.details[0].message },
        })
      }
  };

  module.exports = validator