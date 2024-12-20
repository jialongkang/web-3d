var Module = {
    onRuntimeInitialized: function() {
        var objects_list = [];
        console.log("Running...");
        Module.initializeGround();


        document.addEventListener('keydown', (event) => {
            if (event.key === 'r') {
                console.log("The 'r' key was pressed!");
                Module.addSphere();
            }
        });

    }
};

// import SceneInitializer from './SceneInitializer.js';
// import CameraController from './CameraInitializer.js';
// import Object from './objClass.js';
// import {Sphere} from './objClass.js';
// import {Cube} from './objClass.js';
// // import {Module} from './Render.js';

// console.log("script.js is running");

// const scene_class = new SceneInitializer();
// scene_class.init();

// // Create and add a sphere and a cube
// // scene_class.createAndAddSphere(1, new THREE.MeshBasicMaterial({ color: 0xff0000 }));
// // scene_class.createAndAddCube(1, new THREE.MeshBasicMaterial({ color: 0x00ff00 }));

// let renderer = scene_class.renderer;
// let camera = scene_class.camera;
// let scene = scene_class.scene;

// // const cube1 = new Cube(3);
// // console.log(cube1);
// // scene.add(cube1.mesh);

// const camera_class = new CameraController(camera);

// camera_class.init();
// // const input_handler = new InputHandler(camera, renderer);

// // Start the animation loop
// function animate() {
//     requestAnimationFrame(animate);
//     // Update rendering logic
//     renderer.render(scene, camera);
// }



// if (true) {
//     document.addEventListener('keydown', (event) => {
//         if (event.key === 'r') {
//             console.log("The 'r' key was pressed!");
//             var Module = {
//                 onRuntimeInitialized: function() {
//                     var objects_list = [];
//                     console.log("Running...");
//                     Module.initializeGround();
//                 }
//             };
//         }
//     });
// }

// animate();

// // if (true) {
// //     document.addEventListener('keydown', (event) => {
// //         if (event.key === 'r') {
// //             console.log("The 'r' key was pressed!");
// //             var Module = {
// //                 onRuntimeInitialized: function() {
// //                     var objects_list = [];
// //                     console.log("Running...")
// //                     Module.initializeGround();
// //                     Module.addSphere(0,0,0,1,"dielectric",1.5);
// //                 
// //                     // Module.addSphere_v2(sph_x, sph_y, sph_z, sph_rad, mat_type, mat_params);
// //                     updateConsole('Sphere added.');
// //             
// //                     // Module.resetWorld();
// //                     // Module.initializeGround();
// //             
// //                     const canvas = document.getElementById('myCanvas');
// //                     // Show the canvas when rendering starts
// //                     canvas.style.display = 'block'; // Make the canvas visible
// //             
// //                     img_w = 200;
// //                     const ctx = canvas.getContext('2d');
// //                     const width = img_w, height = img_h;
// //                     
// //                     ctx.clearRect(0, 0, width, height);
// //             
// //                     setTimeout(() => {
// //             
// //                         const pixelData = Module.simple_render(5,5,5,20,width,16.0/9.0,20);
// //                         console.log("HERE");
// //                         // const pixelData = Module.simple_render(camlf_x, camlf_y, camlf_z, 
// //                         //                                     cam_vfov, width, img_ar, img_spp
// //                         // );
// //                         // Set the canvas dimensions
// //                         canvas.width = width;
// //                         canvas.height = height;
// //                         console.log('Canvas dimensions set to:', width, height);
// //                         console.log('Pixel data received of size :', Module.vector_size(pixelData)); // Print the contents of the pixel data
// //             
// //                         const imageData = ctx.createImageData(width, height);
// //             
// //                         // Copy the RGB data into ImageData
// //                         for (let i = 0, j = 0; i < Module.vector_size(pixelData); i += 3, j++) {
// //                         imageData.data[j * 4] = Module.vector_get(pixelData, i);       // R
// //                         imageData.data[j * 4 + 1] = Module.vector_get(pixelData, i+1); // G
// //                         imageData.data[j * 4 + 2] = Module.vector_get(pixelData, i+2); // B
// //                         imageData.data[j * 4 + 3] = 255;            // A (opaque)
// //                         }
// //             
// //                         console.log('ImageData prepared, putting image on canvas.');
// //             
// //                         // Render the image to the canvas
// //                         ctx.putImageData(imageData, 0, 0);
// //                     }, 10); // Pause for 2000 milliseconds (2 seconds)
// //                 }
// //             }
// //         }
// //     });
// // }

