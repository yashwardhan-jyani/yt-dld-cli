#!/usr/bin/env node

import fs from 'fs';
import chalk from 'chalk';
import ytdl from 'ytdl-core';
import sanitize from 'sanitize-filename';
import { Command } from 'commander';
import { oraPromise } from 'ora';
import {
	printFormatInfo,
	printVideoProgressBar,
	exportInfoAsJson,
	printVideoBasicInfo,
	printVideoFormats,
} from './utils/functions.js';
import { onError } from './utils/errMsg.js';
import { mkdir } from './utils/directory.js';

const downloadPath = '/tube/downloads';
const version = 1.1;

const app = new Command();
const DOWNLOAD_DIR = process.cwd() + downloadPath;


app
    .description('CLI to download youtube video using JavaScript utilities')
    .version(version, '-v, --version')
    .arguments('<url>')
    .action((value) => {
        if (!/^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.be)\/.+$/.test(value)) {
            throw app.error(chalk.red.bold('\n❌ Enter a valid youtube URL!\n'));
        }
    })
    .option(
        '-i, --info [type]',
        'Print video info as JSON without downloading, pass json as type will export video info as JSON file',
        (value) => {
            const isMatch = new RegExp(/^(json)$/).test(value);
            if (isMatch) return value;
            else {
                throw app.error(chalk.red.bold('Info formats Can be only [json]'));
            }
        }
    )
    .option('-q, --quality <ITAG>', 'Video quality to download, default: highest')
    .option('-o, --output <FILE>', 'Save to file, default: video title')
    .option(
        '-f, --filter <STR>',
        'Can be [videoonly, default: audio]',
        (value) => {
            const isMatch = new RegExp(/^(video|audio)(only)?$/).test(value);
            if (isMatch) return value;
            else {
                throw app.error(
                    chalk.red.bold(
                        'Quality filter Can be only [video, videoonly, audio, audioonly]'
                    )
                );
            }
        }
    )
    .option('-p, --print-url', 'Print direct download URL')
    .option('-e, --ext [ext]', 'change output video extension', (value) => {
        const isMatch = new RegExp(/^(mp3|mp4)$/).test(value);
        if (isMatch) return value;
        else {
            throw app.error(chalk.red.bold('video extension Can be only [mp3, mp4]'));
        }
    })

    .showSuggestionAfterError(true)
    .addHelpText(
        'after',
        `
Usage:
  $ yt-dld -i <url>
  $ yt-dld -o videoTitle <url>

Examples:
  $ yt-dld "http://www.youtube.com/watch?v=AwRAfxBub9M"
  $ yt-dld -o new song "http://www.youtube.com/watch?v=AwRAfxBub9M" 
`
    )
    .parse(process.argv);

const URL = app.args[0],
    options = app.opts();

if(options.info) {
    await oraPromise(ytdl.getInfo(URL), 'Get video data ...')
        .then((info) => {
            if(options.info === 'json') {
                exportInfoAsJson(info);
            }

            printVideoBasicInfo(
                info, info.formats.some((f) => f.isLive)
            );
            console.log('\n');
            printVideoFormats(info)
        })
        .catch((error) => onerror(error));
} else {
	const ytdlOptions = {};

	// quality filter
	ytdlOptions.quality = /,/.test(options.quality)
		? options.quality.split(',')
		: options.quality;

	// Create filters
	const filters = [];

	// Support basic ytdl-core filters manually, so that other
	// cli filters are supported when used together.
	const hasVideo = (format) => !!format.qualityLabel;
	const hasAudio = (format) => !!format.audioBitrate;

	switch (options.filter) {
		case 'videoonly':
			filters.push([
				'videoonly',
				(format) => hasVideo(format) && !hasAudio(format),
			]);
			break;

		case 'audio':
			filters.push(['audio', hasAudio]);
			break;

		// case 'audioonly':
		// 	filters.push([
		// 		'audioonly',
		// 		(format) => !hasVideo(format) && hasAudio(format),
		// 	]);
		// 	break;
        default:
            filters.push(['audio', hasAudio]);
            break;
	}

	ytdlOptions.filter = (format) => {
		return filters.every((filter) => filter[1](format));
	};

	// Print direct download URL
	if (options.printUrl) {
		try {
			const videoResult = await oraPromise(
				ytdl.getInfo(URL),
				'Get direct download URL...'
			);

			console.log(
				chalk.green(ytdl.chooseFormat(videoResult.formats, ytdlOptions).url)
			);
			process.exit();
		} catch (error) {
			onError(error);
		}
	}

	try {
		const readStream = await oraPromise(
            Promise.resolve(ytdl(URL, ytdlOptions)),
			'Reading stream...'
		);

		const stdoutMutable =
			process.stdout && process.stdout.cursorTo && process.stdout.clearLine;

		mkdir(DOWNLOAD_DIR);

		readStream.on('info', (info, format) => {
			let videoTitle = `${sanitize(options.output || info.videoDetails.title, {
				replacement: '-',
			})}.${options.ext ? options.ext : 'mp4'}`;

			readStream.pipe(fs.createWriteStream(`${DOWNLOAD_DIR}/${videoTitle}`));

			printVideoBasicInfo(info, format.isLive);
			printFormatInfo(format, videoTitle);

			// get video length
			if (format.contentLength) {
				printVideoProgressBar(
					stdoutMutable,
					readStream,
					parseInt(format.contentLength, 10)
				);
			} else {
				readStream.once('response', (res) => {
					if (res.headers['content-length']) {
						const size = parseInt(res.headers['content-length'], 10);
						printVideoProgressBar(stdoutMutable, readStream, size);
					}
				});
			}
		});
		readStream.on('error', (err) => {
			if (/No such format found/.test(err.message) && filters.length) {
				console.log(
					chalk.red(
						`No videos matching quality: ${options.quality} & filters: ${filters
							.map((filter) => filter[0])
							.join(', ')}`
					)
				);
			} else {
				onError(err);
			}
			process.exit(1);
		});
	} catch (error) {
		onError(error);
	}
}
