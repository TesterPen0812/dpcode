// FILE: virtualKeyboardInset.ts
// Purpose: Expose the on-screen (virtual) keyboard height as a CSS variable so
//          the composer can stay pinned above the keyboard on mobile browsers.
// Layer: Web shell bootstrap
// Notes:
//   - Modern Chrome/Android can resize the layout viewport via the
//     `interactive-widget=resizes-content` viewport hint (set in index.html),
//     but iOS Safari does not. There, the VisualViewport API is the only
//     reliable signal, so we mirror its offset into `--keyboard-inset-bottom`.
//   - The variable is `0px` whenever no keyboard is shown (and on desktop),
//     making every consumer a no-op outside mobile.

const KEYBOARD_INSET_VAR = "--keyboard-inset-bottom";

export function installVirtualKeyboardInsetTracking(): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const root = document.documentElement;
  root.style.setProperty(KEYBOARD_INSET_VAR, "0px");

  const viewport = window.visualViewport;
  if (!viewport) return;

  let frame = 0;

  const update = () => {
    frame = 0;
    // The keyboard reduces the visual viewport from the bottom. The inset is the
    // gap between the layout-viewport bottom and the visual-viewport bottom.
    const inset = Math.max(
      0,
      window.innerHeight - (viewport.height + viewport.offsetTop),
    );
    // Ignore sub-pixel jitter and the small offset from browser chrome.
    const value = inset > 24 ? Math.round(inset) : 0;
    root.style.setProperty(KEYBOARD_INSET_VAR, `${value}px`);
  };

  const schedule = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(update);
  };

  viewport.addEventListener("resize", schedule);
  viewport.addEventListener("scroll", schedule);
  update();
}
