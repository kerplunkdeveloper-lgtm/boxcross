import { useLayoutEffect, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();
  const isFirstLoad = useRef(true);

  useLayoutEffect(() => {
    // If navigation has an anchor hash or specific query focus, let targeted scroll handle it
    if (hash || search.includes('focus=12m')) return;

    // Instantly reset scroll to top on route change to prevent any visible down-to-top scrolling
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  // Track SPA route changes with Meta Pixel
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
