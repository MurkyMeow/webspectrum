export async function spectrum_create_canvas(): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');

  const gl = canvas.getContext('webgl2', {
    alpha: false,
    antialias: false,
  });

  if (!gl) {
    throw new Error('Could not get webgl2');
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());

  const program = gl.createProgram();
  if (!program) throw new Error('Could not create a program');

  {
    const shader = gl.createShader(gl.VERTEX_SHADER);
    if (!shader) throw new Error('Could not create a vertex shader');
    const source = await fetch('/vert.glslx').then((r) => r.text());
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
  }
  {
    const shader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!shader) throw new Error('Could not create a fragment shader');
    const source = await fetch('/frag.glslx').then((r) => r.text());
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
  }

  gl.linkProgram(program);
  gl.useProgram(program);

  {
    const coord_ptr = gl.getAttribLocation(program, 'coord');
    gl.enableVertexAttribArray(coord_ptr);
    gl.vertexAttribPointer(coord_ptr, 2, gl.FLOAT, false, 0, 0);
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0, 0, 0, 1);

  // prettier-ignore
  const vertices = new Float32Array([
    -1, 1,
    1, 1,
    -1, -1,
    1, -1,
  ]);

  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

  return canvas;
}
