export function extractYoutubeId(url: string) {
	const match = url.match(/(?:v=|youtu\.be\/)([\w-]{11})/);
	return match?.[1] ?? url;
}

export function youtubeThumbnailUrl(url: string) {
	return `https://img.youtube.com/vi/${extractYoutubeId(url)}/hqdefault.jpg`;
}
