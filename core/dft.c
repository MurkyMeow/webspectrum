#include <math.h>

#include "imports.h"

void dft(float* output, const short* input, int sample_count) {
  float freq_scaling = M_PI * 2 / (float)sample_count;

  for (int k = 0; k < sample_count; k += 1) {
    float freq = freq_scaling * (float)k;
    float correlation = 0;

    for (int t = 0; t < sample_count; t += 1) {
      correlation += (float)input[t] * cosf(freq * (float)t);
    }

    output[k] = fabsf(correlation) / (float)sample_count;
  }
}
