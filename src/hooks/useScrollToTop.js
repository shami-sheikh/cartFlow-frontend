import { useEffect } from 'react';

export default function useScrollToTop(deps = []) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, deps);
}
