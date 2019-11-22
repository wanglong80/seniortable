# Seniortable

基于 JavaScript Canvas 的电子表格，它拥有更好的运行和渲染性能，不依赖任何框架，只实现核心引擎，同时提供丰富便捷的 API 给予开发者快速操控引擎的能力。

> 本项目不提供工具栏界面，开发者需根据自己的场景结合 API 创造属于自己的电子表格应用。

![GitHub](https://img.shields.io/github/license/myliang/x-spreadsheet.svg)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/myliang/x-spreadsheet.svg)
[![Join the chat at https://gitter.im/x-datav/spreadsheet](https://badges.gitter.im/x-datav/spreadsheet.svg)](https://gitter.im/x-datav/spreadsheet?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


## 特性
  - Canvas 高性能渲染
  - 丰富的公有 API
  - 灵活的插件扩展机制
  - 兼容 Excel 功能


## 安装

```shell
npm install seniortable
```

```html
<div id="seniortable-demo"></div>
```

```javascript
import Seniortable from "seniortable";
// If you need to override the default options, you can set the override
// const options = {};
// new Spreadsheet('#seniortable-demo', options);
const s = new Spreadsheet("#seniortable-demo")
  .loadData({}) // load data
  .change(data => {
    // save data to db
  });

// data validation
s.validate()
```

```javascript
// default options
{
  showToolbar: true,
  showGrid: true,
  showContextmenu: true,
  view: {
    height: () => document.documentElement.clientHeight,
    width: () => document.documentElement.clientWidth,
  },
  row: {
    len: 100,
    height: 25,
  },
  col: {
    len: 26,
    width: 100,
    indexWidth: 60,
    minWidth: 60,
  },
  style: {
    bgcolor: '#ffffff',
    align: 'left',
    valign: 'middle',
    textwrap: false,
    strike: false,
    underline: false,
    color: '#0a0a0a',
    font: {
      name: 'Helvetica',
      size: 10,
      bold: false,
      italic: false,
    },
  },
}
```

## API 参考手册

### 公有方法
方法 | 参数 |  说明
-|-|-
this.loadData(data) | `data` JSON 源数据 | 载入全部数据
this.getData() | void | 获取全部数据  
this.undo() | void | 撤销
this.redo() | void | 重做
this.render() | void | 渲染重绘表格
this.getCell(ri, ci) | `ri` 行索引 `ci` 列索引 | 获取单元格数据 |
this.setCellText(ri, ci, text) | `ri` 行索引 `ci` 列索引 `text` 文本 | 设置单元格文本

### 公有事件
事件 | 回调参数 |  说明
-|-|-
this.onChange(cb) | `$1` 全部数据 | 单元格内容改变时触发


## 开发环境

```sheel
git clone https://github.com/wanglong6/seniortable.git
cd seniortable
npm install
npm run dev
```

打开浏览器访问 http://127.0.0.1:8080

## 浏览器支持

Modern browsers (chrome, firefox, Safari)

## 开源许可证

GNU General Public License
