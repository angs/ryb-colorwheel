//Copyright Altti Tammi 2010 etc

//GLOBAL VARIABLES
klik = false;
c_size = 256;
b_width = 30;
h_offsetLeft = 10; h_offsetTop = 10;
b_offsetLeft = 280; b_offsetTop = 10;

bright=1; hue=60; sat=0.6;
hue2=150; sat2=96; bright2=255;
colorrule = 2;
colormodel=0;

colors = [
["single",[0]],
["complement",[0,180]],	//comp
["splitcomp",[0,150,210]],	//splitcomp
["triad",[0,120,240]],	//triad
["right",[0,90,270]],	//rightang
["wideanalog",[0,60,300]],	//wideanalog
["analogous",[0,30,330]],	//analogous
["tetrad",[0,90,180,270]],	//tetrad
["doublecomp",[0,60,180,240]],	//doublecomp
["narrowquad",[0,20,40,60]],	//triad
["hexagon",[0,60,120,180,240,300]],	//everyother
["decagon",[0,36,72,108,144,180,216,252,288,324]],
["hendecagon",[0,32.7,65.4,98.2,130.9,163.6,196.4,229.1,261.2,294.5,327.3]],
["dodecagon",[0,30,60,90,120,150,180,210,240,270,300,330]]	//all
];

colorFunctions = [ fastRYB, distortedRGB, RYBblack, HSV2RGB];
laskevarit = fastRYB;

function changeColorModel(){
	colormodel = document.getElementById("colormodel").selectedIndex;
	laskevarit = colorFunctions[colormodel];
	drawcontrols(true);
}

function changeColorRule(){
	var rulevalue = document.getElementById("rule").value;
	for (var i=0; i<colors.length;++i) { if (colors[i][0] == rulevalue) colorrule = i; }
}

function update(e){
	if (!klik) return;
	hori = e.pageX-document.getElementById('cannedham').offsetLeft;
	verti = e.pageY-document.getElementById('cannedham').offsetTop;
	if (hori >= h_offsetLeft && hori < h_offsetLeft + c_size && verti >= h_offsetTop && verti < h_offsetTop+c_size)
	{
		hue2 = hori-h_offsetLeft;
		sat2 = c_size-1-verti+h_offsetTop;
		draw();
	}
	else if (hori >= b_offsetLeft && hori < b_offsetLeft + b_width && verti >= b_offsetTop && verti < b_offsetTop+c_size)
	{
		bright2 = c_size-1-verti+b_offsetTop;
		drawcontrols(false);
	}
	normalize();
}

function loader()
{
	var code = parseInt(document.getElementById("loader").value, 16);
	if (isNaN(code) || code < 0) { alert("Error"); return; }
	var temp1 = code % 16;
	code = code >>> 4;
	var temp2 = code % 16;
	code = code >>> 4;
	var temp3 = code % 256;
	code = code >>> 8;
	var temp4 = code % 256;
	code = code >>> 8;
	var temp5 = code;
	if (temp1 >= colorFunctions.length || temp2 >= colors.length) { alert("Error"); return; }
	document.getElementById("colormodel").selectedIndex=temp1;
	colormodel = temp1;
	laskevarit = colorFunctions[colormodel];
	document.getElementById("rule").selectedIndex=temp2;
	colorrule = temp2;
	bright2=temp3;
	sat2=temp4;
	hue2=temp5;
	normalize();
	drawcontrols(true);
}

function normalize(){
	hue = hue2/c_size*360;
	sat = sat2/c_size;
	bright = bright2/c_size;
}

function mousedown(event){
	klik = true;
	update(event);
}

function mouseup(event){
	klik = false;
	drawcontrols(true);
}

//H asteina; S,V väliltä [0,1]
function HSV2RGB(hue,sat,v){
	while (hue < 0) { hue+=360; }
	if (hue >= 360) { hue %=360; }
	H1 = hue/60;
	var C = v*sat;
	X = C*(1-Math.abs(H1 % 2-1));
	var red, green, blue;
	switch(Math.floor(H1)){
		case 0: red = C; green=X; blue=0; break;
		case 1: red = X; green=C; blue=0; break;
		case 2: red = 0; green=C; blue=X; break;
		case 3: red = 0; green=X; blue=C; break;
		case 4: red = X; green=0; blue=C; break;
		case 5: red = C; green=0; blue=X; break;
		default: break;
	}
	m = v - C;
	return [Math.floor(255*(red+m)),Math.floor(255*(green+m)),Math.floor(255*(blue+m))];
}

