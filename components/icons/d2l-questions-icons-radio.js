import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/icons/icon-custom.js';
import { html, LitElement } from 'lit';

class D2lQuestionsIconsRadioUnchecked extends LitElement {
	render() {
		return html`
		<d2l-icon-custom size="tier1" style="color: var(--d2l-color-galena);">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				<path d="M0 0h24v24H0z" fill="none"/>
				<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
			</svg>
		</d2l-icon-custom>`;
	}
}
customElements.define('d2l-questions-icons-radio-unchecked', D2lQuestionsIconsRadioUnchecked);

class D2lQuestionsIconsRadioChecked extends LitElement {
	render() {
		return html`
		<d2l-icon-custom size="tier1" style="color: var(--d2l-color-galena);">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				<path d="M0 0h24v24H0z" fill="none"/>
				<path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
			</svg>
		</d2l-icon-custom>`;
	}
}
customElements.define('d2l-questions-icons-radio-checked', D2lQuestionsIconsRadioChecked);
