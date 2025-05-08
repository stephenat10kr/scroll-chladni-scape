
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

        // Expanded parameter ranges for more dramatic changes
        vec4 s1 = vec4(0.5, 0.5, 0.5, 1.0);
        vec4 s2 = vec4(-8.0, 8.0, 8.0, 9.0);

        // Exaggerate scroll effect by amplifying u_xy.y (the scroll position)
        float scrollFactor = pow(u_xy.y * 2.0, 2.0); // Square the value for non-linear response
        
        // Create more dramatic time variation
        float tx = sin(u_time * 0.2) * 0.15; 
        float ty = cos(u_time * 0.3) * 0.15;

        // Amplify parameter variation based on scroll
        float a = mix(s1.x, s2.x, clamp(u_xy.x + tx + scrollFactor, 0.0, 1.0));
        float b = mix(s1.y, s2.y, clamp(u_xy.x + tx + scrollFactor * 0.8, 0.0, 1.0));
        float n = mix(s1.z, s2.z, clamp(u_xy.y + ty + scrollFactor * 1.2, 0.0, 1.0));
        float m = mix(s1.w, s2.w, clamp(u_xy.y + ty + scrollFactor, 0.0, 1.0));

        // Create a secondary pattern with different parameters that becomes more visible with scrolling
        float amp1 = a * sin(PI * n * p.x) * sin(PI * m * p.y) +
                     b * sin(PI * m * p.x) * sin(PI * n * p.y);
        
        float amp2 = b * sin(PI * (n+2.0) * p.y) * sin(PI * (m-1.0) * p.x) + 
                     a * sin(PI * (m+2.0) * p.y) * sin(PI * (n-1.0) * p.x);
        
        // Blend between patterns based on scroll position
        float amp = mix(amp1, amp2, scrollFactor);
                
        // Create more defined, high-contrast pattern edges
        float threshold = 0.05 + 0.05 * sin(scrollFactor * PI);
        float col = 1.0 - smoothstep(abs(amp), 0.0, threshold);
        
        // Add subtle color variation based on scroll position
        vec3 color = vec3(col);
        if (scrollFactor > 0.5) {
          // Shift color subtly as user scrolls past midpoint
          color = vec3(col, col * (1.0 - (scrollFactor - 0.5) * 0.4), col * (1.0 - (scrollFactor - 0.5) * 0.7));
        }
        
        gl_FragColor = vec4(color, 1.0);
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
    
    // Function to update scroll-based XY values with exaggerated effect
    const updateScrollXY = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Enhanced scroll normalization - creates more dramatic changes as you scroll
      // Apply easing function for more dynamic effect
      let yNorm = scrollHeight > 0 ? scrollY / scrollHeight : 0;
      
      // Apply a non-linear curve to the scroll value for more dramatic changes
      // This will make the middle part of the scroll change faster than the start/end
      yNorm = Math.pow(yNorm, 1.5) * (1.0 - yNorm) + Math.pow(yNorm, 2.5);
      
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
