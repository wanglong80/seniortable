/* global window, document */
import { h } from './component/element';
import DataProxy from './core/data_proxy';
import Sheet from './component/sheet';
import { cssPrefix } from './config';
import { locale } from './locale/locale';
import Paste from './plugins/Paste';
import './index.less';


class Spreadsheet {
  constructor(selectors, options = {}) {
    let targetEl = selectors;

    if (typeof selectors === 'string') {
      targetEl = document.querySelector(selectors);
    }

    const rootEl = h('div', `${cssPrefix}`)
      .on('contextmenu', evt => evt.preventDefault());
    // create canvas element
    targetEl.appendChild(rootEl.el);

    // 数据对象
    this.data = new DataProxy('sheet1', options);
    // sheet 对象
    this.sheet = new Sheet(rootEl, this.data);
    // 表格对象
    this.table = this.sheet.table;

    // 默认安装所有内置插件
    this.addPlugin(new Paste());
  }

  // 公有方法

  // 安装插件
  addPlugin(plugin) {
    plugin.setup.call(this);
  }

  // 加载数据并渲染到当前表格
  loadData(data) {
    this.sheet.loadData(data);
    return this;
  }

  // 撤销
  undo() {
    return this.sheet.undo();
  }

  // 重做
  redo() {
    return this.sheet.redo();
  }

  // 获取数据
  getData() {
    return this.data.getData();
  }

  // 仅设置单元格文本，但不渲染到画布（渲染需调用 render 方法）
  setDataCellText(ri, ci, text) {
    return this.data.setCellText(ri, ci, text);
  }

  // 获取单元格数据
  getCell(ri, ci) {
    return this.data.getCell(ri, ci);
  }

  // 获取当前焦点单元格的选中器对象
  getSelector() {
    return this.data.selector;
  }

  validate() {
    const { validations } = this.data;
    return validations.errors.size <= 0;
  }

  // 重绘渲染表格
  render() {
    return this.sheet.table.render();
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
