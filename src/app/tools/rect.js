define(function () {
	function instantiate(editor, pos) {
		let tile = editor.getTileFromWorldPosition(pos);
		let index = editor.tileSet.selected;
		let s = editor.tileSet.tiles[index];
		if (s) {
			let us = editor.tileSet.unitSize;
            editor.map.push({
				x: tile.x,
				y: tile.y,
				w: us,
				h: us,
				tile: index
			});
		}
	}

	function rectToTiles(editor, rect) {
		let gs = editor.grid.size;
		let tile0 = editor.getTileFromWorldPosition({x:rect.x,y:rect.y});
		let tile1 = editor.getTileFromWorldPosition({x:rect.x+rect.w,y:rect.y+rect.h});
		if (tile0.x == tile1.x && tile0.y == tile1.y) {
			return instantiate(editor, tile0);
		}
		let x = 0;
		let y = 0;
		for(x = tile0.x; x <= tile1.x; x+=gs){
		for(y = tile0.y; y <= tile1.y; y+=gs){
			instantiate(editor,{x:x,y:y});
		}
		}
	}
	
	function rect(pos0,pos1){
		return {
			x : Math.min(pos0.x,pos1.x),
			y : Math.min(pos0.y,pos1.y),
			w : Math.abs(pos0.x-pos1.x),
			h : Math.abs(pos0.y-pos1.y),
		}
	}

	let eventHandlers = {
		/** @param {MouseEvent} click*/
		mousedown(click, editor, state) {
			state.mousedown = true;
			state.pos0 = editor.getTileFromCanvasPixel(editor.getCanvasMousePos(click));
		},
		/** @param {MouseEvent} click*/
		mouseup(click, editor, state) {
			state.mousedown = false;
			state.pos1 = editor.getTileFromCanvasPixel(editor.getCanvasMousePos(click));
			rectToTiles(editor, rect(state.pos0, state.pos1));
			
		},
		/** @param {MouseEvent} click*/
		mousemove(click, editor, state) {
			state.pos1 = editor.getTileFromCanvasPixel(editor.getCanvasMousePos(click));
		},

	};

	function createState() {
		return {
			mousedown: false,
			pos0: null,
			pos1: null,
			screenPosition: {
				x: 0,
				y: 0
			}
		};
	}



	return class Rect {
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