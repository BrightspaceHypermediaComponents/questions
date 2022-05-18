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
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

class D2lQuestionsMultipleChoicePresentational extends SkeletonMixin(LocalizeQuestions(LitElement)) {

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
		return [super.styles, radioStyles, bodyCompactStyles, css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			:host([skeleton]) .d2l-questions-multiple-choice-group {
				display: flex;
				flex-direction: column;
			}
			:host([skeleton]) .d2l-questions-multiple-choice-question-text-skeleton {
				height: 20px;
				margin-bottom: 28px;
				width: 603px;
			}
			.d2l-questions-multiple-choice-row-skeleton {
				align-items: flex-start;
				color: var(--d2l-color-galena);
				display: flex;
				flex-wrap: nowrap;
				height: 24px;
				padding-bottom: 1.2rem;
			}
			:host([skeleton]) .d2l-input-radio-skeleton {
				align-self: center;
				height: 24px;
				margin-left: 0;
				width: 24px;
			}
			:host([skeleton]) .d2l-input-radio-skeleton-readonly {
				align-self: center;
				height: 18px;
				margin-left: 26px;
				width: 18px;
			}
			:host([skeleton]) .d2l-questions-html-block {
				align-self: center;
				height: 14px;
				margin-left: 12px;
				width: 134px;
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
		if (this.choices !== undefined && !this.skeleton) {
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
		} else {
			return this._renderMultipleChoiceSkeleton();
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

	_renderMultipleChoiceSkeleton() {
		const skeletonChoices = [1, 2, 3, 4];
		/* eslint-disable indent */
		return html`
			<div class="d2l-skeletize d2l-questions-multiple-choice-question-text-skeleton"></div>
			<div class="d2l-questions-multiple-choice-group">
				${skeletonChoices.map(() => {
					if (this.readonly) {
						return html`
							<div class="d2l-questions-multiple-choice-row-skeleton">
								<div class="d2l-input-radio-skeleton-readonly d2l-skeletize"></div>
								<div class="d2l-questions-html-block d2l-skeletize"></div>
							</div>
						`;
					} else {
						return html`
							<div class="d2l-questions-multiple-choice-row">
								<div class="d2l-input-radio-skeleton d2l-skeletize"></div>
								<div class="d2l-questions-html-block d2l-skeletize"></div>
							</div>
						`;
					}})}
			</div>
		`;
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