interface Core extends WebAssembly.Exports {
  test: () => number;
}

const req = fetch('/core.wasm');

const imports = {
  env: {},
};

WebAssembly.instantiateStreaming(req, imports).then(({ instance }) => main(instance.exports as Core));

function main(core: Core) {
  const { test } = core;

  console.log(test());
}
