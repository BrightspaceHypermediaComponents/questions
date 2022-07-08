import './icons/d2l-questions-icons-radio.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/html-block/html-block.js';
import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/offscreen/offscreen.js';
import { css, html, LitElement } from 'lit';
import { bodyCompactStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { LocalizeQuestions } from '../localize-questions.js';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

class D2lQuestionsShortAnswerPresentational extends SkeletonMixin(RtlMixin(LocalizeQuestions(LitElement))) {

	static get properties() {
		return {
			blanks: { type: Array },
			questionText: {
				attribute: 'question-text',
				type: String
			}
		};
	}

	static get styles() {
		return [super.styles, css`
			:host {
				display: inline-block;
				width: 100%;
			}
			:host([hidden]) {
				display: none;
			}
			.d2l-questions-short-answer-question-text {
				padding-bottom: 1rem;
			}
			.d2l-questions-short-answer-row {
				align-items: flex-start;
				display: flex;
				flex-wrap: nowrap;
				padding-bottom: 0.4rem;
			}
			.d2l-questions-short-answer-preface {
				color: var(--d2l-color-galena);
				margin-right: 0.5rem;
			}
			.d2l-questions-short-answer-row d2l-icon {
				flex: none;
				margin-left: 0.5rem;
			}
			:host([dir="rtl"]) .d2l-questions-short-answer-row d2l-icon {
				margin-right: 0.5rem;
				margin-left: 0;
			}
			.d2l-questions-short-answer-incorrect-icon {
				color: var(--d2l-color-cinnabar);
			}
			:host([dir="rtl"]) .d2l-questions-short-answer-correct-icon {
				transform: scaleX(-1);
			}
			.d2l-questions-short-answer-incorrect-bracket {
				font-weight: 700;
				color: var(--d2l-color-citrine-minus-1);
				margin-left: 0.5rem;
			}
			.d2l-questions-short-answer-correct-bracket {
				font-weight: 700;
				color: var(--d2l-color-celestine);
				margin-left: 0.5rem;
			}
		`];
	}

	constructor() {
		super();
	}

	render() {
		if (this.blanks !== undefined && !this.skeleton) {
			return html`
				<div class="d2l-questions-short-answer-question-text">
					<d2l-html-block>
						${unsafeHTML(this.questionText)}
					</d2l-html-block>
				</div>
				<div class="d2l-questions-multiple-choice-group">
					${this.blanks.map((blank, index) => this._renderBlank(blank, index+1))}
				</div>
			`;
		}
	}

	_renderBlank(blank, index) {
		let icon, bracketText, screenReaderText = undefined;
		let iconStyle, bracketTextStyle = '';

		if (blank.correct) {
			icon = 'check';
			iconStyle = 'd2l-questions-short-answer-correct-icon';
			bracketText = this.localize('correctBlank', { percentage : blank.value} );
			bracketTextStyle = 'd2l-questions-short-answer-correct-bracket';
			screenReaderText = this.localize('correctBlankScreenReader', { percentage: blank.value });
		} else {
			icon = 'close-large-thick';
			iconStyle = 'd2l-questions-short-answer-incorrect-icon';
			bracketText = this.localize('incorrectBlank', { correctAnswerText: blank.correctAnswerText });
			bracketTextStyle = 'd2l-questions-short-answer-incorrect-bracket';
			screenReaderText = this.localize('incorrectBlankScreenReader', { correctAnswerText: blank.correctAnswerText });
		}

		return html`
			<div class="d2l-questions-short-answer-row">
				<d2l-html-block class="d2l-questions-short-answer-preface">
					${this.localize('answerForBlank', { blankNumber: index })}
				</d2l-html-block>
				<d2l-html-block class="d2l-questions-short-answer-response">
					${unsafeHTML(blank.responseText)}
				</d2l-html-block>
				${html`<d2l-icon icon="tier1:${icon}" class="${iconStyle}"></d2l-icon>`}
				<d2l-html-block class="${bracketTextStyle}" aria-hidden="true"> ${bracketText}</d2l-html-block>
				<d2l-offscreen>${choice.text}</d2l-offscreen>
			</div>`;
	}

}
customElements.define('d2l-questions-short-answer-presentational', D2lQuestionsShortAnswerPresentational);
