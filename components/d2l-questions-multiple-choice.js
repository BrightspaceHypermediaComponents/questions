import './d2l-questions-multiple-choice-presentational.js';
import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import { Classes, Rels } from 'd2l-hypermedia-constants';
import { css, html, LitElement } from 'lit';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';

class D2lQuestionsMultipleChoice extends SkeletonMixin(LitElement) {

	static get properties() {
		return {
			readonly: { type: Boolean },
			question: { type: Object },
			questionResponse: { type: Object },
			token: { type: Object },
			_choices: { type: Array },
			_questionTextHTML: { type: String }
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
		return html`
			<d2l-questions-multiple-choice-presentational
				?readonly=${this.readonly}
				question-text=${this._questionTextHTML}
				.choices=${this._choices}
				?skeleton=${this.skeleton}>
			</d2l-questions-multiple-choice-presentational>`;
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

	async _loadChoices() {
		// Reponse has the choices more readily available than the actual question does + the answer/correctness states
		if (this.questionResponse) {
			return await this._loadChoicesFromResponse();
		}
		const itemBodyHref = this.question.entity.getSubEntityByRel(Rels.Questions.itemBody);
		const itemBodyEntity = await this._getEntityFromHref(itemBodyHref);
		const interactionHref = itemBodyEntity.entity.getSubEntityByRel(Rels.Questions.interaction);
		const interactionEntity = await this._getEntityFromHref(interactionHref);
		const choices = await Promise.all(interactionEntity.entity.getSubEntitiesByClass(Classes.questions.simpleChoice).map(async choice => {
			const choiceEntity = await this._getEntityFromHref(choice.href, false);
			return {
				href: choice.href,
				htmlText: choiceEntity.entity.getSubEntityByClass(Classes.text.richtext).properties.html,
				text: choiceEntity.entity.getSubEntityByClass(Classes.text.richtext).properties.text,
			};
		}));
		this._choices = choices === undefined ? [] : choices;
	}

	async _loadChoicesFromResponse() {
		let hasCorrectAnswer = false;
		const candidateResponse = this.questionResponse.entity.getSubEntityByClass(Classes.questions.candidateResponse);
		const choices = await Promise.all(candidateResponse.entities.map(async choice => {
			if (choice.hasClass(Classes.questions.correctResponse)) {
				hasCorrectAnswer = true;
			}
			const choiceHref = choice.getLinkByRel(Rels.Questions.identifier).href;
			const choiceEntity = await this._getEntityFromHref(choiceHref, false);
			return {
				htmlText: choiceEntity.entity.getSubEntityByClass(Classes.text.richtext).properties.html,
				text: choiceEntity.entity.getSubEntityByClass(Classes.text.richtext).properties.text,
				selected: choice.hasClass(Classes.questions.selected),
				correct: choice.hasClass(Classes.questions.correctResponse),
				href: choiceHref
			};
		}));
		if (!hasCorrectAnswer) {
			const responseHref = candidateResponse.getLinkByRel(Rels.Questions.responseDeclaration).href;
			const response = await this._getEntityFromHref(responseHref, false);
			const correctResponse = response.entity.getSubEntityByClass(Classes.questions.correctResponse);
			const correctChoiceHref = correctResponse.getSubEntityByClass(Classes.questions.value).getLinkByRel(Rels.Questions.identifier).href;
			choices.find(choice => choice.href === correctChoiceHref).correct = true;
		}
		this._choices = choices === undefined ? [] : choices;
		return;
	}

	async _loadQuestionData() {
		try {
			const questionTextEntity = this.question.entity.getSubEntityByClass(Classes.questions.questionText);
			this._questionTextHTML = questionTextEntity.properties.html;
		} catch (err) {
			console.error(err);
			throw new Error('d2l-questions-multiple-choice: Unable to get question text from question');
		}
		try {
			await this._loadChoices();
		} catch (err) {
			console.error(err);
			throw new Error('d2l-questions-multiple-choice: Unable to load choices from question');
		}
		await this._finishedLoadingQuestionData();
	}
}
customElements.define('d2l-questions-multiple-choice', D2lQuestionsMultipleChoice);
