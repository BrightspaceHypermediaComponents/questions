import { blankUnanswered, blankCorrect, blankIncorrect, blanksCorrect, blanksIncorrect } from './d2l-questions-short-answer-presentational-data.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('short-answer-presentational-axe', () => {

	it('unanswered', async() => {
		const el = await fixture(html`
			<d2l-questions-short-answer-presentational
				question-text="<p>Who was the first <b>female</b> astronaut?</p>"
				.choices=${blankUnanswered}>
			</d2l-questions-short-answer-presentational>`);
		el.choices = blanksUnanswered;
		await expect(el).to.be.accessible();
	});

	it('single-correct', async() => {
		const el = await fixture(html`
			<d2l-questions-short-answer-presentational
				question-text="<p>Who was the first <b>female</b> astronaut?</p>"
				.choices=${blankCorrect}>
			</d2l-questions-short-answer-presentational>`);
		await expect(el).to.be.accessible();
	});

	it('single-incorrect', async() => {
		const el = await fixture(html`
			<d2l-questions-short-answer-presentational
				question-text="<p>Who was the first <b>female</b> astronaut?</p>"
				.choices=${blankIncorrect}>
			</d2l-questions-short-answer-presentational>`);
		await expect(el).to.be.accessible();
	});

	it('multi-correct', async() => {
		const el = await fixture(html`
			<d2l-questions-short-answer-presentational
				question-text="What are the names of the 3 Rice Krispie elves?"
				.choices=${blanksCorrect}>
			</d2l-questions-short-answer-presentational>`);
		await expect(el).to.be.accessible();
	});

	it('multi-incorrect', async () => {
		const el = await fixture(html`
			<d2l-questions-short-answer-presentational
				question-text="What are the names of the 3 Rice Krispie elves?"
				.choices=${blanksIncorrect}>
			</d2l-questions-short-answer-presentational>`);
		await expect(el).to.be.accessible();
	});

});
