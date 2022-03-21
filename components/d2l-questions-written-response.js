import '@brightspace-ui/core/components/inputs/input-textarea.js';
import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import { bodyStandardStyles, labelStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { Classes, Rels } from 'd2l-hypermedia-constants';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { LocalizeDynamicMixin } from '@brightspace-ui/core/mixins/localize-dynamic-mixin.js';
import { removeParagraphFormat } from './helpers/htmlTextHelper.js';
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
			.d2l-questions-written-response-question-text {
				font-weight: 700;
				padding-bottom: 1.2rem;
			}
			.d2l-questions-written-response-question-initial-text {
				margin-left: 0.95rem;
				margin-right: 0.95rem;
				padding-bottom: 0.619rem;
			}
			.d2l-questions-written-response-question-answer-key {
				padding-bottom: 0.8rem;
			}
			.d2l-questions-written-response-question-word-count {
				padding-bottom: 0.5rem;
				padding-top: 0.5rem;
			}
			.d2l-questions-written-response-question-word-count > h3 {
				font-size: 0.65rem;
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
						${unsafeHTML(removeParagraphFormat(questionText.properties.html))}
					</d2l-html-block>
				</div>
				${this._renderInitialText()}
				${this._renderAnswerKey()}
			</div>
		`;
	}

	async updated(changedProperties) {
		super.updated();
		if ((changedProperties.has('question') || changedProperties.has('questionResponse')) && this.readonly) {
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

		if (itemBodyHref !== undefined) {
			const itemBodyEntity = await this._getEntityFromHref(itemBodyHref);
			const answerKeyEntity = itemBodyEntity.entity.getSubEntityByClass(Classes.text.richtext);

			if (answerKeyEntity !== undefined) {
				this._answerKey = answerKeyEntity.properties.html;
			}
		}
	}

	_renderAnswerKey() {
		if (this.readonly && this._answerKey !== undefined) {
			return html`
				<div class="d2l-questions-written-response-question-answer-key">
					<h2 class="d2l-label-text">
						${this.localize('answerKey')}
					</h2>
					<d2l-html-block>
						${unsafeHTML(removeParagraphFormat(this._answerKey))}
					</d2l-html-block>
				</div>
			`;
		}

		return html``;
	}

	_renderInitialText() {
		if (this.readonly && this.questionResponse) {
			const responseEntities = this.questionResponse.entity.getSubEntityByClass(Classes.questions.candidateResponse);

			if (responseEntities !== undefined) {
				const initialTextResponse = responseEntities.getSubEntityByClass(Classes.text.richtext);

				if (initialTextResponse !== undefined) {
					return html`
						<div class="d2l-questions-written-response-question-initial-text">
							<d2l-html-block>
								${unsafeHTML(removeParagraphFormat(initialTextResponse.properties.html))}
							</d2l-html-block>
							<div class="d2l-questions-written-response-question-word-count">
								<h3 class="d2l-label-text">
									${initialTextResponse.properties.wordCount} ${this.localize('words')}
								</h3>
							</div>
						</div>
					`;
				}
			}
		}

		return html``;
	}
}
customElements.define('d2l-questions-written-response', D2lQuestionWrittenResponse);
