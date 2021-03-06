define(["helper/dom", "helper/file"], function (Dom, File) {
	return Dom.create(`
<div app-id="root">
	<style>
        .column {
            float: left;
        }

        .left {
            width: 50%;
        }

        .right {
            width: 50%;
        }

        .row:after {
            content: "";
            display: table;
            clear: both;
        }
		
        .canvasColumn {
            
        }

        .inputColumn {
            
        }
        html, body {
            width:  100%;
            height: 100%;
            margin: 0;
        }
    </style>
	<div class="row">
		<div class="column canvasColumn">			
			<canvas 
				app-id 		= "canvas"
				tabindex	= "-1"
				width  		= 100
				height 		= 100 
				style  		= "background-color:black"
			></canvas>
		</div>
		<div class="column">
			<canvas 
				app-id 		= "tileset"
				tabindex	= "-1"
				width  		= 100
				height 		= 100 
				style  		= "background-color:darkgrey;"
			></canvas>
            <div>
                <button app-id="export">export</button>
                <button app-id="import">import</button>
            </div>
			<div app-id="tools">
                
            </div>
            <input type="checkbox" app-id = "renderGrid" checked/>render grid <br>
            <input type="number" app-id = "gridSize">grid Size
		</div>
        
		<br/>
	</div>
</div>
	`);
});
