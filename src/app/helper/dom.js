define(function () {
	function create(html) {
		var template = document.createElement('template'),
			text = html.trim();
		template.innerHTML = text;
		return template.content.firstChild;
	};

	function get(id, root) {
		root = root || document.body;
		return document.querySelector(`[app-id=${id}]`);
	};

	function set(id, html, root) {
		root = root || document.body;
		let target = get(id, root);
		if (!target) {
			target = document.createElement("template");
			root.appendChild(target);
		}
		target.outerHTML = html;
		return target;
	};

	function inner(id, value, root) {
		root = root || document.body;
		let target = get(id);
		target.innerHTML = content;
		return target;
	};

	function getMousePos(mouseEvent, element){
		var rect = element.getBoundingClientRect();
		return {
			x: mouseEvent.clientX - rect.left,
			y: mouseEvent.clientY - rect.top
		};
	}
    
    function reloadScrollBar() {
        document.documentElement.style.overflow = 'auto';  // firefox, chrome
        document.body.scroll = "yes"; // ie only
    }

    function unloadScrollBar() {
        document.documentElement.style.overflow = 'hidden';  // firefox, chrome
        document.body.scroll = "no"; // ie only
    }
	return {
		create: create,
		get: get,
		set: set,
		inner: inner,
		getMousePos: getMousePos,
        reloadScrollBar: reloadScrollBar,
        unloadScrollBar: unloadScrollBar
	};
});