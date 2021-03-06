define(function () {
	
	/** @param {Editor} editor
	    @param {{x:number,y:number}} pos0
	    @param {{x:number,y:number}} pos1
	*/
	function lineToTiles(editor, pos0, pos1) {
		let gs = editor.grid.size;
		let tile0 = editor.getTileFromWorldPosition(pos0);
		let tile1 = editor.getTileFromWorldPosition(pos1);
		if (tile0.x == tile1.x && tile0.y == tile1.y) {
			return editor.instantiateAt(tile0);
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
				editor.instantiateAt({
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
				editor.instantiateAt({
					x: x0 + stepx * i,
					y: y0 + stepy * i
				});
			}
		}

	}


	function mouseMove(click, editor, state){
		state.screenPosition = editor.getCanvasMousePos(click);
		let sp = state.screenPosition;
		let newpos = editor.getTileFromCanvasPixel(sp);
		let oldpos = state.worldPosition;
		if (oldpos.x != newpos.x || oldpos.y != newpos.y) {
			state.worldPosition = newpos;
			if (state.mousedown) {
				//instantiateAt(editor, state.worldPosition);
				lineToTiles(editor, oldpos, newpos);
			}
		}
	}


	let eventHandlers = {
		/** @param {MouseEvent} click*/
		mousedown(click, editor, state) {
			editor.instantiateAt(editor.getWorldMousePos(click));
			state.mousedown = true;
		},
		/** @param {MouseEvent} click*/
		mouseup(click, editor, state) {
			state.mousedown = false;
		},
		/** @param {MouseEvent} click*/
		mousemove(click, editor, state) {
			state.screenPosition = editor.getCanvasMousePos(click);
			
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
			let state = this.state;
			let sp = state.screenPosition;
			let newpos = editor.getTileFromCanvasPixel(sp);
			let oldpos = state.worldPosition;
			if (oldpos.x != newpos.x || oldpos.y != newpos.y) {
				//update mouse world position if view is moving
				state.worldPosition = newpos;
				if (state.mousedown) {
					lineToTiles(editor, oldpos, newpos);
				}
			}
		}
		render(editor){
			let selected = editor.tileSet.selected;
			let ts = editor.tileSet.unitSize;
			let wc = this.state.worldPosition;
			let e = editor.tileSet.tiles[selected];
			let atlas = editor.tileSet.atlas;
			if (e) {
				let sx = e.x * ts,
					sy = e.y * ts,
					sw = (e.w || 1) * ts,
					sh = (e.h || 1) * ts;
				let fixedPos = editor.grid.getTileAtPosition(wc);

				editor.ctx.drawImage(atlas, sx, sy, sw, sh, fixedPos.x, fixedPos.y, sw, sh);

			}

		}
	}

});