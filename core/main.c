#include "stdlib.h"

// exported to js
void* c_allocate(int amount) {
  return malloc(amount);
}
void c_free(void* pointer) {
  free(pointer);
}
