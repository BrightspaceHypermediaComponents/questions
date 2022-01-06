import './icons/d2l-questions-icons-radio.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/offscreen/offscreen.js';
import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import { css, html, LitElement } from 'lit-element';
import { bodyCompactStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { getUniqueId } from '@brightspace-ui/core/helpers/uniqueId.js';
import { LocalizeDynamicMixin } from '@brightspace-ui/core/mixins/localize-dynamic-mixin.js';
import { radioStyles } from '@brightspace-ui/core/components/inputs/input-radio-styles.js';

const REL_IDENTIFIER = 'https://questions.api.brightspace.com/rels/identifier';
const REL_ITEM_BODY = 'https://questions.api.brightspace.com/rels/item-body';
const REL_INTERACTION = 'https://questions.api.brightspace.com/rels/interaction';
const REL_RESPONSE_DECLARATION = 'https://questions.api.brightspace.com/rels/response-declaration';
class D2lQuestionsMultipleChoice extends LocalizeDynamicMixin(LitElement) {

	static get properties() {
		return {
			readonly: { type: Boolean },
			question: { type: Object },
			questionResponse: { type: Object },
			token: { type: Object },
			_choices: { type: Object }
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
				color: var(--d2l-color-galena);
				display: flex;
				flex-wrap: nowrap;
				height: 2.5rem;
			}
			.d2l-questions-multiple-choice-row d2l-questions-icons-radio-unchecked,
			.d2l-questions-multiple-choice-row d2l-questions-icons-radio-checked {
				margin-right: 0.3rem;
				margin-top: -0.1rem;
			}
			.d2l-questions-multiple-choice-row d2l-icon {
				margin-right: 0.3rem;
			}
			.d2l-questions-multiple-choice-incorrect-icon {
				color: var(--d2l-color-cinnabar);
			}
			.d2l-questions-multiple-choice-correct-icon {
				color: var(--d2l-color-olivine);
			}
			.d2l-questions-multiple-choice-without-icon {
				width: 1.2rem;
			}
		`];
	}

	constructor() {
		super();
		this.radioGroupId = getUniqueId();
	}

	static get localizeConfig() {
		return {
			importFunc: async lang => (await import(`../lang/${lang}.js`)).default
		};
	}

	render() {
		const questionText = this.question.entity.getSubEntityByClass('questionText');
		if (this._choices !== undefined) {
			return html`
				<div class="d2l-questions-multiple-choice-question-text">${questionText.properties.html}</div>

				<div class="d2l-questions-multiple-choice-group">
					${this._choices.map((choice) => this._renderChoice(choice))}
				</div>
				`;
		}
	}

	async updated(changedProperties) {
		super.updated();
		if ((changedProperties.has('question') || changedProperties.has('questionResponse'))) {
			try {
				await this._loadChoices();
			} catch (err) {
				console.error(err);
				throw new Error('d2l-questions-multiple-choice: Unable to load choices from question');
			}
		}
	}

	async _getEntityFromHref(targetHref, bypassCache) {
		return await window.D2L.Siren.EntityStore.fetch(targetHref, this.token, bypassCache);
	}

	async _loadChoices() {
		// Reponse has the choices more readily available than the actual question does + the answer/correctness states
		if (this.questionResponse) {
			return await this._loadChoicesFromResponse();
		}
		const itemBodyHref = this.question.entity.getSubEntityByRel(REL_ITEM_BODY);
		const itemBodyEntity = await this._getEntityFromHref(itemBodyHref);
		const interactionHref = itemBodyEntity.entity.getSubEntityByRel(REL_INTERACTION);
		const interactionEntity = await this._getEntityFromHref(interactionHref);
		const choices = await Promise.all(interactionEntity.entity.getSubEntitiesByClass('simple-choice').map(async choice => {
			const choiceEntity = await this._getEntityFromHref(choice.href, false);
			return {
				text: choiceEntity.entity.getSubEntityByClass('richtext').properties.text,
				href: choice.href
			};
		}));
		this._choices = choices;
	}

	async _loadChoicesFromResponse() {
		let hasCorrectAnswer = false;
		const candidateResponse = this.questionResponse.entity.getSubEntityByClass('candidate-response');
		const choices = await Promise.all(candidateResponse.entities.map(async choice => {
			if (choice.hasClass('correct-response')) {
				hasCorrectAnswer = true;
			}
			const choiceHref = choice.getLinkByRel(REL_IDENTIFIER).href;
			const choiceEntity = await this._getEntityFromHref(choiceHref, false);
			return {
				text: choiceEntity.entity.getSubEntityByClass('richtext').properties.text,
				selected: choice.hasClass('selected'),
				correct: choice.hasClass('correct-response'),
				href: choiceHref
			};
		}));
		if (!hasCorrectAnswer) {
			const responseHref = candidateResponse.getLinkByRel(REL_RESPONSE_DECLARATION).href;
			const response = await this._getEntityFromHref(responseHref, false);
			const correctResponse = response.entity.getSubEntityByClass('correct-response');
			const correctChoiceHref = correctResponse.getSubEntityByClass('value').getLinkByRel(REL_IDENTIFIER).href;
			choices.find(choice => choice.href === correctChoiceHref).correct = true;
		}
		this._choices = choices;
		return;
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
						${choice.text}
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
				<d2l-offscreen>${this.localize(lang)} ${choice.text}</d2l-offscreen>
				<span aria-hidden="true">${choice.text}</span>
			</div>`;
	}

}
customElements.define('d2l-questions-multiple-choice', D2lQuestionsMultipleChoice);
