import '@brightspace-ui/core/components/inputs/input-textarea.js';
import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/list/list.js';
import '@brightspace-ui/core/components/list/list-item.js';
import '@brightspace-ui/core/components/html-block/html-block.js';
import { AttachmentTypes, getAttachmentType, getLinkIconTypeFromUrl, getReadableFileSizeString } from './helpers/attachmentsHelper.js';
import { bodySmallStyles, bodyStandardStyles, labelStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html, LitElement } from 'lit';
import { getFileIconTypeFromExtension } from '@brightspace-ui/core/components/icons/getFileIconType';
import { linkStyles } from '@brightspace-ui/core/components/link/link.js';
import { LocalizeQuestions } from '../localize-questions.js';
import { removeParagraphFormat } from './helpers/htmlTextHelper.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

class D2lQuestionWrittenResponsePresentational extends LocalizeQuestions(LitElement) {

	static get properties() {
		return {
			answerKey: {
				attribute: 'answer-key',
				type: String
			},
			questionText: {
				attribute: 'question-text',
				type: String
			},
			responseAttachments: {
				attribute: false,
				type: Array
			},
			responseLength: {
				attribute: 'response-length',
				type: String
			},
			responseText: {
				attribute: 'response-text',
				type: String
			},
			readonly: {
				type: Boolean
			}
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
				z-index: 1;
			}
			.d2l-questions-written-response-question-text {
				padding-bottom: 1.2rem;
			}
			.d2l-questions-written-response-question-response {
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

	render() {
		return html`
			<div class="d2l-questions-question-wrapper">
				<div class="d2l-questions-written-response-question-text">
					<d2l-html-block>
						${unsafeHTML(removeParagraphFormat(this.questionText))}
					</d2l-html-block>
				</div>
				<div class="d2l-questions-written-response-question-response">
					${this._renderResponse()}
					${this._renderAttachments()}
				</div>
				${this._renderAnswerKey()}
			</div>
		`;
	}

	_downloadAttachment(href) {
		window.location.href = href;
	}

	_renderAnswerKey() {
		if (this.readonly && this.answerKey) {
			return html`
				<div class="d2l-questions-written-response-question-answer-key">
					<h2 class="d2l-label-text">
						${this.localize('answerKey')}
					</h2>
					<d2l-html-block>
						${unsafeHTML(removeParagraphFormat(this.answerKey))}
					</d2l-html-block>
				</div>
			`;
		}
	}

	_renderAttachments() {
		if (this.readonly && this.responseAttachments) {
			const attachmentItems = html`${this.responseAttachments.map(file => {
				const onClickHandler = () => this._downloadAttachment(file.href);
				const onKeydownHandler = (e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						this._downloadAttachment(file.href);
					}
				};

				const attachmentType = getAttachmentType(file.extension);

				let iconType;
				switch (attachmentType) {
					case AttachmentTypes.LINK:
						iconType = getLinkIconTypeFromUrl(file.href);
						break;
					case AttachmentTypes.PAGE:
						iconType = 'browser';
						break;
					default:
						iconType = getFileIconTypeFromExtension(file.extension);
				}

				return html`
					<d2l-list-item key=${file.href} class="d2l-questions-written-response-attachment-list-item">
						<div class="d2l-questions-written-response-attachment-container">
							<d2l-icon icon="tier1:${iconType}"></d2l-icon>
							<a class="d2l-link d2l-body-compact"
								tabindex="0"
								aria-label="${this.localize('clickToDownloadAttachmentFile', 'fileName', file.name)}"
								@keydown=${onKeydownHandler}
								@click=${onClickHandler}
							>${file.name}</a>
							${attachmentType === AttachmentTypes.LINK ? html`` : html`<span class="d2l-body-compact">(${getReadableFileSizeString(file.size, this.localize.bind(this))})</span>`}
						</div>
					</d2l-list-item>
				`;
			})}`;

			return html`
				<d2l-list class="d2l-questions-written-response-question-attachment-list" aria-role="attachment list" separators="between">
					${attachmentItems}
				</d2l-list>
			`;
		}
	}

	_renderResponse() {
		if (this.readonly && this.responseText) {
			return html`
				<d2l-html-block>
					${unsafeHTML(removeParagraphFormat(this.responseText))}
				</d2l-html-block>
				<div class="d2l-questions-written-response-question-word-count">
					<h3 class="d2l-label-text">
						${this.responseLength} ${this.localize('words')}
					</h3>
				</div>
			`;
		}
	}
}
customElements.define('d2l-questions-written-response-presentational', D2lQuestionWrittenResponsePresentational);
