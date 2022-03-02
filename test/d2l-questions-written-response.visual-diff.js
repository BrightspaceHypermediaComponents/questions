import puppeteer from 'puppeteer';
import { VisualDiff } from '@brightspace-ui/visual-diff';

describe('d2l-questions-written-response', () => {

	const visualDiff = new VisualDiff('d2l-questions-written-response', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/test/d2l-questions-written-response.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(async() => await browser.close());

	describe('written-response', () => {
		it('default', async function() {
			const rect = await visualDiff.getRect(page, '#written-response-readonly');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('readonly-no-response', async function() {
			const rect = await visualDiff.getRect(page, '#written-response-readonly-no-response');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('readonly-no-answer-key', async function() {
			const rect = await visualDiff.getRect(page, '#written-response-readonly-no-answer-key');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});
});
