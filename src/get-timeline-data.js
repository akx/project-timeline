import R from "ramda";
import fishue from "./fishue";

function getGroupDefinitions(parsed, lanes) {
    if (lanes === "none" || lanes === null) {
        return [];
    }
    const key = (lanes === "projects" ? "projects" : "people");
    return R.pipe(
        R.pluck(key), R.flatten, R.sortBy(R.identity), R.uniq,
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

export default function getTimelineData(parsed, lanes) {
    let groups = getGroupDefinitions(parsed, lanes);
    const projectStyles = getProjectStyles(parsed);
    const items = [];
    const addItem = items.push.bind(items);
    let id = 1;
    parsed.forEach(({range, people, projects}) => {
        R.xprod(people, projects).forEach(([person, project]) => {
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
