'use client';

import { useEffect, useRef, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ShaderType = 'winamp' | 'liquid' | 'neon-grid' | 'aurora';

const SHADERS: Record<ShaderType, string> = {
  'winamp': `
    precision mediump float;
    uniform vec2 resolution;
    uniform vec2 mouse;
    uniform float time;
    uniform float scroll;

    vec3 palette(float t) {
      vec3 a = vec3(0.5, 0.5, 0.5);
      vec3 b = vec3(0.5, 0.5, 0.5);
      vec3 c = vec3(1.0, 1.0, 1.0);
      vec3 d = vec3(0.563, 0.416, 0.457);
      return a + b * cos(6.28318 * (c * t + d));
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
      vec2 uv0 = uv;
      vec3 finalColor = vec3(0.0);

      for (float i = 0.0; i < 3.0; i++) {
        uv = fract(uv * 1.5) - 0.5;
        
        float d = length(uv) * exp(-length(uv0));
        
        vec3 col = palette(length(uv0) + i * 0.4 + time * 0.4 + scroll * 0.2);
        
        d = sin(d * 8.0 + time + mouse.x * 3.14159) / 8.0;
        d = abs(d);
        d = pow(0.01 / d, 1.2);
        
        finalColor += col * d;
      }
      
      float vignette = 1.0 - length(uv0) * 0.3;
      finalColor *= vignette;
      float fadeAmount = 1.0 - (scroll * 0.5);
      finalColor *= fadeAmount;
      
      gl_FragColor = vec4(finalColor, 0.15);
    }
  `,
  'liquid': `
    precision mediump float;
    uniform vec2 resolution;
    uniform vec2 mouse;
    uniform float time;
    uniform float scroll;

    void main() {
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      uv.x *= resolution.x / resolution.y;
      
      vec2 p = uv - vec2(0.5);
      
      float d = length(p);
      float angle = atan(p.y, p.x);
      
      float flow = sin(d * 10.0 - time * 2.0 + mouse.x * 5.0);
      float wave = cos(angle * 5.0 + time + mouse.y * 5.0);
      
      vec3 color = vec3(0.5 + 0.5 * sin(time + uv.xyx + vec3(0, 2, 4)));
      color += vec3(flow * wave) * 0.2;
      
      // Interaction
      float mouseDist = length(uv - mouse);
      color += vec3(0.1 / mouseDist) * vec3(0.2, 0.4, 1.0);
      
      gl_FragColor = vec4(color, 0.2);
    }
  `,
  'neon-grid': `
    precision mediump float;
    uniform vec2 resolution;
    uniform vec2 mouse;
    uniform float time;
    uniform float scroll;

    void main() {
      vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
      
      // Grid using smoothstep instead of fwidth
      vec2 gridUV = fract(uv * 5.0 + scroll) - 0.5;
      float gridX = smoothstep(0.48, 0.5, abs(gridUV.x));
      float gridY = smoothstep(0.48, 0.5, abs(gridUV.y));
      float gridPattern = max(gridX, gridY);
      
      // Color
      vec3 color = vec3(0.1, 0.0, 0.2);
      color += vec3(0.5, 0.0, 1.0) * gridPattern;
      
      // Mouse glow
      float d = length(uv - (mouse * 2.0 - 1.0));
      color += vec3(0.0, 0.5, 1.0) * (0.2 / d);
      
      gl_FragColor = vec4(color, 0.3);
    }
  `,
  'aurora': `
    precision mediump float;
    uniform vec2 resolution;
    uniform vec2 mouse;
    uniform float time;
    uniform float scroll;

    void main() {
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      
      float t = time * 0.5;
      
      vec3 color = vec3(0.0);
      
      for(float i = 1.0; i < 4.0; i++) {
        uv.y += sin(uv.x * 3.0 + t * i + mouse.x) * 0.1;
        float intensity = 0.5 / abs(uv.y - 0.5);
        color += vec3(0.1 * i, 0.05 * i, 0.2 * i) * intensity;
      }
      
      gl_FragColor = vec4(color, 0.2);
    }
  `,
};

export function WebGLBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const scrollRef = useRef(0);
  const [activeShader, setActiveShader] = useState<ShaderType>('winamp');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const gl = canvas.getContext('webgl');
    if (!gl) {
      return;
    }

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    // Vertex shader
    const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Compile shaders
    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) {
        return null;
      }
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(SHADERS[activeShader], gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) {
      return;
    }

    // Create program
    const program = gl.createProgram();
    if (!program) {
      return;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Set up geometry
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const resolutionLocation = gl.getUniformLocation(program, 'resolution');
    const mouseLocation = gl.getUniformLocation(program, 'mouse');
    const timeLocation = gl.getUniformLocation(program, 'time');
    const scrollLocation = gl.getUniformLocation(program, 'scroll');

    // Mouse movement handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: 1 - e.clientY / window.innerHeight,
      };
    };

    // Scroll handler
    const handleScroll = () => {
      scrollRef.current = Math.min(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight), 1);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    // Animation loop
    let animationId: number;
    const startTime = Date.now();

    const render = () => {
      const time = (Date.now() - startTime) / 1000;

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform2f(mouseLocation, mouseRef.current.x, mouseRef.current.y);
      gl.uniform1f(timeLocation, time);
      gl.uniform1f(scrollLocation, scrollRef.current);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationId);
      gl.deleteProgram(program);
    };
  }, [activeShader]);

  return (
    <>
      <canvas ref={canvasRef} className="webgl-canvas pointer-events-none fixed inset-0 z-0" />
      <div className="bg-background/80 border-border fixed right-4 bottom-4 z-50 rounded-lg border p-2 shadow-lg backdrop-blur-md">
        <Select value={activeShader} onValueChange={v => setActiveShader(v as ShaderType)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select Shader" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="winamp">Winamp</SelectItem>
            <SelectItem value="liquid">Liquid</SelectItem>
            <SelectItem value="neon-grid">Neon Grid</SelectItem>
            <SelectItem value="aurora">Aurora</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
