import '@brightspace-ui/core/components/inputs/input-checkbox.js';
import '@brightspace-ui/core/components/icons/icon.js';
import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import { css, html, LitElement } from 'lit-element';
import { LocalizeDynamicMixin } from '@brightspace-ui/core/mixins/localize-dynamic-mixin.js';

//Database is using magic numbers
const IS_CHECKED = '1';
class D2lQuestionsMultiSelect extends LocalizeDynamicMixin(LitElement) {

	static get properties() {
		return {
			disabled: { type: Boolean },
			question: { type: Object },
			questionResponse: { type: Object }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			.d2l-questions-multi-select-incorrect-icon {
				padding-left: 1.2rem;
			}
			.d2l-questions-multi-select-question-text {
				padding-bottom: 1rem;
			}
			.d2l-questions-multi-select-row {
				display: flex;
				flex-wrap: nowrap;
			}
			.d2l-questions-multi-select-row d2l-icon {
				margin-right: 0.3rem;
				margin-top: 0.1rem;
			}
		`;
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
				<div class="d2l-questions-multi-select-question-text">${questionText.properties.html}</div>
				${this.displayChoices.map((choice) => this._renderChoice(choice))}
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
		const isCorrect = choice.responseIsCorrect && choice.response === IS_CHECKED
			|| !choice.responseIsCorrect && !(choice.response === IS_CHECKED);

		return html`
			<div class="d2l-questions-multi-select-row">
				${choice.isCorrect ? html`<d2l-icon icon="tier1:arrow-thin-right"></d2l-icon>` : ''}
				<d2l-icon
					class="${choice.isCorrect ? '' : 'd2l-questions-multi-select-incorrect-icon'}"
					icon="tier1:${isCorrect ? 'check' : 'close-default'}"></d2l-icon>
				<d2l-input-checkbox
					description="${this.localize(choice.isCorrect ? 'correctAnswer' : 'incorrectAnswer')} ${this.localize(isCorrect ? 'correctResponse' : 'incorrectResponse')}"
					?checked=${choice.response === IS_CHECKED}
					?disabled=${this.disabled}
				>
				${choice.value}
				</d2l-input-checkbox>
			</div>
		`;
	}

}
customElements.define('d2l-questions-multi-select', D2lQuestionsMultiSelect);
