Installation:
-------------
The included bower.json file has all the dependencies required for this project.
In order to get the application to work you will need to run: bower install from within the working application directory.

Dependencies/Packages:
----------------------
1. angular-local-storage (via bower manifest)
2. bootstrap (via bower manifest)
2. jQuery (Bootstrap dependency via bower) 
4. angularjs (CDN)

Notes on project
----------------
I decided not to use a pre-built canvas package instead prefering to interface directly with the canvas object via the drawing directive (using angularjs).  I used the angular-local-storage file to provide persistent client-side storage. I also used Bootstrap to give the application a slightly more polished look-and-feel.

References
----------
1. Bootstrap - http://getbootstrap.com/
2. Angular directives API - https://docs.angularjs.org/guide/directive
3. http://jsfiddle.net/m1erickson/QyWDY/ - mouse click collision detection methodology on canvas
4. http://jsfiddle.net/AbdiasSoftware/zcpvg/ - more collision detection methodology
5. https://github.com/grevory/angular-local-storage - local storage API 

