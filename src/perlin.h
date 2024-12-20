#ifndef PERLIN_H
#define PERLIN_H

#include "rtweekend.h"

class perlin {
    public:
        perlin() {
            // Initialize random values
            for (int i = 0; i < point_count; i++) {
                randvec[i] = unit_vector(vec3::random(-1,1));
                // randfloat[i] = random_double();
            }
            // Create permutation tables
            perlin_generate_perm(perm_x);
            perlin_generate_perm(perm_y);
            perlin_generate_perm(perm_z);
        }
    
        double noise(const point3& p) const {
            // Get fractional components (0-1) for interpolation
            auto u = p.x() - std::floor(p.x());
            auto v = p.y() - std::floor(p.y());
            auto w = p.z() - std::floor(p.z());

            // Get integer coordinates of the cube we're in
            auto i = int(std::floor(p.x()));
            auto j = int(std::floor(p.y()));
            auto k = int(std::floor(p.z()));
            
            vec3 c[2][2][2];  // Will store values for the 8 corners

            // Fill the corner values using hash function
            for (int di=0; di < 2; di++)
                for (int dj=0; dj < 2; dj++)
                    for (int dk=0; dk < 2; dk++)
                        c[di][dj][dk] = randvec[
                            perm_x[(i+di) & 255] ^
                            perm_y[(j+dj) & 255] ^
                            perm_z[(k+dk) & 255]
                        ];

            // Interpolate between the corner values
            return perlin_interp(c, u, v, w);
            // return trilinear_interp(c, u, v, w);
        }

        double turb(const point3& p, int depth) const {
            auto accum = 0.0;
            auto temp_p = p;
            auto weight = 1.0;

            for (int i = 0; i < depth; i++) {
                accum += weight * noise(temp_p);
                weight *= 0.5;
                temp_p *= 2;
            }
            return std::fabs(accum);
        }

    private:
        static const int point_count = 256;  // Size of the noise lattice
        vec3 randvec[point_count]; // Random vector for noise
        // double randfloat[point_count];       // Random values for noise
        int perm_x[point_count];             // Permutation tables for x,y,z
        int perm_y[point_count];             // These help create randomness
        int perm_z[point_count];             // while maintaining consistency

        static void perlin_generate_perm(int* p) {
            // Initialize array with sequential values
            for (int i = 0; i < point_count; i++)
                p[i] = i;
            // Shuffle the array
            permute(p, point_count);
        }

        static void permute(int* p, int n) {
            // Fisher-Yates shuffle algorithm
            for (int i = n-1; i > 0; i--) {
                int target = random_int(0, i);
                int tmp = p[i];
                p[i] = p[target];
                p[target] = tmp;
            }
        }

        static double trilinear_interp(double c[2][2][2], double u, double v, double w) {
            // c[2][2][2] represents the 8 corners of a cube
            // u, v, w are the fractional distances along x, y, z axes (always between 0 and 1)
            
            auto accum = 0.0;
            for (int i=0; i < 2; i++)
                for (int j=0; j < 2; j++)
                    for (int k=0; k < 2; k++)
                        accum += (i*u + (1-i)*(1-u))     // x-axis interpolation weight
                              * (j*v + (1-j)*(1-v))      // y-axis interpolation weight
                              * (k*w + (1-k)*(1-w))      // z-axis interpolation weight
                              * c[i][j][k];              // value at corner (i,j,k)
            return accum;
        }

        static double perlin_interp(const vec3 c[2][2][2], double u, double v, double w) {
            auto uu = u*u*(3-2*u);
            auto vv = v*v*(3-2*v);
            auto ww = w*w*(3-2*w);
            auto accum = 0.0;

            for (int i=0; i < 2; i++)
                for (int j=0; j < 2; j++)
                    for (int k=0; k < 2; k++) {
                        vec3 weight_v(u-i, v-j, w-k);
                        accum += (i*uu + (1-i)*(1-uu))
                            * (j*vv + (1-j)*(1-vv))
                            * (k*ww + (1-k)*(1-ww))
                            * dot(c[i][j][k], weight_v);
                    }

            return accum;
        }
};

#endif