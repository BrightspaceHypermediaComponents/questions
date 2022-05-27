import '../components/d2l-questions-written-response.js';
import { Classes, Rels } from 'd2l-hypermedia-constants';
import { elementUpdated, expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';
import { stub } from 'sinon';

describe('d2l-questions-written-response', () => {

	// Load question mocks
	const ANSWER_KEY_TEXT = '<p>Sample Answer Key</p>';
	const ANSWER_KEY_ENTITY = {
		properties: {
			html: ANSWER_KEY_TEXT
		}
	};
	const ITEM_BODY_HREF = 'itemBodyHref';
	const ITEM_BODY_ENTITY = {
		entity: {
			getSubEntityByClass: function(entityClass) {
				return entityClass === Classes.text.richtext ? ANSWER_KEY_ENTITY : undefined;
			}
		}
	};
	const QUESTION_TEXT = '<p>Sample Text</p>';
	const QUESTION_ENTITY = {
		entity: {
			getSubEntityByClass: function(entityClass) {
				return entityClass === Classes.questions.questionText ? {
					properties: {
						html: QUESTION_TEXT
					}
				} : undefined;
			},
			getSubEntityByRel: function(entityRel) {
				return entityRel === Rels.Questions.itemBody ? ITEM_BODY_HREF : undefined;
			}
		}
	};

	// Load response mocks
	const FILE_OBJECT = {
		extension: '.extension',
		href: 'http://sample-href.d2l:44446/SampleAttachment.extension?ou=6609',
		name: 'SampleAttachment.extension',
		size: 123
	};
	const RESPONSE_ATTACHMENTS = [
		FILE_OBJECT, FILE_OBJECT
	];
	const FILE_UPLOAD_ENTITY = {
		entities: [
			{ properties: FILE_OBJECT },
			{ properties: FILE_OBJECT }
		]
	};
	const RESPONSE_TEXT = '<p>Sample Response</p>';
	const RESPONSE_LENGTH = 2;
	const RESPONSE_TEXT_ENTITY = {
		properties: {
			html: RESPONSE_TEXT,
			wordCount: RESPONSE_LENGTH
		}
	};
	const RESPONSE_ENTITY = {
		getSubEntityByClass: function(entityClass) {
			return entityClass === Classes.text.richtext ? RESPONSE_TEXT_ENTITY : undefined;
		}
	};
	const QUESTION_RESPONSE_ENTITY = {
		entity: {
			getSubEntityByClass: function(entityClass) {
				switch (entityClass) {
					case Classes.questions.candidateResponse:
						return RESPONSE_ENTITY;
					case 'file-upload':
						return FILE_UPLOAD_ENTITY;
					default:
						return undefined;
				}
			}
		}
	};

	function stubGetEntityFromHref(targetHref) {
		switch (targetHref) {
			case ITEM_BODY_HREF:
				return ITEM_BODY_ENTITY;
			default:
				throw 'unexpected href requested';
		}
	}

	it('should construct', () => {
		runConstructor('d2l-questions-written-response');
	});

	it('should load the question text', async() => {
		const elem = await fixture(html` <d2l-questions-written-response></d2l-questions-written-response> `);
		stub(elem, '_loadAnswerKey').callsFake(() => { elem._answerKey = '';});
		elem.question = QUESTION_ENTITY;
		await elementUpdated(elem);
		elem.addEventListener('d2l-questions-question-loaded', async() => {
			expect(elem._questionText).to.equal(QUESTION_TEXT);
		});
	});

	it('should load the answer key', async() => {
		const elem = await fixture(html` <d2l-questions-written-response></d2l-questions-written-response> `);
		stub(elem, '_getEntityFromHref').callsFake(stubGetEntityFromHref);
		elem.question = QUESTION_ENTITY;
		await elementUpdated(elem);
		elem.addEventListener('d2l-questions-question-loaded', async() => {
			expect(elem._answerKey).to.equal(ANSWER_KEY_TEXT);
		});
	});

	it('should reload when question changes', async() => {
		const elem = await fixture(html` <d2l-questions-written-response></d2l-questions-written-response> `);
		const _loadQuestionTextStub = stub(elem, '_loadQuestionText');
		const _loadAnswerKeyStub = stub(elem, '_loadAnswerKey');
		elem.question = QUESTION_ENTITY;
		await elementUpdated(elem);
		expect(_loadQuestionTextStub).to.have.callCount(1);
		expect(_loadAnswerKeyStub).to.have.callCount(1);
	});

	it('should load the question response', async() => {
		const elem = await fixture(html` <d2l-questions-written-response></d2l-questions-written-response> `);
		stub(elem, '_loadQuestionText').callsFake(() => { elem._questionText = '';});
		stub(elem, '_loadAnswerKey').callsFake(() => { elem._answerKey = '';});
		elem.questionResponse = QUESTION_RESPONSE_ENTITY;
		elem.question = QUESTION_ENTITY;
		await elementUpdated(elem);
		elem.addEventListener('d2l-questions-question-loaded', async() => {
			expect(elem._responseText).to.equal(RESPONSE_TEXT);
			expect(elem._responseLength).to.equal(RESPONSE_LENGTH);
		});
	});

	it('should load the question response attachments', async() => {
		const elem = await fixture(html` <d2l-questions-written-response></d2l-questions-written-response> `);
		stub(elem, '_loadQuestionText').callsFake(() => { elem._questionText = '';});
		stub(elem, '_loadAnswerKey').callsFake(() => { elem._answerKey = '';});
		elem.questionResponse = QUESTION_RESPONSE_ENTITY;
		elem.question = QUESTION_ENTITY;
		await elementUpdated(elem);
		elem.addEventListener('d2l-questions-question-loaded', async() => {
			expect(elem._responseAttachments).to.deep.equal(RESPONSE_ATTACHMENTS);
		});
	});

	it('should reload when question response changes', async() => {
		const elem = await fixture(html` <d2l-questions-written-response></d2l-questions-written-response> `);
		const _loadResponseStub = stub(elem, '_loadResponse');
		const _loadResponseAttachmentsStub = stub(elem, '_loadResponseAttachments');
		const _loadQuestionTextStub = stub(elem, '_loadQuestionText');
		const _loadAnswerKeyStub = stub(elem, '_loadAnswerKey');
		elem.questionResponse = QUESTION_RESPONSE_ENTITY;
		await elementUpdated(elem);
		expect(_loadResponseStub).to.have.callCount(1);
		expect(_loadResponseAttachmentsStub).to.have.callCount(1);
		// Should not reload question text or answer key
		expect(_loadQuestionTextStub).to.have.callCount(0);
		expect(_loadAnswerKeyStub).to.have.callCount(0);
	});

});
