/* global window, document */
import { h } from './component/element';
import DataProxy from './core/data_proxy';
import Sheet from './component/sheet';
import { cssPrefix } from './config';
import { locale } from './locale/locale';
import paste from './plugins/paste';
import './index.less';


class Spreadsheet {
  constructor(selectors, options = {}) {
    let targetEl = selectors;
    if (typeof selectors === 'string') {
      targetEl = document.querySelector(selectors);
    }
    this.data = new DataProxy('sheet1', options);
    const rootEl = h('div', `${cssPrefix}`)
      .on('contextmenu', evt => evt.preventDefault());
    // create canvas element
    targetEl.appendChild(rootEl.el);
    this.sheet = new Sheet(rootEl, this.data);

    this.addPlugin(paste);
  }


  // 公有方法

  // 安装插件
  addPlugin(plugin) {
    plugin(this);
  }

  // 加载数据并渲染到当前表格
  loadData(data) {
    this.sheet.loadData(data);
    return this;
  }

  // 获取数据
  getData() {
    return this.data.getData();
  }

  // 获取单元格数据
  getCell(ri, ci) {
    return this.data.getCell(ri, ci);
  }

  validate() {
    const { validations } = this.data;
    return validations.errors.size <= 0;
  }

  // 公有事件

  // 数据改变时触发
  onChange(cb) {
    this.data.change = cb;
    return this;
  }

  static locale(lang, message) {
    locale(lang, message);
  }
}

const spreadsheet = (el, options = {}) => new Spreadsheet(el, options);


if (window) {
  window.x = window.x || {};
  window.x.spreadsheet = spreadsheet;
  window.x.spreadsheet.locale = (lang, message) => locale(lang, message);
}

export default Spreadsheet;
export {
  spreadsheet,
};
