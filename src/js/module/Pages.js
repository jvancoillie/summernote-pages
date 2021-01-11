import PageList from "./PageList";

export default class Pages {
    constructor(context) {
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
            },
        };
    }

    initialize() {
        this.editable.closest('.note-frame').classList.add('note-pages')
        this.createPageList()
        this.setOrientation();
        // force start history after page initialisation
        this.context.invoke('editor.commit')
    }

    destroy() {
    }

    addToolbarButtons() {
        this.context.memo('button.orientation', () => {
            var button = this.ui.buttonGroup([
                this.ui.button({
                    className: 'dropdown-toggle',
                    contents: this.options.pages.orientation.icon,
                    // tooltip: this.lang.pages.orientation.tooltip,
                    data: {
                        toggle: 'dropdown'
                    }
                }),
                this.ui.dropdown({
                    className: 'dropdown-template',
                    items: this.options.pages.orientation.menu,
                    click: this.context.createInvokeHandler('pages.toggleOrientation')
                })
            ]);
            return button.render();
        });
    }

    getPages() {
        return this.editable.querySelectorAll('div.page')
    }

    toggleOrientation(value) {
        if (value === 'Portrait') {
            this.currentOrientation = 'portrait';
        } else {
            this.currentOrientation = 'landscape';
        }
        this.updatePages()
    };

    updatePages() {
        this.setOrientation()
        this.getPages().forEach((page) => {
            this.setPageProperties(page);
        });
        this.createPageList();
        this.checkPageBreak();
    };

    setOrientation() {
        if (this.currentOrientation === 'portrait') {
            $('.note-editing-area').removeClass('lanscape').addClass('portrait');
            $('.note-editable').css({'width': '21cm'}); // height:842
        } else {
            $('.note-editing-area').removeClass('portrait').addClass('landscape');
            $('.note-editable').css({'width': '29.7cm'}); // height:842
        }
    };

    setPageProperties(page) {
        page.setAttribute("contenteditable", true);
        if (this.currentOrientation === 'portrait') {
            page.classList.add('portrait')
            page.classList.remove('landscape')
            page.style.width = '21cm';
            page.style.height = '29.7cm';
        } else {
            page.classList.add('landscape')
            page.classList.remove('portrait')
            page.style.width = '29.7cm';
            page.style.height = '21cm';
        }

        return page;
    }

    createPage(content) {
        content = content || this.dom.emptyPara;
        let page = document.createElement(this.pageTag)
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
        this.pageList = new PageList();
        // no page wrapper found create
        if (this.getPages().length === 0) {
            var page = this.createPage(this.editable.innerHTML);
            this.editable.innerHTML = '';
            this.editable.appendChild(page);
            this.editable.focus();
            this.pageList.append(page);
        } else if (this.getPages().length > 0) {
            // there is already page wrappers ... append on PageList
            this.getPages().forEach((page) => {
                this.pageList.append(page);
            })
        }

        this.context.invoke('editor.focus')
        this.checkPageBreak();

        return this.pageList;
    }

    checkPageBreak() {
        this.divide(this.pageList.head, this.pageList)
    }

    divide(current, pageList){
        if(current === null){
            return ;
        }

        if (current.overflows()) {
            console.log('this page node overflows', current);
            // take overflow and add it on next page ...
            if(current.next === null){
                console.log('need to create a new page')
                let page = this.insertPageBreak();
                page.innerHTML = '' // remove defalut dom.para
                pageList.append(page);
            }

            let nextpage = current.next.page;

            // // here we got an overflow page insert a new page after and move overflow on this page
            let children = current.page.childNodes
            let i = children.length - 1;
            while (current.overflows()) {
                let c = current.page.removeChild(children[i]);    // Remove a child
                nextpage.append(c);                  // Put it back at its new position
                i--;
            }
        }

        this.divide(current.next, pageList);
    }

    getCurrentPage() {
        /**
         * @type {WrappedRange}
         */
        let rng = this.context.invoke('editor.createRange')

        if (rng.isOnEditable()) {
            let currentNode = rng.sc;
            while (this.dom.isText(currentNode)) {
                currentNode = currentNode.parentNode;
            }
            let page = currentNode.closest('div.page');

            if (page) {
                return page;
            } else {
                console.log('not in page wrapper :(', rng)
            }
        }

        return {};
    }

    insertPageBreak() {
        let currentPage = this.getCurrentPage();
        let newPage = this.createPage();

        if (currentPage.page) {
            this.insertAfter(currentPage.page, newPage)
        } else {
            this.editable.appendChild(newPage)
        }

        return newPage;
    };

    insertAfter(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
}