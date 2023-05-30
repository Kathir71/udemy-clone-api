
const { validationResult, ValidationChain } = require('express-validator');

const validate = validations => {
  return async (req, res, next) => {
    // req.body.user = JSON.parse(req.body.user);
    // req.body.instructor = JSON.parse(req.body.instructor);
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    res.status(400).json({ msg: errors.array()[0].msg });
  };
};
module.exports = {
	validate,
}