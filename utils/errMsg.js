import chalk from 'chalk';

function onError(err) {
	console.log(chalk.red.bold(`❌ ${err.message}`));
	process.exit(1);
}

export { onError };
