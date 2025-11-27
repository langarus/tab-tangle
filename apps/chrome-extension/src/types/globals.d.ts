// Global type declarations for the extension

// Firefox-specific function to clone objects across security boundaries
declare function cloneInto<T>(obj: T, target: Window): T;

// Service worker importScripts function
declare function importScripts(...urls: string[]): void;
