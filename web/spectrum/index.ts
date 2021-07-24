const frag_source = /* glsl */ `
  precision lowp float;

  varying vec2 tex_coord;

  uniform sampler2D spectrum_data;

  void main() {
    gl_FragColor = texture2D(spectrum_data, tex_coord);
  }
`;

const vert_source = /* glsl */ `
  precision lowp float;

  attribute vec2 coord;
  varying vec2 tex_coord;

  void main() {
    tex_coord = coord;
    gl_Position = vec4(coord, 0, 1);
  }
`;

export interface SpectrumOptions {
  max_freq: number;
  max_time: number;
}

export function spectrum_create({ max_freq, max_time }: SpectrumOptions) {
  const canvas = document.createElement('canvas');

  const gl = canvas.getContext('webgl2', {
    alpha: false,
    antialias: false,
  });

  if (!gl) {
    throw new Error('Could not get webgl2');
  }

  const program = gl.createProgram();
  if (!program) throw new Error('Could not create a program');

  {
    const shader = gl.createShader(gl.VERTEX_SHADER);
    if (!shader) throw new Error('Could not create a vertex shader');
    gl.shaderSource(shader, vert_source);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
  }
  {
    const shader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!shader) throw new Error('Could not create a fragment shader');
    gl.shaderSource(shader, frag_source);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
  }

  gl.linkProgram(program);
  gl.useProgram(program);

  const coord_buf = gl.createBuffer();
  const coord_ptr = gl.getAttribLocation(program, 'coord');
  gl.bindBuffer(gl.ARRAY_BUFFER, coord_buf);
  gl.enableVertexAttribArray(coord_ptr);
  gl.vertexAttribPointer(coord_ptr, 2, gl.FLOAT, false, 0, 0);

  // screen rectangle
  // prettier-ignore
  const vertices = new Float32Array([
    -1, 1,
    1, 1,
    -1, -1,
    1, -1,
  ]);

  gl.bindBuffer(gl.ARRAY_BUFFER, coord_buf);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

  const spectrum_tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, spectrum_tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  gl.viewport(0, 0, canvas.width, canvas.height);

  return {
    canvas,
    draw(spectrum_data: Uint8Array): void {
      gl.clearColor(0, 0, 0, 1);

      gl.bindTexture(gl.TEXTURE_2D, spectrum_tex);
      gl.activeTexture(gl.TEXTURE0);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, max_time, max_freq, 0, gl.RGB, gl.UNSIGNED_BYTE, spectrum_data);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 2);
    },
  };
}
