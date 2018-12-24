define(["helper/dom", "helper/view", "helper/vector"], function (Dom, View, Vector) {

	class Map {
		constructor() {
			this.data = null;
			this.layers = [];
		}
	}
	class Layer {
		constructor() {
			this.data = null;
			this.instances = [];
		}
	}
	class Sprite {
		constructor() {
			this.src = null;
			this.rect = null;
		}
	}
	class Instance {
		constructor() {
			this.position = null;
			this.scale = null;
			this.object = null;
		}
	}
	class Context {
		constructor() {
			this.view = new View();
			this.gridSize = new Vector();
		}
	}


	class MapEditor {
		constructor() {
			this.map = new Map();
			this.tileSet = [];
			this.context = new Context();
			this.dom = null;

		}
		parseDom(root) {
			root = root || document.body;

		}
		render() {

		}
	}
	return MapEditor;
});