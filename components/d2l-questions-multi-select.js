import './d2l-questions-multi-select-presentational.js';
import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import { html, LitElement } from 'lit';

class D2lQuestionsMultiSelect extends LitElement {

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
	}

}
customElements.define('d2l-questions-multi-select', D2lQuestionsMultiSelect);
