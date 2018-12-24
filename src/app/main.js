requirejs(["map-editor", "helper/dom", "helper/loop", "templates/editor"], function (MapEditor, Dom, Loop, template) {
	class Editor{
		constructor(){
			this.root = template.cloneNode(true);
			this.map = [];
			
		}
		
		start(root){
			root = root||document.body;
			/**@type {HTMLElement}*/
			root.append(this.root);
			
			let canvas = Dom.get("canvas", this.root);
			canvas.addEventListener("mousedown",
				/**@param {MouseEvent} click*/
				(click) => {
					let pos = Dom.getMousePos(click, canvas);
					this.map.push({
						x: pos.x,
						y: pos.y,
						w: 10,
						h: 10
					});
				}
			);
			this.loop = new Loop.RAF(() => {}, () => {
				let ctx = canvas.getContext("2d");

				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.fillStyle = "blue";

				this.map.forEach((e) => {
					ctx.fillRect(e.x, e.y, e.w, e.h);
				});
			});
			/**@type {HTMLCanvasElement}*/
			this.loop.start();

		}
	}
	new Editor().start();
});