#include <math.h>

#include "imports.h"

void dft(float* output, const short* input, int sample_count) {
  for (int k = 0; k < sample_count; k += 1) {
    float freq = M_PI * 2 * (float)k / (float)sample_count;
    float real = 0;
    float imag = 0;

    for (int t = 0; t < sample_count; t += 1) {
      float arg = freq * (float)t;
      real += (float)input[t] * cosf(arg);
      imag += -(float)input[t] * sinf(arg);
    }

    output[k] = sqrtf(real * real + imag * imag) / (float)sample_count;
  }
}
