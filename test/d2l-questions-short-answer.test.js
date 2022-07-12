// import '../components/d2l-questions-multiple-choice.js';
// import { Classes, Rels } from 'd2l-hypermedia-constants';
// import { elementUpdated, expect, fixture, html } from '@open-wc/testing';
// import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';
// import { stub } from 'sinon';

// describe('d2l-questions-multiple-choice', () => {

// 	// _loadChoices mocks
// 	const CHOICE_HREF = 'choiceHref';
// 	const CHOICE_HTML = '<p>Sample Option</p>';
// 	const CHOICE_TEXT = 'Sample Option';
// 	const CHOICES = [
// 		{
// 			href: CHOICE_HREF,
// 			htmlText: CHOICE_HTML,
// 			text: CHOICE_TEXT
// 		},
// 		{
// 			href: CHOICE_HREF,
// 			htmlText: CHOICE_HTML,
// 			text: CHOICE_TEXT
// 		},
// 		{
// 			href: CHOICE_HREF,
// 			htmlText: CHOICE_HTML,
// 			text: CHOICE_TEXT
// 		},
// 		{
// 			href: CHOICE_HREF,
// 			htmlText: CHOICE_HTML,
// 			text: CHOICE_TEXT
// 		}
// 	];
// 	const CHOICE_ENTITY = {
// 		entity: {
// 			getSubEntityByClass: function(entityClass) {
// 				return entityClass === Classes.text.richtext ? {
// 					properties: {
// 						html: CHOICE_HTML,
// 						text: CHOICE_TEXT
// 					}
// 				} : undefined;
// 			}
// 		}
// 	};
// 	const INTERACTION_HREF = 'interactionHref';
// 	const INTERACTION_ENTITY = {
// 		entity: {
// 			getSubEntitiesByClass: function(entityClass) {
// 				return entityClass === Classes.questions.simpleChoice ? [
// 					{ href: CHOICE_HREF },
// 					{ href: CHOICE_HREF },
// 					{ href: CHOICE_HREF },
// 					{ href: CHOICE_HREF }
// 				] : undefined;
// 			}
// 		}
// 	};
// 	const ITEM_BODY_HREF = 'itemBodyHref';
// 	const ITEM_BODY_ENTITY = {
// 		entity: {
// 			getSubEntityByRel: function(entityRel) {
// 				return entityRel === Rels.Questions.interaction ? INTERACTION_HREF : undefined;
// 			}
// 		}
// 	};
// 	const QUESTION_TEXT = '<p>Sample Text</p>';
// 	const QUESTION_ENTITY = {
// 		entity: {
// 			getSubEntityByClass: function(entityClass) {
// 				return entityClass === Classes.questions.questionText ? {
// 					properties: {
// 						html: QUESTION_TEXT
// 					}
// 				} : undefined;
// 			},
// 			getSubEntityByRel: function(entityRel) {
// 				return entityRel === Rels.Questions.itemBody ? ITEM_BODY_HREF : undefined;
// 			}
// 		}
// 	};

