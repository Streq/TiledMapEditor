requirejs(["map-editor", 
		   "helper/dom", 
		   "helper/loop", 
		   "templates/editor", 
		   "helper/math",
		   "helper/view"], 
		  function 
		  ( MapEditor, 
			Dom, 
			Loop, 
			template, 
			Math2,
			View) {
	
	
	const dotLineStyle = (() => {
		let canvas = document.createElement("canvas");
		let ls = 1;
		canvas.width = ls * 2;
		canvas.height = ls * 2;
		let ctx = canvas.getContext("2d");
		ctx.fillStyle = "#FFFFFF77";
		ctx.fillRect(0, 0, ls, ls);
		ctx.fillRect(ls, ls, ls, ls);
		ctx.fillStyle = "#00000077";
		ctx.fillRect(0, ls, ls, ls);
		ctx.fillRect(ls, 0, ls, ls);

		//return canvas;
		return ctx.createPattern(canvas, "repeat");
	})();

	class Pencil {

	}

	class Grid {
		constructor(size, offset) {
			this.size = size;
			this.offset = offset;
		}
		render(ctx, view) {
			let gs = this.size*view.scale,
				canvas = ctx.canvas,
				width = canvas.width,
				height = canvas.height,
				x = view.x*view.scale,
				y = view.y*view.scale;
                //m = {x:0,y:0};//data.input.mousepos && new vector(Math.floor(data.input.mousepos.x), data.input.mousepos.y);
			ctx.save();
           	x = Math.floor(-Math2.mod(x, gs));
			y = Math.floor(-Math2.mod(y, gs));
			
			if (gs > 1) {
				let columns = width / gs,
					rows = height / gs,
					i;
				ctx.translate(x,y);
				ctx.fillStyle = dotLineStyle;
				for (i = 0; i < rows + 1; ++i) {
					ctx.fillRect(-gs, i * gs, width + gs * 2, 1);
				}
				for (i = 0; i < columns + 1; ++i) {
					ctx.fillRect(i * gs, -gs, 1, height + gs * 2);
				}
			}
			ctx.restore();
		}
		fixMousePos(pos, canvasOffset) {

		}
	}
	class Editor {
		constructor() {
			this.root = template.cloneNode(true);
			this.grid = new Grid(32, 0);
			this.map = [];
			this.view = {x:0,y:0,scale:1};
			//this.view = new View({center:{x:0, y:0},halfDimensions:{x:600, y:400},viewPort:{x:0, y:0, w:1, h:1}});
		}



		start(root) {
			root = root || document.body;
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
						w: 32,
						h: 32
					});
				}
			);
			this.loop = new Loop.RAF(
				() => {

				},
				() => {
					let ctx = canvas.getContext("2d"),
						view = this.view;
					ctx.clearRect(0, 0, canvas.width, canvas.height);
					ctx.save();
					ctx.scale(view.scale,view.scale);
					ctx.translate(-view.x,-view.y);
					ctx.fillStyle = "blue";
					this.map.forEach(
						(e) => {
							ctx.fillRect(e.x, e.y, e.w, e.h);
						}
					);
					ctx.restore();
                    
					this.grid.render(ctx,view);
				}
			);
			/**@type {HTMLCanvasElement}*/
			this.loop.start();

		}
	}
	new Editor().start();
});