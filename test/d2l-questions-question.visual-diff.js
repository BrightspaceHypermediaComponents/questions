import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-questions-question', () => {

	const visualDiff = new VisualDiff('d2l-questions-question', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/test/d2l-questions-question.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(async() => await browser.close());

	describe('multiple-choice', () => {
		it('default', async function() {
			const rect = await visualDiff.getRect(page, '#multiple-choice');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('default readonly', async function() {
			const rect = await visualDiff.getRect(page, '#multiple-choice-readonly');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('incorrect', async function() {
			const rect = await visualDiff.getRect(page, '#multiple-choice-incorrect');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('incorrect readonly', async function() {
			const rect = await visualDiff.getRect(page, '#multiple-choice-incorrect-readonly');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});
});
