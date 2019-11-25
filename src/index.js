/* global window, document */
import { h } from './component/element';
import DataProxy from './core/data_proxy';
import Sheet from './component/sheet';
import { cssPrefix } from './config';
import Paste from './plugins/paste';
import './index.less';

class Seniortable {
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

  // 设置单元格文本，但不渲染到画布（渲染需调用 render 方法）
  setCellText(ri, ci, text) {
    return this.data.setCellText(ri, ci, text);
  }

  // 设置单元格样式
  setCellAttr(ri, ci, property, value) {
    return this.data.setCellAttr(ri, ci, property, value);
  }

  // 设置当前选中的单元格样式
  setSelectedCellAttr(property, value) {
    this.data.setSelectedCellAttr(property, value);
    return this;
  }

  // 合并当前选中的单元格
  mergeSelectedCells() {
    this.data.merge();
    return this;
  }

  // 拆分当前选中的单元格
  unmergeSelectedCells() {
    this.data.unmerge();
    return this;
  }

  // 冻结指定行和列
  freeze(ri, ci) {
    this.sheet.freeze(ri, ci);
    return this;
  }

  // 未选中的单元格计算公式
  formulaSelectedCell(formula) {
    this.data.formulaSelectedCell(formula);
    return this;
  }

  // 获取单元格数据
  getCell(ri, ci) {
    return this.data.getCell(ri, ci);
  }

  // 获取选中的单元格数据
  getSelectedCell() {
    return this.data.getSelectedCell();
  }

  // 获取当前选中的坐标数据
  getSelection() {
    return { ... this.data.selector.range };
  }

  // 向上插入n行
  insertRows(sri, n) {
    this.data.insert('row', sri, n);
    return this;
  }

  // 向左插入n列
  insertColumns(sci, n) {
    this.data.insert('column', sci, n);
    return this;
  }

  // 删除选择的行
  deleteRows(sri, eri) {
    this.data.delete('row', sri, eri);
    return this;
  }

  // 删除选择的列
  deleteColumns(sci, eci) {
    this.data.delete('column', sci, eci);
    return this;
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

const seniortable = (el, options = {}) => new Seniortable(el, options);

if (window) {
  window.seniortable = seniortable;
}

export default Seniortable;
export {
  Seniortable,
};
