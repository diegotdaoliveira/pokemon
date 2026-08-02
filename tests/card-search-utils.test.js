const test = require('node:test');
const assert = require('node:assert/strict');
const { buildCardNumberVariants, isExactCardNumberMatch, isCardNumberEquivalent, extractCardNumberQuery } = require('../card-search-utils');

test('buildCardNumberVariants preserva o formato literal e adiciona uma comparação numérica', () => {
  const variants = buildCardNumberVariants('pokemon card 003/132');
  assert.ok(variants.includes('003/132'));
  assert.ok(variants.includes('3/132'));
});

test('isExactCardNumberMatch diferencia 003/132 de 3/132', () => {
  assert.equal(isExactCardNumberMatch('003/132', '3/132'), false);
  assert.equal(isExactCardNumberMatch('1/25', '001/025'), false);
});

test('isCardNumberEquivalent aceita formatos equivalentes sem confundir números diferentes', () => {
  assert.equal(isCardNumberEquivalent('003/132', '3/132'), true);
  assert.equal(isCardNumberEquivalent('1/25', '001/025'), true);
});

test('extractCardNumberQuery reconhece formatos literais de coleções e promoções', () => {
  assert.equal(extractCardNumberQuery('SWSH001'), 'SWSH001');
  assert.equal(extractCardNumberQuery('promo TG01/TG30'), 'TG01/TG30');
  assert.equal(extractCardNumberQuery('GG12/GG70'), 'GG12/GG70');
});
