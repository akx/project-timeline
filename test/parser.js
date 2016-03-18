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

    it("should be lenient about spaces after commas", () => {
        const entry = parseMarkup(`
2016w1 x, y, z q, w,   e
`)[0];
        expect(entry.people).to.have.length(3);
        expect(entry.projects).to.have.length(3);
    });

    it("should support brackets for visual wrapping of people", () => {
        const entry = parseMarkup("2016w1 [x, y, z] qqq")[0];
        expect(entry.people).to.eql(["X", "Y", "Z"]);
    });
});
