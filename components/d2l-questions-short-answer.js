import './d2l-questions-short-answer-presentational.js';
import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import { css, html, LitElement } from 'lit';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';
import { Classes, Rels } from 'd2l-hypermedia-constants';

class D2lQuestionsShortAnswer extends SkeletonMixin(LitElement) {

	static get properties() {
		return {
			readonly: { type: Boolean },
			question: { type: Object },
			questionResponse: { type: Object },
			token: { type: Object },
			_blanks: { type: Array },
			_questionTextHTML: { type: String },
			_responses: { type: Array }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
				width: 100%;
			}
			:host([hidden]) {
				display: none;
			}
		`;
	}

	constructor() {
		super();
		this._choices = [];
	}

	render() {
		this._blanks = [
			{
				correctAnswerText: 'correct response',
				value: 50,
				responseText: 'correct response',
				correct: true
			},
			{
				correctAnswerText: 'question 2',
				value: 50,
				responseText: 'incorrect response',
				correct: false
			},
			{
				correctAnswerText: 'question 3',
				value: 50,
				responseText: 'incorrect response 2',
				correct: false
			}
		];

		return html`
			<d2l-questions-short-answer-presentational
				?skeleton=${this.skeleton}
				question-text=${this._questionTextHTML}
				.blanks=${this._blanks}
				.responses=${this._responses}
			>
			</d2l-questions-short-answer-presentational>`;
	}

	async updated(changedProperties) {
		super.updated();
		if ((changedProperties.has('question') || changedProperties.has('questionResponse'))) {
			await this._loadQuestionData();
		}
	}

	async _finishedLoadingQuestionData() {
		this.dispatchEvent(new CustomEvent('d2l-questions-question-loaded', {
			composed: true,
			bubbles: true,
		}));
	}

	async _getEntityFromHref(targetHref, bypassCache) {
		return await window.D2L.Siren.EntityStore.fetch(targetHref, this.token, bypassCache);
	}

	async _loadBlanks() {
		const candidateResponses = this.questionResponse.entity.getSubEntitiesByClass(Classes.questions.candidateResponse);
		const blanks = await Promise.all(candidateResponses.map(async candidateResponse => {
			const responseValue = candidateResponse.getSubEntityByClass(Classes.questions.value);
			const responseDeclarationHref = candidateResponse.getLinkByRel(Rels.Questions.responseDeclaration).href;
			const responseDeclaration = await this._getEntityFromHref(responseDeclarationHref, false);
			const mapping = responseDeclaration.entity.getSubEntityByClass(Classes.questions.mapping);
			const mapEntryHref = mapping.getSubEntityByClass('map-entry').href;
			const mapEntry = await this._getEntityFromHref(mapEntryHref, false);

			return {
				correctAnswerText: mapEntry.entity.properties.key,
				value: mapEntry.entity.properties.value,
				responseText: responseValue.properties.response,
				correct: responseValue.hasClass(Classes.questions.correctResponse)
			};
		}));
	
		console.log('blanks', blanks)
		this._blanks = blanks === undefined ? [] : blanks;
		return;
	}

	async _loadQuestionData() {
		try {
			const questionTextEntity = this.question.entity.getSubEntityByClass(Classes.questions.questionText);
			this._questionTextHTML = questionTextEntity.properties.html;
		} catch (err) {
			console.error(err);
			throw new Error('d2l-questions-short-answer: Unable to get question text from question');
		}
		try {
			await this._loadBlanks();
		} catch (err) {
			console.error(err);
			throw new Error('d2l-questions-short-answer: Unable to load blanks from question');
		}
		await this._finishedLoadingQuestionData();
	}

}
customElements.define('d2l-questions-short-answer', D2lQuestionsShortAnswer);


