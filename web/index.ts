interface Core extends WebAssembly.Exports {
  memory: WebAssembly.Memory;
  c_allocate: (amount: number) => number;
  c_free: (pointer: number) => void;
  wav_parse_data: (data_pointer: number) => number;
}

const req = fetch('/core.wasm');

const imports = {
  env: {
    console_log: console.log,
    console_logf: console.log,
  },
};

WebAssembly.instantiateStreaming(req, imports).then(({ instance }) => main(instance.exports as Core));

function main(core: Core) {
  const {
    memory: { buffer: c_memory },
    c_allocate,
    wav_parse_data,
  } = core;

  fetch('/static/200hz.wav')
    .then((res) => res.arrayBuffer())
    .then((file_buf) => {
      const file_size = file_buf.byteLength;
      const file_array = new Uint8Array(file_buf);

      const file_pointer = c_allocate(file_size);
      const file_memory = new Uint8Array(c_memory, file_pointer, file_size);
      file_memory.set(file_array);

      wav_parse_data(file_pointer);
    });

  console.log(core);
}
