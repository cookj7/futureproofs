'use strict';

app.directive("drawing", ['localStorageService', 'plotService', '$rootScope', function(localStorageService, plotService, $rootScope){
  return {
    restrict: "A", 
    transclude: true,
    controller: function($scope, $element){
      // initialise zoom
      plotService.zoom = localStorageService.get('zoom') || 1;

      // ensure initial cursor is crosshair
      $element.css({cursor: 'crosshair'});
    },

    link: function(scope, element){
      // grab canvas and context
      var canvas = element[0];
      var ctx = canvas.getContext('2d');
      var buffer = 50;
      
      var items = localStorageService.get('plot') || [];

      // setup location points
      var x1 = null;
      var x2 = null;
      var y1 = null;
      var y2 = null;

      // draggableItemId
      var dragging = {
        active: false,
        x: 0,
        y: 0,
        idx: -1
      };

      // draw from local storage
      redraw();

      // click event
      element.bind('click', function(event){
        var x = (event.offsetX!==undefined)?event.offsetX:(event.layerX - event.currentTarget.offsetLeft);
        var y = (event.offsetX!==undefined)?event.offsetY:(event.layerY - event.currentTarget.offsetTop);

        // if click is on canvas top bar
        if (y<=buffer) {
          return;
        }

        switch (plotService.mode) {
          case 'delete':
            angular.forEach(items, function (value, key) {
              var lineAsRect = defineLineAsRect(value.x1*plotService.zoom, value.y1*plotService.zoom, value.x2*plotService.zoom, value.y2*plotService.zoom, 10);
              drawLineAsRect(lineAsRect, "transparent");
              if (ctx.isPointInPath(x, y)) {
                  removeItem(key);
                  return;
              }
            });
            break;
          case 'drag': 
            // do nothing
            break;
          default:
            if (x1 === null) { // first click 
              x1 = (x/plotService.zoom).toFixed(0);
              y1 = (y/plotService.zoom).toFixed(0);   
              click(x1, y1);
            } else { // second click
              x2 = (x/plotService.zoom).toFixed(0);
              y2 = (y/plotService.zoom).toFixed(0);
              click(x2, y2);

              // draw (and save) plot
              draw({
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2,
                config: {
                  colour: plotService.colour,
                  thickness: plotService.thickness,
                }
              }, true);
            }
        }
      }).bind('mousemove', function(event){
          // get mouse position 
          // IMPORTANT - we have adjusted for zoom
          var xM = (((event.offsetX!==undefined)?event.offsetX:(event.layerX - event.currentTarget.offsetLeft))/plotService.zoom).toFixed(0);
          var yM = (((event.offsetX!==undefined)?event.offsetY:(event.layerY - event.currentTarget.offsetTop))/plotService.zoom).toFixed(0);
          var oM = (x1 === null);
          
          if (yM<=buffer) return;

          drawLocation(xM, yM, oM);

          if ((plotService.mode=='drag') && dragging.active) {
            var x = (event.offsetX!==undefined)?event.offsetX:(event.layerX - event.currentTarget.offsetLeft);
            var y = (event.offsetX!==undefined)?event.offsetY:(event.layerY - event.currentTarget.offsetTop);

            x = (x/plotService.zoom).toFixed(0);
            y = (y/plotService.zoom).toFixed(0);

            var mvX = x - dragging.x;
            var mvY = y - dragging.y;

            dragging.x = x;
            dragging.y = y;

            items[dragging.idx].x1 =parseInt(items[dragging.idx].x1)+mvX;
            items[dragging.idx].y1 =parseInt(items[dragging.idx].y1)+mvY;
            items[dragging.idx].x2 =parseInt(items[dragging.idx].x2)+mvX;
            items[dragging.idx].y2 =parseInt(items[dragging.idx].y2)+mvY;

            localStorageService.set('plot', items);

            redraw();

          }
          
      }).bind('mousedown', function(event){
          // get mouse position 
          // IMPORTANT - we have adjusted for zoom
          if (plotService.mode=='drag') {
            var x = (event.offsetX!==undefined)?event.offsetX:(event.layerX - event.currentTarget.offsetLeft);
            var y = (event.offsetX!==undefined)?event.offsetY:(event.layerY - event.currentTarget.offsetTop);

            var keepGoing = true;
            angular.forEach(items, function (value, key) {
              if (keepGoing) {
                var lineAsRect = defineLineAsRect(value.x1*plotService.zoom, value.y1*plotService.zoom, value.x2*plotService.zoom, value.y2*plotService.zoom, 10);
                drawLineAsRect(lineAsRect, "transparent");
                if (ctx.isPointInPath(x, y)) {
                    x = (x/plotService.zoom).toFixed(0);
                    y = (y/plotService.zoom).toFixed(0);

                    dragging.idx = key;
                    dragging.active = true;
                    dragging.x = x;
                    dragging.y = y;
                    element.css({cursor: 'pointer'});
                    keepGoing = false;
                }
              }
            });
            
          }
          
      }).bind('mouseup', function(event){
          // get mouse position 
          // IMPORTANT - we have adjusted for zoom
          if ((plotService.mode=='drag') && dragging.active) {
            dragging.active = false;
            element.css({cursor: 'crosshair'});
          }
          
      });

      // clear drawing event
      $rootScope.$on('clearDrawing', function(args, message){
        // empty local storage
        items = [];
        localStorageService.remove('plot');

        // ensure that any exiting plots are cleared
        x1 = x2 = y1 = y2 = null;

        redraw();
      });


      // zoom broadcast event
      $rootScope.$on('zoom', function(args){
        // save changes
        localStorageService.set('zoom', plotService.zoom);
        redraw();/**/
      });

      // remove plot item from list (and redraw)
      function removeItem (index) {
        items.splice(index, 1);
        localStorageService.set('plot', items);
        redraw();
      }

      // locational indicator
      function drawLocation(xM, yM, oM) {
        ctx.clearRect (oM?0:150, 0, oM?400:150, 50);
        ctx.font="12px Times New Roman";//
        ctx.fillStyle = oM?'#369':'#69c';
        ctx.fillText("Position "+(oM?1:2)+" = ("+xM+", "+(yM-buffer)+")",10+(oM?0:150),20);
      }

      // register click (visual feedback)
      function click(x,y) {
        ctx.beginPath();
        ctx.strokeStyle = plotService.colour;
        ctx.lineWidth = 1;
        ctx.rect(x*plotService.zoom,y*plotService.zoom,1,1);
        ctx.stroke(); /**/
      }


      // draw method used to draw an individual line
      function draw(plot, save) {
        ctx.beginPath();
        ctx.moveTo(plot.x1*plotService.zoom, plot.y1*plotService.zoom);
        ctx.lineTo(plot.x2*plotService.zoom, plot.y2*plotService.zoom);

        // set style
        ctx.strokeStyle = plot.config.colour;
        ctx.lineWidth = plot.config.thickness*plotService.zoom;

        // draw line
        ctx.stroke();

        // save node (if applicable)
        if (save) {
          items.push(plot);
          localStorageService.set('plot', items);

          // reset plot (TODO: resolve byref issues | RESOLVED)
          x1 = x2 = y1 = y2 = null;
        } 

      }


      // redraw method 
      function redraw(){
        ctx.clearRect (0, 0, canvas.width, canvas.height);
        var img = new Image();
        img.src = plotService.imgSource;

        // TODO: stop reload of image on each refresh
        img.onload = function() {
          canvas.width = img.width * plotService.zoom;
          canvas.height = (img.height * plotService.zoom)+buffer;
          ctx.drawImage(img, 0, buffer, canvas.width, canvas.height-buffer);

          // redraw (locally stored) lines
          if (items.length) {
            angular.forEach(items, function (value, key) {
              draw(value, false); 
            });
            
          }

          // make sure first click is redrawn
          if (x1!==null) {
            drawLocation(x1, y1, true);
          }

        }
      }

      /* 
        implementation provided by jsFiddle: http://jsfiddle.net/m1erickson/QyWDY/ 
        used to determine if line has been clicked
      */
      function defineLineAsRect(x1, y1, x2, y2, lineWidth) {
            var dx = x2 - x1; // deltaX used in length and angle calculations 
            var dy = y2 - y1; // deltaY used in length and angle calculations
            var lineLength = Math.sqrt(dx * dx + dy * dy);
            var lineRadianAngle = Math.atan2(dy, dx);

            return ({
                translateX: x1,
                translateY: y1,
                rotation: lineRadianAngle,
                rectX: 0,
                rectY: -lineWidth / 2,
                rectWidth: lineLength,
                rectHeight: lineWidth
            });
        }

      function drawLineAsRect(lineAsRect, color) {
            var r = lineAsRect;
            ctx.save();
            ctx.beginPath();
            ctx.translate(r.translateX, r.translateY);
            ctx.rotate(r.rotation);
            ctx.rect(r.rectX, r.rectY, r.rectWidth, r.rectHeight);
            ctx.translate(-r.translateX, -r.translateY);
            ctx.rotate(-r.rotation);
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }

    }
  };
}]);