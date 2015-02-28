(function(){
    var XO, drawLine, drawArc, drawCross, filled, pps;
    pps = [{x : 1, y : 1},
           {x : 0, y : 0},
           {x : 0, y : 2},
           {x : 2, y : 0},
           {x : 2, y : 2}];
    filled = [];
    drawLine = function(x1, y1, x2, y2){
        var context = XO.context;
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
        context.closePath();
    };
    drawArc = function(x, y){
        var radius, context, size, hsize;
        context = XO.context;
        size = XO.blockSize;
        hsize = size / 2.0;
        radius = size / 2.0 - 4;
        context.beginPath();
        context.arc(x * size + hsize , y * size + hsize, radius, 0, 2 * Math.PI); 
        context.stroke();
        context.closePath();
        XO.fill(x, y, 1);
    };
    drawCross = function(x, y){
        var context, x1, y1, size;
        size = XO.blockSize;
        x1 = x * size;
        y1 = y * size;
        context = XO.context;
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x1 + size, y1 + size);
        context.moveTo(x1, y1 + size);
        context.lineTo(x1 + size, y1);
        context.stroke();
        context.closePath();
        XO.fill(x, y, 2);
    };
    XO = {
        N           : 3,
        blockSize   : 100,
        filledCnt   : 0,
        setContext  : function(ctx){
           this.context = ctx;
        },
        drawLines   : function(){
            var i, size; 
            size = XO.blockSize;
            for(i=0;i<=this.N;i+=1){
                drawLine(i * size, 0, i * size, XO.N * size);     
                drawLine(0, i * size, XO.N * size, i * size);
            }
        },
        getRandCell : function(){
            return parseInt(Math.random() * 1000, 10) % this.N;
        },
        done        : function(){
            return XO.filledCnt === this.N * this.N;
        },
        fill        : function(x, y, v){
            filled[x][y] = v; 
            this.filledCnt += 1;
        },
        isFilled    : function(x, y){
            return !!filled[x][y];
        },
        drawRandomCross : function(){
            var x, y, i;
            for(i=0; i<pps.length; i+=1){
                if(!this.isFilled(pps[i].x, pps[i].y)){
                    drawCross(pps[i].x, pps[i].y);
                    return;
                }
            }
            while(x = this.getRandCell(),
            y = this.getRandCell(),this.isFilled(x, y));
            drawCross(x, y);
        },
        init        : function(){
            var canvas, context, size, i, j;
            canvas = document.createElement('canvas');
            size = XO.blockSize;
            canvas.width = XO.N * size + 1;
            canvas.height = XO.N * size + 1;
            XO.canvas = canvas;
            XO.context = canvas.getContext('2d');
            for(i=0;i<XO.N;i+=1){
                filled[i] = [];
                for(j=0;j<XO.N;j+=1){
                    filled[i][j] = 0;
                }
            }
            XO.drawLines();
            canvas.onclick = function(evt){
                var x, y;
                x = parseInt(evt.offsetX / size, 10);
                y = parseInt(evt.offsetY / size, 10);
                if(XO.isFilled(x, y)) return;
                drawArc(x, y);
                if(!XO.done() && !XO.isNextFinish()){
                    XO.drawRandomCross(); 
                }
            };
            document.body.appendChild(canvas);
        },
        isNextFinish     : function(){
            var i, j, d1, d2; 
            d1 = []; d2 = [];
            for(i=0;i<this.N;i+=1){
                d1[d1.length] = filled[i][i];
                d2[d2.length] = filled[i][this.N - i - 1];
                for(j=0;j<this.N - 2;j+=1){
                    if(this.check(filled[i][j], filled[i][j + 1], filled[i][j + 2])){
                       drawCross(i, this.crossXorY);
                       return true;
                    }
                    if(this.check(filled[j][i], filled[j + 1][i], filled[j + 2][i])){
                       drawCross(this.crossXorY, i);
                       return true;
                    }
                }
            }
            if(this.check(d1[0], d1[1], d1[2])){
                drawCross(this.crossXorY, this.crossXorY);
                return true;
            }
            if(this.check(d2[0], d2[1], d2[2])){
                drawCross(this.crossXorY, this.N - this.crossXorY - 1);
                return true;
            }
            return false;
        },
        check       : function(a,b,c){
            var arr, i; 
            arr = [a, b, c];
            for(i=0;i<arr.length;i+=1){
                if(!arr[i]){
                    arr.splice(i, 1)
                    this.crossXorY = i;
                }
            }
            if(arr.length === 2 && arr[0] === arr[1]){
                return true;
            }else{
                return false;
            }
        },
        reset   : function(){
            this.canvas.width = this.canvas.width;
            this.drawLines();
        }
    };
    window.XO = XO;
})();
window.onload = XO.init;
