Terminal prompt:
npm start


TODO:
- Add a axis reference tool
- Change camera movements to be viewpath aligned. DONE
- Add mouse based movement of the objects.
- Allow cubes to be rendered. DONE
- Add material choice. DONE
- Add menu bar to change material choice and resize. DONE
- Allow object rotation.
- Figure out how to overlay the ray camera viewport on the window. 
- Fix camera sync, sometimes camera is not in right position or not looking right direction.
- Make object resizing occur at same location DONE
- Make the menu so that it will always go back to showing your object's state, unless you input all values.
- Fix bug in resizing, not letting you write decimals.



Current key functions:
- c to add cube
- v to add Sphere
- b to pause scene and get ready for rendering
- n to unpause scene
- r to render scene
- d to delete object
- w,s,up,down,left,right for object moving
- hold and drag mouse for camera translation
- command + hold and drag mouse for camera rotation about viewpoint
- scroll mouse for zoom along viewpath
- click on objects with mouse to select


Notes on selection logic:

- If click on object, set it to selection.
- Edit colors and outline for previous selection.
- Open menu for that object, change the menu contents, 