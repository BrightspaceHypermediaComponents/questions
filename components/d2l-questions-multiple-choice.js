import '@brightspace-ui/core/components/inputs/input-checkbox.js';
import { css, html, LitElement } from 'lit-element';
import { LocalizeDynamicMixin } from '@brightspace-ui/core/mixins/localize-dynamic-mixin.js';

class D2lQuestionsMultipleChoice extends LocalizeDynamicMixin(LitElement) {

	static get properties() {
		return {
			prop1: { type: String },
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

	constructor() {
		super();

		this.prop1 = 'd2l-questions-question';
	}

	static get localizeConfig() {
		return {
			importFunc: async lang => (await import(`../lang/${lang}.js`)).default
		};
	}

	render() {
		return html`
			<h2>${this.localize('hello')} ${this.prop1}!</h2>
			<d2l-input-checkbox id="checkbox">Label for checkbox</d2l-input-checkbox>
			<d2l-input-checkbox>Label for second checkbox</d2l-input-checkbox>
		`;
	}

}
customElements.define('d2l-questions-multiple-choice', D2lQuestionsMultipleChoice);
