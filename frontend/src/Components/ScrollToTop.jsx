import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

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

  return null;
};

export default ScrollToTop;
