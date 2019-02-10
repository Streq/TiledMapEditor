define(function () {
	function instantiate(editor, pos) {
		let tile = editor.getTileFromWorldPosition(pos);
		let index = editor.tileSet.selected;
		let s = editor.tileSet.tiles[index];
		if (s) {
			editor.map.push({
				x: tile.x,
				y: tile.y,
				w: editor.grid.size,
				h: editor.grid.size,
				tile: index
			});
		}
	}

	/** @param {Editor} editor
	    @param {{x:number,y:number}} pos0
	    @param {{x:number,y:number}} pos1
	*/
	function lineToTiles(editor, pos0, pos1) {
		let gs = editor.grid.size;
		let tile0 = editor.getTileFromWorldPosition(pos0);
		let tile1 = editor.getTileFromWorldPosition(pos1);
		if (tile0.x == tile1.x && tile0.y == tile1.y) {
			return instantiate(editor, tile0);
		}
		let
			x0 = tile0.x,
			y0 = tile0.y,
			x1 = tile1.x,
			y1 = tile1.y,
			dx = x1 - x0,
			dy = y1 - y0;


		let horizontal = Math.abs(dx) > Math.abs(dy);
		if (horizontal) {
			let backwards = dx < 0;
			let stepy = dy / Math.abs(dx) * gs;
			let stepx = backwards ? -gs : gs;
			let i;
			for (i = 1; i <= dx / stepx; i++) {
				instantiate(editor, {
					x: x0 + stepx * i,
					y: y0 + stepy * i
				});
			}
		} else {
			let backwards = dy < 0;
			let stepy = backwards ? -gs : gs;
			let stepx = dx / Math.abs(dy) * gs;
			let i;
			for (i = 1; i <= dy / stepy; i += 1) {
				instantiate(editor, {
					x: x0 + stepx * i,
					y: y0 + stepy * i
				});
			}
		}

	}




	let eventHandlers = {
		/** @param {MouseEvent} click*/
		mousedown(click, editor, state) {
			instantiate(editor, editor.getWorldMousePos(click));
			state.mousedown = true;
		},
		/** @param {MouseEvent} click*/
		mouseup(click, editor, state) {
			state.mousedown = false;
		},
		/** @param {MouseEvent} click*/
		mousemove(click, editor, state) {
			state.screenPosition = editor.getCanvasMousePos(click);
			let oldpos = state.worldPosition;
			let sp = state.screenPosition;
			let newpos = editor.getTileFromCanvasPixel(sp);
			if (oldpos.x != newpos.x || oldpos.y != newpos.y) {
				state.worldPosition = newpos;
				if (state.mousedown) {
					//instantiate(editor, state.worldPosition);
					lineToTiles(editor, oldpos, newpos);
				}
			}
		},

	};

	function createState() {
		return {
			mousedown: false,
			worldPosition: {
				x: 0,
				y: 0
			},
			screenPosition: {
				x: 0,
				y: 0
			}
		};
	}



	return class Pencil {
		constructor() {
			this.eventHandlers = eventHandlers;
			this.state = createState();
		}
		update(dt, editor) {

		}
		render(editor){
			
		}
	}

});