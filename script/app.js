var Canvas = function(){
	this.canvas = document.getElementById('myCanvas');
	this.ctx = this.canvas.getContext("2d");
	this.canvas.width = 400;
	this.canvas.height = 300;
}
var ORGDATA;
Canvas.filters = [
		{
			"id":1,
			"name":"Original Image"
		},
		{
			"id":2,
			"name":"Black & White"
		},
		{
			"id":3,
			"name":"Sepia Style"
		},
		{
			"id":4,
			"name":"Red Channel"
		},
		{
			"id":5,
			"name":"Blue Channel"
		},
		{
			"id":6,
			"name":"Green Channel"
		},
		{
			"id":7,
			"name":"Brighten"
		}
	];

Canvas.prototype.readImage = function(img){
	this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
	this.canvas.originalImageData = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);
	ORGDATA = img;
}
Canvas.prototype.writeImage = function(img){
	this.ctx.putImageData(img, 0, 0);
}

Canvas.prototype.applyFilter = function(filter){
	if( ORGDATA != 'undefined'){
		switch (parseInt(filter.getAttribute('filterid'))) {
			case 1:
				this.orginal();
				break;
			case 2:
				this.orginal();
				this.black_white();
				break;
			case 3:
				this.orginal();
				this.sepia();
				break;
			case 4:
				this.orginal();
				this.channel(1);
				break;
			case 5:
				this.orginal();
				this.channel(2);
				break;
			case 6:
				this.orginal();
				this.channel(3);
				break;
			case 7:
				this.orginal();
				this.brighten(50);
				break;
			case 8:
				this.orginal();
				this.matrix();
				break;
		}
	}
}

Canvas.prototype.getFilters = function(){
	return Canvas.filters;
}

Canvas.prototype.orginal = function(){
	this.ctx.drawImage(ORGDATA, 0, 0, this.canvas.width, this.canvas.height);
}

Canvas.prototype.black_white = function(){
	var d = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);

	for( var i=0; i<d.data.length; i+=4){
		var r = d.data[i], g = d.data[i+1], b = d.data[i+2], a = d.data[i+3];
		var x = 0.299*r + 0.587*g + 0.114*b;
		d.data[i] = x;
		d.data[i+1] = x;
		d.data[i+2] = x;
	}
	this.writeImage(d);
}

Canvas.prototype.sepia = function(){
	var d = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);

	for( var i=0; i<d.data.length; i+=4){
		var r = d.data[i], g = d.data[i+1], b = d.data[i+2], a = d.data[i+3];
		var oR = (r * .393) + (g *.769) + (b * .189),
		oG = (r * .349) + (g *.686) + (b * .168),
		oB = (r * .272) + (g *.534) + (b * .131)
		d.data[i] = oR>255?255:oR;
		d.data[i+1] = oG>255?255:oG;
		d.data[i+2] = oB>255?255:oB;
	}
	this.writeImage(d);
}

Canvas.prototype.channel =function(channel){
	var d = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);

	for( var i=0; i<d.data.length; i+=4){
		var r = d.data[i], g = d.data[i+1], b = d.data[i+2], a = d.data[i+3];
		if(channel === 1){
			d.data[i] = (r+g+b)/3;
			d.data[i+1] = 0;
			d.data[i+2] = 0;
		}else if(channel === 2){
			d.data[i] = 0;
			d.data[i+1] = 0;
			d.data[i+2] = (r+g+b)/3;
		}else if(channel === 3){
			d.data[i] = 0;
			d.data[i+1] = (r+g+b)/3;
			d.data[i+2] = 0;
		}
	}
	this.writeImage(d);	
}


Canvas.prototype.brighten = function(x){
	var d = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);

	for( var i=0; i<d.data.length; i+=4){
		var r = d.data[i], g = d.data[i+1], b = d.data[i+2], a = d.data[i+3];
		d.data[i] = r+x>255?255:r+x;
		d.data[i+1] = g+x>255?255:g+x;
		d.data[i+2] = b+x>255?255:b+x;
	}
	this.writeImage(d);
}

Canvas.prototype.matrix = function(){
	var imgMatrix = [[0,0,0],[0,0,0],[0,0,0]];
	for(var i=2; i<this.canvas.width-2; i++){
		for(var j=2; j<this.canvas.height-2; j++){
			
			imgMatrix[0][0] =	this.ctx.getImageData(i-1,j-1, i-1,j-1);
			imgMatrix[0][1] =	this.ctx.getImageData(i-1,j, i-1,j);
			imgMatrix[0][2] =	this.ctx.getImageData(i-1,j+1, i-1,j+1);

			imgMatrix[1][0] =	this.ctx.getImageData(i,j-1, i,j-1);
			imgMatrix[1][1] =	this.ctx.getImageData(i,j, i,j);
			imgMatrix[1][2] =	this.ctx.getImageData(i,j+1, i,j+1);
				
			imgMatrix[2][0] =	this.ctx.getImageData(i+1,j-1, i+1,j+1);
			imgMatrix[2][1] =	this.ctx.getImageData(i+1,j, i+1,j);
			imgMatrix[2][2] =	this.ctx.getImageData(i+1,j+1, i+1,j+1);
			console.log(imgMatrix);
			// imgMatrix = this.multiplyMatrix(imgMatrix,this.sharpenMatrix);

			// this.ctx.putImageData(imgMatrix[0][0], i-1,j-1);
			// this.ctx.putImageData(imgMatrix[0][1], i-1,j);
			// this.ctx.putImageData(imgMatrix[0][2], i-1,j+1);

			// this.ctx.putImageData(imgMatrix[1][0], i,j-1);
			// this.ctx.putImageData(imgMatrix[1][1], i,j);
			// this.ctx.putImageData(imgMatrix[1][2], i,j+1);

			// this.ctx.putImageData(imgMatrix[2][0], i+1,j-1);
			// this.ctx.putImageData(imgMatrix[2][1], i+1,j);
			// this.ctx.putImageData(imgMatrix[2][2], i+1,j+1);
		}
	}
}

Canvas.prototype.sharpenMatrix = [[ 0, -2,  0],[-2, 11, -2],[ 0, -2,  0]];

Canvas.prototype.multiplyMatrix = function(a,b){
	var res = [[0,0,0],[0,0,0],[0,0,0]];
	for(var i1=0;i1<3;i1++){
		for(var j1=0; j1<3; j1++){
			res[i1][j1] =+ a[i1][j1]*b[j1][i1];
		}
	}
	return res;
}