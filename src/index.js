require("style!css!stylus!./style.styl");
require("style!css!vis/dist/vis.css");
import vis from "vis";
import m from "mithril";
import debounce from "lodash/debounce";
import parseMarkup from "./parse-markup";
import getTimelineData from "./get-timeline-data";

const noop = () => {};
var timeline = null;
var markup = localStorage["ptMarkup"] || "";


function updateTimeline() {
    if (!timeline) return;
    const parsed = parseMarkup(markup);
    const data = getTimelineData(parsed);
    timeline.setData(data);
}

const throttledUpdate = debounce(updateTimeline, 500);

function view() {
    const up = function update() {
        markup = this.value;
        localStorage["ptMarkup"] = markup;
        throttledUpdate();
    };
    return m("#container",
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
                timeline = new vis.Timeline(element, null, {
                    height: "500px",
                    width: "100%",
                    groupOrder: "id",
                });
                updateTimeline();
            },
        })
    );
}

m.mount(document.body, {view, controller: noop});
