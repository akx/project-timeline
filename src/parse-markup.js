/* eslint-disable no-param-reassign */

import filter from "ramda/src/filter";
import identity from "ramda/src/identity";
import map from "ramda/src/map";
import pipe from "ramda/src/pipe";
import toLower from "ramda/src/toLower";
import trim from "ramda/src/trim";
import upperFirst from "lodash/upperFirst";
import {parseAsRange} from "./dates";

const identityFilter = filter(identity);
const cleanText = pipe(trim, toLower, upperFirst);


export default function parseMarkup(markup) {
    const parsed = [];
    markup.split("\n").forEach((line) => {
        line = trim(line);
        if (!line.length || /^#/.test(line)) return;
        const match = /^(\d.+?)\s+(.+?)\s+(.+)$/.exec(line);
        if (!match) return;
        const [, rangeText, personText, projectText] = match;
        const range = parseAsRange(rangeText);
        const people = identityFilter(map(cleanText, personText.split(","))).sort();
        const projects = identityFilter(map(cleanText, projectText.split(","))).sort();
        if (!(range && (people && people.length) && (projects && projects.length))) {
            return;
        }
        parsed.push({range, people, projects});
    });
    return parsed;
}
