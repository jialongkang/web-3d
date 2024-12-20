#ifndef CAMERA_H
#define CAMERA_H

#include "hittable.h"
#include "material.h"

// Camera class responsible for constructing and dispatching rays into the world, and
// using results to construct rendered image.

class camera {
  public: 
    
    // Public camera parameters

    double aspect_ratio = 1.0;  // Ratio of image width over height
    int    image_width  = 100;  // Rendered image width in pixel count
    int    image_height; // Declare image_height without initialization
    int samples_per_pixel = 10; // Count of random samples for each pixel
    int max_depth = 10; // Maximum number of ray bounces into scene
    color background; // Scene background color

    double vfov = 90; // Vertical view angle (field of view)
    point3 lookfrom = point3(0,0,0); // Point camera is looking from
    point3 lookat = point3(0,0,-1); // Point camera is looking at
    vec3 vup = vec3(0,1,0); // Camera-relative "up" direction

    double defocus_angle = 0; // Variation angle of rays through each pixel
    double focus_dist = 10; // Distance from camera lookfrom to plane of perfect focus

    void calculate_image_height() { // New function to calculate image height
        image_height = int(image_width / aspect_ratio);
        image_height = (image_height < 1) ? 1 : image_height;
    }

    std::vector<uint8_t> render(const hittable& world) {
        initialize();

        std::vector<uint8_t> pixel_data(image_width * image_height * 3);
        std::vector<std::vector<color>> pixel_buffer(image_height, std::vector<color>(image_width, color(0, 0, 0)));

        //std::cout << "P3\n" << image_width << ' ' << image_height << "\n255\n";

        for (int j = 0; j < image_height; j++) {
            std::cout << "\rScanlines remaining: " << (image_height - j) << ' ' << std::flush;
            for (int i = 0; i < image_width; i++) {
                color pixel_color(0,0,0);
                for (int sample = 0; sample < samples_per_pixel; sample++) { // Anti-aliasing
                    ray r = get_ray(i,j);
                    pixel_color += ray_color(r, max_depth, world); // Adds colors to average within pixel
                }
                //pixel_buffer[j][i] = pixel_samples_scale * pixel_color;
                //write_color(std::cout, pixel_samples_scale * pixel_color);

                // Scale by number of samples and apply gamma correction
                pixel_color *= pixel_samples_scale;

                auto r = linear_to_gamma(pixel_color.x());
                auto g = linear_to_gamma(pixel_color.y());
                auto b = linear_to_gamma(pixel_color.z());

                // Translate to [0, 255] range using clamping
                static const interval intensity(0.000, 0.999);
                int rbyte = static_cast<int>(255.999 * intensity.clamp(r));
                int gbyte = static_cast<int>(255.999 * intensity.clamp(g));
                int bbyte = static_cast<int>(255.999 * intensity.clamp(b));

                // Flattened index for the 1D array
                int index = (j * image_width + i) * 3;
                pixel_data[index]     = static_cast<uint8_t>(rbyte);
                pixel_data[index + 1] = static_cast<uint8_t>(gbyte);
                pixel_data[index + 2] = static_cast<uint8_t>(bbyte);
            }
        }

        std::cout << "\rDone.                 \n";
        return pixel_data;
    }

  private:

    // Private camera parameters
    
    double pixel_samples_scale; // Color scale factor for sum of pixel samples
    point3 center;         // Camera center
    point3 pixel00_loc;    // Location of pixel 0, 0
    vec3   pixel_delta_u;  // Offset to pixel to the right
    vec3   pixel_delta_v;  // Offset to pixel below
    vec3 u, v, w; // Camera frame basis vectors
    vec3 defocus_disk_u; // Defocus disk horizontal radius
    vec3 defocus_disk_v; // Defocus disk vertical radius

