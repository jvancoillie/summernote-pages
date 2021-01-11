export default class PageNode{
  constructor(page) {
    this.page = page;
    this.next = null;
  }

  getHeight(){
    return this.page.clientHeight;
  }

  getContentHeight(){
    let contentHeight = 0;

    this.page.childNodes.forEach((child) => {
      contentHeight += +this.outerHeightElement(child);
    });

    return contentHeight;
  }

  overflows(){
    return this.getHeight() < this.getContentHeight();
  }

  outerHeightElement(el) {
    var height = el.offsetHeight;
    var style = getComputedStyle(el);
    height += parseInt(style.marginTop) + parseInt(style.marginBottom);

    return height;
  }

}