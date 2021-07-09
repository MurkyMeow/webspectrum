typedef char file_t;

inline int read_int32(file_t* file) {
  return file[0] | (file[1] << 8) | (file[2] << 16) | (file[3] << 24);
}

inline short read_int16(file_t* file) {
  return file[0] | (file[1] << 8);
}

// wav file reference: http://soundfile.sapp.org/doc/WaveFormat

typedef struct {
  int sample_rate;
  int sample_count;
  const char* data;
} wav_t;

short wav_get_bits_per_sample(file_t* file) {
  return read_int16(file + 34);
}

int wav_get_sample_count(file_t* file) {
  return read_int32(file + 40);
}

file_t* wav_get_samples(file_t* file) {
  return file + 44;
}
