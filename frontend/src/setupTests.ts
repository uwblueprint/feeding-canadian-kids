// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
// We'll disable eslint for this line since this library doesn't actually
// need to be included in the bundle, even though we're importing it in a
// "normal .ts file."
// eslint-disable-next-line import/no-extraneous-dependencies
import "@testing-library/jest-dom";

// To fix issue in some tests with not finding "matchMedia"
// https://stackoverflow.com/questions/39830580/jest-test-fails-typeerror-window-matchmedia-is-not-a-function
// https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
// https://github.com/facebook/create-react-app/issues/10126
Object.defineProperty(window, "matchMedia", {
  writable: true,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  value: (query: any) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});
