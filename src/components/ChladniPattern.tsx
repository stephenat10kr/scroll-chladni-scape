
import React, { useEffect, useRef } from 'react';

interface ChladniPatternProps {
  children: React.ReactNode;
}

const ChladniPattern: React.FC<ChladniPatternProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    
    if (!container || !canvas) {
      console.error('Container or canvas not found');
      return;
    }
    
    // Initialize WebGL
    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }
    
    console.log('WebGL initialized successfully');
    
    // Set canvas size to match container
    const resizeCanvas = () => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      console.log(`Canvas resized to ${width} x ${height}`);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create shader program
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0, 1);
      }
    `;
    
    const fragmentShaderSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_xy;
      
      void main(void) {
        const float PI = 3.14159265;
        vec2 p = (2.0 * gl_FragCoord.xy - u_resolution) / u_resolution.y;

        vec4 s1 = vec4(1.0, 1.0, 1.0, 2.0);
        vec4 s2 = vec4(-4.0, 4.0, 4.0, 4.6);

        float tx = sin(u_time)*0.1; 
        float ty = cos(u_time)*0.1; 

        float a = mix(s1.x, s2.x, u_xy.x + tx);
        float b = mix(s1.y, s2.y, u_xy.x + tx);
        float n = mix(s1.z, s2.z, u_xy.y + ty);
        float m = mix(s1.w, s2.w, u_xy.y + ty);

        float amp = a * sin(PI * n * p.x) * sin(PI * m * p.y) +
                    b * sin(PI * m * p.x) * sin(PI * n * p.y);
        float col = 1.0 - smoothstep(abs(amp), 0.0, 0.1);
        gl_FragColor = vec4(vec3(col), 1.0);
      }
    `;
    
    // Compile shaders
    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      
      return shader;
    };
    
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) {
      console.error('Failed to create shaders');
      return;
    }
    
    // Create program
    const program = gl.createProgram();
    if (!program) return;
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      return;
    }
    
    // Set up buffers
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    const positions = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
       1.0,  1.0
    ]);
    
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    
    // Get attribute/uniform locations
    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeUniformLocation = gl.getUniformLocation(program, 'u_time');
    const xyUniformLocation = gl.getUniformLocation(program, 'u_xy');
    
    // Animation
    let startTime = Date.now();
    let frameId: number;
    let scrollY = window.scrollY || document.documentElement.scrollTop;
    let scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    let yNorm = scrollHeight > 0 ? scrollY / scrollHeight : 0;
    
    const render = () => {
      // Update scroll position
      scrollY = window.scrollY || document.documentElement.scrollTop;
      scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      yNorm = scrollHeight > 0 ? scrollY / scrollHeight : 0;
      
      const currentTime = Date.now();
      const elapsedTime = (currentTime - startTime) / 1000; // Convert to seconds
      
      // Clear and set viewport
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      // Use the program
      gl.useProgram(program);
      
      // Set uniforms
      gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
      gl.uniform1f(timeUniformLocation, elapsedTime);
      gl.uniform2f(xyUniformLocation, 0.5, yNorm);
      
      // Set up attributes
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
      
      // Draw
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      
      frameId = requestAnimationFrame(render);
    };
    
    // Listen for scroll events
    const handleScroll = () => {
      scrollY = window.scrollY || document.documentElement.scrollTop;
      scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      yNorm = scrollHeight > 0 ? scrollY / scrollHeight : 0;
      console.log(`Scroll updated: ${scrollY}, normalized: ${yNorm}`);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Start rendering
    console.log('Starting render loop');
    render();
    
    return () => {
      console.log('Cleaning up WebGL resources');
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(frameId);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-screen"
      style={{ position: 'relative' }}
    >
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default ChladniPattern;
