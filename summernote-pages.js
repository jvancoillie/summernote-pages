/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/module/PageList.js":
/*!***********************************!*\
  !*** ./src/js/module/PageList.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ PageList
/* harmony export */ });
/* harmony import */ var _PageNode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PageNode */ "./src/js/module/PageNode.js");

class PageList {
  constructor() {
    this.head = null;
  }

  append(page) {
    if (this.head === null) {
      this.head = new _PageNode__WEBPACK_IMPORTED_MODULE_0__.default(page);
    } else {
      this._append(page, this.head);
    }
  }

  _append(page, current) {
    if (current.next === null) {
      current.next = new _PageNode__WEBPACK_IMPORTED_MODULE_0__.default(page);
      return;
    }

    this._append(page, current.next);
  }

  contains(page) {
    return this._contains(page, this.head);
  }

  _contains(page, current) {
    if (current === null) {
      return false;
    }

    if (current.page === page) {
      return true;
    }

    return this._contains(page, current.next);
  }

  getNode(page) {
    return this._getNode(page, this.head);
  }

  _getNode(page, current) {
    if (current === null) {
      return false;
    }

    if (current.page === page) {
      return current;
    }

    return this._getNode(page, current.next);
  }

}

/***/ }),

/***/ "./src/js/module/PageNode.js":
/*!***********************************!*\
  !*** ./src/js/module/PageNode.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ PageNode
/* harmony export */ });
class PageNode {
  constructor(page) {
    this.page = page;
    this.next = null;
  }

  getHeight() {
    return this.page.clientHeight;
  }

  getContentHeight() {
    let contentHeight = 0;
    this.page.childNodes.forEach(child => {
      contentHeight += +this.outerHeightElement(child);
    });
    return contentHeight;
  }

  overflows() {
    return this.getHeight() < this.getContentHeight();
  }

  outerHeightElement(el) {
    var height = el.offsetHeight;
    var style = getComputedStyle(el);
    height += parseInt(style.marginTop) + parseInt(style.marginBottom);
    return height;
  }

}

/***/ }),

/***/ "./src/js/module/Pages.js":
/*!********************************!*\
  !*** ./src/js/module/Pages.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ Pages
/* harmony export */ });
/* harmony import */ var _PageList__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PageList */ "./src/js/module/PageList.js");
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "jquery");

class Pages {
  constructor(context) {
    console.log('summernote module pages');
    this.ui = $.summernote.ui;
    this.dom = $.summernote.dom;
    this.range = $.summernote.range;
    this.context = context;
    this.editable = context.layoutInfo.editable[0];
    this.options = context.options;
    this.currentOrientation = 'portrait';
    this.pageList = null;
    this.pageTag = 'div';
    this.addToolbarButtons();
    this.events = {
      'summernote.change': (we, contents, $editable) => {
        this.createPageList();
      }
    };
  }

  initialize() {
    this.editable.closest('.note-frame').classList.add('note-pages');
    this.createPageList();
    this.setOrientation(); // force start history after page initialisation

    this.context.invoke('editor.commit');
  }

  destroy() {}

  addToolbarButtons() {
    this.context.memo('button.orientation', () => {
      var button = this.ui.buttonGroup([this.ui.button({
        className: 'dropdown-toggle',
        contents: this.options.pages.orientation.icon,
        // tooltip: this.lang.pages.orientation.tooltip,
        data: {
          toggle: 'dropdown'
        }
      }), this.ui.dropdown({
        className: 'dropdown-template',
        items: this.options.pages.orientation.menu,
        click: this.context.createInvokeHandler('pages.toggleOrientation')
      })]);
      return button.render();
    });
  }

  getPages() {
    return this.editable.querySelectorAll('div.page');
  }

  toggleOrientation(value) {
    if (value === 'Portrait') {
      this.currentOrientation = 'portrait';
    } else {
      this.currentOrientation = 'landscape';
    }

    this.updatePages();
  }

  updatePages() {
    this.setOrientation();
    this.getPages().forEach(page => {
      this.setPageProperties(page);
    });
    this.createPageList();
    this.checkPageBreak();
  }

  setOrientation() {
    if (this.currentOrientation === 'portrait') {
      $('.note-editing-area').removeClass('lanscape').addClass('portrait');
      $('.note-editable').css({
        'width': '21cm'
      }); // height:842
    } else {
      $('.note-editing-area').removeClass('portrait').addClass('landscape');
      $('.note-editable').css({
        'width': '29.7cm'
      }); // height:842
    }
  }

  setPageProperties(page) {
    page.setAttribute("contenteditable", true);

    if (this.currentOrientation === 'portrait') {
      page.classList.add('portrait');
      page.classList.remove('landscape');
      page.style.width = '21cm';
      page.style.height = '29.7cm';
    } else {
      page.classList.add('landscape');
      page.classList.remove('portrait');
      page.style.width = '29.7cm';
      page.style.height = '21cm';
    }

    return page;
  }