// 	// _loadChoicesFromResponse mocks
// 	const CHOICES_RESPONSE = [
// 		{
// 			htmlText: CHOICE_HTML,
// 			text: CHOICE_TEXT,
// 			selected: true,
// 			correct: true,
// 			href: CHOICE_HREF
// 		},
// 		{
// 			htmlText: CHOICE_HTML,
// 			text: CHOICE_TEXT,
// 			selected: false,
// 			correct: false,
// 			href: CHOICE_HREF
// 		},
// 		{
// 			htmlText: CHOICE_HTML,
// 			text: CHOICE_TEXT,
// 			selected: false,
// 			correct: false,
// 			href: CHOICE_HREF
// 		},
// 		{
// 			htmlText: CHOICE_HTML,
// 			text: CHOICE_TEXT,
// 			selected: false,
// 			correct: false,
// 			href: CHOICE_HREF
// 		}
// 	];
// 	const CHOICE_RESPONSE = {
// 		getLinkByRel: function(rel) {
// 			return rel === Rels.Questions.identifier ? {
// 				href: CHOICE_HREF
// 			} : undefined;
// 		},
// 		hasClass: function(className) {
// 			return this.class.includes(className);
// 		},
// 		class: [Classes.questions.value]
// 	};
// 	const CHOICE_RESPONSE_CORRECT_SELECTED = {
// 		getLinkByRel: function(rel) {
// 			return rel === Rels.Questions.identifier ? {
// 				href: CHOICE_HREF
// 			} : undefined;
// 		},
// 		hasClass: function(className) {
// 			return this.class.includes(className);
// 		},
// 		class: [Classes.questions.value, Classes.questions.correctResponse, Classes.questions.selected]
// 	};
// 	const CANDIDATE_RESPONSE_ENTITY = {
// 		entities: [CHOICE_RESPONSE_CORRECT_SELECTED, CHOICE_RESPONSE, CHOICE_RESPONSE, CHOICE_RESPONSE]
// 	};
// 	const QUESTION_RESPONSE_ENTITY = {
// 		entity: {
// 			getSubEntityByClass: function(entityClass) {
// 				return entityClass === Classes.questions.candidateResponse ? CANDIDATE_RESPONSE_ENTITY : undefined;
// 			}
// 		}
// 	};

// 	function stubGetEntityFromHref(targetHref) {
// 		switch (targetHref) {
// 			case ITEM_BODY_HREF:
// 				return ITEM_BODY_ENTITY;
// 			case INTERACTION_HREF:
// 				return INTERACTION_ENTITY;
// 			case CHOICE_HREF:
// 				return CHOICE_ENTITY;
// 			default:
// 				throw 'unexpected href requested';
// 		}
// 	}

// 	it('should construct', () => {
// 		runConstructor('d2l-questions-multiple-choice');
// 	});

// 	it('should load question text', async() => {
// 		const elem = await fixture(html` <d2l-questions-multiple-choice></d2l-questions-multiple-choice> `);
// 		stub(elem, '_loadChoices').callsFake(() => { elem._choices = [];});
// 		elem.question = QUESTION_ENTITY;
// 		await elementUpdated(elem);
// 		expect(elem._questionTextHTML).to.equal(QUESTION_TEXT);
// 	});

// 	it('should load options for question', async() => {
// 		const elem = await fixture(html` <d2l-questions-multiple-choice></d2l-questions-multiple-choice> `);
// 		stub(elem, '_getEntityFromHref').callsFake(stubGetEntityFromHref);
// 		elem.question = QUESTION_ENTITY;
// 		await elementUpdated(elem);
// 		elem.addEventListener('d2l-questions-question-loaded', async() => {
// 			expect(elem._choices).to.deep.equal(CHOICES);
// 		});
// 	});

// 	it('should reload when question changes', async() => {
// 		const elem = await fixture(html` <d2l-questions-multiple-choice></d2l-questions-multiple-choice> `);
// 		const _loadQuestionDataStub = stub(elem, '_loadQuestionData');
// 		elem.question = QUESTION_ENTITY;
// 		await elementUpdated(elem);
// 		expect(_loadQuestionDataStub).to.have.callCount(1);
// 	});

// 	it('should load options from question response', async() => {
// 		const elem = await fixture(html` <d2l-questions-multiple-choice></d2l-questions-multiple-choice> `);
// 		stub(elem, '_getEntityFromHref').callsFake(stubGetEntityFromHref);
// 		elem.questionResponse = QUESTION_RESPONSE_ENTITY;
// 		elem.question = QUESTION_ENTITY;
// 		await elementUpdated(elem);
// 		elem.addEventListener('d2l-questions-question-loaded', async() => {
// 			expect(elem._choices).to.deep.equal(CHOICES_RESPONSE);
// 		});
// 	});

// 	it('should reload when question response changes', async() => {
// 		const elem = await fixture(html` <d2l-questions-multiple-choice></d2l-questions-multiple-choice> `);
// 		const _loadQuestionDataStub = stub(elem, '_loadQuestionData');
// 		elem.questionResponse = QUESTION_RESPONSE_ENTITY;
// 		await elementUpdated(elem);
// 		expect(_loadQuestionDataStub).to.have.callCount(1);
// 	});

// });
