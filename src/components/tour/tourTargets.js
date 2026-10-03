const rects = {};
const listeners = new Set();

export const setTourTarget = (id, rect) => {
  if (!id || !rect || rect.width <= 0 || rect.height <= 0) {
    return;
  }
  rects[id] = rect;
  listeners.forEach(listener => listener(id, rect));
};

export const getTourTarget = id => rects[id] || null;

export const subscribeTourTargets = listener => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
