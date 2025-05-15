
# Chladni ScrollJack

A React component package that combines a beautiful Chladni pattern background with smooth scrolljacking functionality.

## Installation

1. Copy the entire `exports` directory to your project
2. Also copy these required files:
   - `src/components/ExportableChladniPattern.tsx`
   - `src/components/ScrollJackContainer.tsx`
   - `src/components/scroll-jack/` (entire directory)
   - `src/lib/utils.ts` (for the `cn` utility)

## Basic Usage

```tsx
import { ChladniScrollJack, Section } from './exports';

const YourPage = () => {
  return (
    <ChladniScrollJack titles={["First Section", "Second Section", "Third Section"]}>
      {/* Section 1 */}
      <Section>
        <h2 className="text-3xl font-bold text-white mb-6">First Section Content</h2>
        <p className="text-white text-xl">Your content here...</p>
      </Section>
      
      {/* Section 2 */}
      <Section>
        <h2 className="text-3xl font-bold text-white mb-6">Second Section Content</h2>
        <p className="text-white text-xl">More content here...</p>
      </Section>
      
      {/* Section 3 */}
      <Section>
        <h2 className="text-3xl font-bold text-white mb-6">Third Section Content</h2>
        <p className="text-white text-xl">Final content here...</p>
      </Section>
    </ChladniScrollJack>
  );
};
```

## Advanced Usage

### Using Just the Chladni Background

If you only want the animated background without scrolljacking:

```tsx
import { ExportableChladniPattern } from './exports';

const YourPage = () => {
  return (
    <ExportableChladniPattern>
      {/* Your regular content here */}
      <div className="container mx-auto py-20 px-4 min-h-screen">
        <h1 className="text-5xl font-bold mb-8 text-white">Your Content</h1>
        <p className="text-xl text-white">
          This will have the animated background without scrolljacking behavior.
        </p>
      </div>
    </ExportableChladniPattern>
  );
};
```

### Styling Tips

- The background is black with white patterns
- Use text colors that contrast well (white works best)
- Add `backdrop-blur-sm` and background with opacity (like `bg-white/10`) to make content sections more readable

## Required Dependencies

- React 18+
- Tailwind CSS

## Customization

To customize the Chladni pattern:
- Edit the shader parameters in `ExportableChladniPattern.tsx`
- Main visual parameters are in the `s1` and `s2` vectors
