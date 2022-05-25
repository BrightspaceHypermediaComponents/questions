import '../components/d2l-questions-question.js';
import { elementUpdated, expect, fixture, html } from '@open-wc/testing';
import { Classes } from 'd2l-hypermedia-constants';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';
import { stub } from 'sinon';

describe('d2l-questions-question', () => {

	const QUESTION_HREF_1 = 'questionHref1';
	const QUESTION_HREF_2 = 'questionHref2';
	const RESPONSE_HREF_1 = 'responseHref1';
	const RESPONSE_HREF_2 = 'responseHref2';

	it('should construct', () => {
		runConstructor('d2l-questions-question');
	});

	it('should update data when question href changes', async() => {
		const elem = await fixture(html` <d2l-questions-question question-href=${QUESTION_HREF_1}></d2l-questions-question> `);
		const stubGetQuestion = stub(elem, '_getQuestion').callsFake(() => { elem._questionType = Classes.questions.multipleChoice; });
		elem.questionHref = QUESTION_HREF_2;
		await elementUpdated(elem);
		expect(stubGetQuestion).to.have.been.calledOnce;
	});

	it('should update data when question response href changes', async() => {
		const elem = await fixture(html` <d2l-questions-question question-href=${QUESTION_HREF_1} response-href=${RESPONSE_HREF_1}></d2l-questions-question> `);
		const stubGetQuestion = stub(elem, '_getQuestion').callsFake(() => { elem._questionType = Classes.questions.multipleChoice; });
		elem.questionResponseHref = RESPONSE_HREF_2;
		await elementUpdated(elem);
		expect(stubGetQuestion).to.have.been.calledOnce;
	});

});
