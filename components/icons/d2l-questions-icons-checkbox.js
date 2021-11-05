
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/icons/icon-custom.js';
import { html, LitElement } from 'lit-element/lit-element.js';

class D2lQuestionsIconsCheckboxUnchecked extends LitElement {
	render() {
		return html`
		<d2l-icon-custom size="tier1" style="color: var(--d2l-color-galena);">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				<path d="M0 0h24v24H0V0z" fill="none"/>
				<path d="M19 5v14H5V5h14m2-2H3v18h18V3z"/>
			</svg>
		</d2l-icon-custom>`;
	}
}
customElements.define('d2l-questions-icons-checkbox-unchecked', D2lQuestionsIconsCheckboxUnchecked);

class D2lQuestionsIconsCheckboxChecked extends LitElement {
	render() {
		return html`
		<d2l-icon-custom size="tier1" style="color: var(--d2l-color-galena);">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				<path d="M0 0h24v24H0V0z" fill="none"/>
				<path d="M21 3H3v18h18V3zM10 17l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
			</svg>
		</d2l-icon-custom>`;
	}
}
customElements.define('d2l-questions-icons-checkbox-checked', D2lQuestionsIconsCheckboxChecked);

