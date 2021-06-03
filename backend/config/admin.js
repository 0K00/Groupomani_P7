const db = require('../models');
const bcrypt = require('bcrypt');
require('dotenv').config();

function setAdmin(req, res) {
	db.User.findOne({ where: { email: 'admin@mail.com' } || { pseudo: 'admin' } })
		.then(user => {
			if (!user) {
				bcrypt
					.hash(process.env.PW_ADMIN, 10)
					.then(hash => {
						const admin = db.User.create({
							pseudo: 'admin',
							email: 'admin@mail.com',
							password: hash,
							admin: true
						})
							.then(admin => {
								console.log({
									admin,
									message: `Your admin account has been created ${admin.pseudo}.`
								});
							})
							.catch(error => {
								res.status(400).json({ error });
							});
					})
					.catch(error => {
						res.status(500).send({ error });
					});
			} else {
				console.log({ message: 'the admin is already created' });
			}
		})
		.catch(error => {
			console.log({ error });
		});
}
module.exports = setAdmin();
