requirejs(["helper/dom","tileset"],function(Dom,Ttileset){
    
    /**@param {HTMLCanvasElement} canvas1*/
    let canvas = Dom.create("<canvas id='tileset' width = 200 height = 200></canvas>");
    document.body.appendChild(canvas);

    let tilesetData={
        atlas:"assets/tiles.png",
        tileSize:16,
        data:[
            {name:"block"},
            {name:"lava"}
        ]
    }
    
    class Tileset{
        constructor(canvas){
            this.canvas = canvas;
        }
        
        load(tilesetData){
            return new Promise((resolve,reject)=>{
                let img = document.createElement("img");
                img.onload = ()=>{
                    this.atlas = img;
                    resolve();
                };
                img.src = tilesetData.atlas;
            });
            
            this.tiles = tilesetData.data;
        }
        
        render(){
            this.canvas.getContext("2d").drawImage(this.atlas,0,0);
        }
    }
    
    let tileset = new Tileset(canvas);
    
    tileset.load(tilesetData).then(()=>tileset.render());
    
});