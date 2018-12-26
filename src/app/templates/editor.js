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
            max-width: 600px;
        }

        .inputColumn {
            width: 35%;
        }
    </style>
	<div class="row">
		<div class="column">
			<canvas 
				app-id 		= "tileset"
				tabindex	= "-1"
				width  		= 160
				height 		= 400 
				style  		= "background-color:darkgrey;"
			></canvas>
		</div>
		<div class="column canvasColumn">			
			<canvas 
				app-id 		= "canvas"
				tabindex	= "-1"
				width  		= 600 
				height 		= 400 
				style  		= "background-color:black"
			></canvas>
		</div>
		<div class="column inputColumn">
			<textarea app-id="exporttext"></textarea>
		</div>
		<br/>
	</div>
</div>
	`);
});