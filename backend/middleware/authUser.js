const emailValidator = require('email-validator');
const passwordValidator = require('password-validator');

exports.valid = (req, res, next) => {
	const passwordSchema = new passwordValidator();
	passwordSchema
		.is()
		.min(8) // Minimum length 8
		.is()
		.max(20) // Maximum length 20
		.has()
		.uppercase() // Must have uppercase letters
		.has()
		.lowercase() // Must have lowercase letters
		.has()
		.not()
		.symbols(); // Has no symbols

	if (!emailValidator.validate(req.body.email) || !passwordSchema.validate(req.body.password)) {
		return res.status(400).send({
			error: 'Please verify your email address or your password.'
		});
	} else if (
		emailValidator.validate(req.body.email) ||
		passwordSchema.validate(req.body.password)
	) {
		next();
	}
};

exports.checkPseudo = (req, res, next) => {
	const regex = /^[a-zA-Z0-9_]{3,30}$/;
	const pseudo = req.body.pseudo;
	if (regex.test(pseudo) === true) {
		next();
	} else {
		return res.status(400).send({
			error: 'Please verify your username.'
		});
	}
};
