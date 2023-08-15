
# `Yt-dld-Cli`

`yt-dld-cli` is a command line tool to download YouTube videos and playlists.

It's a node package, so it's available for (Windows, Linux and Mac) operating systems, all you need is [`Node.js`](https://nodejs.org/en/) installed on your system.

## Getting Start 🌠

Ensure that you have [`Node.js`](https://nodejs.org/en/) installed on your system, then you can install yt-dld using npm by this command:

> **Note** for Linux and Mac users need to execute the following command with `sudo`

```shell
npm install -g yt-dld
```

or using `yarn`:

```shell
yarn global add yt-dld
```

### Usage ✍️

```text
Usage: yt-dld [options] <url>

CLI to download youtube video using JavaScript utilities

Options:
  -v, --version         output the version number
  -i, --info [type]     Print video info as JSON without downloading, pass json
                        as type will export video info as JSON file
  -q, --quality <ITAG>  Video quality to download, default: highest
  -o, --output <FILE>   Save to file, default: video title
  -f, --filter <STR>    Can be [videoonly, default: audio]
  -p, --print-url       Print direct download URL
  -e, --ext [ext]       change output video extension
  -h, --help            display help for command

Usage:
  $ yt-dld <url> -i
  $ yt-dld <url> -o videoTitle

Examples:
  $ yt-dld "http://www.youtube.com/watch?v=AwRAfxBub9M"
  $ yt-dld "http://www.youtube.com/watch?v=AwRAfxBub9M" -o videoTitle
```

### Options

#### `version`

getting the app version simply type `-v` flag after `url`

it will ignore any other flags

```shell
yt-dld "http://www.youtube.com/watch?v=AwRAfxBub9M" -v
```

#### `info`

for get video info without downloading the video in `json` format or print info in console (default) add `-i` or `--info` flag

this will print video info in console

```shell
yt-dld "http://www.youtube.com/watch?v=AwRAfxBub9M" -i
```

to export video info as `json` format add `json` after `-i` flag.

but be **aware** of the following:

- the exported file (report) will be in `./tube/reports` directory
- the directory will be created if not exist
- also will overwrite existing reports
- the exported report will be fully informative like response, related video and more

```shell
yt-dld "http://www.youtube.com/watch?v=AwRAfxBub9M" -i json
```

the preview of print on console will be like this:

```txt
title:       Life story || 30 sec whatsapp motivational video status
author:      STATUS                                          
avg rating:  (null)                                                 
views:       1,911,403                                              
length:      00:00:31                                               


formats:

itag container quality codecs                 bitrate   audio bitrate size     
---- --------- ------- ---------------------- --------- ------------- ---------
  18 mp4       360p    avc1.42001E, mp4a.40.2 232.90 kB 96KB          893.76 kB
 243 webm      360p    vp9                    94.78 kB                278.91 kB
 396 mp4       360p    av01.0.01M.08          91.36 kB                275.50 kB
 134 mp4       360p    avc1.4d401e            62.49 kB                175.55 kB
 395 mp4       240p    av01.0.00M.08          62.80 kB                190.99 kB
 242 webm      240p    vp9                    56.51 kB                167.78 kB
 133 mp4       240p    avc1.4d4015            42.70 kB                122.24 kB
 394 mp4       144p    av01.0.00M.08          58.93 kB                190.85 kB
 278 webm      144p    vp9                    47.57 kB                158.64 kB
 160 mp4       144p    avc1.4d400c            28.08 kB                81.77 kB 
 251 webm              opus                             160KB         524.53 kB
 140 mp4               mp4a.40.2                        128KB         488.10 kB
 250 webm              opus                             64KB          258.95 kB
 249 webm              opus                             48KB          194.91 kB
```

#### `output`

change the download video title to what you want just add `-o` followed by the new title

but be **aware** of the following:

- the directory will be created if not exist
- also will overwrite existing videos
- the title will be sanitize using [`sanitize-filename`](https://www.npmjs.com/package/sanitize-filename) package

```shell
yt-dld "http://www.youtube.com/watch?v=AwRAfxBub9M" -o newVideoTitle
```

#### `print-url`

what a feature you can take the url of video without downloading it, it will print on console

also, you can get the URL of the video with filters like audio, onlyvideo...etc

```shell
yt-dld "http://www.youtube.com/watch?v=AwRAfxBub9M" -p
```

#### `quality`

change the quality of the video with `itag` number, it will throw an error if the quality is not supported or founded

```shell
yt-dld "http://www.youtube.com/watch?v=AwRAfxBub9M" -q 140
```

#### `filter`

change the filter of downloaded video it Can be one of `[videoonly, default: audio]`, also , it will throw an error if the filter is not one of them

```shell
yt-dld "http://www.youtube.com/watch?v=AwRAfxBub9M" -f audioonly
```

#### `ext`

this is useful for change extension of the video (default `mp4`) for now it supports only `[mp3, mp4]`

```shell
yt-dld "http://www.youtube.com/watch?v=AwRAfxBub9M" -e mp3
```

## dev mode ⭐

## Features

- User friendly command line interface.
- Download single YouTube video.
- Download YouTube playlist.
- Supports all available video formats and qualities.
- Playlists organized to folders by their names.

## Used Package 🧰

- [`commander.js`](https://github.com/tj/commander.js)
- [`ora`](https://www.npmjs.com/package/ora)
- [`chalk`](https://www.npmjs.com/package/chalk)
- [`cli-progress`](https://www.npmjs.com/package/cli-progress)
- [`inquirer`](https://www.npmjs.com/package/inquirer)
- [`list-it`](https://www.npmjs.com/package/list-it)
- [`sanitize-filename`](https://www.npmjs.com/package/sanitize-filename)
- [`ytdl-core`](https://www.npmjs.com/package/ytdl-core)
- [`streamspeed`](https://www.npmjs.com/package/streamspeed)
