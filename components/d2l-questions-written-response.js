import '@brightspace-ui/core/components/inputs/input-textarea.js';
import { bodyStandardStyles, labelStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { Classes } from 'd2l-hypermedia-constants';
import { LocalizeDynamicMixin } from '@brightspace-ui/core/mixins/localize-dynamic-mixin.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

class D2lQuestionWrittenResponse extends LocalizeDynamicMixin(LitElement) {

	static get properties() {
		return {
			readonly: { type: Boolean },
			question: { type: Object },
			questionResponse: { type: Object },
			token: { type: Object },
		};
	}

	static get styles() {
		return [bodyStandardStyles, labelStyles, css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			.d2l-questions-written-response-question-text > p {
				margin-bottom: 0.95rem;
			}
			.d2l-questions-written-response-question-answer-key {
				margin-bottom: 0.8rem;
			}
			.d2l-questions-written-response-question-answer-key > .d2l-label-text {
				margin-top: 1.2rem;
				margin-bottom: 0.6rem;
			}
		`];
	}

	static get localizeConfig() {
		return {
			importFunc: async lang => (await import(`../lang/${lang}.js`)).default
		};
	}

	render() {
		const questionText = this.question.entity.getSubEntityByClass(Classes.questions.questionText);

		return html`
			<div class="d2l-questions-question-wrapper">
				<div class="d2l-questions-written-response-question-text">
					<d2l-html-block>
						${unsafeHTML(questionText.properties.html)}
					</d2l-html-block>
				</div>
				<div class="d2l-questions-written-response-question-initial-text">
					${this._renderInitialText()}
				</div>
				<div class="d2l-questions-written-response-question-answer-key">
					<h2 class="d2l-label-text">
						Answer Key
					</h2>
					<d2l-html-body>
						Answer Key Is The Following (Hardcoded)
					</d2l-html-body>
				</div>
			</div>
		`;
	}

	_renderInitialText() {
		const temp = this.questionResponse.entity.getSubEntityByClass(Classes.questions.candidateResponse).entities;
		console.log(temp);

		return html`
			<d2l-input-textarea label="Initial Text" label-hidden>
				Initial
			</d2l-input-textarea>
		`;
	}
}
customElements.define('d2l-questions-written-response', D2lQuestionWrittenResponse);
