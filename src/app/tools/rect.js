define(function () {
	function rectToTiles(editor, rect,callback) {
		let gs = editor.grid.size;
		let tile0 = editor.getTileFromWorldPosition({x:rect.x,y:rect.y});
		let tile1 = editor.getTileFromWorldPosition({x:rect.x+rect.w,y:rect.y+rect.h});
		if (tile0.x == tile1.x && tile0.y == tile1.y) {
			return editor.instantiateAt(tile0);
		}
		let x = 0;
		let y = 0;
		for(x = tile0.x; x <= tile1.x; x+=gs){
		for(y = tile0.y; y <= tile1.y; y+=gs){
			callback({x:x,y:y});
		}
		}
	}
	function rectToTilesInstantiate(editor, rect) {
		let callback = (pos)=>{
			editor.instantiateAt(pos);
		}
		rectToTiles(editor, rect, callback);
		
	}
	function rectToTilesRender(editor, rect){
		let callback = (pos)=>{
			let selected = editor.tileSet.selected;
			let ts = editor.tileSet.unitSize;
			let wc = pos;
			let e = editor.tileSet.tiles[selected];
			let atlas = editor.tileSet.atlas;
			if (e) {
				let sx = e.x * ts,
					sy = e.y * ts,
					sw = (e.w || 1) * ts,
					sh = (e.h || 1) * ts;
				let fixedPos = pos;

				editor.ctx.drawImage(atlas, sx, sy, sw, sh, fixedPos.x, fixedPos.y, sw, sh);

			}
		}
		rectToTiles(editor,rect,callback);
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
			rectToTilesInstantiate(editor, rect(state.pos0, state.pos1));
			state.pos0 = null;
			
		},
		/** @param {MouseEvent} click*/
		mousemove(click, editor, state) {
			state.screenPosition = editor.getCanvasMousePos(click);			
			state.pos1 = editor.getTileFromCanvasPixel(state.screenPosition);
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
			let state = this.state;
			state.pos1 = editor.getTileFromCanvasPixel(state.screenPosition);
		}
		render(editor){
			let state = this.state;
			let p0 = state.pos0;
			let p1 = state.pos1;
			if(p0&&p1){
				rectToTilesRender(editor,rect(p0, p1));
			}
		}
	}

});