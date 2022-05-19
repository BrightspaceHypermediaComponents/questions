import './icons/d2l-questions-icons-checkbox.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/inputs/input-checkbox.js';
import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/offscreen/offscreen.js';
import { css, html, LitElement } from 'lit';
import { bodyCompactStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { LocalizeQuestions } from '../localize-questions.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

//Database is using magic numbers
const IS_CHECKED = '1';
class D2lQuestionsMultiSelectPresentational extends LocalizeQuestions(LitElement) {

	static get properties() {
		return {
			choices: { type: Array },
			questionText: {
				attribute: 'question-text',
				type: String
			},
			readonly: { type: Boolean }
		};
	}

	static get styles() {
		return [bodyCompactStyles, css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			.d2l-questions-multi-select-question-text {
				padding-bottom: 1rem;
			}
			.d2l-questions-multi-select-row {
				color: var(--d2l-color-galena);
				display: flex;
				flex-wrap: nowrap;
				height: 2.5rem;
			}
			.d2l-questions-multi-select-row d2l-icon {
				margin-right: 0.3rem;
				margin-top: 0.1rem;
			}
			.d2l-questions-multi-select-row d2l-questions-icons-checkbox-unchecked,
			.d2l-questions-multi-select-row d2l-questions-icons-checkbox-checked {
				margin-right: 0.3rem;
				margin-top: -0.1rem;
			}
			.d2l-questions-incorrect-answer-icon {
				padding-left: 1.2rem;
			}
			.d2l-questions-multi-select-correct-response-icon {
				color: var(--d2l-color-galena);
			}
			.d2l-questions-multi-select-incorrect-response-icon {
				color: var(--d2l-color-cinnabar);
			}
			.d2l-questions-multi-select-correct-answer-icon {
				color: var(--d2l-color-olivine);
			}
		`];
	}

	render() {
		if (typeof this.choices === 'undefined') {
			return html``;
		}
		return html`
			<div class="d2l-questions-multi-select-question-text">
				<d2l-html-block>
					${unsafeHTML(this.questionText)}
				</d2l-html-block>
			</div>
			${this.choices.map((choice) => this._renderChoice(choice))}
		`;
	}

	_renderAnswerableChoice(value, checked, correctAnswer, correctResponse, accessibleDescription) {
		return html`
			<div class="d2l-questions-multi-select-row">
				${correctAnswer ? html`<d2l-icon class="d2l-questions-multi-select-correct-answer-icon" icon="tier1:arrow-thin-right"></d2l-icon>` : ''}
				<d2l-icon
					class="${!correctResponse ? 'd2l-questions-multi-select-incorrect-response-icon' : 'd2l-questions-multi-select-correct-response-icon'} ${!correctAnswer ? 'd2l-questions-incorrect-answer-icon' : ''}"
					icon="tier1:${correctResponse ? 'check' : 'close-large-thick'}"></d2l-icon>
				<d2l-input-checkbox
					description="${accessibleDescription}"
					?checked=${checked}>
				${value}
				</d2l-input-checkbox>
			</div>
		`;
	}

	_renderChoice(choice) {
		const checked = choice.response === IS_CHECKED;
		const correctAnswer = choice.isCorrect;
		const correctResponse = choice.responseIsCorrect && checked || !choice.responseIsCorrect && !checked;
		const accessibleDescription = `${this.localize(correctAnswer ? 'correctAnswer' : 'incorrectAnswer')} ${this.localize(correctResponse ? 'correctResponse' : 'incorrectResponse')}`;

		if (this.readonly) {
			return this._renderReadonlyChoice(choice.value, checked, correctAnswer, correctResponse, accessibleDescription);
		} else {
			return this._renderAnswerableChoice(choice.value, checked, correctAnswer, correctResponse, accessibleDescription);
		}
	}

	_renderReadonlyChoice(value, checked, correctAnswer, correctResponse, accessibleDescription) {
		return html`
			<div class="d2l-questions-multi-select-row d2l-body-compact">
				${correctAnswer ? html`<d2l-icon class="d2l-questions-multi-select-correct-answer-icon" icon="tier1:arrow-thin-right"></d2l-icon>` : ''}
				<d2l-icon
					class="${!correctResponse ? 'd2l-questions-multi-select-incorrect-response-icon' : 'd2l-questions-multi-select-correct-response-icon'} ${!correctAnswer ? 'd2l-questions-incorrect-answer-icon' : ''}"
					icon="tier1:${correctResponse ? 'check' : 'close-large-thick'}"></d2l-icon>
				${checked ? html`<d2l-questions-icons-checkbox-checked></d2l-questions-icons-checkbox-checked>` : html`<d2l-questions-icons-checkbox-unchecked></d2l-questions-icons-checkbox-unchecked>`}
				<d2l-offscreen>${accessibleDescription} ${value}</d2l-offscreen>
				<span aria-hidden="true">${value}</span>
			</div>
		`;
	}

}
customElements.define('d2l-questions-multi-select-presentational', D2lQuestionsMultiSelectPresentational);
