const { log } = require('console');
const fs = require('fs');

// Create a writestream and temporarily save the img
const uploadImg = (req, path) => {
	return new Promise((resolve, reject) => {
		const stream = fs.createWriteStream(path);
		req.pipe(stream);

		stream.on('open', () => console.log('Started upload ...'));
		stream.on('close', () => resolve(path));
		stream.on('error', err => reject(err));
	});
};

// Send the converted img to the client
const sendConvertedImg = (res, path) => {
	return new Promise((resolve, reject) => {
		const stream = fs.createReadStream(path);

		stream.on('open', () => stream.pipe(res));
		stream.on('close', () => resolve(path));
		stream.on('error', err => reject(err));
	});
};

// Delete a given set of old files
const deleteOldFiles = (...args) => {
	return new Promise((resolve, reject) => {
		console.log('deleting old files now');
		try {
			args.forEach(arg => fs.unlinkSync(arg));
			resolve([...args]);
		} catch (e) {
			reject(e);
		}
	});
};

const cleanTempDir = async dirname => {
	const dir = await fs.promises.opendir(dirname);

	for await (const dirent of dir) {
		fs.unlinkSync(dirname + dirent.name);
	}
};

module.exports = { uploadImg, sendConvertedImg, deleteOldFiles, cleanTempDir };
