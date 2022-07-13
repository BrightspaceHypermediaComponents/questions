import puppeteer from 'puppeteer';
import { VisualDiff } from '@brightspace-ui/visual-diff';

describe('d2l-questions-short-answer', () => {

	const visualDiff = new VisualDiff('d2l-questions-short-answer', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/test/d2l-questions-short-answer.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(async() => await browser.close());

	describe('short-answer', () => {

		it('unanswered', async function() {
			const rect = await visualDiff.getRect(page, '#short-answer-unanswered');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('single-blank-correct', async function() {
			const rect = await visualDiff.getRect(page, '#short-answer-single-blank-correct');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('single-blank-incorrect', async function() {
			const rect = await visualDiff.getRect(page, '#short-answer-single-blank-incorrect');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('multi-blank-correct', async function () {
			const rect = await visualDiff.getRect(page, '#short-answer-multi-blank-correct');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('multi-blank-incorrect', async function () {
			const rect = await visualDiff.getRect(page, '#short-answer-multi-blank-incorrect');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

	});
});
