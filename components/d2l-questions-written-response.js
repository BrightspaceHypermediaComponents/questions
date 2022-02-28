import '@brightspace-ui/core/components/inputs/input-textarea.js';
import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import { bodyStandardStyles, labelStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { Classes, Rels } from 'd2l-hypermedia-constants';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { LocalizeDynamicMixin } from '@brightspace-ui/core/mixins/localize-dynamic-mixin.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

class D2lQuestionWrittenResponse extends LocalizeDynamicMixin(LitElement) {

	static get properties() {
		return {
			readonly: { type: Boolean },
			question: { type: Object },
			questionResponse: { type: Object },
			token: { type: Object },
			_answerKey: { type: String }
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
			/* Temp Commented Out Until <p> tag in <d2l-html-block> change implemented */
			/* .d2l-questions-written-response-question-text > p {
				margin-bottom: 0.95rem;
			} */
			.d2l-questions-written-response-question-initial-text {
				margin: 0.95rem 0.475rem 0.475rem;
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
					${this._renderAnswerKey()}
				</div>
			</div>
		`;
	}

	async updated(changedProperties) {
		super.updated();
		if ((changedProperties.has('question') || changedProperties.has('questionResponse'))) {
			try {
				await this._loadAnswerKey();
			} catch (err) {
				console.error(err);
				throw new Error('d2l-questions-written-response: Unable to load answer key from question');
			}
		}
	}

	async _getEntityFromHref(targetHref) {
		return await window.D2L.Siren.EntityStore.fetch(targetHref, this.token);
	}

	async _loadAnswerKey() {
		const itemBodyHref = this.question.entity.getSubEntityByRel(Rels.Questions.itemBody);
		const itemBodyEntity = await this._getEntityFromHref(itemBodyHref);
		const answerKeyEntity = itemBodyEntity.entity.getSubEntityByClass(Classes.text.richtext);

		if (answerKeyEntity !== undefined) {
			this._answerKey = answerKeyEntity.properties.html;
		}
	}

	_renderAnswerKey() {
		if (this._answerKey === undefined) {
			return html``;
		}

		return html`
			<h2 class="d2l-label-text">
				Answer Key
			</h2>
			<d2l-html-block>
				${unsafeHTML(this._answerKey)}
			</d2l-html-block>
		`;
	}

	_renderInitialText() {
		const responseEntities = this.questionResponse.entity.getSubEntityByClass(Classes.questions.candidateResponse);
		const initialTextResponse = responseEntities.getSubEntityByClass(Classes.text.richtext);

		if (initialTextResponse !== undefined) {
			return html`
				<d2l-html-block>
					${unsafeHTML(initialTextResponse.properties.html)}
				</d2l-html-block>
			`;
		}

		// Not fully sure the condition to check for if student
		// return html`
		// 	<d2l-input-textarea label="Initial Text" label-hidden>
		// 		${initialTextResponseEntity}
		// 	</d2l-input-textarea>
		// `;
	}
}
customElements.define('d2l-questions-written-response', D2lQuestionWrittenResponse);
