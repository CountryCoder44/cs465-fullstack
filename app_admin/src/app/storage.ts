import { InjectionToken } from '@angular/core';

// Wraps the browser's localStorage in an injection token so services depend
// on an abstraction rather than the global window object - this keeps them
// testable and safe to run where there is no browser (e.g. SSR).
export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage
});
