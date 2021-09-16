import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import { css, html, LitElement } from 'lit-element';
import { runAsync } from '@brightspace-ui/core/directives/run-async/run-async.js';

class D2lQuestionsQuestion extends (LitElement) {

	static get properties() {
		return {
			questionHref: {
				attribute: 'question-href',
				type: String
			},
			questionResponseHref: {
				attribute: 'question-response-href',
				type: String
			},
			question: {
				attribute: false,
				type: Object
			},
			questionResponse: {
				attribute: false,
				type: Object
			},
			disabled: {
				type: Boolean
			},
			token: {
				type: String
			}
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
		`;
	}

	async firstUpdated() {
		await this._update();
	}

	render() {
		return html`
			${runAsync(
		this.question,
		() => this._renderType(),
		{
			success: type => type
		},
		{ pendingState: false }
	)}
		`;
	}

	async updated(changedProperties) {
		if (changedProperties.has('question-href')
		|| changedProperties.has('question-response-href')) {
			await this._update();
		}
	}

	async _getQuestion() {
		if (this.questionHref) {
			this.question = await window.D2L.Siren.EntityStore.fetch(this.questionHref, this.token);
		}
		if (this.questionResponseHref) {
			this.questionResponse = await window.D2L.Siren.EntityStore.fetch(this.questionResponseHref, this.token);
		}
	}

	async _renderType() {
		if (this.question.entity.hasClass('MultipleChoice')) {
			await import('./d2l-questions-multiple-choice.js');
			return html`
				<d2l-questions-multiple-choice
					?disabled=${this.disabled}
					.question=${this.question}
					.questionResponse=${this.questionResponse}>
				</d2l-questions-multiple-choice>`;
		} else {
			console.error('Unknown question type');
		}
	}

	async _update() {
		await this._getQuestion();
	}

}
customElements.define('d2l-questions-question', D2lQuestionsQuestion);
