'use strict';

app.service( 'plotService', function( $rootScope ) {
    var service = {
      colour: 'red',
      thickness: 1,
      zoom: 1,
      
      mode: 'draw',

      imgSource: 'img/img.jpeg',

	  // mode set
      modes: ['draw', 'delete', 'drag'],

	  // HTML3.2 colour set (core)
      colours: ['aqua','black','blue','fuchsia','green','gray','lime','maroon','navy','olive','purple','red','silver','teal','white','yellow'],

	  // thickness set
      thicknesses: [1, 2, 3, 4, 5, 6, 7, 8, 9 ,10],


      broadcast: function(bEvent) {
	    $rootScope.$broadcast(bEvent);
      } ,

      clear: function () {
      	this.broadcast('clearDrawing');
      } ,
  
      zoomIn: function () {
      	if (this.zoom>=2) {
          return;
        }
        this.zoom+=0.25;
      	this.broadcast('zoom');
      } ,
  
      zoomOut: function () {
      	if (this.zoom<=1) {
          return;
        }
        this.zoom-=0.25;
      	this.broadcast('zoom');
      } 
   };
   return service;
});