function distortedRGB(hue,sat,v){
	while (hue < 0) { hue+=360; }
	if (hue >= 360) { hue %=360; }
	if (0 <= hue && hue < 120){ hue = 0.5*hue; }
	else if (120 <= hue && hue < 180){ hue = hue-60; }
	else if (180 <= hue && hue < 240){ hue = 2*hue-240; }
	H1 = hue/60;
	var C = v*sat;
	X = C*(1-Math.abs(H1 % 2-1));
	var red, green, blue;
	switch(Math.floor(H1)){
		case 0: red = C; green=X; blue=0; break;
		case 1: red = X; green=C; blue=0; break;
		case 2: red = 0; green=C; blue=X; break;
		case 3: red = 0; green=X; blue=C; break;
		case 4: red = X; green=0; blue=C; break;
		case 5: red = C; green=0; blue=X; break;
		default: break;
	}
	m = v - C;
	return [Math.floor(255*(red+m)),Math.floor(255*(green+m)),Math.floor(255*(blue+m))];
}

function hex(d, n){
    var hex = Number(d).toString(16);
    while (hex.length < n) {
        hex = "0" + hex;
    }
    return hex;
}

/*
Based on the RYB interpolation cube suggested in
Gossett, N.; Chen, B.: Paint Inspired Color Mixing and Compositing for Visualization, Information Visualization, 2004. INFOVIS 2004. IEEE Symposium on
*/

function fastRYB(hue,sat,v){
	hue+=180;
	while (hue < 0) { hue+=360; }
	if (hue >= 360) { hue %=360; }
	var H1 = hue/60;
	var C = v*sat;
	var X = C*(1-Math.abs(H1 % 2-1));
	var r; var y; var b;
	var m = v - C;
	switch(Math.floor(H1)){
		case 0: r = C+m; y=X+m; b=0+m; break;
		case 1: r = X+m; y=C+m; b=0+m; break;
		case 2: r = 0+m; y=C+m; b=X+m; break;
		case 3: r = 0+m; y=X+m; b=C+m; break;
		case 4: r = X+m; y=0+m; b=C+m; break;
		case 5: r = C+m; y=0+m; b=X+m; break;
		default: break;
	}
	return [Math.floor(51 + r*(-51 - 34.935*y) + 76.5*y + b*(204-76.5*y + r*(51+34.935*y))),
	Math.floor(23.97+ r*(144.33- 49.215*y) - 23.97*y + b*(103.53- 103.53*y + r*(-16.83 + 176.715*y))),
	Math.floor(r*(51- 25.5*y) + 127.5*y + b*(-127.5*y + r*(-51 + 280.5*y)))];
}

function RYBblack(hue,sat,v){
	hue+=180;
	while (hue < 0) { hue+=360; }
	if (hue >= 360) { hue %=360; }
	var H1 = hue/60;
	var C = v*sat;
	var X = C*(1-Math.abs(H1 % 2-1));
	var r; var y; var b;
	var m = v - C;
	switch(Math.floor(H1)){
		case 0: r = C+m; y=X+m; b=0+m; break;
		case 1: r = X+m; y=C+m; b=0+m; break;
		case 2: r = 0+m; y=C+m; b=X+m; break;
		case 3: r = 0+m; y=X+m; b=C+m; break;
		case 4: r = X+m; y=0+m; b=C+m; break;
		case 5: r = C+m; y=0+m; b=X+m; break;
		default: break;
	}
	return [
	Math.floor((127.5- 85.935*r)*y + b*(255+ (-127.5 + 85.935*r)*y)),
Math.floor(r*(168.3- 73.185*y) + b*(127.5- 127.5*y + r*(-40.8 + 200.685*y))),
Math.floor((127.5- 127.5*b)*y + r*(51- 25.5*y + b*(-51 + 280.5*y)))
	];
}

