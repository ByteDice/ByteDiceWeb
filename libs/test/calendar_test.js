//const libCCss = `//#file { ./lib_style.css }`
const libCss = `
:root {
	--c-a-cell-width: 0px;  /* automatically set */
	--c-a-cell-height: 0px; /* automatically set */
	
	--c-width: 700px;
	--c-height: 400px;
	--c-cell-x-count: 7;
	--c-cell-y-count: 7;
	--c-time-width: 50px;
	--c-date-height: 1.5em;

	--c-s-grid-line-width: 2px;
	--c-s-grid-line-color: #000000;
}

div.c-base {
	background-color: darkgray;
	display: grid;
	grid-template-columns: var(--c-time-width) 1fr;
	grid-template-rows: var(--c-date-height) 1fr;
	width: var(--c-width);
	height: var(--c-height);
	padding-bottom: 0.5em;
}

ul.c-ul {
	list-style-type: none;
	margin: 0;
	padding: 0;
}

ul.c-times {
	display: grid;
	grid-template-rows: repeat(var(--c-cell-y-count), 1fr);
	grid-template-columns: 1fr;
	margin: -0.5em 0;
}

ul.c-dates {
	display: grid;
	grid-template-columns: repeat(var(--c-cell-x-count), 1fr);
	grid-template-rows: 1fr;
	text-align: center;
}

div.c-grid {
	background: /* Grid lines */
		repeating-linear-gradient(
			0deg,
			var(--c-s-grid-line-color),
			var(--c-s-grid-line-color) var(--c-s-grid-line-width),
			transparent var(--c-s-grid-line-width),
			transparent calc((var(--c-height) / var(--c-cell-y-count)))
		),
		repeating-linear-gradient(
			90deg,
			var(--c-s-grid-line-color),
			var(--c-s-grid-line-color) var(--c-s-grid-line-width),
			transparent var(--c-s-grid-line-width),
			transparent calc((var(--c-width) / var(--c-cell-x-count)))
		);

	background-size: calc(100% / var(--c-cell-x-count))
	                 calc(100% / var(--c-cell-y-count));
	
	display: grid;
	grid-template-columns: repeat(var(--c-cell-x-count), 1fr);
	grid-template-rows: 1fr;
}
`;


class CalendarSettings {
	// Not implemented
}


/**
 * A calendar-style element.
 */
class Calendar {
	debug = false;

	/**
	 * Creates a calendar object.
	 * 
	 * @param {number} cellCountX How many cells on the X axis
	 * @param {number} cellCountY How many cells on the Y axis
	 * @param {[string]} timeItems A list of strings that is rendered to the left of the grid (usually timestamps)
	 * @param {[string]} dateItems A list of strings that is rendered above the grid (usually dates)
	 */
	constructor(cellCountX, cellCountY, timeItems, dateItems) {
		this.cellCount = { x: cellCountX, y: cellCountY };
		this.timeItems = timeItems;
		this.dateItems = dateItems;
	}

	/**
	 * Adds the calendar element to the document. This method also generates the calendar element.
	 * 
	 * @param {HTMLElement} child An optional HTML element where the calendar resides in. No value makes it use the <body>.
	 */
	attachElement(child = null) {
		console.log("Attached calendar to HTML page.");
		child.appendChild(this.#generateElement());
	}

	/**
	 * Adds pre-made CSS to the document. This CSS can be partially overridden or can be skipped completely.
	 */
	attachCss() {
		let s = document.createElement("style");
		s.textContent = libCss;
		document.head.insertBefore(s, document.head.firstChild);
	}


	#generateElement() {
		let c = document.createElement("div");
		c.className = "c-base";

		let cEmpty = document.createElement("div");
		cEmpty.style.display = "inline-block";

		let cDates = document.createElement("ul");
		cDates.className = "c-dates c-ul";

		let cTimes = document.createElement("ul");
		cTimes.className = "c-times c-ul";

		let cGrid = document.createElement("div");
		cGrid.className = "c-grid";

		if (this.debug) {
			let s = "red solid 1px";
			cDates.style.outline = s;
			cTimes.style.outline = s;
			cGrid.style.outline = "blue solid 1px";
		}

		let all = [cEmpty, cDates, cTimes, cGrid];
		for (let el of all) { c.appendChild(el); }

		this.#generateDates(cDates);
		this.#generateTimes(cTimes);

		return c;
	}

	#generateDates(el) {
		for (let i of this.dateItems) {
			let li = document.createElement("li");
			li.innerText = i;
			el.appendChild(li);
		}
	}

	#generateTimes(el) {
		for (let i of this.timeItems) {
			let li = document.createElement("li");
			li.className = "c-time";
			li.innerText = i;
			el.appendChild(li);
		}
	}
}