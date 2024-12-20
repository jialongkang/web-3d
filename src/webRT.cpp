#include <emscripten/bind.h>
#include <iostream>
#include "rtweekend.h"
#include "camera.h"
#include "hittable.h"
#include "hittable_list.h"
#include "sphere.h"
#include "material.h"
#include "bvh.h"
#include "texture.h"
#include "quad.h"
#include "constant_medium.h"
#include <vector>
#include <initializer_list>
#include <emscripten/val.h>

using namespace emscripten;

hittable_list world;
camera cam;

void resetWorld() {
    world.clear();
}

int calculateHeight(int image_width, float aspect_ratio) {
    int image_height;
    image_height = int(image_width / aspect_ratio);
    image_height = (image_height < 1) ? 1 : image_height;
    return image_height;
}

void initializeGround () {
    auto checker = make_shared<checker_texture>(0.32, color(0.2, 0.3, 0.1), color(0.9,0.9,0.9));
    // auto ground_material = make_shared<lambertian>(color(0.5, 0.5, 0.5));
    world.add(make_shared<sphere>(point3(0,-1000,0), 1000, make_shared<lambertian>(checker)));
}

void addSphere (float x, float y, float z, float rad) {
    auto material3 = make_shared<metal>(color(0.7, 0.6, 0.5), 0.0);
    world.add(make_shared<sphere>(point3(x,y,z), rad, material3));
}

void addSphere_v2 (float x, float y, float z, float rad, std::string mat_type, std::vector<float> mat_params) {
    
    std::shared_ptr<material> material;

    if (mat_type == "metal") {
        // Assuming mat_params contains 2 values: color and fuzziness
        material = make_shared<metal>(color(mat_params[0], mat_params[1], mat_params[2]), mat_params[3]);
    } else if (mat_type == "lambertian") {
        // Assuming mat_params contains 3 values for color
        material = make_shared<lambertian>(color(mat_params[0], mat_params[1], mat_params[2]));
    } else if (mat_type == "dielectric") {
        // Assuming mat_params has 1 value for the effective refraction index
        material = make_shared<dielectric>(mat_params[0]);
    }

    world.add(make_shared<sphere>(point3(x,y,z), rad, material));
}

void addCube (double x, double y, double z, double size) {
    auto white = make_shared<lambertian>(color(.73, .73, .73));

    double half = size / 2.0;
    // Calculate the two opposite vertices
    double x1 = x - half;
    double y1 = y - half;
    double z1 = z - half;

    double x2 = x + half;
    double y2 = y + half;
    double z2 = z + half;

    shared_ptr<hittable> box1 = box(point3(x1,y1,z1), point3(x2,y2,z2), white); 
    world.add(box1);
}

void addCube_v2 (float x, float y, float z, float size, std::string mat_type, std::vector<float> mat_params) {

    double half = size / 2.0;
    // Calculate the two opposite vertices
    double x1 = x - half;
    double y1 = y - half;
    double z1 = z - half;

    double x2 = x + half;
    double y2 = y + half;
    double z2 = z + half;

    std::shared_ptr<material> material;

    if (mat_type == "metal") {
        // Assuming mat_params contains 2 values: color and fuzziness
        material = make_shared<metal>(color(mat_params[0], mat_params[1], mat_params[2]), mat_params[3]);
    } else if (mat_type == "lambertian") {
        // Assuming mat_params contains 3 values for color
        material = make_shared<lambertian>(color(mat_params[0], mat_params[1], mat_params[2]));
    } else if (mat_type == "dielectric") {
        // Assuming mat_params has 1 value for the effective refraction index
        material = make_shared<dielectric>(mat_params[0]);
    }

    shared_ptr<hittable> cube = box(point3(x1,y1,z1), point3(x2,y2,z2), material); 
    world.add(cube);
}

int camera_setup(
    int camlf_x, int camlf_y, int camlf_z,
    int camla_x, int camla_y, int camla_z,
    int cam_vfov, int img_w, float img_ar, int img_spp
    ){
        
    cam.aspect_ratio      = img_ar;
    cam.image_width       = img_w;
    cam.calculate_image_height();
    cam.samples_per_pixel = img_spp;
    cam.vfov     = cam_vfov;
    cam.lookfrom = point3(camlf_x,camlf_y,camlf_z);
    cam.lookat = point3(camla_x,camla_y,camla_z);

    cam.max_depth = 50;
    cam.background = color(0.70, 0.80, 1.00);
    cam.vup = vec3(0,1,0);
    cam.defocus_angle = 0.0;

    return cam.image_height;
}

std::vector<uint8_t> render() {

    //std::cout << "Camera created at: " << cam.lookfrom.x() << std::endl;
    std::vector<uint8_t> pixel_data = cam.render(world);

    return pixel_data;
}

// Define functions instead of using lambdas
void vector_push_back(std::vector<uint8_t>& v, float value) {
    v.push_back(static_cast<uint8_t>(value)); // Ensure value is cast to uint8_t
}

size_t vector_size(const std::vector<uint8_t>& v) {
    return v.size();
}

uint8_t vector_get(const std::vector<uint8_t>& v, size_t i) {
    return v[i];
}

// Define functions for std::vector<float>
void vector_push_back_float(std::vector<float>& v, float value) {
    v.push_back(value); // No need to cast, as value is already float
}

size_t vector_size_float(const std::vector<float>& v) {
    return v.size();
}

float vector_get_float(const std::vector<float>& v, size_t i) {
    return v[i];
}

std::vector<float> vector_make(emscripten::val jsArray) {
    std::vector<float> result;
    for (size_t i = 0; i < jsArray["length"].as<int>(); ++i) {
        result.push_back(jsArray[i].as<float>());
    }
    return result; // Return the vector
}

// Binding the function
EMSCRIPTEN_BINDINGS(my_module) {
    function("vector_push_back", &vector_push_back); // Updated to use the new function
    function("vector_size", &vector_size); // Updated to use the new function
    function("vector_get", &vector_get); // Updated to use the new function
    function("vector_make", &vector_make);
    function("initializeGround", &initializeGround);
    function("addSphere", &addSphere);
    function("render", &render);
    function("camera_setup", &camera_setup);
    function("resetWorld", &resetWorld);
    function("addSphere_v2", &addSphere_v2);
    function("calculateHeight", &calculateHeight);
    function("addCube", &addCube);
    function("addCube_v2", &addCube_v2);

    // Bind the std::vector<uint8_t> type
    class_<std::vector<uint8_t>>("VectorUint8")
        .constructor<>()
        .function("push_back", &vector_push_back)
        .function("size", &vector_size)
        .function("get", &vector_get);

    class_<std::vector<float>>("VectorFloat")
        .constructor<>()
        .function("push_back", &vector_push_back_float)
        .function("size", &vector_size_float)
        .function("get", &vector_get_float)
        .function("vector_make", &vector_make);

}