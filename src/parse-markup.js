/* eslint-disable no-param-reassign */

import filter from "ramda/src/filter";
import identity from "ramda/src/identity";
import map from "ramda/src/map";
import pipe from "ramda/src/pipe";
import toLower from "ramda/src/toLower";
import trim from "ramda/src/trim";
import uniq from "ramda/src/uniq";
import upperFirst from "lodash/upperFirst";
import {parseAsRange} from "./dates";

const identityFilter = filter(identity);
const cleanText = pipe(trim, toLower, upperFirst);


function parseList(listText) {
    return uniq(identityFilter(
        map(cleanText, listText.replace(/^\[|\]$/g, "").split(","))
    ).sort());
}

export default function parseMarkup(markup) {
    const parsed = [];
    markup.split("\n").forEach((line) => {
        line = trim(line).replace(/,\s+/g, ',');
        if (!line.length || /^#/.test(line)) return;
        const match = /^(\d.+?)\s+(.+?)\s+(.+)$/.exec(line);
        if (!match) return;
        const [, rangeText, personText, projectText] = match;
        const range = parseAsRange(rangeText);
        const people = parseList(personText);
        const projects = parseList(projectText);
        if (!(range && (people && people.length) && (projects && projects.length))) {
            return;
        }
        parsed.push({range, people, projects});
    });
    return parsed;
}
