import '@brightspace-ui/core/components/icons/icon.js';
import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { getUniqueId } from '@brightspace-ui/core/helpers/uniqueId.js';
import { LocalizeDynamicMixin } from '@brightspace-ui/core/mixins/localize-dynamic-mixin.js';
import { radioStyles } from '@brightspace-ui/core/components/inputs/input-radio-styles.js';

//Database is using magic numbers
const IS_CHECKED = '1';
const IS_NOT_CHECKED = '0';
class D2lQuestionsMultipleChoice extends LocalizeDynamicMixin(LitElement) {

	static get properties() {
		return {
			disabled: { type: Boolean },
			question: { type: Object },
			questionResponse: { type: Object }
		};
	}

	static get styles() {
		return [radioStyles, css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			.d2l-questions-multiple-choice-group {
				display:flex;
				flex-direction:column;
			}
			.d2l-questions-multiple-choice-question-text {
				padding-bottom: 1rem;
			}
			.d2l-questions-multiple-choice-row {
				display: flex;
				flex-wrap: nowrap;
				height: 1.4rem;
			}
			.d2l-questions-multiple-choice-row d2l-icon {
				margin-right: 0.3rem;
				margin-top: 0.2rem;
			}
			.d2l-questions-multiple-choice-without-icon {
				display: inline;
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
			const answer = answers.find(answer => answer.properties.atomId === choice.properties.atomId);
			return { ...choice.properties, ...answer.properties };
		});
	}

	_renderChoice(choice) {
		let icon = undefined;
		let lang = '';
		if (choice.response) {
			if (choice.response === IS_CHECKED && choice.isCorrect) {
				icon = 'check';
				lang = 'correctResponse';
			} else if (choice.response === IS_CHECKED && !choice.isCorrect) {
				icon = 'close-default';
				lang = 'incorrectResponse';
			} else if (choice.response === IS_NOT_CHECKED && choice.isCorrect) {
				icon = 'arrow-thin-right';
				lang = 'correctAnswer';
			}
		}

		const inputSelectClasses =  {
			'd2l-input-radio-label': true,
			'd2l-input-radio-label-disabled': this.disabled
		};

		return html`
			<div class="d2l-questions-multiple-choice-row">
				${icon ? html`<d2l-icon icon="tier1:${icon}"></d2l-icon>` : html`<div class="d2l-questions-multiple-choice-without-icon"></div>`}
				<label class="${classMap(inputSelectClasses)}">
					<input type="radio" name="${this.radioGroupId}"
					?checked=${choice.response === IS_CHECKED}
					?disabled=${this.disabled}
					aria-label="${this.localize(lang)} ${choice.value}">
					${choice.value}
				</label>
			</div>
		`;
	}
}
customElements.define('d2l-questions-multiple-choice', D2lQuestionsMultipleChoice);
