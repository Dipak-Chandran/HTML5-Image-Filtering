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
		},
		{
			"id":8,
			"name":"Invert"
		},
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
				this.invert();
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
Canvas.prototype.invert = function(){
	var d = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);

	for( var i=0; i<d.data.length; i+=4){
		var r = d.data[i], g = d.data[i+1], b = d.data[i+2], a = d.data[i+3];
		d.data[i] = 255 - r;
		d.data[i+1] = 255 -g;
		d.data[i+2] = 255 -b;
	}
	this.writeImage(d);	
}