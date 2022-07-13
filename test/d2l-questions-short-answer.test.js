import '../components/d2l-questions-multiple-choice.js';
import { Classes, Rels } from 'd2l-hypermedia-constants';
import { elementUpdated, expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';
import { stub } from 'sinon';

describe('d2l-questions-multiple-choice', () => {

	// _loadQuestionData mocks
	const QUESTION_TEXT = '<p>Name the first two colours of the rainbow.</p>';
	const QUESTION_ENTITY = {
		entity: {
			getSubEntityByClass: function(entityClass) {
				return entityClass === Classes.questions.questionText ? {
					properties: {
						html: QUESTION_TEXT
					}
				} : undefined;
			}
		}
	};

    // _loadBlanks mocks
    const RESPONSE_DECLARATION_HREF_1 = 'responseDeclarationHref1';
    const RESPONSE_DECLARATION_HREF_2 = 'responseDeclarationHref2';
    const MAP_ENTRY_HREF_1 = 'mapEntryHref1';
    const MAP_ENTRY_HREF_2 = 'mapEntryHref2';
    const CORRECT_RESPONSE_TEXT = 'Red';
    const INCORRECT_RESPONSE_TEXT = 'Blue';
    const CORRECT_TEXT_1 = 'Red';
    const CORRECT_TEXT_2 = 'Orange';

    const QUESTION_RESPONSE_ENTITY = {
        entity: {
            getSubEntitiesByClass: function (entityClass) {
                return entityClass === Classes.questions.candidateResponse ? CANDIDATE_RESPONSE_ENTITIES : undefined;
            }
        }
    };
    const CANDIDATE_RESPONSE_ENTITIES = {
        entities: [
            {
                getSubEntityByClass: function (entityClass) {
                    return entityClass === Classes.questions.value ? {
                        properties: {
                            response: CORRECT_RESPONSE_TEXT
                        },
                        class: [Classes.questions.correctResponse]
                    } : undefined;
                },
                getLinkByRel: function (rel) {
                    return rel === Rels.Questions.responseDeclaration ? {
                        href: RESPONSE_DECLARATION_HREF_1
                    } : undefined;
                }
            },
            {
                getSubEntityByClass: function (entityClass) {
                    return entityClass === Classes.questions.value ? {
                        properties: {
                            response: INCORRECT_RESPONSE_TEXT
                        },
                        class: [Classes.questions.correctResponse]
                    } : undefined;
                },
                getLinkByRel: function (rel) {
                    return rel === Rels.Questions.responseDeclaration ? {
                        href: RESPONSE_DECLARATION_HREF_2
                    } : undefined;
                }
            }
        ]
    };
    const RESPONSE_DECLARATION_ENTITY_1 = {
        entity: {
            getSubEntityByClass: function (entityClass) {
                return entityClass === Classes.questions.mapping ? {
                    entity: {
                        getSubEntityByClass: function (entityClass) {
                            return entityClass === Classes.questions.mapEntry ? {
                                MAP_ENTRY_ENTITY_1
                            } : undefined;
                        }
                    }
                } : undefined;
            }
        }
    };
    const RESPONSE_DECLARATION_ENTITY_2 = {
        entity: {
            getSubEntityByClass: function (entityClass) {
                return entityClass === Classes.questions.mapping ? {
                    entity: {
                        getSubEntityByClass: function (entityClass) {
                            return entityClass === Classes.questions.mapEntry ? {
                                MAP_ENTRY_ENTITY_2
                            } : undefined;
                        }
                    }
                } : undefined;
            }
        }
    };
    const MAP_ENTRY_ENTITY_1 = {
        href: MAP_ENTRY_HREF_1,
        entity: {
            properties: {
                key: CORRECT_TEXT_1,
                value: 50
            },
        }
    };
    const MAP_ENTRY_ENTITY_2 = {
        href: MAP_ENTRY_HREF_2,
        entity: {
            properties: {
                key: CORRECT_TEXT_2,
                value: 50
            },
        }
    };
	const BLANKS_RESPONSE = [
		{
            responseText: CORRECT_RESPONSE_TEXT,
            correctAnswerText: CORRECT_TEXT_1,
            value: MAP_ENTRY_ENTITY_1.entity.properties.value,
            correct: true
		},
		{
            responseText: INCORRECT_RESPONSE_TEXT,
            correctAnswerText: CORRECT_TEXT_2,
            value: MAP_ENTRY_ENTITY_2.entity.properties.value,
            correct: false
		}
	];

	function stubGetEntityFromHref(targetHref) {
		switch (targetHref) {
			case RESPONSE_DECLARATION_HREF_1:
                return RESPONSE_DECLARATION_ENTITY_1;
            case RESPONSE_DECLARATION_HREF_2:
                return RESPONSE_DECLARATION_ENTITY_2;
			case MAP_ENTRY_HREF_1:
                return MAP_ENTRY_ENTITY_1;
            case MAP_ENTRY_HREF_2:
                return MAP_ENTRY_ENTITY_2;
			default:
				throw 'unexpected href requested';
		}
	}

	it('should construct', () => {
		runConstructor('d2l-questions-short-answer');
	});

	it('should load question text', async() => {
        const elem = await fixture(html` <d2l-questions-short-answer></d2l-questions-short-answer> `);
		stub(elem, '_loadBlanks').callsFake(() => { elem._blanks = [];});
		elem.question = QUESTION_ENTITY;
		await elementUpdated(elem);
		expect(elem._questionTextHTML).to.equal(QUESTION_TEXT);
	});

	it('should load blanks from question response', async() => {
        const elem = await fixture(html` <d2l-questions-short-answer></d2l-questions-short-answer> `);
		stub(elem, '_getEntityFromHref').callsFake(stubGetEntityFromHref);
		elem.questionResponse = QUESTION_RESPONSE_ENTITY;
		elem.question = QUESTION_ENTITY;
		await elementUpdated(elem);
		elem.addEventListener('d2l-questions-question-loaded', async() => {
			expect(elem._blanks).to.deep.equal(BLANKS_RESPONSE);
		});
	});

    it('should reload when question changes', async () => {
        const elem = await fixture(html` <d2l-questions-short-answer></d2l-questions-short-answer> `);
        const _loadQuestionDataStub = stub(elem, '_loadQuestionData');
        elem.question = QUESTION_ENTITY;
        await elementUpdated(elem);
        expect(_loadQuestionDataStub).to.have.callCount(1);
    });

	it('should reload when question response changes', async() => {
        const elem = await fixture(html` <d2l-questions-short-answer></d2l-questions-short-answer> `);
		const _loadQuestionDataStub = stub(elem, '_loadQuestionData');
		elem.questionResponse = QUESTION_RESPONSE_ENTITY;
		await elementUpdated(elem);
		expect(_loadQuestionDataStub).to.have.callCount(1);
	});

});
