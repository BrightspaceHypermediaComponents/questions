import '@brightspace-ui/core/components/inputs/input-checkbox.js';
import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import { css, html, LitElement } from 'lit-element';
import { LocalizeDynamicMixin } from '@brightspace-ui/core/mixins/localize-dynamic-mixin.js';

//Database is using magic numbers
const IS_CHECKED = '1';
class D2lQuestionsMultipleChoice extends LocalizeDynamicMixin(LitElement) {

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
		`;
	}

	static get localizeConfig() {
		return {
			importFunc: async lang => (await import(`../lang/${lang}.js`)).default
		};
	}

	render() {
		this._loadChoices();
		if (this.displayChoices !== undefined) {
			return html`
				${this.displayChoices.map((choice) => html`
					<d2l-input-checkbox
						?checked=${choice.response === IS_CHECKED}
						?disabled=${this.disabled}
					>
					${choice.value}
					</d2l-input-checkbox>
				`)}
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

}
customElements.define('d2l-questions-multiple-choice', D2lQuestionsMultipleChoice);
