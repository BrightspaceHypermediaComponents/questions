import puppeteer from 'puppeteer';
import { VisualDiff } from '@brightspace-ui/visual-diff';

describe('d2l-questions-multiple-choice', () => {

	const visualDiff = new VisualDiff('d2l-questions-multiple-choice', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/test/d2l-questions-multiple-choice.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
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

		it('unanswered', async function() {
			const rect = await visualDiff.getRect(page, '#multiple-choice-unanswered');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('readonly', async function() {
			const rect = await visualDiff.getRect(page, '#multiple-choice-readonly');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('readonly-correct', async function() {
			const rect = await visualDiff.getRect(page, '#multiple-choice-readonly-correct');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('readonly-incorrect', async function() {
			const rect = await visualDiff.getRect(page, '#multiple-choice-readonly-incorrect');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});
});
