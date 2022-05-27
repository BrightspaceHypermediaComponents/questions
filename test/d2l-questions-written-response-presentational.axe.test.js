import { answerKey, emptyResponse, emptyResponseWordCount, longResponseText, longResponseText2, longResponseWordCount, longResponseWordCount2, multipleAttachments, questionText, responseText, singleAttachment, wordCount } from './d2l-questions-written-response-presentational-data.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('written-response-presentational-axe', () => {

	it('readonly-response', async() => {
		const el = await fixture(html`
			<d2l-questions-written-response-presentational
                .questionText=${questionText}
                .responseText=${responseText}
                .answerKey=${answerKey}
                .responseLength=${wordCount}
				readonly>
			</d2l-questions-written-response-presentational>`);
		await expect(el).to.be.accessible();
	});

	it('readonly-no-response', async() => {
		const el = await fixture(html`
			<d2l-questions-written-response-presentational
                .questionText=${questionText}
                .answerKey=${answerKey}
				readonly>
			</d2l-questions-written-response-presentational>`);
		await expect(el).to.be.accessible();
	});

	it('readonly-no-answer-key', async() => {
		const el = await fixture(html`
			<d2l-questions-written-response-presentational
                .questionText=${questionText}
                .responseText=${responseText}
                .responseLength=${wordCount}
				readonly>
			</d2l-questions-written-response-presentational>`);
		await expect(el).to.be.accessible();
	});

	it('readonly-empty-response', async() => {
		const el = await fixture(html`
			<d2l-questions-written-response-presentational
                .questionText=${questionText}
                .responseText=${emptyResponse}
                .answerKey=${answerKey}
                .responseLength=${emptyResponseWordCount}
				readonly>
			</d2l-questions-written-response-presentational>`);
		await expect(el).to.be.accessible();
	});

	it('readonly-single-attachment', async() => {
		const el = await fixture(html`
			<d2l-questions-written-response-presentational
                .questionText=${questionText}
                .responseText=${longResponseText}
                .answerKey=${answerKey}
                .responseLength=${longResponseWordCount}
				.responseAttachments=${singleAttachment}
				readonly>
			</d2l-questions-written-response-presentational>`);
		await expect(el).to.be.accessible();
	});

	it('readonly-multiple-attachment', async() => {
		const el = await fixture(html`
			<d2l-questions-written-response-presentational
                .questionText=${questionText}
                .responseText=${longResponseText2}
                .answerKey=${answerKey}
                .responseLength=${longResponseWordCount2}
				.responseAttachments=${multipleAttachments}
				readonly>
			</d2l-questions-written-response-presentational>`);
		await expect(el).to.be.accessible();
	});

});
