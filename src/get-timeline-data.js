import flatten from "ramda/src/flatten";
import identity from "lodash/identity";
import map from "ramda/src/map";
import pipe from "ramda/src/pipe";
import pluck from "ramda/src/pluck";
import sortBy from "ramda/src/sortBy";
import uniq from "ramda/src/uniq";
import xprod from "ramda/src/xprod";
import fishue from "./fishue";

function getGroupDefinitions(parsed, lanes) {
    if (lanes === "none" || lanes === null) {
        return [];
    }
    const key = (lanes === "projects" ? "projects" : "people");
    return pipe(
        pluck(key), flatten, sortBy(identity), uniq,
        map((name) => ({id: name, content: name}))
    )(parsed);
}

function getProjectStyles(parsed) {
    const projects = pipe(pluck("projects"), flatten, sortBy(identity), uniq)(parsed);
    const projectStyles = {};
    projects.forEach((project, index) => {
        const hue = fishue(index);
        projectStyles[project] = `background-color: hsl(${hue}, 100%, 85%)`;
    });
    return projectStyles;
}

export default function getTimelineData(parsed, lanes) {
    let groups = getGroupDefinitions(parsed, lanes);
    const projectStyles = getProjectStyles(parsed);
    const items = [];
    const seen = {};
    const addItem = function(item) {
        const hash = `${+item.start},${+item.end},${item.group},${item.content}`;
        if (!seen[hash]) {
            items.push(item);
            seen[hash] = item;
        }
    };
    let id = 1;
    parsed.forEach(({range, people, projects}) => {
        xprod(people, projects).forEach(([person, project]) => {
            let content;
            let group;
            switch (lanes) {
                case "projects":
                    content = person;
                    group = project;
                    break;
                case "people":
                    content = project;
                    group = person;
                    break;
                default:
                    content = `${person} @ ${project}`;
                    break;
            }
            addItem({
                id: (id++),
                start: range[0],
                end: range[1],
                group,
                content,
                style: projectStyles[project],
            });
        });
    });
    if (groups.length === 0) {
        groups = undefined;
    }
    return {groups, items};
}
