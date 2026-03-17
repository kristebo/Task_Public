/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
// Fallback JSX typings if React's intrinsic elements are not resolved.
// This should normally be unnecessary if @types/react is installed and tsconfig is correct.
// Included to unblock development; can be removed once root cause is fixed.
// Attempt to ensure React JSX types are available.
import 'react';
declare namespace JSX {
  interface IntrinsicElements {
    div: any;
    header: any;
    h1: any;
    nav: any;
    main: any;
    footer: any;
    span: any;
    section: any;
    input: any;
    p: any;
    article: any;
    code: any;
  }
}
export {};
