import fs from 'fs';
import chalk from 'chalk';
import ListIt from 'list-it';
import StreamSpeed from 'streamspeed';
import CliProgress from 'cli-progress';
import sanitize from 'sanitize-filename';
import dotenv from 'dotenv';
import { toHumanSize, toHumanTime } from './human.js';
import { onError } from './errMsg.js';
import { mkdir } from './directory.js';

dotenv.config();
const REPORT_DIR = process.cwd() + process.env.DOWNLOAD_REPORT_PATH;


function printVideoBasicInfo(info, live) {
	const listIt = new ListIt();

	let INFO = [
		[chalk.bold('title: '), info.videoDetails.title],
		[chalk.bold('author: '), info.videoDetails.author.name],
		[chalk.bold('avg rating: '), info.videoDetails.averageRating],
		[
			chalk.bold('views: '),
			new Intl.NumberFormat('en').format(info.videoDetails.viewCount),
		],
	];

	if (!live) {
		INFO.push([
			chalk.bold('length: '),
			toHumanTime(parseFloat(info.videoDetails.lengthSeconds)),
		]);
	}
	console.log('\n');
	console.log(listIt.d(INFO).toString());
}

function printVideoFormats(info) {
	const listIt = new ListIt({ headerUnderline: true });

	const formats = info.formats.map((format) => ({
		itag: format.itag,
		container: format.container,
		quality: format.qualityLabel || '',
		codecs: format.codecs,
		bitrate: format.qualityLabel ? toHumanSize(format.bitrate) : '',
		'audio bitrate': format.audioBitrate ? format.audioBitrate + 'KB' : '',
		size: format.contentLength ? toHumanSize(format.contentLength) : '',
	}));

	console.log(chalk.cyan.bold('formats:\n'));
	console.log(listIt.d(formats).toString());
}

function printFormatInfo(info, output) {
	const listIt = new ListIt();

	let INFO = [
		[chalk.bold('itag: '), info.itag],
		[chalk.bold('container: '), info.container],
	];

	if (info.qualityLabel) {
		INFO.push([chalk.bold('quality: '), info.qualityLabel]);
		INFO.push([chalk.bold('video bitrate: '), toHumanSize(info.bitrate)]);
	}

	if (info.audioBitrate) {
		INFO.push([chalk.bold('audio bitrate: '), info.audioBitrate + 'KB']);
	}

	INFO.push([chalk.bold('codecs: '), info.codecs]);
	INFO.push([chalk.bold('output: '), output]);

	console.log('\n');
	console.log(listIt.d(INFO).toString());
}

function printVideoProgressBar(stdoutMutable, readStream, size) {
	console.log(chalk.bold('size: ') + toHumanSize(size) + '\n');

	if (!stdoutMutable) {
		return;
	}

	// Create progress bar.
	const bar = new CliProgress.SingleBar(
		{
			format: '{bar} {percentage}% {speed} | ETA: {eta}s',
			barCompleteChar: '#',
			barIncompleteChar: '-',
			barsize: 50,
			hideCursor: true,
		},
		CliProgress.Presets.shades_classic
	);

	bar.start(size, 0, {
		speed: 'N/A',
	});

	const streamSpeed = new StreamSpeed();

	streamSpeed.add(readStream);

	// Keep track of progress.
	const getSpeed = () => ({
		speed: StreamSpeed.toHuman(streamSpeed.getSpeed(), {
			timeUnit: 's',
			precision: 3,
		}),
	});

	readStream.on('data', (data) => {
		bar.increment(data.length, getSpeed());
	});

	// Update speed every second, in case download is rate limited,
	// which is the case with `audioonly` formats.
	let intervalId = setInterval(() => {
		bar.increment(0, getSpeed());
	}, 1000);

	readStream.on('end', () => {
		bar.stop();
		clearInterval(intervalId);
	});
}

function exportInfoAsJson(info) {
	try {
		mkdir(REPORT_DIR);

		fs.writeFileSync(
			`${REPORT_DIR}/${sanitize(info.videoDetails.title)}.json`,
			JSON.stringify(info, null, 2)
		);

		console.log(chalk.green.bold('✔ Exported successfully\n'));
		console.log(chalk.white(`  - In ${REPORT_DIR}`));
		console.log(
			chalk.white('  - Name as ') +
				chalk.cyan(` ${info.videoDetails.title}.json`)
		);

		process.exit();
	} catch (error) {
		onError(error);
	}
}

export {
    printVideoProgressBar,
	exportInfoAsJson,
	printFormatInfo,
	printVideoBasicInfo,
	printVideoFormats
}