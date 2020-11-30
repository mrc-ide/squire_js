import { expect } from 'chai';
import { leadingEigenvalue } from '../src/eigenvalues.js';
import { flattenNested } from '../src/utils.js';
import BRA from '../data/BRA.json';

describe('leadingEigenvalue', function() {
  it('works for a non-symmetric matrix', function() {
    expect(
      leadingEigenvalue([[1, 2], [3, 4]])
    ).to.be.closeTo(5.3722813, 1e-6);
  });

  it('is fast', function() {
    this.timeout(1000);
    const input = BRA.contactMatrixScaledAge;
    for (let i = 0; i < 300; ++i) {
      leadingEigenvalue(input);
    }
  });
})
