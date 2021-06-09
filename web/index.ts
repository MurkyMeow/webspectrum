interface Core extends WebAssembly.Exports {
  memory: WebAssembly.Memory;
  c_allocate: (amount: number) => number;
  c_free: (pointer: number) => void;
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
      const sample_count = 32;
      const samples_ptr = wav_get_samples(file_ptr);

      const frequencies_ptr = c_allocate(sample_count * Float32Array.BYTES_PER_ELEMENT);
      const frequencies = new Float32Array(c_memory, frequencies_ptr, sample_count);

      dft(frequencies_ptr, samples_ptr, sample_count);

      console.log(frequencies);
    });

  console.log(core);
}
