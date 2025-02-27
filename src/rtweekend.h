#ifndef RTWEEKEND_H
#define RTWEEKEND_H

#include <cmath>
#include <iostream>
#include <limits>
#include <memory>
#include <cstdlib> // for the random number generator function

// C++ Std Usings

using std::make_shared;
using std::shared_ptr;

// Constants

const double infinity = std::numeric_limits<double>::infinity();
const double pi = 3.1415926535897932385;

// Utility Functions

inline double degrees_to_radians(double degrees) {
    return degrees * pi / 180.0;
}

inline double random_double() {
    // Return random real number in [0,1]
    return std::rand() / (RAND_MAX + 1.0);
}

inline double random_double(double min, double max) {
    // Return random real number in [min, max]
    return min + (max-min)*random_double();
}

inline int random_int(int min, int max) {
    // Return random integer in [min, max]
    return int(random_double(min, max+1));
}

// Common headers

#include "color.h"
#include "interval.h"
#include "ray.h"
#include "vec3.h"

#endif