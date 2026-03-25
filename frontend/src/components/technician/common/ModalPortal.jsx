/**
 * ModalPortal — renders children directly into document.body via a React portal.
 *
 * This ensures modal overlays are never clipped by a parent stacking context
 * created by `transform`, `will-change`, `filter`, `isolation`, etc.
 * (e.g. Framer Motion's AnimatedPage / AnimatedSection use will-change-transform
 * which would otherwise trap z-index values inside that context.)
 */

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const ModalPortal = ({ children }) => {
 const el = useRef(document.createElement('div'));

 useEffect(() => {
 const container = el.current;
 document.body.appendChild(container);
 return () => {
 document.body.removeChild(container);
 };
 }, []);

 return createPortal(children, el.current);
};

export default ModalPortal;
