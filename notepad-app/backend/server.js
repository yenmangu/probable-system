const app = require('./app');

const PORT = process.env.PORT || 3030;

const start = () => {
	app.listen(PORT, () => {
		console.log(`Server listening on ${PORT}\nTime: ${new Date()}`);
	});
};
start();
