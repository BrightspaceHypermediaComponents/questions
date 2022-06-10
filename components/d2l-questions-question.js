import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import { css, html, LitElement } from 'lit';
import { Classes } from 'd2l-hypermedia-constants';
import { runAsync } from '@brightspace-ui/core/directives/run-async/run-async.js';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';

class D2lQuestionsQuestion extends SkeletonMixin((LitElement)) {

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
			_question: {
				attribute: false,
				type: Object
			},
			_questionResponse: {
				attribute: false,
				type: Object
			},
			readonly: {
				type: Boolean
			},
			token: {
				type: String
			},
			_questionType: {
				type: String
			},
			_questionKey: {
				type: String
			}
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

	async firstUpdated() {
		await this._update();
	}

	render() {
		return html`${runAsync(
			this._questionKey,
			() => this._renderType(),
			{
				success: type => type
			},
			{
				pendingState: false
			}
		)}`;
	}

	async updated(changedProperties) {
		if (changedProperties.has('questionHref')
		|| changedProperties.has('questionResponseHref')
		|| changedProperties.has('skeleton')) {
			await this._update();
			this._questionKey = `${this.questionHref}${this.questionResponseHref}${this.skeleton}`;
		}
	}

	async _getQuestion() {
		if (this.questionHref) {
			this._question = await window.D2L.Siren.EntityStore.fetch(this.questionHref, this.token);
		}
		if (this.questionResponseHref) {
			this._questionResponse = await window.D2L.Siren.EntityStore.fetch(this.questionResponseHref, this.token);
		}
		if (this._question && this._question.entity) {
			if (this._question.entity.hasClass(Classes.questions.multipleChoice)) {
				this._questionType = Classes.questions.multipleChoice;
			} else if (this._question.entity.hasClass(Classes.questions.multiSelect)) {
				this._questionType = Classes.questions.multiSelect;
			} else if (this._question.entity.hasClass(Classes.questions.longAnswer)) { // previous naming convention for "Written Response" is "Long Answer", API response displaying LongAnswer currently
				this._questionType = Classes.questions.longAnswer;
			} else if (this._question.entity.hasClass(Classes.questions.trueFalse)) {
				this._questionType = Classes.questions.trueFalse;
			}
		}
	}

	async _renderType() {
		switch (this._questionType) {

			case Classes.questions.multipleChoice:
				await import('./d2l-questions-multiple-choice.js');
				return html`
					<d2l-questions-multiple-choice
						?isTrueFalse=${false}
						?readonly=${this.readonly}
						.question=${this._question}
						.questionResponse=${this._questionResponse}
						?skeleton=${this.skeleton}
						.token=${this.token}>
					</d2l-questions-multiple-choice>`;

			case Classes.questions.multiSelect:
				await import('./d2l-questions-multi-select.js');
				// We can get rid of this when multiselect is properly implemented and sends this event
				await this._sendQuestionLoaded();
				return html`
					<d2l-questions-multi-select
						?readonly=${this.readonly}
						.question=${this._question}
						.questionResponse=${this._questionResponse}
						?skeleton=${this.skeleton}>
					</d2l-questions-multi-select>`;

			case Classes.questions.longAnswer:
				await import('./d2l-questions-written-response.js');
				return html`
					<d2l-questions-written-response
						?readonly=${this.readonly}
						.question=${this._question}
						.questionResponse=${this._questionResponse}
						?skeleton=${this.skeleton}
						.token=${this.token}>
					</d2l-questions-written-response>`;

			case Classes.questions.trueFalse:
				await import('./d2l-questions-multiple-choice.js');
				return html`
					<d2l-questions-multiple-choice
						?isTrueFalse=${true}
						?readonly=${this.readonly}
						.question=${this._question}
						.questionResponse=${this._questionResponse}
						.token=${this.token}>
					</d2l-questions-multiple-choice>`;

			default:
				await this._sendQuestionLoaded();
				throw 'Unknown question type';
		}
	}

	async _sendQuestionLoaded() {
		this.dispatchEvent(new CustomEvent('d2l-questions-question-loaded', {
			composed: true,
			bubbles: true,
		}));
	}

	async _update() {
		await this._getQuestion();
	}

}
customElements.define('d2l-questions-question', D2lQuestionsQuestion);
