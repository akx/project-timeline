/* eslint-disable no-param-reassign */

import upperFirst from "lodash/upperFirst";
import R from "ramda";
import {parseAsRange} from "./dates";

const identityFilter = R.filter(R.identity);
const cleanText = R.pipe(R.trim, R.toLower, upperFirst);


export default function parseMarkup(markup) {
    const parsed = [];
    markup.split("\n").forEach((line) => {
        line = R.trim(line);
        if (!line.length || /^#/.test(line)) return;
        const match = /^(\d.+?)\s+(.+?)\s+(.+)$/.exec(line);
        if (!match) return;
        const [, rangeText, personText, projectText] = match;
        const range = parseAsRange(rangeText);
        const people = identityFilter(R.map(cleanText, personText.split(","))).sort();
        const projects = identityFilter(R.map(cleanText, projectText.split(","))).sort();
        if (!(range && (people && people.length) && (projects && projects.length))) {
            return;
        }
        parsed.push({range, people, projects});
    });
    return parsed;
}
