function toHumanTime(seconds = 0) {
	const [hour, minute, second, sign] =
		seconds > 0
			? [seconds / 3600, (seconds / 60) % 60, seconds % 60, '']
			: [-seconds / 3600, (-seconds / 60) % 60, -seconds % 60, '-'];

	return (
		sign +
		[hour, minute, second]
			.map((v) => `${Math.floor(v)}`.padStart(2, '0'))
			.join(':')
	);
}

function toHumanSize(bytes = 0) {
	const suffixes = ['B', 'kB', 'MB', 'GB', 'TB'];
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${suffixes[i]}`;
}

export { toHumanSize, toHumanTime };