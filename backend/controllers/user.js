const bcrypt = require('bcrypt');
const db = require('../models');
const token = require('../middleware/token');
const fs = require('fs');
const { Op } = require('sequelize');

exports.signup = async (req, res) => {
	try {
		const user = await db.User.findOne({
			where: { email: req.body.email }
		});
		if (user !== null) {
			if (user.pseudo === req.body.pseudo) {
				return res.status(400).json({ error: 'This nickname is already used.' });
			}
		} else {
			const hash = await bcrypt.hash(req.body.password, 10);
			const newUser = await db.User.create({
				pseudo: req.body.pseudo,
				email: req.body.email,
				password: hash,
				admin: false
			});

			const tokenObject = await token.issueJWT(newUser);
			res.status(201).send({
				user: newUser,
				token: tokenObject.token,
				expires: tokenObject.expiresIn,
				message: `Your account is successfully created ${newUser.pseudo}!`
			});
		}
	} catch (error) {
		return res.status(400).send({ error: 'Email already use.' });
	}
};

exports.login = async (req, res) => {
	try {
		const user = await db.User.findOne({
			where: { email: req.body.email }
		});
		if (user === null) {
			return res.status(403).send({ error: 'Connection failed.' });
		} else {
			const hash = await bcrypt.compare(req.body.password, user.password);
			if (!hash) {
				return res.status(401).send({ error: 'Incorrect password.' });
			} else {
				const tokenObject = await token.issueJWT(user);
				res.status(200).send({
					user: user,
					token: tokenObject.token,
					sub: tokenObject.sub,
					expires: tokenObject.expiresIn,
					message: 'Hello ' + user.pseudo
				});
			}
		}
	} catch (error) {
		return res.status(500).send({ error: 'Server error' });
	}
};

exports.getAccount = async (req, res) => {
	try {
		const user = await db.User.findOne({
			where: { id: req.params.id }
		});
		res.status(200).send(user);
	} catch (error) {
		return res.status(500).send({ error: 'Server error' });
	}
};

exports.getAllUsers = async (req, res) => {
	try {
		const users = await db.User.findAll({
			attributes: ['pseudo', 'id', 'photo', 'bio', 'email'],
			where: {
				id: {
					[Op.ne]: 1
				}
			}
		});
		res.status(200).send(users);
	} catch (error) {
		return res.status(500).send({ error: 'Server error' });
	}
};

exports.updateAccount = async (req, res) => {
	const id = req.params.id;
	try {
		const userId = token.getUserId(req);
		let newPhoto;
		let user = await db.User.findOne({ where: { id: id } });
		if (userId === user.id) {
			if (req.file && user.photo) {
				newPhoto = `${req.protocol}://${req.get('host')}/upload/${req.file.filename}`;
				const filename = user.photo.split('/upload')[1];
				fs.unlink(`upload/${filename}`, err => {
					if (err) console.log(err);
					else {
						console.log(`Deleted file: upload/${filename}`);
					}
				});
			} else if (req.file) {
				newPhoto = `${req.protocol}://${req.get('host')}/upload/${req.file.filename}`;
			}
			if (newPhoto) {
				user.photo = newPhoto;
			}
			if (req.body.bio) {
				user.bio = req.body.bio;
			}
			if (req.body.pseudo) {
				user.pseudo = req.body.pseudo;
			}
			const newUser = await user.save({ fields: ['pseudo', 'bio', 'photo'] });
			res.status(200).json({
				user: newUser,
				messageRetour: 'Your profile has been modified.'
			});
		} else {
			res.status(400).json({ messageRetour: 'You do not have the required rights.' });
		}
	} catch (error) {
		return res.status(500).send({ error: 'Server error' });
	}
};

exports.deleteAccount = async (req, res) => {
	try {
		const id = req.params.id;
		const user = await db.User.findOne({ where: { id: id } });
		if (user.photo !== null) {
			const filename = user.photo.split('/upload')[1];
			fs.unlink(`upload/${filename}`, () => {
				db.User.destroy({ where: { id: id } });
				res.status(200).json({ messageRetour: 'Deleted user' });
			});
		} else {
			db.User.destroy({ where: { id: id } });
			res.status(200).json({ messageRetour: 'Deleted user' });
		}
	} catch (error) {
		return res.status(500).send({ error: 'Server error' });
	}
};