// //         document.getElementById('helloButton').addEventListener('click', function() {
// //             updateConsole("Hello world!");
// //             Module.say_hello();
// //         });

// //         document.getElementById('lerpButton').addEventListener('click', function() {
// //             const result = Module.lerp(1, 2, 0.5);
// //             updateConsole('Lerp result: ' + result);
// //         });

// //         document.getElementById('sphereButton').addEventListener('click', function() {
// //             const sph_x = parseInt(document.getElementById('sph_x').value);
// //             const sph_y = parseInt(document.getElementById('sph_y').value);
// //             const sph_z = parseInt(document.getElementById('sph_z').value);
// //             const sph_rad = parseInt(document.getElementById('sph_rad').value);
// //             
// //             // Get the selected material type
// //             const mat_type = document.getElementById('materialType').value;
// //             let mat_params_js = [];
// //             // Gather material parameters based on the selected material type
// //             if (mat_type === 'dielectric') { // Set params for dielectric material
// //                 mat_params_js.push(parseFloat(document.getElementById('dielectric_param_1').value));
// //             } else if (mat_type === 'metal') { // Set params for metal material
// //                 mat_params_js.push(
// //                     parseFloat(document.getElementById('metal_param_1').value),
// //                     parseFloat(document.getElementById('metal_param_2').value),
// //                     parseFloat(document.getElementById('metal_param_3').value),
// //                     parseFloat(document.getElementById('metal_param_4').value)
// //                 );
// //             } else if (mat_type === 'lambertian') { // Set params for lambertian material
// //                 mat_params_js.push(
// //                     parseFloat(document.getElementById('lamb_param_1').value),
// //                     parseFloat(document.getElementById('lamb_param_2').value),
// //                     parseFloat(document.getElementById('lamb_param_3').value)
// //                 );
// //             }
// //             // Create the mat_params as a C++ vector float object
// //             const mat_params = Module.vector_make(mat_params_js);
// //             
// //             if (isNaN(sph_x) || isNaN(sph_y) || isNaN(sph_z)|| isNaN(sph_rad)) {
// //                 updateConsole('Please fill in all options to add a sphere.');
// //                 return; // Exit the function if any input is empty
// //             } else {
// //                 Module.addSphere_v2(sph_x, sph_y, sph_z, sph_rad, mat_type, mat_params);
// //                 updateConsole('Sphere added.');
// //                 objects_list.push(`Sphere(${sph_x}, ${sph_y}, ${sph_z}, ${sph_rad})`);
// //                 console.log(objects_list);
// //                 updateObjectsList(objects_list);
// //             }
// //         });

// //         document.getElementById('resetButton').addEventListener('click', function() {
// //             Module.resetWorld();
// //             Module.initializeGround();
// //             objects_list = [];
// //             updateObjectsList(objects_list);
// //         });

// //         document.getElementById('renderButton').addEventListener('click', function() {
// //             // Disable the render button to prevent multiple clicks
// //             document.getElementById('renderButton').disabled = true;
// //             
// //             // Get camera option values
// //             const camlf_x = parseInt(document.getElementById('camlf_x').value);
// //             const camlf_y = parseInt(document.getElementById('camlf_y').value);
// //             const camlf_z = parseInt(document.getElementById('camlf_z').value);
// //             const cam_vfov = parseInt(document.getElementById('cam_vfov').value);
// //             // Get aspect ratio
// //             const img_ar_input = document.getElementById('img_ar').value;
// //             const [numerator, denominator] = img_ar_input.split('/').map(Number);
// //             const img_ar = denominator !== 0 ? numerator / denominator : 0; // Calculate the float ratio
// //             // Calculate image height based on the aspect ratio and image width
// //             const img_w = parseInt(document.getElementById('img_w').value);
// //             const img_h = Math.max(1, Math.floor(img_w / img_ar)); // Ensure height is at least 1
// //             const img_spp = parseInt(document.getElementById('img_spp').value);

// //             // Check input values have been inputted.
// //             if (isNaN(camlf_x) || isNaN(camlf_y) || isNaN(camlf_z)|| 
// //                 isNaN(cam_vfov) || isNaN(img_ar) || isNaN(img_w) || isNaN(img_spp)) {
// //                 updateConsole('Please fill in all input fields before rendering.');
// //                 document.getElementById('renderButton').disabled = false;
// //                 return; // Exit the function if any input is empty
// //             } else {
// //                 updateConsole('Render inputs accepted. Computing ray tracing...');
// //             }

