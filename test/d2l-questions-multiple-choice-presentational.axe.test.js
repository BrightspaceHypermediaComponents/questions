import { choicesCorrect, choicesIncorrect, choicesUnanswered } from './d2l-questions-multiple-choice-presentational-data.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('multiple-choice-presentational-axe', () => {

	it('answered', async() => {
		const el = await fixture(html`
			<d2l-questions-multiple-choice-presentational
				question-text="Test Text"
				.choices=${choicesCorrect}>
			</d2l-questions-multiple-choice-presentational>`);
		await expect(el).to.be.accessible();
	});

	it('unanswered', async() => {
		const el = await fixture(html`
			<d2l-questions-multiple-choice-presentational
				question-text="Test Text"
				.choices=${choicesUnanswered}>
			</d2l-questions-multiple-choice-presentational>`);
		el.choices = choicesUnanswered;
		await expect(el).to.be.accessible();
	});

	it('readonly-correct', async() => {
		const el = await fixture(html`
			<d2l-questions-multiple-choice-presentational
				readonly
				question-text="Test Text"
				.choices=${choicesCorrect}>
			</d2l-questions-multiple-choice-presentational>`);
		await expect(el).to.be.accessible();
	});

	it('readonly-incorrect', async() => {
		const el = await fixture(html`
			<d2l-questions-multiple-choice-presentational
				readonly
				question-text="Test Text"
				.choices=${choicesIncorrect}>
			</d2l-questions-multiple-choice-presentational>`);
		await expect(el).to.be.accessible();
	});

	it('readonly-unanswered', async() => {
		const el = await fixture(html`
			<d2l-questions-multiple-choice-presentational
				readonly
				question-text="Test Text"
				.choices=${choicesUnanswered}>
			</d2l-questions-multiple-choice-presentational>`);
		await expect(el).to.be.accessible();
	});

});
