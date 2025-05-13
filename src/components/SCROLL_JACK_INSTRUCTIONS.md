
# Scroll Jack Component

This component provides a scroll-jacking experience where the user's normal scroll behavior is temporarily overridden to display a sequence of full-screen sections with animated transitions.

## How to Import

```tsx
import { ScrollJackContainer } from 'path-to-your-project/src/components/scroll-jack';
```

## Basic Usage

```tsx
<ScrollJackContainer
  titles={["First Section", "Second Section", "Third Section"]}
>
  {/* Section 1 */}
  <section className="min-h-screen flex items-center justify-center">
    <div>Content for first section</div>
  </section>

  {/* Section 2 */}
  <section className="min-h-screen flex items-center justify-center">
    <div>Content for second section</div>
  </section>

  {/* Section 3 */}
  <section className="min-h-screen flex items-center justify-center">
    <div>Content for third section</div>
  </section>
</ScrollJackContainer>
```

## Integration in a Page

You can place the ScrollJackContainer component anywhere in your page layout. Normal scrolling will work before and after the scroll-jacked sections:

```tsx
<div>
  {/* Normal scrolling content */}
  <div className="min-h-screen">
    Regular content that scrolls normally...
  </div>
  
  {/* ScrollJackContainer integrated in the middle of the page */}
  <ScrollJackContainer
    titles={["Title 1", "Title 2", "Title 3"]}
  >
    {/* Your scroll-jacked sections */}
    <section>...</section>
    <section>...</section>
    <section>...</section>
  </ScrollJackContainer>
  
  {/* More normal scrolling content */}
  <div className="min-h-screen">
    More regular content that scrolls normally...
  </div>
</div>
```

## Notes

- The component uses Intersection Observer to detect when it enters and exits the viewport
- The component will activate scroll-jacking only when it's visible in the viewport
- Normal scrolling behavior resumes after the last section or when scrolling out of view
- Works best with fullscreen sections (make sure to use `min-h-screen` for each section)
