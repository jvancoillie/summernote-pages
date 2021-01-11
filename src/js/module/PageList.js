import PageNode from "./PageNode";

export default class PageList {
    constructor() {
        this.head = null;
    }

    append(page) {
        if (this.head === null) {
            this.head = new PageNode(page);
        }else{
            this._append(page, this.head)
        }
    }

    _append(page, current) {
        if (current.next === null) {
            current.next = new PageNode(page);
            return;
        }

        this._append(page, current.next);
    }

    contains(page){
       return this._contains(page, this.head);
    }

    _contains(page, current){
        if(current === null){
            return false;
        }

        if(current.page === page){
            return true;
        }

        return this._contains(page, current.next);
    }

    getNode(page){
        return this._getNode(page, this.head);
    }

    _getNode(page, current){
        if(current === null){
            return false;
        }

        if(current.page === page){
            return current;
        }

        return this._getNode(page, current.next);
    }
}