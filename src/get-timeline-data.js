import R from "ramda";
import fishue from "./fishue";

function getGroupDefinitions(parsed) {
    return R.pipe(
        R.pluck("people"), R.flatten, R.sortBy(R.identity), R.uniq,
        R.map((name) => ({id: name, content: name}))
    )(parsed);
}

function getProjectStyles(parsed) {
    const projects = R.pipe(R.pluck("projects"), R.flatten, R.sortBy(R.identity), R.uniq)(parsed);
    const projectStyles = {};
    projects.forEach((project, index) => {
        const hue = fishue(index);
        projectStyles[project] = `background-color: hsl(${hue}, 100%, 85%)`;
    });
    return projectStyles;
}

export default function getTimelineData(parsed) {
    const groups = getGroupDefinitions(parsed);
    const projectStyles = getProjectStyles(parsed);
    const items = [];
    const addItem = items.push.bind(items);
    parsed.forEach(({range, people, projects}) => {
        R.xprod(people, projects).forEach(([person, project]) => addItem({
            start: range[0],
            end: range[1],
            group: person,
            content: project,
            style: projectStyles[project],
        }));
    });
    return {groups, items};
}
