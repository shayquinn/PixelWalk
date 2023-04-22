/*
This JavaScript code is a color picker that allows a user to select a color from an image by clicking on it.
The selected color is then used to draw a path around all pixels in the image that are of a similar color.

The code first creates a canvas element, sets its size to the width and height of the browser window, and adds it to the body of the HTML document.
An image is loaded into the canvas and its data is extracted using the getImageData() method. This data is then used to determine the color of each pixel in the image.

When the user clicks on the canvas, the sts() function is called, which determines all the pixels in the image that are of a similar color to the one clicked on.
These pixels are then used to draw a path around the selected color.

The getRGB2() function is used to determine the color of a pixel at a specific location in the image.
The check() function determines whether a pixel's color is within a certain range of the selected color,
while the inrange() function is used by check() to determine if a pixel's color is within a certain range.

The callwile2() function is used to draw a path around the selected color by finding a path from one pixel to the next until all pixels
of the selected color have been included in the path. Finally, the draw() function is used to draw the path around the selected color on the canvas.
*/
document.addEventListener("DOMContentLoaded", function (event) {
    let sc = [];
    let range = [5, 5, 5, 5];
    let xyarrayX = [];
    let xyarrayY = [];
    let xarray = [];
    let yarray = [];
    let ctx;
    let cw;
    let ch;
    let imgData;
    let sharx = [];
    let shary = [];

    let tty, ttx, cx, cy;

    let WW = window.innerWidth, WH = window.innerHeight;
    let canvas = document.createElement('canvas');
    canvas.width = WW;
    canvas.height = WH;
    let body = document.getElementsByTagName("body")[0];
    body.appendChild(canvas);

    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;

    let image = new Image();
    let im = [image, 0, 0, WW, WH];
    cw = im[3];
    ch = im[4];
    image.src = "./images/colorwheel1.png";

    image.onload = function () {
        ctx.drawImage(im[0], im[1], im[2], im[3], im[4]);
        imgData = ctx.getImageData(im[1], im[2], im[3], im[4]);
        ctx.clearRect(0, 0, cw, ch);
        ctx.putImageData(imgData, im[1], im[2]);
    };//end image onload

    canvas.addEventListener("mousemove", (e) => {
        if (e.target.nodeName === "CANVAS") {
            cx = e.pageX;
            cy = e.pageY;
            cx = (cx <= im[3]) ? cx : im[3];
            cy = (cy <= im[4]) ? cy : im[4];
            cx = (cx >= 0) ? cx : 0;
            cy = (cy >= 0) ? cy : 0;

            if (e.which === 0) {
            }
            if (e.which === 1) {
            }
        }
    });

    canvas.addEventListener("click", function (e) {
        sharx = [];
        shary = [];
        xarray = [];
        yarray = [];
        xyarrayX = [];
        xyarrayY = [];
        sc[0] = cx;
        sc[1] = cy
        sc[2] = getRGB2(cx, cy);
        sts(sc, imgData);
    }, false);

/*
This function is called when the user clicks on the canvas. It takes an array sc containing the current x and y coordinates of 
the mouse cursor and the RGB values of the pixel at that location. It then iterates through all the pixels in the image data
and checks if their RGB values are within a certain range of the RGB values of the clicked pixel. If a pixel's RGB values are 
within this range, it is added to a list of pixels that are "close" to the clicked pixel. The function then calls another function
called callwhile() to draw a path around all of the pixels in this list.
*/
    function sts(sc) {
        var sw = true;
        for (var i = 0; i < imgData.data.length; i += 4) {
            var ngh = [imgData.data[i], imgData.data[i + 1], imgData.data[i + 2], imgData.data[i + 3]];

            if (check(ngh, sc[2], range)) {
                if (sw === true) {
                    sw = false;
                }
            } else {
                if (sw === false) {
                    sharx.push(Math.round((i / 4) % cw));
                    shary.push(Math.round((i / 4) / cw));
                    sw = true;
                }
            }
        }
        /*path around all of the clicked color*/
        callwhile(sharx, shary, sc[2]);
        draw();
    }//end sts

    /*
    This function takes two arguments, x and y, which are the coordinates of a pixel in the image data. It returns an array containing the RGBA values of that pixel.
    */
    function getRGB2(x, y) {
        return [imgData.data[(x * 4) + (im[3] * (y * 4))], imgData.data[((x * 4) + (im[3] * (y * 4))) + 1], imgData.data[((x * 4) + (im[3] * (y * 4))) + 2], imgData.data[((x * 4) + (im[3] * (y * 4))) + 3]];
    }//end getRGB2

    /*
    This function takes three arrays as arguments: gh, st, and ra. gh is an array containing the RGBA values of a pixel,
    st is an array containing the RGBA values of the clicked pixel, and ra is an array containing a range of values for each of the RGBA values.
    The function checks if each of the RGBA values in gh are within the range specified in ra for the corresponding RGBA value in st.
    If any of the RGBA values are within this range, the function returns true, indicating that the pixel is "close" to the clicked pixel.
    */
    function check(gh, st, ra) {
        return inrange(gh[0], st[0], ra[0]) || inrange(gh[1], st[1], ra[1]) || inrange(gh[2], st[2], ra[2]) || inrange(gh[3], st[3], ra[3]);
    }//end check

    /*
    This function takes three arguments: gh, st, and r. gh and st are numbers representing RGBA values, and r is a number representing a range.
    The function checks if gh is within r units of st. If it is, the function returns true, indicating that the pixel is "close" to the clicked pixel.
    */
    function inrange(gh, st, r) {
        return gh < (st - r) || gh > (st + r);
    }//end inrange

    /*
    This function takes three arguments: sx, sy, and c. sx and sy are arrays containing the x and y coordinates, respectively, of all the pixels that
    are "close" to the clicked pixel. c is an array containing the RGBA values of the clicked pixel.
    The function iterates through all the pixels in sx and sy and calls another function called findpath() to find a path around each pixel.
    It then stores the x and y coordinates of the points along each path in two arrays (xyarrayX and xyarrayY) and repeats this process until
    all the pixels in sx and sy have been processed.
    */
    function callwhile(sx, sy, c) {
        let stop = true;
        let temsharx = sx;
        let temshary = sy;

        temsharx.shift();
        temshary.shift();
        temshary <= 0 ? temshary = 0 : temshary = temshary;
        temshary >= im[4] ? temshary = im[4] : temshary = temshary;

        let wco = 0;
        while (stop) {
            if (temsharx.length > 0) {
                findpath(temsharx[0], temshary[0]);
                xyarrayX[wco] = xarray;
                xyarrayY[wco] = yarray;
                for (let i = 0; i < xarray.length; i++) {
                    for (let j = 0; j < temsharx.length; j++) {
                        let xa = xyarrayX[wco][i];
                        let ya = xyarrayY[wco][i];
                        let tx = temsharx[j];
                        let ty = temshary[j];
                        if (xa === tx && ya === ty ||
                            xa === tx && (ya - 1) === ty ||
                            xa === tx && (ya + 1) === ty ||
                            (xa + 1) === tx && ya === ty) {
                            temsharx.splice(j, 1);
                            temshary.splice(j, 1);
                            //store j the position in the array
                        }
                    }
                }
                console.log("temx: " + temsharx.length);
                console.log(xyarrayX.length);

                xarray = [];
                yarray = [];

            } else {
                console.log("default stop");
                stop = false;
            }
            if (wco > 100) {
                console.log("ten stop");
                stop = false;
            }
            wco++;
        }
        draw();
    }//end callwile2

    //walk
    function findpath(tx, ty) {
        let stop = true;
        let xstop = false;
        let ystop = false;
        let dir;
        let num = 1;

        let tm, ml, mr, bm;
        //!(check(getRGB2(tx-1,ty-1),sc[2],range)) ? tl=true : tl=false;
        !(check(getRGB2(tx, ty - 1), sc[2], range)) ? tm = true : tm = false;
        //!(check(getRGB2(tx+1,ty-1),sc[2],range)) ? tr=true : tr=false;

        !(check(getRGB2(tx - 1, ty), sc[2], range)) ? ml = true : ml = false;
        !(check(getRGB2(tx + 1, ty), sc[2], range)) ? mr = true : mr = false;

        //!(check(getRGB2(tx-1,ty+1),sc[2],range)) ? bl=true : bl=false;
        !(check(getRGB2(tx, ty + 1), sc[2], range)) ? bm = true : bm = false;
        // !(check(getRGB2(tx+1,ty+1),sc[2],range)) ? br=true : b=false;
        let blo = "||||";
        let bla = "%%%%%%%";
        let cen = "XXXX";
        let tll, tmm, trr, mll, mrr, bll, bmm, brr;
        !(check(getRGB2(tx - 1, ty - 1), sc[2], range)) ? tll = blo : tll = bla;
        !(check(getRGB2(tx, ty - 1), sc[2], range)) ? tmm = blo : tmm = bla;
        !(check(getRGB2(tx + 1, ty - 1), sc[2], range)) ? trr = blo : trr = bla;
        !(check(getRGB2(tx - 1, ty), sc[2], range)) ? mll = blo : mll = bla;
        !(check(getRGB2(tx + 1, ty), sc[2], range)) ? mrr = blo : mrr = bla;
        !(check(getRGB2(tx - 1, ty + 1), sc[2], range)) ? bll = blo : bll = bla;
        !(check(getRGB2(tx, ty + 1), sc[2], range)) ? bmm = blo : bmm = bla;
        !(check(getRGB2(tx + 1, ty + 1), sc[2], range)) ? brr = blo : brr = bla;

        console.log("starting condition");
        console.log(tll + " " + tmm + " " + trr);
        console.log(mll + " " + cen + " " + mrr);
        console.log(bll + " " + bmm + " " + brr);
        console.log("------------------------------------------------------");
        ttx = tx;
        tty = ty;
        console.log(ttx + " " + tty);
        xarray.push(ttx);
        yarray.push(tty);

        !(check(getRGB2(ttx - 1, tty - 1), sc[2], range)) ? tll = blo : tll = bla;
        !(check(getRGB2(ttx, tty - 1), sc[2], range)) ? tmm = blo : tmm = bla;
        !(check(getRGB2(ttx + 1, tty - 1), sc[2], range)) ? trr = blo : trr = bla;
        !(check(getRGB2(ttx - 1, tty), sc[2], range)) ? mll = blo : mll = bla;
        !(check(getRGB2(ttx + 1, tty), sc[2], range)) ? mrr = blo : mrr = bla;
        !(check(getRGB2(ttx - 1, tty + 1), sc[2], range)) ? bll = blo : bll = bla;
        !(check(getRGB2(ttx, tty + 1), sc[2], range)) ? bmm = blo : bmm = bla;
        !(check(getRGB2(ttx + 1, tty + 1), sc[2], range)) ? brr = blo : brr = bla;

        console.log("condition");
        console.log(tll + " " + tmm + " " + trr);
        console.log(mll + " " + cen + " " + mrr);
        console.log(bll + " " + bmm + " " + brr);
        console.log("------------------------------------------------------");

        dir = 1;
        let d1 = ["R", "U", "L", "D"];
        console.log("dir: " + d1[dir - 1]);

        while (stop) {
            tty <= 0 ? tty = 0 : tty = tty;
            tty >= im[4] - 1 ? tty = im[4] - 1 : tty = tty;

            dir = direction(dir, ttx, tty);

            ttx === xarray[0] ? xstop = true : xstop = false;
            tty === yarray[0] ? ystop = true : ystop = false;
            if (num > 4 && ystop && xstop) {
                stop = false;
            }
            //To stop the while from falling into an infinet 
            if (num > 10000) {
                stop = false;
            }
            num++;
        }//end while
    }//end findpath

    function direction(d, tx, ty) {
        let dar = [
            [4, 1, 2, 3],
            [1, 2, 3, 4],
            [2, 3, 4, 1],
            [3, 4, 1, 2]
        ];
        let dat1 = [tx + 1, tx, tx - 1, tx];
        let dat2 = [ty, ty - 1, ty, ty + 1];

        if (ty < 1) {
            if (ty < 1 && tx < 1) {
                d = 1;
            } else if (ty < 1) {
                d = 4;
            }
        } else if (ty > im[4] - 2) {
            if (ty > im[4] - 2 && tx > im[3] - 2) {
                d = 3;
            } else if (ty > im[4] - 2) {
                //d=2;
                if (!(d === 3)) {
                    d = 2;
                }
            }
        } else if (tx < 1) {
            if (ty > im[4] - 2 && tx < 1) {
                d = 2;
            } else if (tx < 1) {
                d = 1;
            }
        } else if (tx > im[3] - 2) {
            if (ty > im[4] - 2 && tx > im[3] - 2) {
                d = 4;
            } else if (tx > im[3] - 2) {
                d = 3;
            }
        }

        for (let i = 0; i < 4; i++) {
            if (!(check(getRGB2(dat1[dar[d - 1][i] - 1], dat2[dar[d - 1][i] - 1]), sc[2], range))) {
                xarray.push(dat1[dar[d - 1][i] - 1]);
                yarray.push(dat2[dar[d - 1][i] - 1]);
                ttx = dat1[dar[d - 1][i] - 1];
                tty = dat2[dar[d - 1][i] - 1];
                return dar[d - 1][i];
            }
        }
    }//end direction

    function draw() {
        //plus 20 w and 20 h
        ctx.putImageData(imgData, im[1], im[2]);
        if( xyarrayX.length>0){
            for (var j = 0; j < xyarrayX.length; j++) {
                for (var l = 0; l < xyarrayX[j].length; l++) {
                    ctx.fillStyle = "rgba(0, 0, 0, 1)";
                    ctx.fillRect((xyarrayX[j][l]), (xyarrayY[j][l]), 3, 3);
                    ctx.fillStyle = "rgba(0, 255, 0, 1)";
                    ctx.fillRect((xyarrayX[j][0]), (xyarrayY[j][0]), 5, 5);
                    ctx.stroke();
                }
            }
        }
    }//end draw

});//end load function


