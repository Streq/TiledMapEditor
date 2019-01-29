requirejs(["map-editor", 
		   "helper/dom", 
		   "helper/loop", 
		   "templates/editor", 
		   "helper/math",
           "helper/file",
           "tileset"], 
		  function 
		  ( MapEditor, 
			Dom, 
			Loop, 
			template, 
			Math2,
            FileUtils,
            Tileset) {
	
	
    Dom.unloadScrollBar();
    
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
	
	const dotLineStyle = makeDotLineStyle("#fff7","#0007");
	const originDotLineStyle = makeDotLineStyle("#fff7","#0007");

	
    
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
					let wy = view.pixelToWorldPos(0,y+canvasGridY).y;
					//if it's an axis change style
					if(!Math.trunc(wy)){
						ctx.save();
                        ctx.fillStyle = originDotLineStyle;
                        ctx.fillRect(-gs, y-1, width + gs * 2, 3);
                        ctx.restore();
					}else{
					   ctx.fillRect(-gs, y, width + gs * 2, 1);
                    }
					
				}
				for (i = 0; i < columns + 1; ++i) {
					let x = i * gs;
					let wx = view.pixelToWorldPos(x+canvasGridX,0).x;
					//if it's an axis change style
					if(!Math.trunc(wx)){
						ctx.save();
                        ctx.fillStyle = originDotLineStyle;
                        ctx.fillRect(x-1, -gs, 3, height + gs * 2);
                        ctx.restore();
					}else{
                        ctx.fillRect(x, -gs, 1, height + gs * 2);
					}
					
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
    
    let pencilTool = {
        eventHandlers: {
            /** @param {MouseEvent} click
                @this Editor */
            mousedown(click, editor, state){
                let pos = this.grid.getTileAtPosition(this.getWorldMousePos(click));
                let index = this.tileSet.selected;
                let s = this.tileSet.tiles[index];
                if(s){
                    this.map.push({
                        x: pos.x,
                        y: pos.y,
                        w: this.grid.size,
                        h: this.grid.size,
                        tile:index
                    });
                }
            },
            /** @param {MouseEvent} click
                @this Editor */
            mouseup(click, editor, state){
                let pos = this.grid.getTileAtPosition(this.getWorldMousePos(click));
                let index = this.tileSet.selected;
                let s = this.tileSet.tiles[index];
                if(s){
                    this.map.push({
                        x: pos.x,
                        y: pos.y,
                        w: this.grid.size,
                        h: this.grid.size,
                        tile:index
                    });
                }
            },
            mousemove(click, editor, state){
                
            }
        },
        /** @param {MouseEvent} click
            @this Editor */
        update(dt){
            let pos = this.grid.getTileAtPosition(this.getWorldMousePos(click));
            let index = this.tileSet.selected;
            let s = this.tileSet.tiles[index];
            if(s){
                this.map.push({
                    x: pos.x,
                    y: pos.y,
                    w: this.grid.size,
                    h: this.grid.size,
                    tile:index
                });
            }
        },
        render(ctx,view){
            
        },
        
        state:{
            mousedown: false,
            newPos: true,
            position: {x:0,y:0}
        }

    }
    
    
	class Editor {
		constructor() {
			this.root = template.cloneNode(true);
			this.grid = new Grid(16, {x:0, y:0});
			this.map = [];
			this.view = new View(-32*0,-32*0,1);
			this.cursor = {x:0,y:0};
            this.renderGrid = true;
			this.inputState = {
				u: false,
				d: false,
				l: false,
				r: false
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
        
		
		export(map){
			return map.map((e)=>{
				return {
					x: e.x,
					y: e.y,
					w: e.w,
					h: e.h,
					tile: this.tileSet.tiles[e.tile].name,
				};
			});
		}
		
        import(map){
			return map.map((e)=>{
				let index = this.tileSet.tiles.findIndex((each)=>each.name==e.tile);
                return {
					x: e.x,
					y: e.y,
					w: e.w,
					h: e.h,
					tile: index,
				};
			});
		}
        
        toClipboard(map){
            navigator.clipboard.writeText(JSON.stringify(this.export(map)));
        }
        
        fromClipboard(){
            /**@param {ClipboardEvent} click*/
            navigator.clipboard.readText().then((text)=>{
                this.import(JSON.parse(text)).forEach(
                    (each)=>this.map.push(each)
                );
            });
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
				(click)=>this.currentClickHandle(click)
			);
			
            this.currentClickHandle = 
                /**@param {MouseEvent} click*/
				(click) => {
                    let pos = this.grid.getTileAtPosition(this.getWorldMousePos(click));
					let index = this.tileSet.selected;
					let s = this.tileSet.tiles[index];
                    if(s){
						this.map.push({
                            x: pos.x,
                            y: pos.y,
                            w: this.grid.size,
                            h: this.grid.size,
                            tile:index
                        });
                    }
				};
            
			
			Dom.get("import").addEventListener("click",
		  		()=>this.fromClipboard()
			);
			
			Dom.get("export").addEventListener("click",
		  		()=>this.toClipboard(this.map)
		  	)
            let editor = this;
			Dom.get("renderGrid").addEventListener('change', function () {
                    if (this.checked) {
                        editor.renderGrid=true;
                    } else {
                        editor.renderGrid=false;
                    }
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
                        case "c":
                            if(e.ctrlKey){
                                this.toClipboard(this.map);
                            }
                            break;
                        case "v":
                            if(e.ctrlKey){
                                this.fromClipboard();
                            }
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
            
            let tilesetData={
                atlas:"assets/tiles.png",
                tileSize:16,
                data:[
                    {name:"block", x:0, y:0},
                    {name:"platform", x:1, y:0},
                    {name:"miniblock", x:8, y:0},
                    {name:"portal", x:7, y:2},
                    {name:"end portal", x:0, y:2},
                    {name:"spikes", x:9, y:1},
                    {name:"lava", x:1, y:1},

                ]
            }
            this.tileSet = new Tileset(tilesetCanvas);
            this.tileSet.load(tilesetData);
            function resizeCanvasToWIndow(canvas, percx, percy){
                canvas.width= window.innerWidth*percx;
                canvas.height= window.innerHeight*percy;
            }
            function resizeCanvases(){
               resizeCanvasToWIndow(canvas,0.8,1); 
               resizeCanvasToWIndow(tilesetCanvas,0.2,0.3); 
            }
            resizeCanvases();
            window.addEventListener("resize",resizeCanvases);
            
            
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
        
        renderMap(){
            let canvas = this.canvas,
                ctx = canvas.getContext("2d"),
                view = this.view,
				cc = this.cursor,
				wc = this.view.pixelToWorldPos(cc.x,cc.y),
				gs = this.grid.size,
                atlas = this.tileSet.atlas;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.scale(view.scale,view.scale);
            ctx.translate(Math.trunc(-view.x),Math.trunc(-view.y));
            
            let ts = this.tileSet.unitSize;
            
            this.map.forEach(
                (e) => {
                    let tile = this.tileSet.tiles[e.tile],
						sx = tile.x*ts,
                        sy = tile.y*ts,
                        sw = (tile.w||1)*ts, 
                        sh = (tile.h||1)*ts;
                    ctx.drawImage(atlas, sx, sy, sw, sh, e.x, e.y, e.w, e.h);
                }
            );
			
            let selected = this.tileSet.selected;
            
			let e = this.tileSet.tiles[selected];
            if(e){
                let sx = e.x*ts,
                    sy = e.y*ts,
                    sw = (e.w||1)*ts, 
                    sh = (e.h||1)*ts;
                let fixedPos = this.grid.getTileAtPosition(wc);
            
                ctx.drawImage(atlas, sx, sy, sw, sh, fixedPos.x, fixedPos.y, gs, gs);
            
            }
            
            ctx.restore();
            if(this.renderGrid){
                this.grid.render(ctx,view);
            }
		}
        
        renderTileset(){
            if(this.tileSet){
                this.tileSet.render();
            }
        }
        
	}
	new Editor().start();
});