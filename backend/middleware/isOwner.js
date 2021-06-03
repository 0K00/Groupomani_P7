const db = require('../models');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, 'secret');
    const userId = decodedToken.sub;
    const user = db.User.findOne({ where: { id: req.params.id } });
		if (userId !== user.id || userId.admin == false) {
			res.status(403).json({ message: 'Unauthorized' });
			return user;
		}
		next();
    } catch (e) {
        console.log(e)
		res.status(500).json({ error: new Error('Invalid request!') });
	}
};