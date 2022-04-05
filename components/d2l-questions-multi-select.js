import './icons/d2l-questions-icons-checkbox.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/inputs/input-checkbox.js';
import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/offscreen/offscreen.js';
import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { bodyCompactStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { LocalizeQuestions } from '../localize-questions.js';

//Database is using magic numbers
const IS_CHECKED = '1';
class D2lQuestionsMultiSelect extends LocalizeQuestions(LitElement) {

	static get properties() {
		return {
			readonly: { type: Boolean },
			question: { type: Object },
			questionResponse: { type: Object }
		};
	}

	static get styles() {
		return [bodyCompactStyles, css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			.d2l-questions-multi-select-question-text {
				padding-bottom: 1rem;
			}
			.d2l-questions-multi-select-row {
				color: var(--d2l-color-galena);
				display: flex;
				flex-wrap: nowrap;
				height: 2.5rem;
			}
			.d2l-questions-multi-select-row d2l-icon {
				margin-right: 0.3rem;
				margin-top: 0.1rem;
			}
			.d2l-questions-multi-select-row d2l-questions-icons-checkbox-unchecked,
			.d2l-questions-multi-select-row d2l-questions-icons-checkbox-checked {
				margin-right: 0.3rem;
				margin-top: -0.1rem;
			}
			.d2l-questions-incorrect-answer-icon {
				padding-left: 1.2rem;
			}
			.d2l-questions-multi-select-correct-response-icon {
				color: var(--d2l-color-galena);
			}
			.d2l-questions-multi-select-incorrect-response-icon {
				color: var(--d2l-color-cinnabar);
			}
			.d2l-questions-multi-select-correct-answer-icon {
				color: var(--d2l-color-olivine);
			}
		`];
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
		const checked = choice.response === IS_CHECKED;
		const correctAnswer = choice.isCorrect;
		const correctResponse = choice.responseIsCorrect && checked || !choice.responseIsCorrect && !checked;
		const accessibleDescription = `${this.localize(correctAnswer ? 'correctAnswer' : 'incorrectAnswer')} ${this.localize(correctResponse ? 'correctResponse' : 'incorrectResponse')}`;

		if (this.readonly) {
			return html`
				<div class="d2l-questions-multi-select-row d2l-body-compact">
					${correctAnswer ? html`<d2l-icon class="d2l-questions-multi-select-correct-answer-icon" icon="tier1:arrow-thin-right"></d2l-icon>` : ''}
					<d2l-icon
						class="${!correctResponse ? 'd2l-questions-multi-select-incorrect-response-icon' : 'd2l-questions-multi-select-correct-response-icon'} ${!correctAnswer ? 'd2l-questions-incorrect-answer-icon' : ''}"
						icon="tier1:${correctResponse ? 'check' : 'close-large-thick'}"></d2l-icon>
					${checked ? html`<d2l-questions-icons-checkbox-checked></d2l-questions-icons-checkbox-checked>` : html`<d2l-questions-icons-checkbox-unchecked></d2l-questions-icons-checkbox-unchecked>`}
					<d2l-offscreen>${accessibleDescription} ${choice.value}</d2l-offscreen>
					<span aria-hidden="true">${choice.value}</span>
				</div>`;
		} else {
			return html`
				<div class="d2l-questions-multi-select-row">
					${correctAnswer ? html`<d2l-icon class="d2l-questions-multi-select-correct-answer-icon" icon="tier1:arrow-thin-right"></d2l-icon>` : ''}
					<d2l-icon
						class="${!correctResponse ? 'd2l-questions-multi-select-incorrect-response-icon' : 'd2l-questions-multi-select-correct-response-icon'} ${!correctAnswer ? 'd2l-questions-incorrect-answer-icon' : ''}"
						icon="tier1:${correctResponse ? 'check' : 'close-large-thick'}"></d2l-icon>
					<d2l-input-checkbox
						description="${accessibleDescription}"
						?checked=${checked}>
					${choice.value}
					</d2l-input-checkbox>
				</div>`;
		}
	}

}
customElements.define('d2l-questions-multi-select', D2lQuestionsMultiSelect);
