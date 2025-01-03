Access the site on:
www.raytracingontheweb.com

Probably will not be up for long but as of 4 Jan 2025, it is. 

The concept of this site is to create an interactive demo of raytracing within a browser. Using Three.js, I built a basic 3D scene constructor (like in Blender) which then feeds object and camera data into a C++ raytracer. This raytracer was built almost entirely following the "Raytracing in One Weekend" tutorial series, then adapted to build arbitrary scene and compiled into WebAssembly with Emscripten. This C++ script was the inspiration for this project, but actually it is a bit stupid to keep it now since Three.js already provides the foundation of a 3D scene, camera, and the ability to create vectors and objects. So in my code, the objects are first rendered with Three.js's basic rendering, and then rendered entirely separately by the C++ raytracing code which actually simulates ray interactions. It would make much more sense to code the ray interactions directly into the Three.js scene, perhaps using webGPU to perform GPU-accelerated parallel processing. 



Personal notes:

Terminal prompt:
npm start


TODO:
- Add a axis reference tool DONE
- Change camera movements to be viewpath aligned. DONE
- Add mouse based movement of the objects.
- Allow cubes to be rendered. DONE
- Add material choice. DONE
- Add menu bar to change material choice and resize. DONE
- Allow object rotation. 
- Figure out how to overlay the ray camera viewport on the window. 
- Fix camera sync, sometimes camera is not in right position or not looking right direction.
- Make object resizing occur at same location DONE
- Make the menu so that it will always go back to showing your object's state, unless you input all values. DONE
- Fix bug in resizing, not letting you write decimals.



Current key functions:
- c to add cube
- v to add Sphere
- d to delete object
- up,down,left,right arrow keys for object moving
- s to switch z and x axis object motion controls
- hold and drag mouse for camera translation
- command + hold and drag mouse for camera rotation about viewpoint
- scroll mouse for zoom along viewpath
- click on objects with mouse to select
- m for secret easter egg

