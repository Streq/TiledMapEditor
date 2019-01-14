requirejs(["helper/dom","tileset"],function(Dom,Tileset){
    
    /**@param {HTMLCanvasElement} canvas1*/
    let canvas = Dom.create("<canvas id='tileset' width = 200 height = 200></canvas>");
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
    
    let tileset = new Tileset(canvas);
    tileset.load(tilesetData).then(()=>tileset.render());
    
});