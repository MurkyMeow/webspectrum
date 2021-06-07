#include "imports.h"
#include "stdlib.h"
#include "string.h"

typedef const char file_t;

void wav_parse_data(file_t* file) {
  console_logc(file[0]);
  console_logc(file[1]);
  console_logc(file[2]);
  console_logc(file[3]);
}
