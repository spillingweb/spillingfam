import { clsx, type ClassValue} from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Scrolls to the first element with a validation error in the form.
 * This looks for elements with aria-invalid="true" attribute.
 */
export function scrollToFirstError() {
  // Small delay to ensure DOM has updated with error states
  setTimeout(() => {
    // Find the first element with an error
    const firstErrorElement = document.querySelector<HTMLElement>(
      '[aria-invalid="true"]'
    );

    if (firstErrorElement) {
      // Scroll to the element
      firstErrorElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // Focus the input after scrolling (with a small delay for smooth scrolling)
      setTimeout(() => {
        if (typeof firstErrorElement.focus === "function") {
          firstErrorElement.focus();
        }
      }, 300);
    }
  }, 100);
}
