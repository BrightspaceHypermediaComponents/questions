export function removeParagraphFormat(htmlText) {
	if (htmlText === undefined || htmlText === '') {
		return '';
	}

	if (htmlText.startsWith('<p>') &&
			htmlText.endsWith('</p>') &&
				(htmlText.indexOf('<p>') ===
					htmlText.lastIndexOf('<p>'))) {
		return htmlText.substring(3, htmlText.length - 4);
	}

	return htmlText;
}
