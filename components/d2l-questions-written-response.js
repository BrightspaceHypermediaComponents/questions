import './d2l-questions-written-response-presentational.js';
import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import { Classes, Rels } from 'd2l-hypermedia-constants';
import { html, LitElement } from 'lit';

class D2lQuestionWrittenResponse extends LitElement {

	static get properties() {
		return {
			readonly: { type: Boolean },
			question: { type: Object },
			questionResponse: { type: Object },
			token: { type: Object },
			_answerKey: { type: String },
			_questionText: { type: String },
			_responseAttachments: { type: Array },
			_responseLength: { type: Number },
			_responseText: { type: String }
		};
	}

	render() {
		return html`
			<d2l-questions-written-response-presentational
				?readonly=${this.readonly}
				answer-key=${this._answerKey}
				question-text=${this._questionText}
				response-length=${this._responseLength}
				response-text=${this._responseText}
				.responseAttachments=${this._responseAttachments}>
			</d2l-questions-written-response-presentational>
		`;
	}

	async updated(changedProperties) {
		super.updated();
		if (changedProperties.has('question')) {
			await this._loadQuestionText();
			await this._loadAnswerKey();
		}
		if (changedProperties.has('question') || changedProperties.has('questionResponse')) {
			await this._loadResponse();
			await this._loadResponseAttachments();
		}
	}

	async _getEntityFromHref(targetHref) {
		return await window.D2L.Siren.EntityStore.fetch(targetHref, this.token);
	}

	async _loadAnswerKey() {
		this._answerKey = undefined;

		try {
			const itemBodyHref = this.question.entity.getSubEntityByRel(Rels.Questions.itemBody);

			if (itemBodyHref !== undefined) {
				const itemBodyEntity = await this._getEntityFromHref(itemBodyHref);
				const answerKeyEntity = itemBodyEntity.entity.getSubEntityByClass(Classes.text.richtext);

				if (answerKeyEntity !== undefined) {
					this._answerKey = answerKeyEntity.properties.html;
				}
			}
		} catch (err) {
			console.error(err);
			throw new Error('d2l-questions-written-response: Unable to load answer key from question');
		}
	}

	async _loadQuestionText() {
		this._questionText = undefined;
		try {
			const questionTextEntity = this.question.entity.getSubEntityByClass(Classes.questions.questionText);
			this._questionText = questionTextEntity.properties.html;
		} catch (err) {
			console.error(err);
			throw new Error('d2l-questions-written-response: Unable to load question text from question');
		}
	}

	async _loadResponse() {
		this._responseText = undefined;
		this._responseLength = undefined;

		try {
			if (this.questionResponse) {
				const responseEntity = this.questionResponse.entity.getSubEntityByClass(Classes.questions.candidateResponse);

				if (responseEntity !== undefined) {
					const responseTextEntity = responseEntity.getSubEntityByClass(Classes.text.richtext);
					this._responseText = responseTextEntity.properties.html;
					this._responseLength = responseTextEntity.properties.wordCount;
				}
			}
		} catch (err) {
			console.error(err);
			throw new Error('d2l-questions-written-response: Unable to load response from questionResponse');
		}
	}

	async _loadResponseAttachments() {
		this._responseAttachments = undefined;

		try {
			if (this.questionResponse) {
				const fileUploadEntity = this.questionResponse.entity.getSubEntityByClass('file-upload');
				const attachedFiles = fileUploadEntity && fileUploadEntity.entities;

				if (attachedFiles) {
					this._responseAttachments = attachedFiles.map(attachedFile => ({
						name: attachedFile.properties.name,
						size: attachedFile.properties.size,
						extension: attachedFile.properties.extension,
						href: attachedFile.properties.href
					}));
				}
			}
		} catch (err) {
			console.error(err);
			throw new Error('d2l-questions-written-response: Unable to load response attachments from questionResponse');
		}
	}
}
customElements.define('d2l-questions-written-response', D2lQuestionWrittenResponse);
