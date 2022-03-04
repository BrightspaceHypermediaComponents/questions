import { assert } from '@open-wc/testing';
import { removeParagraphFormat } from '../../components/helpers/htmlTextHelper.js';

describe('htmlTextHelper tests', () => {

	describe('removeParagraphFormat test', () => {
		it('correctly remove <p> tags', async() => {
			const singlePTagHTML = '<p>Paragraph starting sentence.</p>';
			const layeredPTagHTML = '<p>Paragraph<p>starting</p>sentence.</p>';
			const nonLayeredPTagHTML = '<p>Paragraph</p><p>starting</p><p>here.</p>';

			assert.equal(removeParagraphFormat(singlePTagHTML), 'Paragraph starting sentence.');
			assert.equal(removeParagraphFormat(layeredPTagHTML), layeredPTagHTML);
			assert.equal(removeParagraphFormat(nonLayeredPTagHTML), nonLayeredPTagHTML);
		});
	});
});
