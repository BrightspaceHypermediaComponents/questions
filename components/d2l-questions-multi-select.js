import './d2l-questions-multi-select-presentational.js';
import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import { html, LitElement } from 'lit';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';

class D2lQuestionsMultiSelect extends SkeletonMixin(LitElement) {

	static get properties() {
		return {
			readonly: { type: Boolean },
			question: { type: Object },
			questionResponse: { type: Object },
			_choices: { type: Array },
			_questionTextHTML: { type: String }
		};
	}

	render() {
		return html`
			<d2l-questions-multi-select-presentational
				?readonly=${this.readonly}
				question-text=${this._questionTextHTML}
				.choices=${this._choices}>
			</d2l-questions-multi-select-presentational>
		`;
	}

	async updated(changedProperties) {
		super.updated();
		if ((changedProperties.has('question') || changedProperties.has('questionResponse'))) {
			this._loadQuestionData();
		}
	}

	_finishedLoadingQuestionData() {
		this.dispatchEvent(new CustomEvent('d2l-questions-question-loaded', {
			composed: true,
			bubbles: true,
		}));
	}

	_loadChoices() {
		const choices = this.question.entity.getSubEntityByClass('atoms').entities;
		const answers = this.questionResponse.entity.entities;
		return choices.map(choice => {
			const answer = answers.find(answer => answer.properties.atomId === choice.properties.atomId);
			return { ...choice.properties, ...answer.properties };
		});
	}

	_loadQuestionData() {
		const questionTextEntity = this.question.entity.getSubEntityByClass('questionText');
		this._questionTextHTML = questionTextEntity.properties.html;
		this._choices = this._loadChoices();
		this._finishedLoadingQuestionData();
	}

}
customElements.define('d2l-questions-multi-select', D2lQuestionsMultiSelect);