    void initialize() {
        pixel_samples_scale = 1.0 / samples_per_pixel;

        center = lookfrom;

        // Determine viewport dimensions.
        auto theta = degrees_to_radians(vfov);
        auto h = std::tan(theta/2);
        auto viewport_height = 2 * h * focus_dist;
        auto viewport_width = viewport_height * (double(image_width)/image_height);

        // Calculate u,v,w basis vectors for camera coordinate frame, setting -w as view direction
        w = unit_vector(lookfrom - lookat);
        u = unit_vector(cross(vup, w));
        v = cross(w, u);

        // Calculate the vectors across the horizontal and down the vertical viewport edges.
        auto viewport_u = viewport_width * u; // Vector across viewport horizontal edge
        auto viewport_v = viewport_height * -v;  // Vector down viewport vertical edge

        // Calculate the horizontal and vertical delta vectors from pixel to pixel.
        pixel_delta_u = viewport_u / image_width;
        pixel_delta_v = viewport_v / image_height;

        // Calculate the location of the upper left pixel.
        auto viewport_upper_left = center - (focus_dist * w) - viewport_u/2 - viewport_v/2;
        pixel00_loc = viewport_upper_left + 0.5 * (pixel_delta_u + pixel_delta_v);

        // Calculate camera defocus disk basis vectors.
        auto defocus_radius = focus_dist * std::tan(degrees_to_radians(defocus_angle / 2)); // Radius of a cone from camera to focus plane with angle defined
        defocus_disk_u = u * defocus_radius; // Normalized defocus disk vectors
        defocus_disk_v = v * defocus_radius;
    }

    ray get_ray(int i, int j) const{
        // Construct a camera ray originating from the defocus disk and directed at a randomly
        // sampled point around the pixel location i, j.

        auto offset = sample_square();
        auto pixel_sample = pixel00_loc                         
                            + ((i + offset.x()) * pixel_delta_u)
                            + ((j + offset.y()) * pixel_delta_v);
                            
        auto ray_origin = (defocus_angle <= 0 ) ? center : defocus_disk_sample();
        auto ray_direction = pixel_sample - ray_origin;
        auto ray_time = random_double();

        return ray(ray_origin, ray_direction, ray_time);
    }

    vec3 sample_square() const{
        // Returns vector to random point in the [-.5,-.5]-[+.5,+.5] unit square.
        return vec3(random_double() - 0.5, random_double() - 0.5, 0);
    }

    point3 defocus_disk_sample() const {
        // Returns a random point in the camera defocus disk
        auto p = random_in_unit_disk();
        return center + (p[0] * defocus_disk_u) + (p[1] * defocus_disk_v);
    }

    // color ray_color_nolight(const ray& r, int depth, const hittable& world) const {
    //     // If we've exceeded the ray bounce limit, no more light is gathered.
    //     if (depth <= 0)
    //         return color(0,0,0);

    //     hit_record rec;

    //     if (world.hit(r, interval(0.001, infinity), rec)) {
    //         ray scattered;
    //         color attenuation;
    //         if (rec.mat->scatter(r, rec, attenuation, scattered))
    //             return attenuation * ray_color(scattered, depth-1, world);
    //         return color(0,0,0);
    //     }

    //     vec3 unit_direction = unit_vector(r.direction());
    //     auto a = 0.5*(unit_direction.y() + 1.0);
    //     return (1.0-a)*color(1.0, 1.0, 1.0) + a*color(0.5, 0.7, 1.0);
    // }

    color ray_color(const ray& r, int depth, const hittable& world) const {
        // If we've exceeded the ray bounce limit, no more light is gathered.
        if (depth <= 0)
            return color(0,0,0);

        hit_record rec;

        // If the ray hits nothing, return the background color.
        if (!world.hit(r, interval(0.001, infinity), rec))
            return background;

        ray scattered;
        color attenuation;
        color color_from_emission = rec.mat->emitted(rec.u, rec.v, rec.p);

        if (!rec.mat->scatter(r, rec, attenuation, scattered))
            return color_from_emission;

        color color_from_scatter = attenuation * ray_color(scattered, depth-1, world);

        return color_from_emission + color_from_scatter;
    }
};

#endif