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

//Database is using magic numbers
const IS_CHECKED = '1';
const IS_NOT_CHECKED = '0';
class D2lQuestionsMultipleChoice extends LocalizeDynamicMixin(LitElement) {

	static get properties() {
		return {
			readonly: { type: Boolean },
			question: { type: Object },
			questionResponse: { type: Object }
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
		this._loadChoices();
		const questionText = this.question.entity.getSubEntityByClass('questionText');
		if (this.displayChoices !== undefined) {
			return html`
				<div class="d2l-questions-multiple-choice-question-text">${questionText.properties.html}</div>

				<div class="d2l-questions-multiple-choice-group">
					${this.displayChoices.map((choice) => this._renderChoice(choice))}
				</div>
				`;
		} else {
			return html``;
		}
	}

	_loadChoices() {
		const choices = this.question.entity.getSubEntityByClass('atoms').entities;
		const answers = this.questionResponse.entity.entities;
		this.displayChoices = choices.map(choice => {
			const answer = answers.find(answer => answer.properties && answer.properties.atomId === choice.properties.atomId);
			return { ...choice.properties, ...answer.properties };
		});
	}

	_renderChoice(choice) {
		const checked = choice.response === IS_CHECKED;
		if (this.readonly) {
			let icon = undefined;
			let lang = '';
			let iconStyle = '';
			if (choice.response) {
				if (checked && choice.isCorrect) {
					icon = 'check';
					lang = 'correctResponse';
				} else if (checked && !choice.isCorrect) {
					icon = 'close-large-thick';
					lang = 'incorrectResponse';
					iconStyle = 'd2l-questions-multiple-choice-incorrect-icon';
				} else if (choice.response === IS_NOT_CHECKED && choice.isCorrect) {
					icon = 'arrow-thin-right';
					lang = 'correctAnswer';
					iconStyle = 'd2l-questions-multiple-choice-correct-icon';
				}
			}

			return html`
				<div class="d2l-questions-multiple-choice-row d2l-body-compact">
					${icon ? html`<d2l-icon icon="tier1:${icon}" class="${iconStyle}"></d2l-icon>` : html`<div class="d2l-questions-multiple-choice-without-icon"></div>`}
					${checked ? html`<d2l-questions-icons-radio-checked></d2l-questions-icons-radio-checked>` : html`<d2l-questions-icons-radio-unchecked></d2l-questions-icons-radio-unchecked>`}
					<d2l-offscreen>${this.localize(lang)} ${choice.value}</d2l-offscreen>
					<span aria-hidden="true">${choice.value}</span>
				</div>
		`;
		} else {
			return html`
				<div class="d2l-questions-multiple-choice-row">
					<label class="d2l-input-radio-label">
						<input type="radio" name="${this.radioGroupId}"
						?checked=${checked}
						aria-label="${choice.value}">
						${choice.value}
					</label>
			</div>
			`;
		}
	}
}
customElements.define('d2l-questions-multiple-choice', D2lQuestionsMultipleChoice);
