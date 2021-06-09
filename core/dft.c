#include <math.h>

void dft(float* output, const int* input, int sample_count) {
  for (int k = 0; k < sample_count; k += 1) {
    float freq = M_PI * 2 * (float)k / (float)sample_count;
    float real = 0;

    for (int t = 0; t < sample_count; t += 1) {
      real += (float)input[t] * sinf(freq * (float)t);
    }

    output[k] += real;
  }
}
