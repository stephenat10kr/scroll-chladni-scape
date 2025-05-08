
# Chladni Pattern Background Component

This file contains instructions on how to add the Chladni Pattern background to another Lovable project.

## How to Use

1. **Copy the Component File**: 
   Copy the entire `ExportableChladniPattern.tsx` file to your target project's `src/components/` directory.

2. **Import and Use**:
   ```tsx
   import ExportableChladniPattern from '@/components/ExportableChladniPattern';

   const YourPage = () => {
     return (
       <ExportableChladniPattern>
         {/* Your page content goes here */}
         <div className="container mx-auto py-20 px-4">
           <h1 className="text-4xl text-white">Your Content</h1>
           {/* Add more content */}
         </div>
       </ExportableChladniPattern>
     );
   };

   export default YourPage;
   ```

3. **Styling Tips**:
   - The background is black with white patterns
   - Use text colors that contrast well (white works best)
   - Add `backdrop-blur-sm` and background with opacity (like `bg-white/10`) to make content sections more readable

## Customization

To customize the pattern:
- Edit the shader parameters in the `fragmentShaderSource` variable inside `ExportableChladniPattern.tsx`
- The main visual parameters are in the `s1` and `s2` vectors
- Current values: `s1 = vec4(4.0, 4.0, 1.0, 4.0)` and `s2 = vec4(-3.0, 2.0, 4.0, 2.6)`

## Notes

- The component uses WebGL for rendering
- It occupies the full viewport as a fixed position background
- The pattern changes based on scroll position
- All content should be placed as children of the component
