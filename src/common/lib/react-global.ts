import React from "react";

// Compatibility shim for packages compiled with the classic JSX runtime.
// Remove this after @jyh-dev/kit promise-modal is published with an explicit
// React import or automatic JSX runtime output.
(globalThis as typeof globalThis & { React?: typeof React }).React = React;
