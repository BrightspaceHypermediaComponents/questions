import { blanksUnanswered, blankCorrect, blankIncorrect, blanksCorrect, blanksIncorrect } from './d2l-questions-short-answer-presentational-data.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('short-answer-presentational-axe', () => {

	it('answered', async() => {
		const el = await fixture(html`
			<d2l-questions-short-answer-presentational
				question-text="Test Text"
				.choices=${blankCorrect}>
			</d2l-questions-short-answer-presentational>`);
		await expect(el).to.be.accessible();
	});

	it('unanswered', async() => {
		const el = await fixture(html`
			<d2l-questions-short-answer-presentational
				question-text="Test Text"
				.choices=${blanksUnanswered}>
			</d2l-questions-short-answer-presentational>`);
		el.choices = blanksUnanswered;
		await expect(el).to.be.accessible();
	});

	it('single-correct', async() => {
		const el = await fixture(html`
			<d2l-questions-short-answer-presentational
				question-text="Test Text"
				.choices=${blankCorrect}>
			</d2l-questions-short-answer-presentational>`);
		await expect(el).to.be.accessible();
	});

	it('single-incorrect', async() => {
		const el = await fixture(html`
			<d2l-questions-short-answer-presentational
				question-text="Test Text"
				.choices=${blankIncorrect}>
			</d2l-questions-short-answer-presentational>`);
		await expect(el).to.be.accessible();
	});

	it('multi-correct', async() => {
		const el = await fixture(html`
			<d2l-questions-short-answer-presentational
				question-text="Test Text"
				.choices=${blanksCorrect}>
			</d2l-questions-short-answer-presentational>`);
		await expect(el).to.be.accessible();
	});

	it('multi-incorrect', async () => {
		const el = await fixture(html`
			<d2l-questions-short-answer-presentational
				question-text="Test Text"
				.choices=${blanksIncorrect}>
			</d2l-questions-short-answer-presentational>`);
		await expect(el).to.be.accessible();
	});

});
