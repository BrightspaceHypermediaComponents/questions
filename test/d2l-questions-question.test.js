import '../components/d2l-questions-question.js';
import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

describe('D2lQuestionsQuestion', () => {

	describe('accessibility', () => {
		it('multiple-choice pass all aXe tests', async() => {
			const el = await fixture(html`
					<d2l-questions-question
						question-href="./data/multiple-choice/question.json"
						question-response-href="./data/multiple-choice/question-response-correct.json"
						token="token">
					</d2l-questions-question>
				`);
			await expect(el).to.be.accessible();
		});

		it('written-response pass all aXe tests', async() => {
			const el = await fixture(html`
					<d2l-questions-question
						question-href="./data/written-response/question.json"
						question-response-href="./data/written-response/question-response.json"
						token="token">
					</d2l-questions-question>
				`);
			await expect(el).to.be.accessible();
		});
	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-questions-question');
		});
	});
});
