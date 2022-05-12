import './icons/d2l-questions-icons-radio.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/html-block/html-block.js';
import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/offscreen/offscreen.js';
import { css, html, LitElement } from 'lit';
import { bodyCompactStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { getUniqueId } from '@brightspace-ui/core/helpers/uniqueId.js';
import { LocalizeQuestions } from '../localize-questions.js';
import { radioStyles } from '@brightspace-ui/core/components/inputs/input-radio-styles.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

class D2lQuestionsMultipleChoicePresentational extends LocalizeQuestions(LitElement) {

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
		return [radioStyles, bodyCompactStyles, css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			.d2l-questions-multiple-choice-group {
				display: flex;
				flex-direction: column;
			}
			.d2l-questions-multiple-choice-question-text {
				padding-bottom: 1rem;
			}
			.d2l-questions-multiple-choice-row {
				align-items: flex-start;
				color: var(--d2l-color-galena);
				display: flex;
				flex-wrap: nowrap;
				padding-bottom: 1.2rem;
			}
			.d2l-input-radio-label {
				align-items: flex-start;
				color: var(--d2l-color-galena);
				display: flex;
				flex-wrap: nowrap;
			}
			.d2l-questions-multiple-choice-row d2l-questions-icons-radio-unchecked,
			.d2l-questions-multiple-choice-row d2l-questions-icons-radio-checked {
				flex: none;
				margin-right: 0.3rem;
				margin-top: -0.1rem;
			}
			.d2l-questions-multiple-choice-row d2l-icon {
				flex: none;
				margin-right: 0.3rem;
			}
			.d2l-questions-multiple-choice-incorrect-icon {
				color: var(--d2l-color-cinnabar);
			}
			.d2l-questions-multiple-choice-correct-icon {
				color: var(--d2l-color-olivine);
			}
			.d2l-questions-multiple-choice-without-icon {
				flex: none;
				width: 1.2rem;
			}
		`];
	}

	constructor() {
		super();
		this.radioGroupId = getUniqueId();
	}

	render() {
		if (this.choices !== undefined) {
			return html`
				<div class="d2l-questions-multiple-choice-question-text">
					<d2l-html-block>
						${unsafeHTML(this.questionText)}
					</d2l-html-block>
				</div>

				<div class="d2l-questions-multiple-choice-group">
					${this.choices.map((choice) => this._renderChoice(choice))}
				</div>
			`;
		}
	}

	_renderChoice(choice) {
		if (this.readonly) {
			return this._renderReadonlyChoice(choice);
		} else {
			return html`
				<div class="d2l-questions-multiple-choice-row">
					<label class="d2l-input-radio-label">
						<input type="radio" name="${this.radioGroupId}"
						?checked=${choice.selected}
						aria-label="${choice.text}">
						<d2l-html-block>
							${unsafeHTML(choice.htmlText)}
						</d2l-html-block>
					</label>
				</div>
			`;
		}
	}

	_renderReadonlyChoice(choice) {
		let icon = undefined;
		let lang = '';
		let iconStyle = '';
		if (choice.selected && choice.correct) {
			icon = 'check';
			lang = 'correctResponse';
		} else if (choice.selected && !choice.correct) {
			icon = 'close-large-thick';
			lang = 'incorrectResponse';
			iconStyle = 'd2l-questions-multiple-choice-incorrect-icon';
		} else if (!choice.selected && choice.correct) {
			icon = 'arrow-thin-right';
			lang = 'correctAnswer';
			iconStyle = 'd2l-questions-multiple-choice-correct-icon';
		}

		return html`
			<div class="d2l-questions-multiple-choice-row d2l-body-compact">
				${icon ? html`<d2l-icon icon="tier1:${icon}" class="${iconStyle}"></d2l-icon>` : html`<div class="d2l-questions-multiple-choice-without-icon"></div>`}
				${choice.selected ? html`<d2l-questions-icons-radio-checked></d2l-questions-icons-radio-checked>` : html`<d2l-questions-icons-radio-unchecked></d2l-questions-icons-radio-unchecked>`}
				<d2l-offscreen>${this.localize(lang)}${choice.text}</d2l-offscreen>
				<d2l-html-block aria-hidden="true">
					${unsafeHTML(choice.htmlText)}
				</d2l-html-block>
			</div>`;
	}

}
customElements.define('d2l-questions-multiple-choice-presentational', D2lQuestionsMultipleChoicePresentational);
