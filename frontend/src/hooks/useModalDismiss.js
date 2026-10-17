import { useEffect } from 'react';

/**
 * Custom hook to manage modal accessibility:
 * - Dismisses modal when 'Escape' key is pressed.
 * - Locks background body scrolling while modal is active.
 */
export function useModalDismiss(isOpen, onClose) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
}