// //             // Set up the canvas
// //             const canvas = document.getElementById('myCanvas');
// //             const ctx = canvas.getContext('2d');
// //             const width = img_w, height = img_h;
// //             
// //             // Clear the canvas before rendering
// //             ctx.clearRect(0, 0, width, height);

// //             setTimeout(() => {
// //                 const pixelData = Module.simple_render(camlf_x, camlf_y, camlf_z, 
// //                     cam_vfov, width, img_ar, img_spp
// //                 );
// //                 
// //                 // Set the canvas dimensions
// //                 canvas.width = width;
// //                 canvas.height = height;
// //                 console.log('Canvas dimensions set to:', width, height);
// //                 
// //                 console.log('Pixel data received of size :', Module.vector_size(pixelData)); // Print the contents of the pixel data
// //                 // Create an ImageData object
// //                 const imageData = ctx.createImageData(width, height);

// //                 // Copy the RGB data into ImageData
// //                 for (let i = 0, j = 0; i < Module.vector_size(pixelData); i += 3, j++) {
// //                     imageData.data[j * 4] = Module.vector_get(pixelData, i);       // R
// //                     imageData.data[j * 4 + 1] = Module.vector_get(pixelData, i+1); // G
// //                     imageData.data[j * 4 + 2] = Module.vector_get(pixelData, i+2); // B
// //                     imageData.data[j * 4 + 3] = 255;            // A (opaque)
// //                 }

// //                 console.log('ImageData prepared, putting image on canvas.');

// //                 // Render the image to the canvas
// //                 ctx.putImageData(imageData, 0, 0);
// //                 updateConsole('Image rendered to canvas.');

// //                 // Re-enable the render button after rendering is complete
// //                 document.getElementById('renderButton').disabled = false;
// //             }, 10); // Pause for 2000 milliseconds (2 seconds)
// //         });

// //         document.getElementById('setDefaultsButton').addEventListener('click', function() {
// //             // Set default values for camera options
// //             document.getElementById('camlf_x').value = 0; // Default x position
// //             document.getElementById('camlf_y').value = 10; // Default y position
// //             document.getElementById('camlf_z').value = 10; // Default z position
// //             document.getElementById('cam_vfov').value = 20; // Default vertical field of view

// //             // Set default values for image options
// //             document.getElementById('img_w').value = 200; // Default image width
// //             document.getElementById('img_ar').value = '16/9'; // Default aspect ratio
// //             document.getElementById('img_spp').value = 20; // Default samples per pixel

// //             // Set sphere default values
// //             document.getElementById('sph_x').value = 0;
// //             document.getElementById('sph_y').value = 1;
// //             document.getElementById('sph_z').value = 0;
// //             document.getElementById('sph_rad').value = 1;
// //         });
// //     },
// // };

// // function updateConsole(message) {
// //     const messageText = document.getElementById('general_message');
// //     messageText.textContent = message; // Append new message
// // }

// // // Function to update the objects list display
// // function updateObjectsList(objects_list) {
// //     const objectText = document.getElementById('objectText');
// //     objectText.innerHTML = objects_list.join('<br>'); // Use <br> for line breaks
// // }

// // document.getElementById('materialType').addEventListener('change', function() {
// //     const selectedMaterial = this.value;

// //     // Hide all material parameter sections initially
// //     document.getElementById('dielectricParams').style.display = 'none';
// //     document.getElementById('metalParams').style.display = 'none';
// //     document.getElementById('lambertianParams').style.display = 'none';

// //     // Show the relevant parameters based on the selected material
// //     if (selectedMaterial === 'dielectric') {
// //         document.getElementById('dielectricParams').style.display = 'block';
// //     } else if (selectedMaterial === 'metal') {
// //         document.getElementById('metalParams').style.display = 'block';
// //     } else if (selectedMaterial === 'lambertian') {
// //         document.getElementById('lambertianParams').style.display = 'block';
// //     }
// // });

document.addEventListener('keydown', (event) => {
    if (event.key === 'r') {
        console.log("The 'r' key was pressed!");
        Module.onRuntimeInitialized(); // Call the function when 'r' is pressed
    }
});