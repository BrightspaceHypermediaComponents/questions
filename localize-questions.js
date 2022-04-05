import { LocalizeDynamicMixin } from '@brightspace-ui/core/mixins/localize-dynamic-mixin';

export const LocalizeQuestions = superclass => class extends LocalizeDynamicMixin(superclass) {

	static get localizeConfig() {
		return {
			importFunc: async lang => (await import(`./lang/${lang}.js`)).default,
			osloCollection: '@brightspace-hmc\\questions\\d2l-questions'
		};
	}
};
