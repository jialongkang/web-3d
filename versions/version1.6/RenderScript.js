var Module = {
    onRuntimeInitialized: function() {
        
        document.getElementById('renderButton').addEventListener('click', () => {
            console.log("Starting Raytracing Render...");
            // document.getElementById('loadingSpinner').style.display = 'block';

            if (!window.ready) {
                console.log("Scene not ready to render. Press B to get ready.");
                return;
            }
            
            Module.resetWorld(); 
            Module.initializeGround();
            
            const img_w = window.img_w; // Access the shared variable
            const img_ar = window.img_ar;  
            const img_spp = window.img_spp;
            const img_vfov = window.img_vfov;
            const cam_x = window.cam_x;
            const cam_y = window.cam_y;
            const cam_z = window.cam_z;
            const lookAt_x = window.lookAt_x;
            const lookAt_y = window.lookAt_y;
            const lookAt_z = window.lookAt_z;
            const objects_info = window.objects_info;
            console.log("Rendering objects list:", objects_info)
            
            const canvas = document.getElementById('mySecondCanvas');
            // Show the canvas when rendering starts
            canvas.style.display = 'block'; // Make the canvas visible
            // img_w = 400;
            // img_ar = 16.0/9.0;
            
            const img_h = Module.camera_setup(cam_x,cam_y,cam_z,
                                    lookAt_x,lookAt_y,lookAt_z,
                                    img_vfov,img_w,img_ar,img_spp);
        
            const ctx = canvas.getContext('2d');
            const width = img_w, height = img_h;
            
            canvas.width = width;
            canvas.height = height;
            
            console.log(objects_info);
            // Add spheres now
            for (let i = 0; i < objects_info.length; i++) {
                const [type_i, x_pos_i, y_pos_i, z_pos_i, obj_param_i, mat_type, mat_params_js] = objects_info[i];
                const mat_params_cpp = Module.vector_make(mat_params_js);
                if (type_i == "sphere") {
                    console.log("Adding V2 Object.")
                    Module.addSphere_v2(x_pos_i, y_pos_i, z_pos_i, obj_param_i, mat_type, mat_params_cpp);
                }
                if (type_i == "cube") {
                    console.log("Adding V2 Object.")
                    Module.addCube_v2(x_pos_i, y_pos_i, z_pos_i, obj_param_i, mat_type, mat_params_cpp);
                }
            }

            setTimeout(() => {
                const pixelData = Module.render();
                
                // Check dimensions of pixelData
                const expectedSize = width * height * 3; // 4 for RGBA
                console.log('Expected pixelData size:', expectedSize);
                console.log('Actual pixelData size:', Module.vector_size(pixelData)); // Print the contents of the pixel data

                // Set the canvas dimensions
                console.log('Canvas dimensions set to:', width, height);

                const imageData = ctx.createImageData(width, height);

                // Copy the RGB data into ImageData
                for (let i = 0, j = 0; i < Module.vector_size(pixelData); i += 3, j++) {
                imageData.data[j * 4] = Module.vector_get(pixelData, i);       // R
                imageData.data[j * 4 + 1] = Module.vector_get(pixelData, i+1); // G
                imageData.data[j * 4 + 2] = Module.vector_get(pixelData, i+2); // B
                imageData.data[j * 4 + 3] = 255;            // A (opaque)
                }

                console.log('ImageData prepared, putting image on canvas.');

                // Render the image to the canvas
                ctx.putImageData(imageData, 0, 0);
                document.getElementById('loadingSpinner').style.display = 'none';
                document.getElementById('resetButton').style.display = "block";
            });

            document.getElementById('resetButton').addEventListener('click', () => {
                ctx.clearRect(0, 0, width, height);
            });

        });
    }
};