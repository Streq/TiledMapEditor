requirejs(["map-editor", 
		   "helper/dom", 
		   "helper/loop", 
		   "templates/editor", 
		   "helper/math",
           "helper/file"], 
		  function 
		  ( MapEditor, 
			Dom, 
			Loop, 
			template, 
			Math2,
            FileUtils) {
	
	
	function makeDotLineStyle(color1,color2){
		let canvas = document.createElement("canvas");
		let ls = 1;
		canvas.width = ls * 2;
		canvas.height = ls * 2;
		let ctx = canvas.getContext("2d");
		ctx.fillStyle = color1;
		ctx.fillRect(0, 0, ls, ls);
		ctx.fillRect(ls, ls, ls, ls);
		ctx.fillStyle = color2;
		ctx.fillRect(0, ls, ls, ls);
		ctx.fillRect(ls, 0, ls, ls);

		//return canvas;
		return ctx.createPattern(canvas, "repeat");
	}
	
	const dotLineStyle = makeDotLineStyle("white","black");
	const originDotLineStyle = makeDotLineStyle("red","black");

	
    
    class View {
        constructor(x,y,scale){
            this.x=x;
            this.y=y;
            this.scale=scale;
        }
        
        pixelToWorldPos(x,y){
            return {
                x: this.x + x/this.scale,
                y: this.y + y/this.scale
            };
        }
        worldPosToPixel(x,y){
            return {
                x: (-this.x + x)*this.scale,
                y: (-this.y + y)*this.scale
            };
        }
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
				y = view.y*view.scale,
				canvasGridX = Math.floor(-Math2.mod(x, gs)),
				canvasGridY = Math.floor(-Math2.mod(y, gs));	
			ctx.save();
           	
			
			if (gs > 1) {
				let columns = width / gs,
					rows = height / gs,
					i;
				ctx.translate(canvasGridX,canvasGridY);
				ctx.fillStyle = dotLineStyle;
				for (i = 0; i < rows + 1; ++i) {
					let y = i * gs;
					ctx.save();
					let wy = view.pixelToWorldPos(0,y+canvasGridY).y;
					//if it's an axis change style
					if(!Math.trunc(wy)){
						ctx.fillStyle = originDotLineStyle;
					}
					ctx.fillRect(-gs, y, width + gs * 2, 1);
					ctx.restore();
					
				}
				for (i = 0; i < columns + 1; ++i) {
					let x = i * gs;
					ctx.save();
					let wx = view.pixelToWorldPos(x+canvasGridX,0).x;
					//if it's an axis change style
					if(!Math.trunc(wx)){
						ctx.fillStyle = originDotLineStyle;
					}
					ctx.fillRect(x, -gs, 1, height + gs * 2);
					ctx.restore();
				
				}
			}
			ctx.restore();
		}
		getTileAtPosition(pos){
			let gs = this.size;
			return {
				x: pos.x-Math2.mod(pos.x,gs),
				y: pos.y-Math2.mod(pos.y,gs)
			}
		}
		
	}
	class Editor {
		constructor() {
			this.root = template.cloneNode(true);
			this.grid = new Grid(32, 0);
			this.map = [];
            this.tileSet = [];
			this.view = new View(-32*5,-32*5,1);
			this.cursor = {x:0,y:0};
			this.inputState = {
				u:false,
				d:false,
				l:false,
				r:false
			}
		}

        getWorldMousePos(mouseEvent){
            let pixel = Dom.getMousePos(mouseEvent, this.canvas);
            let pos = this.view.pixelToWorldPos(pixel.x,pixel.y);
            return pos;
        }
        getCanvasMousePos(mouseEvent){
            let pixel = Dom.getMousePos(mouseEvent, this.canvas);
            return pixel;
        }
        
        
		start(root) {
			root = root || document.body;
			/**@type {HTMLElement}*/
			root.append(this.root);

			//Map canvas
            let canvas = Dom.get("canvas", this.root);
            this.canvas = canvas;
			
			//click to instantiate
			canvas.addEventListener("click",
				/**@param {MouseEvent} click*/
				(click) => {
                    let pos = this.grid.getTileAtPosition(this.getWorldMousePos(click));
					
					this.map.push({
						x: pos.x,
						y: pos.y,
						w: this.grid.size,
						h: this.grid.size
					});
				}
			);
			
			//move view
			canvas.addEventListener("keydown",
				/**@param {KeyboardEvent} e*/
				(e) => {
                    switch(e.key){
						case "w":
							this.inputState.u=true;
							break;
						case "s":
							this.inputState.d=true;
							break;
						case "a":
							this.inputState.l=true;
							break;
						case "d":
							this.inputState.r=true;
							break;
					}
				}
			);
			canvas.addEventListener("keyup",
				/**@param {KeyboardEvent} e*/
				(e) => {
                    switch(e.key){
						case "w":
							this.inputState.u=false;
							break;
						case "s":
							this.inputState.d=false;
							break;
						case "a":
							this.inputState.l=false;
							break;
						case "d":
							this.inputState.r=false;
							break;
					}
				}
			);
			//update cursor position
			canvas.addEventListener("mousemove",
				/**@param {MouseEvent} mouse*/
				(mouse) => {
					this.cursor = this.getCanvasMousePos(mouse);
				}
			)
            
            //tileset canvas
            let tilesetCanvas = Dom.get("tileset", this.root);
            this.tilesetCanvas = tilesetCanvas;
            
            
            this.loadTileSet("src/test/sample.tileset.info.json");
			
            this.loop = new Loop.RAF(
				(dt) => {
					let d = {
						x:this.inputState.r-this.inputState.l,
						y:this.inputState.d-this.inputState.u
					}
					
					this.view.x += dt*0.5*d.x;
					this.view.y += dt*0.5*d.y;
				},
				() => {
					this.renderMap();
                    this.renderTileset();
				}
			);
            this.loop.start();

		}
        
        loadTileSet(path){
            FileUtils.readText(path)
                .then((tilesetString) => {
                    let tileset = JSON.parse(tilesetString);
                    this.tileSet = tileset;
                    return;
                });
        }
        
        renderMap(){
            let canvas = this.canvas,
                ctx = canvas.getContext("2d"),
                view = this.view,
				cc = this.cursor,
				wc = this.view.pixelToWorldPos(cc.x,cc.y),
				gs = this.grid.size;
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
			
            let fixedPos = this.grid.getTileAtPosition(wc);
            ctx.fillRect(fixedPos.x, fixedPos.y, gs, gs);
            ctx.restore();
			this.grid.render(ctx,view);
        }
        renderTileset(){
            if(this.tileSet){
                
            }
        }
        
	}
	new Editor().start();
});