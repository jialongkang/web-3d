var Module = {
    onRuntimeInitialized: function() {
       var objects_list = [];

        Module.initializeGround();

        Module.addSphere_v2(sph_x, sph_y, sph_z, sph_rad, mat_type, mat_params);
        updateConsole('Sphere added.');

        Module.resetWorld();
        Module.initializeGround();

        const canvas = document.getElementById('myCanvas');
        const ctx = canvas.getContext('2d');
        const width = img_w, height = img_h;
          
        ctx.clearRect(0, 0, width, height);

        setTimeout(() => {

            const pixelData = Module.simple_render(camlf_x, camlf_y, camlf_z, 
                                                cam_vfov, width, img_ar, img_spp
            );
            // Set the canvas dimensions
            canvas.width = width;
            canvas.height = height;
            console.log('Canvas dimensions set to:', width, height);
            console.log('Pixel data received of size :', Module.vector_size(pixelData)); // Print the contents of the pixel data

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
            updateConsole('Image rendered to canvas.');
        }, 10); // Pause for 2000 milliseconds (2 seconds)
    }
};