function draw(){
	var teksti = document.getElementById("rgbinfo");
	var teksti2 = document.getElementById("debuginfo");
	teksti2.innerHTML = "Save state: "+ hex((((hue2*256+sat2)*256+bright2)*256)+colorrule*16+colormodel,8);
	teksti.innerHTML = "";
	var varit = colors[colorrule][1];
	var varit2 = new Array();
	for (i=0;i<varit.length;++i){
		varit2.push(laskevarit(hue+varit[i],sat,bright));
		teksti.innerHTML += "#"+hex(varit2[i][2]+256*(varit2[i][1]+256*varit2[i][0]),6)+" ";
		if (varit.length == 1)
		{
			varit2.push(laskevarit(hue+varit[i],sat*0.8,bright));
			varit2.push(laskevarit(hue+varit[i],sat*0.6,bright));
			varit2.push(laskevarit(hue+varit[i],sat*0.4,bright));
			varit2.push(laskevarit(hue+varit[i],sat*0.2,bright));
			varit2.push(laskevarit(hue+varit[i],sat,bright*0.8));
			varit2.push(laskevarit(hue+varit[i],sat,bright*0.6));
			varit2.push(laskevarit(hue+varit[i],sat,bright*0.4));
			varit2.push(laskevarit(hue+varit[i],sat,bright*0.2));
		}
	}
	numvarit = varit2.length;
	for (i=0; i<pallot.length; i++)
	{
		//vari = normalize(laskevarit(hue+varit[colorIndex],sat,bright)));
		kon.fillStyle = "rgb("+varit2[i%numvarit][0]+","+varit2[i%numvarit][1]+","+varit2[i%numvarit][2]+")";
		ympyr(pallot[i]);
	}
}

function ympyr(pallo){
	kon.strokeStyle = "black";
	kon.beginPath();
	kon.arc(pallo[0],pallo[1],pallo[2],0,Math.PI*2,true);
	kon.closePath();
	kon.stroke();
	kon.fill();
}

function drawcontrols(smooth){
	kon.clearRect(0,0,leveys,korkeus);
	var imageData = kon.getImageData(h_offsetLeft, h_offsetTop, c_size, c_size);
	if (!smooth){
		for (i=0; i<c_size; i+=4){
			for (j=0; j<c_size; j+=4){
				var k = laskevarit((i+1)/256*360,1-(j+1)/256,bright);
				var n = (i+c_size*j)*4;
				for (x=0;x<4;++x){
					for (y=0;y<4;++y){
						imageData.data[n++]=k[0]; imageData.data[n++]=k[1]; imageData.data[n++]=k[2]; imageData.data[n++]=255;
					}
					n += 4*c_size-16;
				}
			}
		}
	}
	else {
		for (i=0; i<c_size; ++i){
			for (j=0; j<c_size; ++j){
				var k = laskevarit(i/256*360,1-j/256,bright);
				var n = (i+c_size*j)*4;
				imageData.data[n++]=k[0]; imageData.data[n++]=k[1]; imageData.data[n++]=k[2]; imageData.data[n++]=255;
			}
		}
	}
	var k = laskevarit(hue,sat,bright);
	var s = (k[0]+k[1]+k[2])/3;
	setPixel(imageData,hue2,255-sat2,(s>128)?[0,0,0]:[255,255,255],0xff);
	kon.putImageData(imageData, h_offsetLeft, h_offsetTop);
	imageData = kon.getImageData(b_offsetLeft, b_offsetTop, b_width, c_size);
	lolcolor = laskevarit((hue+180)%360,1,1);
	for (j=0; j<c_size; ++j){
		var lol = laskevarit(hue,sat,1-j/256);
		for (i=0; i<b_width; ++i){
			if (255-bright2==j){
				setPixel(imageData, i, j, lolcolor,0xff); }
			else {
				setPixel(imageData, i, j, lol, 0xff); }
		}
	}
	kon.putImageData(imageData, b_offsetLeft, b_offsetTop);
	draw();
}

function setPixel(imageData, x, y, col, a){
    index = (x + y * imageData.width) * 4;
    imageData.data[index+0] = col[0];
    imageData.data[index+1] = col[1];
    imageData.data[index+2] = col[2];
    imageData.data[index+3] = a;
}

