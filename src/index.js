require("style!css!stylus!./style.styl");
require("style!css!vis/dist/vis.css");
import Timeline from "vis/lib/timeline/Timeline";
import m from "mithril";
import debounce from "debounce";
import parseMarkup from "./parse-markup";
import getTimelineData from "./get-timeline-data";

const noop = () => {};
var timeline = null;
var markup = localStorage["ptMarkup"] || "";
var laneSetting = "people";


function updateTimeline() {
    if (!timeline) return;
    const parsed = parseMarkup(markup);
    const data = getTimelineData(parsed, laneSetting);
    timeline.setGroups(data.groups || undefined);
    timeline.setItems(data.items);
}

const throttledUpdate = debounce(updateTimeline, 500);

function getToolbar() {
    return m(".row#toolbar",
        m(
            "label",
            "Lanes:", m("select", {
                    value: laneSetting,
                    onchange: function () {
                        laneSetting = this.value;
                        updateTimeline();
                    },
                },
                ["people", "projects", "none"].map((value) => m("option", {value, key: value}, value))
            ))
    );
}

function getMainRow() {
    const up = function update() {
        markup = this.value;
        localStorage["ptMarkup"] = markup;
        throttledUpdate();
    };
    return m(".row#main",
        m(".col.edit",
            m("textarea", {
                value: markup,
                oninput: up,
                onchange: up,
            })
        ),
        m(".col#timeline", {
            config: function configTimeline(element, isInitialized) {
                if (isInitialized) return;
                timeline = new Timeline(element, null, {
                    height: "500px",
                    width: "100%",
                    groupOrder: "id",
                });
                updateTimeline();
            },
        })
    );
}

function view() {
    return m("#container", getToolbar(), getMainRow());
}

m.mount(document.body, {view, controller: noop});