  createPage(content) {
    content = content || this.dom.emptyPara;
    let page = document.createElement(this.pageTag);
    page.classList.add('page');
    this.setPageProperties(page);
    page.innerHTML = content;
    return page;
  }

  createPageList() {
    let rng = this.range.create(this.editable);
    rng = rng.deleteContents();
    rng = rng.wrapBodyInlineWithPara();
    this.context.invoke('editor.setLastRange', rng);
    this.pageList = new _PageList__WEBPACK_IMPORTED_MODULE_0__.default(); // no page wrapper found create

    if (this.getPages().length === 0) {
      var page = this.createPage(this.editable.innerHTML);
      this.editable.innerHTML = '';
      this.editable.appendChild(page);
      this.editable.focus();
      this.pageList.append(page);
    } else if (this.getPages().length > 0) {
      // there is already page wrappers ... append on PageList
      this.getPages().forEach(page => {
        this.pageList.append(page);
      });
    }

    this.context.invoke('editor.focus');
    this.checkPageBreak();
    return this.pageList;
  }

  checkPageBreak() {
    this.divide(this.pageList.head, this.pageList);
  }

  divide(current, pageList) {
    if (current === null) {
      return;
    }

    if (current.overflows()) {
      console.log('this page node overflows', current); // take overflow and add it on next page ...

      if (current.next === null) {
        console.log('need to create a new page');
        let page = this.insertPageBreak();
        page.innerHTML = ''; // remove defalut dom.para

        pageList.append(page);
      }

      let nextpage = current.next.page; // // here we got an overflow page insert a new page after and move overflow on this page

      let children = current.page.childNodes;
      let i = children.length - 1;

      while (current.overflows()) {
        let c = current.page.removeChild(children[i]); // Remove a child

        nextpage.append(c); // Put it back at its new position

        i--;
      }
    }

    this.divide(current.next, pageList);
  }

  getCurrentPage() {
    /**
     * @type {WrappedRange}
     */
    let rng = this.context.invoke('editor.createRange');

    if (rng.isOnEditable()) {
      let currentNode = rng.sc;

      while (this.dom.isText(currentNode)) {
        currentNode = currentNode.parentNode;
      }

      let page = currentNode.closest('div.page');

      if (page) {
        return page;
      } else {
        console.log('not in page wrapper :(', rng);
      }
    }

    return {};
  }

  insertPageBreak() {
    let currentPage = this.getCurrentPage();
    let newPage = this.createPage();

    if (currentPage.page) {
      this.insertAfter(currentPage.page, newPage);
    } else {
      this.editable.appendChild(newPage);
    }

    return newPage;
  }

  insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

}

/***/ }),

/***/ "./src/js/summernote-pages.js":
/*!************************************!*\
  !*** ./src/js/summernote-pages.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _module_Pages__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./module/Pages */ "./src/js/module/Pages.js");


(jquery__WEBPACK_IMPORTED_MODULE_0___default().summernote) = jquery__WEBPACK_IMPORTED_MODULE_0___default().extend(true, (jquery__WEBPACK_IMPORTED_MODULE_0___default().summernote), {
  options: {
    modules: {
      'pages': _module_Pages__WEBPACK_IMPORTED_MODULE_1__.default
    },
    // toolbar
    pages: {
      orientation: {
        icon: 'Orientation&nbsp;<span class="caret"></span>',
        menu: ['Portrait', 'Landscape']
      }
    },
    toolbar: [...(jquery__WEBPACK_IMPORTED_MODULE_0___default().summernote.options.toolbar), ['pages', ['orientation', 'test']]],
    blockquoteBreakingLevel: 0,
    keyMap: {
      pc: {
        'CTRL+ENTER': 'pages.insertPageBreak'
      },
      mac: {
        'CMD+ENTER': 'pages.insertPageBreak'
      }
    },
    lang: {
      'en-US': {
        pages: {
          orientation: {
            icon: 'Orientation&nbsp;<span class="caret"></span>',
            menu: ['Portrait', 'Landscape']
          }
        }
      }
    }
  }
});

/***/ }),

/***/ "./src/scss/summernote-pages.scss":
/*!****************************************!*\
  !*** ./src/scss/summernote-pages.scss ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "jquery":
/*!********************!*\
  !*** external "$" ***!
  \********************/
/***/ ((module) => {

module.exports = $;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/js/summernote-pages.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ 	__webpack_require__("./src/scss/summernote-pages.scss");
/******/ })()
;
//# sourceMappingURL=summernote-pages.js.map