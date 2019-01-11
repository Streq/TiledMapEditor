requirejs(["helper/dom","tileset"],function(Dom,Ttileset){
    
    let dom = Dom.create("<canvas id='tileset' width = 200 height = 200></canvas>");
    document.body.appendChild(dom);
    /**@param {HTMLCanvasElement} canvas1*/
    let canvas = Dom.get("tileset");
    canvas.style.backgroundColor="red";

    let tilesetData={
        atlas:"tiles.png",
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
                img.source = tilesetData.atlas;
                
            });
        }
        
        render(){
            this.canvas.getContext("2d").drawImage(this.atlas,0,0);
        }
    }
    
    
    
    let draw = (ctx)=>{
    };
    
});