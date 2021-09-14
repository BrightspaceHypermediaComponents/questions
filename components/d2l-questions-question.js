import { css, html, LitElement } from 'lit-element';
import { LocalizeDynamicMixin } from '@brightspace-ui/core/mixins/localize-dynamic-mixin.js';

class D2lQuestionsQuestion extends LocalizeDynamicMixin(LitElement) {

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
		`;
	}

}
customElements.define('d2l-questions-question', D2lQuestionsQuestion);
