const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
require('dotenv').config();

const userRoutes = require('./routes/user');
const postsRoutes = require('./routes/posts');

const { sequelize } = require('./models/index');

const app = express();

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.use('/upload', express.static(path.join(__dirname, 'upload')));
app.use('/api/users', userRoutes);
app.use('/api/posts', postsRoutes);

const dbTest = async function () {
	try {
		await sequelize.authenticate();
		console.log('Connection has been established successfully.');
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
};
dbTest();

module.exports = app;
