
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
      
      // Simplex 2D noise function
      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
          dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }
      
      void main(void) {
        const float PI = 3.14159265;
        vec2 p = (2.0 * gl_FragCoord.xy - u_resolution) / u_resolution.y;

        // Use more complex parameter set with organic variation
        // Scroll position affects several parameters
        float scroll = u_xy.y;
        
        // Create organic variation with time and noise
        float noiseTime = snoise(vec2(u_time * 0.05, scroll * 0.2)) * 0.5;
        
        // Base parameters that evolve with scroll
        float a = mix(0.5, 5.0, scroll * 0.7 + noiseTime);
        float b = mix(2.0, 4.5, (1.0-scroll) * 0.8 + snoise(vec2(u_time * 0.1, 0.3)));
        float n = mix(1.0, 6.0, snoise(vec2(u_time * 0.07, scroll + 0.5)) * 0.5 + 0.5);
        float m = mix(1.0, 5.0, snoise(vec2(scroll, u_time * 0.03)) * 0.5 + 0.5);
        
        // Time-based rotation for added dynamism
        float angle = u_time * 0.1 + scroll * PI;
        mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
        vec2 rotatedP = rotation * p;
        
        // Multiple overlapping patterns with different frequencies
        float pattern1 = a * sin(PI * n * rotatedP.x) * sin(PI * m * rotatedP.y);
        float pattern2 = b * sin(PI * m * 0.8 * p.x) * sin(PI * n * 1.2 * p.y);
        
        // Blend patterns based on noise and scroll
        float blendFactor = snoise(vec2(u_time * 0.02, scroll * 0.5)) * 0.5 + 0.5;
        float amp = mix(pattern1, pattern2, blendFactor);
        
        // Add turbulence based on position and time
        amp += snoise(p * 3.0 + u_time * 0.1) * 0.2 * scroll;
        
        // Adjustable threshold with organic edges
        float edgeNoise = snoise(p * 5.0 + vec2(u_time * 0.03, scroll)) * 0.05;
        float threshold = 0.1 + 0.05 * sin(u_time * 0.2) + edgeNoise;
        
        // Smoothstep for organic transitions
        float col = 1.0 - smoothstep(abs(amp), 0.0, threshold);
        
        // Color variation
        vec3 baseColor = vec3(0.9, 0.9, 1.0); // Slight blue tint
        vec3 accentColor = vec3(0.8, 0.9, 1.0); // More blue
        vec3 finalColor = mix(baseColor, accentColor, scroll);
        
        gl_FragColor = vec4(finalColor * col, 1.0);
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
    
    // Function to update scroll-based XY values
    const updateScrollXY = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const yNorm = scrollHeight > 0 ? scrollY / scrollHeight : 0;
      
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
      
      // Log scroll position occasionally (not every frame to avoid console spam)
      if (Math.random() < 0.01) {
        console.log(`Scroll updated: ${scrollY}, normalized: ${yNorm}`);
      }
      
      frameId = requestAnimationFrame(updateScrollXY);
    };
    
    // Start rendering
    console.log('Starting render loop with scroll-based morphing');
    updateScrollXY();
    
    return () => {
      console.log('Cleaning up WebGL resources');
      window.removeEventListener('resize', resizeCanvas);
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
