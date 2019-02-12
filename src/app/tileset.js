define(["helper/dom"],function (Dom) {
    function makeDotLineStyle(color1,color2,tilesize){
		let canvas = document.createElement("canvas");
		let ls = tilesize;
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
	
	
	
	
    
    
    return class Tileset{
        /**@param {HTMLCanvasElement}canvas*/
        constructor(canvas){
            this.canvas = canvas;
			this.ctx = this.canvas.getContext("2d");
            this.selected = null;
            canvas.addEventListener("click",(e)=>{
                let xy = Dom.getMousePos(event,canvas);
                let selected = this.getTileAtCanvasPos(xy.x,xy.y);
				this.selected = this.tiles.indexOf(selected);
            });
        }
        
        getTileAtCanvasPos(x,y){
            x = x/this.unitSize;
            y = y/this.unitSize;
            let selected = null;
            let ox=0,oy=0
			this.tiles.forEach((e)=>{
				let w = (e.w||1),
					h = (e.h||1);
				if(ox+w>this.canvas.width/this.unitSize){
                    ox=0;
                    oy+=h;
                }
                
                let inside = ox < x && ox + w > x &&
                             oy < y && oy + h > y;
                if(inside){
                    selected = e;
                }
				ox+=w;
			});
            
            
            return selected;
        }
        
        
		load(tilesetData){
            this.tiles = tilesetData.data;
			this.unitSize = tilesetData.tileSize;
			this.bckg_style = makeDotLineStyle("#fff","#eee",this.unitSize);
			
			return Dom.loadImg(tilesetData.atlas)
				.then((img)=>{
					this.atlas = img;
				});
        }
        
        render(){
			let ctx = this.ctx;
			
			ctx.fillStyle = this.bckg_style;
			ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
			
			let ox=0,oy=0
			this.tiles.forEach((e,index)=>{
				let x = e.x*this.unitSize,
					y = e.y*this.unitSize,
					w = (e.w||1)*this.unitSize,
					h = (e.h||1)*this.unitSize;
				if(ox+w>this.canvas.width){
                    ox=0;
                    oy+=h;
                }
                
                
				ctx.drawImage(this.atlas,x,y,w,h,ox,oy,w,h);
				
                if(this.selected == index){
                    let x = e.x*this.unitSize,
                        y = e.y*this.unitSize,
                        w = (e.w||1)*this.unitSize,
                        h = (e.h||1)*this.unitSize;
                    ctx.save();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = "magenta";
                    ctx.strokeRect(ox,oy,w,h);
                    ctx.restore();
                }
                
                ox+=w;
			});
        }
    }
});