import { useEffect } from "react";

// This hook detects clicks outside of the specified component and calls the provided handler function.
export default function useOnClickOutside(ref, handler) {
  useEffect(() => {
    // Define the listener function to be called on click/touch events
    const listener = (event) => {
      // If the click/touch event originated inside the ref element, do nothing
      //event.target --> where u clicked 
      // ref --> dropdown menu 
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      // Otherwise, call the provided handler function
      handler(event);
    };

    // Add event listeners for mousedown and touchstart events on the document
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    // Cleanup function to remove the event listeners when the component unmounts or when the ref/handler dependencies change
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]); // Only run this effect when the ref or handler function changes
}

// Inside my listener, I'll get an event (the click). How do I know if this click was inside my menu or outside?"

// Answer: "The component using this hook (the dropdown) needs to give me a ref (a 'pointer') to its main div."