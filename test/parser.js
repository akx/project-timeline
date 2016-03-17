/* eslint-env node, mocha */
import {parseAsRange, parseWeek} from '../src/dates';
import {expect} from 'chai';

import parseMarkup from '../src/parse-markup';

describe("Parser", () => {
    it("should ignore lines starting with octothorpes", () => {
        expect(parseMarkup("#\n     #\n#\n")).to.have.length(0);
    });
    it("should ignore indentation", () => {
        expect(parseMarkup(`
2016w1 x   y
       2016w2   y   q
`)).to.have.length(2);
    });
    it("should ignore invalid lines", () => {
        expect(parseMarkup(`
2016w1 x y
2016w1 ,,, ,,,
2016w1 ,,,
jokjrh
`)).to.have.length(1);
    });
});
