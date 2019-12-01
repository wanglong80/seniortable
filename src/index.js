/* global window */
import { h } from './component/element';
import Sheet from './component/sheet';
import Data from './core/data';
import { cssPrefix } from './config';
import Paste from './plugins/paste';
import './index.css';

class Seniortable {
  constructor(targetEl, options = {}) {
    const rootEl = h('div', `${cssPrefix}`).on('contextmenu', evt => evt.preventDefault());
    targetEl.appendChild(rootEl.el);

    // 数据对象
    this.data = new Data('sheet1', options);
    // 工作表
    this.sheet = new Sheet(rootEl, this.data);
    // 表格
    this.table = this.sheet.table;

    // 默认安装所有内置插件
    this.addPlugin(new Paste());
  }

  // 公有方法

  // 安装插件
  addPlugin(plugin) {
    plugin.setup.call(this);
  }

  // 获取数据
  getData() {
    return this.data.getData();
  }

  // 获取当前选择的单元格坐标数据
  getSelected() {
    return this.data.selector.range;
  }

  // 获取单元格文本
  getText(ri, ci) {
    return this.data.getCellTextOrDefault(ri, ci);
  }

  // 设置单元格文本
  setText(ri, ci, text) {
    this.data.setCellText(ri, ci, text);
    return this;
  }

  // 获取单元格样式
  getStyle(ri, ci) {
    return this.data.getCellStyle(ri, ci);
  }

  // 设置单元格样式
  setStyle(sri, sci, eri, eci, property, value) {
    this.data.setSelectedCellAttr(sri, sci, eri, eci, property, value);
    return this;
  }

  // 合并单元格
  merge(sri, sci, eri, eci) {
    this.data.merge(sri, sci, eri, eci);
    return this;
  }

  // 拆分单元格
  unmerge(sri, sci, eri, eci) {
    this.data.unmerge(sri, sci, eri, eci);
    return this;
  }

  // 未选中的单元格计算公式
  formulaSelectedCell(formula) {
    this.data.formulaSelectedCell(formula);
    return this;
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

  // 全选
  selectAll() {

  }

  // 选择单元格（支持非连续选区）
  selectCells() {

  }

  validate() {
    const { validations } = this.data;
    return validations.errors.size <= 0;
  }

  // 加载数据并渲染到当前表格
  loadData(data) {
    this.sheet.loadData(data);
    return this;
  }

  // 是否为焦点
  focusing() {
    return this.sheet.focusing;
  }

  // 撤销
  undo() {
    return this.sheet.undo();
  }

  // 重做
  redo() {
    return this.sheet.redo();
  }

  // 冻结指定行和列
  freeze(ri, ci) {
    this.sheet.freeze(ri, ci);
    return this;
  }

  // 重绘渲染表格
  render() {
    return this.sheet.table.render();
  }

  // 根据坐标获取单元格位置
  getRectByXY(x, y) {
    return this.data.getCellRectByXY(x, y);
  }

  // 公有事件

  // 数据改变时触发
  onChange(cb) {
    this.data.change = cb;
    return this;
  }

  // 键盘按下时触发
  onKeyDown(cb) {
    this.sheet.customEvents.keyDown = cb;
    return this;
  }

  // 鼠标点击时触发
  onClick(cb) {
    this.sheet.customEvents.click = cb;
    return this;
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
