import '../components/d2l-questions-question.js';
import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

describe('D2lQuestionsQuestion', () => {

	describe('accessibility', () => {
		it('should pass all aXe tests', async() => {
			const el = await fixture(html`
					<d2l-questions-question
						question-href="./data/question-multiple-choice.json"
						question-response-href="./data/question-multiple-choice-response.json"
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
