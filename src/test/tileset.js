requirejs(["helper/dom","tileset"],function(Dom,Ttileset){
    
    /**@param {HTMLCanvasElement} canvas1*/
    let canvas = Dom.create("<canvas id='tileset' width = 200 height = 200></canvas>");
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
	
	
	
	document.body.appendChild(canvas);

    let tilesetData={
        atlas:"assets/tiles.png",
        tileSize:16,
        data:[
            {name:"block", x:0, y:0},
            {name:"platform", x:1, y:0},
            {name:"miniblock", x:8, y:0},
			{name:"portal", x:7, y:2},
			{name:"spikes", x:9, y:1},
            {name:"lava", x:1, y:1},
			
        ]
    }
    
    class Tileset{
        constructor(canvas){
            this.canvas = canvas;
			this.ctx = this.canvas.getContext("2d");
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
			this.tiles.forEach((e)=>{
				let x = e.x*this.unitSize,
					y = e.y*this.unitSize,
					w = (e.w||1)*this.unitSize,
					h = (e.h||1)*this.unitSize;
				
				ctx.drawImage(this.atlas,x,y,w,h,ox,oy,w,h);
				ox+=w;
			});
        }
		getTile(){
			
		}
    }
    
    let tileset = new Tileset(canvas);
    
    tileset.load(tilesetData).then(()=>tileset.render());
    
});