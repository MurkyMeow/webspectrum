import { spectrum_create } from './spectrum';

interface Core extends WebAssembly.Exports {
  memory: WebAssembly.Memory;
  c_allocate: (amount: number) => number;
  c_free: (pointer: number) => void;
  wav_get_bits_per_sample: (wav_ptr: number) => number;
  wav_get_sample_count: (wav_ptr: number) => number;
  wav_get_samples: (wav_ptr: number) => number;
  dft: (output_ptr: number, input_ptr: number, sample_count: number) => number;
}

const req = fetch('/core.wasm');

const imports = {
  env: {
    console_log: console.log,
    console_logc: console.log,
    console_logf: console.log,
  },
};

WebAssembly.instantiateStreaming(req, imports).then(({ instance }) => main(instance.exports as Core));

function main(core: Core) {
  const {
    memory: { buffer: c_memory },
    c_allocate,
    wav_get_bits_per_sample,
    wav_get_sample_count,
    wav_get_samples,
    dft,
  } = core;

  fetch('/static/200hz.wav')
    .then((res) => res.arrayBuffer())
    .then((file_buf) => {
      const file_size = file_buf.byteLength;

      const file_ptr = c_allocate(file_size);
      const file_array = new Uint8Array(c_memory, file_ptr, file_size);
      file_array.set(new Uint8Array(file_buf));

      // const sample_count = wav_get_sample_count(file_ptr);
      const sample_count = 1024;
      const bits_per_sample = wav_get_bits_per_sample(file_ptr);
      const samples_ptr = wav_get_samples(file_ptr);

      const frequencies_ptr = c_allocate(sample_count * bits_per_sample);
      const frequencies = new Float32Array(c_memory, frequencies_ptr, sample_count);

      dft(frequencies_ptr, samples_ptr, sample_count);

      const spectrum = spectrum_create({
        max_freq: sample_count / 2,
        max_time: sample_count / 2,
      });
      const spectrum_data = new Uint8Array(sample_count * sample_count);
      for (let i = 0; i < sample_count; i += 2) {
        spectrum_data[i] = i;
        spectrum_data[i + 1] = frequencies[i];
      }
      spectrum.draw(spectrum_data);
      document.body.appendChild(spectrum.canvas);

      console.log(frequencies);
    });
}
