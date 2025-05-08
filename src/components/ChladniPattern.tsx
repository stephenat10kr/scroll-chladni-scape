
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
      uniform float u_scrollY; // Add scroll position as uniform
      
      void main(void) {
        // Constants
        const float PI = 3.14159265;
        vec2 p = (2.0 * gl_FragCoord.xy - u_resolution) / u_resolution.y;

        // Change pattern parameters based on scroll
        float scrollFactor = u_scrollY; // 0.0 to 1.0
        
        // Base parameters that change with scroll
        float a = 1.0 + 3.0 * scrollFactor; 
        float b = 1.0 + 3.0 * sin(scrollFactor * PI);
        float n = 1.0 + 3.0 * scrollFactor;
        float m = 2.0 + 2.6 * (1.0 - scrollFactor);
        
        // Add some time-based animation that varies with scroll
        float timeScale = mix(0.5, 2.0, scrollFactor);
        float timeOffset = u_time * timeScale;
        
        // Add oscillation that changes frequency with scroll
        a += 0.2 * sin(timeOffset);
        b += 0.2 * cos(timeOffset * 1.3);
        
        // Pattern rotation based on scroll
        float angle = scrollFactor * PI;
        vec2 rotated = vec2(
          p.x * cos(angle) - p.y * sin(angle),
          p.x * sin(angle) + p.y * cos(angle)
        );
        
        // Use both original and rotated coordinates with scroll-based mixing
        vec2 patternCoord = mix(p, rotated, scrollFactor * 0.8);
        
        // Calculate Chladni pattern
        float amp = a * sin(PI * n * patternCoord.x) * sin(PI * m * patternCoord.y) +
                   b * sin(PI * m * patternCoord.x) * sin(PI * n * patternCoord.y);
        
        // Color based on amplitude
        float threshold = 0.05 + 0.1 * scrollFactor; // Adjust line thickness
        float col = 1.0 - smoothstep(abs(amp), 0.0, threshold);
        
        // Add color variation based on scroll
        vec3 color = mix(
          vec3(1.0), // White at start
          vec3(0.8, 0.9, 1.0), // Slight blue at end
          scrollFactor
        );
        
        gl_FragColor = vec4(color * col, 1.0);
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
    const scrollYUniformLocation = gl.getUniformLocation(program, 'u_scrollY');
    
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
      gl.uniform1f(scrollYUniformLocation, yNorm);
      
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
