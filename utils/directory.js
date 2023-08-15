import fs from 'fs';

function mkdir(dir = 'test') {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
}

export { mkdir };
