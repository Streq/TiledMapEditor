define(["helper/dom", "helper/file"], function (Dom, File) {
	return Dom.create(
		`<div app-id="root">
			<div class="row">
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
		</div>`
	)
});