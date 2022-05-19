import '../components/d2l-questions-multiple-choice.js';
import { Classes, Rels } from 'd2l-hypermedia-constants';
import { elementUpdated, expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';
import { stub } from 'sinon';

describe('d2l-questions-multiple-choice', () => {

	const INTERACTION_HREF = 'interactionHref';
	const INTERACTION_ENTITY = {
		entity: {
			getSubEntitiesByClass: function(entityClass) {
				//TODO
			}
		}
	};
	const ITEM_BODY_HREF = 'itemBodyHref';
	const ITEM_BODY_ENTITY = {
		entity: {
			getSubEntityByRel: function(entityRel) {
				return entityRel === Rels.Questions.itemBody ? ITEM_BODY_HREF : undefined;
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

	function stubGetEntityFromHref(targetHref) {
		switch (targetHref) {
			case ITEM_BODY_HREF:
				return ITEM_BODY_ENTITY;
			case INTERACTION_HREF:
				return INTERACTION_ENTITY;
			default:
				throw 'unexpected href requested';
		}
	}

	it('should construct', () => {
		runConstructor('d2l-questions-multiple-choice');
	});

	it('should load question text', async() => {
		const elem = await fixture(html` <d2l-questions-multiple-choice .question=${QUESTION_ENTITY}></d2l-questions-multiple-choice> `);
		stub(elem, '_loadChoices').callsFake(() => { elem._choices = [];});
		await elementUpdated(elem);
		expect(elem._questionTextHTML).to.equal(QUESTION_TEXT);
	});

	//Stubbing webcomponents https://open-wc.org/guides/knowledge/testing/stubs/
	//Stub the component, test individual load functions, check data after loading functions
	/*it('should load options for question', async() => {
		const elem = await fixture(html` <d2l-questions-multiple-choice .question=${QUESTION_ENTITY}></d2l-questions-multiple-choice> `);
		stub(elem, '_getEntityFromHref').callsFake(stubGetEntityFromHref);
		expect(elem._choices).to.equal(CHOICES);
	});

	it('should reload when question changes', async() => {

	});

	it('should load options from question response', async() => {

	});

	it('should reload when question response changes', async() => {

	});*/

});
