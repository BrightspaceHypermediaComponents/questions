import puppeteer from 'puppeteer';
import { VisualDiff } from '@brightspace-ui/visual-diff';

describe('d2l-questions-true-false', () => {

	const visualDiff = new VisualDiff('d2l-questions-true-false', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/test/d2l-questions-true-false.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(async() => await browser.close());

	describe('true-false', () => {
		it('default', async function() {
			const rect = await visualDiff.getRect(page, '#true-false');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('unanswered', async function() {
			const rect = await visualDiff.getRect(page, '#true-false-unanswered');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('readonly', async function() {
			const rect = await visualDiff.getRect(page, '#true-false-readonly');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('readonly-correct', async function() {
			const rect = await visualDiff.getRect(page, '#true-false-readonly-correct');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('readonly-incorrect', async function() {
			const rect = await visualDiff.getRect(page, '#true-false-readonly-incorrect');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('skeleton-default', async function() {
			const rect = await visualDiff.getRect(page, '#true-false-skeleton');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('skeleton-readonly', async function() {
			const rect = await visualDiff.getRect(page, '#true-false-skeleton-readonly');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});
});
