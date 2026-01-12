/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./contexts/ThemeContext.tsx":
/*!***********************************!*\
  !*** ./contexts/ThemeContext.tsx ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ThemeProvider: () => (/* binding */ ThemeProvider),\n/* harmony export */   useTheme: () => (/* binding */ useTheme)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* __next_internal_client_entry_do_not_use__ ThemeProvider,useTheme auto */ \n\nconst ThemeContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(undefined);\nfunction ThemeProvider({ children }) {\n    const [theme, setThemeState] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(\"light\");\n    const [mounted, setMounted] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    // Initialize theme from localStorage and system preference\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        const storedTheme = localStorage.getItem(\"theme\");\n        const prefersDark = window.matchMedia(\"(prefers-color-scheme: dark)\").matches;\n        const initialTheme = storedTheme || (prefersDark ? \"dark\" : \"light\");\n        setThemeState(initialTheme);\n        applyTheme(initialTheme);\n        setMounted(true);\n    }, []);\n    const applyTheme = (newTheme)=>{\n        if (newTheme === \"dark\") {\n            document.documentElement.classList.add(\"dark\");\n        } else {\n            document.documentElement.classList.remove(\"dark\");\n        }\n        localStorage.setItem(\"theme\", newTheme);\n    };\n    const setTheme = (newTheme)=>{\n        setThemeState(newTheme);\n        applyTheme(newTheme);\n    };\n    const toggleTheme = ()=>{\n        const newTheme = theme === \"light\" ? \"dark\" : \"light\";\n        setTheme(newTheme);\n    };\n    // Prevent hydration mismatch\n    if (!mounted) {\n        return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n            children: children\n        }, void 0, false);\n    }\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(ThemeContext.Provider, {\n        value: {\n            theme,\n            toggleTheme,\n            setTheme\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"/Users/usr/portfolio_web/ephraim_umunnakwe/nextjs-portfolio/contexts/ThemeContext.tsx\",\n        lineNumber: 55,\n        columnNumber: 5\n    }, this);\n}\nfunction useTheme() {\n    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(ThemeContext);\n    if (context === undefined) {\n        throw new Error(\"useTheme must be used within a ThemeProvider\");\n    }\n    return context;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb250ZXh0cy9UaGVtZUNvbnRleHQudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFFOEU7QUFVOUUsTUFBTUssNkJBQWVKLG9EQUFhQSxDQUErQks7QUFFMUQsU0FBU0MsY0FBYyxFQUFFQyxRQUFRLEVBQWlDO0lBQ3ZFLE1BQU0sQ0FBQ0MsT0FBT0MsY0FBYyxHQUFHTiwrQ0FBUUEsQ0FBUTtJQUMvQyxNQUFNLENBQUNPLFNBQVNDLFdBQVcsR0FBR1IsK0NBQVFBLENBQUM7SUFFdkMsMkRBQTJEO0lBQzNERCxnREFBU0EsQ0FBQztRQUNSLE1BQU1VLGNBQWNDLGFBQWFDLE9BQU8sQ0FBQztRQUN6QyxNQUFNQyxjQUFjQyxPQUFPQyxVQUFVLENBQUMsZ0NBQWdDQyxPQUFPO1FBRTdFLE1BQU1DLGVBQWVQLGVBQWdCRyxDQUFBQSxjQUFjLFNBQVMsT0FBTTtRQUNsRU4sY0FBY1U7UUFDZEMsV0FBV0Q7UUFDWFIsV0FBVztJQUNiLEdBQUcsRUFBRTtJQUVMLE1BQU1TLGFBQWEsQ0FBQ0M7UUFDbEIsSUFBSUEsYUFBYSxRQUFRO1lBQ3ZCQyxTQUFTQyxlQUFlLENBQUNDLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDO1FBQ3pDLE9BQU87WUFDTEgsU0FBU0MsZUFBZSxDQUFDQyxTQUFTLENBQUNFLE1BQU0sQ0FBQztRQUM1QztRQUNBYixhQUFhYyxPQUFPLENBQUMsU0FBU047SUFDaEM7SUFFQSxNQUFNTyxXQUFXLENBQUNQO1FBQ2hCWixjQUFjWTtRQUNkRCxXQUFXQztJQUNiO0lBRUEsTUFBTVEsY0FBYztRQUNsQixNQUFNUixXQUFXYixVQUFVLFVBQVUsU0FBUztRQUM5Q29CLFNBQVNQO0lBQ1g7SUFFQSw2QkFBNkI7SUFDN0IsSUFBSSxDQUFDWCxTQUFTO1FBQ1oscUJBQU87c0JBQUdIOztJQUNaO0lBRUEscUJBQ0UsOERBQUNILGFBQWEwQixRQUFRO1FBQUNDLE9BQU87WUFBRXZCO1lBQU9xQjtZQUFhRDtRQUFTO2tCQUMxRHJCOzs7Ozs7QUFHUDtBQUVPLFNBQVN5QjtJQUNkLE1BQU1DLFVBQVVoQyxpREFBVUEsQ0FBQ0c7SUFDM0IsSUFBSTZCLFlBQVk1QixXQUFXO1FBQ3pCLE1BQU0sSUFBSTZCLE1BQU07SUFDbEI7SUFDQSxPQUFPRDtBQUNUIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZXBocmFpbS11bXVubmFrd2UtcG9ydGZvbGlvLy4vY29udGV4dHMvVGhlbWVDb250ZXh0LnRzeD85MjU3Il0sInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50JztcblxuaW1wb3J0IFJlYWN0LCB7IGNyZWF0ZUNvbnRleHQsIHVzZUNvbnRleHQsIHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5cbnR5cGUgVGhlbWUgPSAnbGlnaHQnIHwgJ2RhcmsnO1xuXG5pbnRlcmZhY2UgVGhlbWVDb250ZXh0VHlwZSB7XG4gIHRoZW1lOiBUaGVtZTtcbiAgdG9nZ2xlVGhlbWU6ICgpID0+IHZvaWQ7XG4gIHNldFRoZW1lOiAodGhlbWU6IFRoZW1lKSA9PiB2b2lkO1xufVxuXG5jb25zdCBUaGVtZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0PFRoZW1lQ29udGV4dFR5cGUgfCB1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBUaGVtZVByb3ZpZGVyKHsgY2hpbGRyZW4gfTogeyBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlIH0pIHtcbiAgY29uc3QgW3RoZW1lLCBzZXRUaGVtZVN0YXRlXSA9IHVzZVN0YXRlPFRoZW1lPignbGlnaHQnKTtcbiAgY29uc3QgW21vdW50ZWQsIHNldE1vdW50ZWRdID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIC8vIEluaXRpYWxpemUgdGhlbWUgZnJvbSBsb2NhbFN0b3JhZ2UgYW5kIHN5c3RlbSBwcmVmZXJlbmNlXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgc3RvcmVkVGhlbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndGhlbWUnKSBhcyBUaGVtZSB8IG51bGw7XG4gICAgY29uc3QgcHJlZmVyc0RhcmsgPSB3aW5kb3cubWF0Y2hNZWRpYSgnKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKScpLm1hdGNoZXM7XG4gICAgXG4gICAgY29uc3QgaW5pdGlhbFRoZW1lID0gc3RvcmVkVGhlbWUgfHwgKHByZWZlcnNEYXJrID8gJ2RhcmsnIDogJ2xpZ2h0Jyk7XG4gICAgc2V0VGhlbWVTdGF0ZShpbml0aWFsVGhlbWUpO1xuICAgIGFwcGx5VGhlbWUoaW5pdGlhbFRoZW1lKTtcbiAgICBzZXRNb3VudGVkKHRydWUpO1xuICB9LCBbXSk7XG5cbiAgY29uc3QgYXBwbHlUaGVtZSA9IChuZXdUaGVtZTogVGhlbWUpID0+IHtcbiAgICBpZiAobmV3VGhlbWUgPT09ICdkYXJrJykge1xuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2RhcmsnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2RhcmsnKTtcbiAgICB9XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3RoZW1lJywgbmV3VGhlbWUpO1xuICB9O1xuXG4gIGNvbnN0IHNldFRoZW1lID0gKG5ld1RoZW1lOiBUaGVtZSkgPT4ge1xuICAgIHNldFRoZW1lU3RhdGUobmV3VGhlbWUpO1xuICAgIGFwcGx5VGhlbWUobmV3VGhlbWUpO1xuICB9O1xuXG4gIGNvbnN0IHRvZ2dsZVRoZW1lID0gKCkgPT4ge1xuICAgIGNvbnN0IG5ld1RoZW1lID0gdGhlbWUgPT09ICdsaWdodCcgPyAnZGFyaycgOiAnbGlnaHQnO1xuICAgIHNldFRoZW1lKG5ld1RoZW1lKTtcbiAgfTtcblxuICAvLyBQcmV2ZW50IGh5ZHJhdGlvbiBtaXNtYXRjaFxuICBpZiAoIW1vdW50ZWQpIHtcbiAgICByZXR1cm4gPD57Y2hpbGRyZW59PC8+O1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8VGhlbWVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt7IHRoZW1lLCB0b2dnbGVUaGVtZSwgc2V0VGhlbWUgfX0+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9UaGVtZUNvbnRleHQuUHJvdmlkZXI+XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VUaGVtZSgpIHtcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoVGhlbWVDb250ZXh0KTtcbiAgaWYgKGNvbnRleHQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndXNlVGhlbWUgbXVzdCBiZSB1c2VkIHdpdGhpbiBhIFRoZW1lUHJvdmlkZXInKTtcbiAgfVxuICByZXR1cm4gY29udGV4dDtcbn1cbiJdLCJuYW1lcyI6WyJSZWFjdCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VDb250ZXh0IiwidXNlRWZmZWN0IiwidXNlU3RhdGUiLCJUaGVtZUNvbnRleHQiLCJ1bmRlZmluZWQiLCJUaGVtZVByb3ZpZGVyIiwiY2hpbGRyZW4iLCJ0aGVtZSIsInNldFRoZW1lU3RhdGUiLCJtb3VudGVkIiwic2V0TW91bnRlZCIsInN0b3JlZFRoZW1lIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInByZWZlcnNEYXJrIiwid2luZG93IiwibWF0Y2hNZWRpYSIsIm1hdGNoZXMiLCJpbml0aWFsVGhlbWUiLCJhcHBseVRoZW1lIiwibmV3VGhlbWUiLCJkb2N1bWVudCIsImRvY3VtZW50RWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsInJlbW92ZSIsInNldEl0ZW0iLCJzZXRUaGVtZSIsInRvZ2dsZVRoZW1lIiwiUHJvdmlkZXIiLCJ2YWx1ZSIsInVzZVRoZW1lIiwiY29udGV4dCIsIkVycm9yIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./contexts/ThemeContext.tsx\n");

/***/ }),

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _contexts_ThemeContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../contexts/ThemeContext */ \"./contexts/ThemeContext.tsx\");\n\n\n\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_contexts_ThemeContext__WEBPACK_IMPORTED_MODULE_2__.ThemeProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"/Users/usr/portfolio_web/ephraim_umunnakwe/nextjs-portfolio/pages/_app.tsx\",\n            lineNumber: 8,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/usr/portfolio_web/ephraim_umunnakwe/nextjs-portfolio/pages/_app.tsx\",\n        lineNumber: 7,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQytCO0FBQzBCO0FBRTFDLFNBQVNDLElBQUksRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQVk7SUFDNUQscUJBQ0UsOERBQUNILGlFQUFhQTtrQkFDWiw0RUFBQ0U7WUFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7OztBQUc5QiIsInNvdXJjZXMiOlsid2VicGFjazovL2VwaHJhaW0tdW11bm5ha3dlLXBvcnRmb2xpby8uL3BhZ2VzL19hcHAudHN4PzJmYmUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBBcHBQcm9wcyB9IGZyb20gJ25leHQvYXBwJztcbmltcG9ydCAnLi4vc3R5bGVzL2dsb2JhbHMuY3NzJztcbmltcG9ydCB7IFRoZW1lUHJvdmlkZXIgfSBmcm9tICcuLi9jb250ZXh0cy9UaGVtZUNvbnRleHQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9OiBBcHBQcm9wcykge1xuICByZXR1cm4gKFxuICAgIDxUaGVtZVByb3ZpZGVyPlxuICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxuICAgIDwvVGhlbWVQcm92aWRlcj5cbiAgKTtcbn0iXSwibmFtZXMiOlsiVGhlbWVQcm92aWRlciIsIkFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.tsx"));
module.exports = __webpack_exports__;

})();