function teepallot()
{
	var numpallot = 1000;
	pallot = new Array();
	pallot.push(new Array(450,200,100));
	//pallot.push(new Array(600,700,50));
	//pallot.push(new Array(1000,300,50));
	for (i=0; i<numpallot; i++){
		x = 400+(leveys-400)*Math.random();
		y = 100+(korkeus-100)*Math.random();
		mindist = 99997; mindist2 = 99998; mindist3 = 99999;
		var pienin1; var pienin2; var pienin3;
		var kummajainen = false;
		for (pallo in pallot){ if (distance(pallot[pallo],x,y) < 0) kummajainen = true; }
		if (kummajainen) continue;
		for (pallo in pallot){
			temp = distance(pallot[pallo], x, y);
			if (mindist > temp) { mindist3 = mindist2; mindist2 = mindist; mindist = temp; pienin3 = pienin2; pienin2 = pienin1; pienin1 = pallot[pallo]; }
			else if (mindist2 > temp) { mindist3 = mindist2; mindist2 = temp; pienin3 = pienin2; pienin2 = pallot[pallo]; }
			else if (mindist3 > temp) { mindist3 = temp; pienin3 = pallot[pallo]; }
		}
		
		var randkoko = 60+Math.random()*20
		if (mindist > randkoko){
			pallot.push(new Array(x,y,randkoko));
		}
		else if (mindist3 < 90000){
			var leftmost = Math.min(Math.min(pienin1[0],pienin2[0]),pienin3[0]);
			var rightmost = Math.max(Math.max(pienin1[0],pienin2[0]),pienin3[0]);
			var topmost = Math.min(Math.min(pienin1[1],pienin2[1]),pienin3[1]);
			var bottomost = Math.max(Math.max(pienin1[0],pienin2[0]),pienin3[0]);
			if (leftmost < x && rightmost > x && topmost < y && bottomost > y){
				var superi = superpallo(pienin1,pienin2,pienin3)
				if (superi[0] < 400 || superi[1] < 100 || superi[0] > leveys || superi[1] > korkeus) continue;
				var kummajainen = false;
				for (pallo in pallot){ if (distance(pallot[pallo],superi[0],superi[1]) < superi[2]) kummajainen = true; }
				if (kummajainen) continue;
				if (superi[2] > 10){
					pallot.push([superi[0],superi[1],Math.min(superi[2],80)]); 
				}
			}
			else if (mindist > 10) pallot.push(new Array(x,y,mindist));
		}
	}
}

function distance(pallo, x, y)
{
	var dx = pallo[0]-x;
	var dy = pallo[1]-y;
	return Math.sqrt(dx*dx+dy*dy)-pallo[2];
}

/*
Solving the Problem of Apollonius, the resulting circle shall not contain any of the parameter circles inside it  
see http://mathworld.wolfram.com/ApolloniusProblem.html for more details
*/
function superpallo(pallo1, pallo2, pallo3){
	var a1 = 2*(pallo1[0]-pallo2[0]);
	var b1 = 2*(pallo1[1]-pallo2[1]);
	var c1 = 2*(pallo1[2]-pallo2[2]);
	var d1 = (pallo1[0]*pallo1[0]+pallo1[1]*pallo1[1]-pallo1[2]*pallo1[2])-(pallo2[0]*pallo2[0]+pallo2[1]*pallo2[1]-pallo2[2]*pallo2[2]);
	var a2 = 2*(pallo1[0]-pallo3[0]);
	var b2 = 2*(pallo1[1]-pallo3[1]);
	var c2 = 2*(pallo1[2]-pallo3[2]);
	var d2 = (pallo1[0]*pallo1[0]+pallo1[1]*pallo1[1]-pallo1[2]*pallo1[2])-(pallo3[0]*pallo3[0]+pallo3[1]*pallo3[1]-pallo3[2]*pallo3[2]);
	var s1 = b2*d1-b1*d2;
	var t1 = b1*c2-b2*c1;
	var u = a1*b2-a2*b1;
	var s2 = a1*d2-a2*d1;
	var t2 = a2*c1-a1*c2;
	var x0 = pallo1[0]*pallo1[0] + pallo1[1]*pallo1[1] - pallo1[2]*pallo1[2] + (s1*s1+s2*s2)/(u*u) - 2*(pallo1[0]*s1 + pallo1[1]*s2)/u;
	var x1 = -2*pallo1[2] + 2*(s1*t1 + s2*t2)/(u*u) - 2*(pallo1[0]*t1 + pallo1[1]*t2)/u;
	var x2 = -1 + (t1*t1 + t2*t2)/(u*u);
	var r = Math.max((-x1+Math.sqrt(x1*x1-4*x0*x2))/(2*x2),(-x1-Math.sqrt(x1*x1-4*x0*x2))/(2*x2));
	var x = (s1+t1*r)/u;
	var y = (s2+t2*r)/u;
	return [x,y,r];
}

function resize()
{
	var canvas = document.getElementById("cannedham");
	kon = canvas.getContext("2d");
	var cont=canvas.parentNode.parentNode;
	if ((canvas.width!=cont.clientWidth)||(canvas.height!=cont.clientHeight)){
		leveys = Math.max(640,cont.clientWidth);
		korkeus = Math.max(480,cont.clientHeight);
		canvas.width=leveys;
		canvas.height=korkeus;
	}
	teepallot();
	drawcontrols(true);
}

function load(){
	normalize();
	changeColorRule();
	resize();
}
