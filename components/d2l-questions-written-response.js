import '@brightspace-ui/core/components/inputs/input-textarea.js';
import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/list/list.js';
import '@brightspace-ui/core/components/list/list-item.js';
import '@brightspace-ui/core/components/html-block/html-block.js';
import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import { AttachmentTypes, getAttachmentType, getLinkIconTypeFromUrl, getReadableFileSizeString } from './helpers/attachmentsHelper.js';
import { bodySmallStyles, bodyStandardStyles, labelStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { Classes, Rels } from 'd2l-hypermedia-constants';
import { css, html, LitElement } from 'lit';
import { getFileIconTypeFromExtension } from '@brightspace-ui/core/components/icons/getFileIconType';
import { linkStyles } from '@brightspace-ui/core/components/link/link.js';
import { LocalizeDynamicMixin } from '@brightspace-ui/core/mixins/localize-dynamic-mixin.js';
import { removeParagraphFormat } from './helpers/htmlTextHelper.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

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
		return [bodyStandardStyles, bodySmallStyles, labelStyles, linkStyles, css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			.d2l-questions-written-response-attachment-container {
				overflow: hidden;
				overflow-wrap: break-word;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.d2l-questions-written-response-question-text {
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
			.d2l-questions-written-response-question-attachment-list {
				padding-bottom: 0.1rem;
				padding-top: 0.1rem;
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

	_downloadAttachment(href) {
		window.location.href = href;
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

	_renderAttachments() {
		if (this.readonly && this.questionResponse) {
			const fileUploadEntities = this.questionResponse.entity.getSubEntityByClass('file-upload');

			if (fileUploadEntities && fileUploadEntities.entities) {
				const fileAttachments = fileUploadEntities.entities;

				return html`${fileAttachments.map((fileAttachment, index) => {
					const { name, size, extension, href } = fileAttachment.properties;

					const onClickHandler = () => this._downloadAttachment(href);
					const onKeydownHandler = (e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							this._downloadAttachment(href);
						}
					};

					const attachmentType = getAttachmentType(fileAttachment);

					let iconType;
					switch (attachmentType) {
						case AttachmentTypes.LINK:
							iconType = getLinkIconTypeFromUrl(href);
							break;
						case AttachmentTypes.PAGE:
							iconType = 'browser';
							break;
						default:
							iconType = getFileIconTypeFromExtension(extension);
					}

					return html`
						<d2l-list-item key=${index} class="d2l-questions-written-response-attachment-list-item">
							<div class="d2l-questions-written-response-attachment-container">
								<d2l-icon icon="tier1:${iconType}"></d2l-icon>
								<a
									class="d2l-link d2l-body-compact"
									tabindex="0"
									aria-label="${this.localize('clickToDownloadAttachmentFile', 'fileName', name)}"
									@keydown=${onKeydownHandler}
									@click=${onClickHandler}
								>${name}</a>
								${attachmentType === AttachmentTypes.LINK ? html`` : html`<span class="d2l-body-compact">(${getReadableFileSizeString(size, this.localize.bind(this))})</span>`}
							</div>
						</d2l-list-item>
					`;
				})}`;
			}
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
							<d2l-list class="d2l-questions-written-response-question-attachment-list" aria-role="attachment list" separators="between">
								${this._renderAttachments()}
							</d2l-list>
						</div>
					`;
				}
			}
		}

		return html``;
	}
}
customElements.define('d2l-questions-written-response', D2lQuestionWrittenResponse);
