# Seniortable

基于 Web 的 JavaScript Canvas 电子表格，它拥有更好的运行和渲染性能，不依赖任何框架，只实现核心引擎，同时提供丰富便捷的 API 给予开发者快速操控引擎的能力。

> 本项目不提供工具栏界面，开发者需根据自己的场景结合 API 创造属于自己的电子表格应用。

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
<div id="seniortable"></div>
```

```javascript
import Seniortable from "seniortable";

const ST = new Spreadsheet(document.querySelector('#seniortable'));
ST.loadData({}); // 加载数据
ST.onChange(data => {
  // 检测到数据变化时可以保存到数据库
});
```

```javascript
// 默认配置项
{
  showGrid: true,
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

## 开发环境

```sheel
git clone https://github.com/wanglong6/seniortable.git
cd seniortable
npm install
npm run dev
```

打开浏览器访问 http://127.0.0.1:8080

## API 参考手册

### 公有方法
<table>
<tr>
    <td>方法</td>
    <td>说明</td>
</tr>
<tr>
    <td>
      <b>loadData(data)</b>
      <div><sub>@param json data - 数据</sub></div>
    </td>
    <td>载入全部数据</td>
</tr>
<tr>
    <td>
      <div><b>getData()</b></div>
    </td>
    <td>获取全部数据</td>
</tr>
<tr>
    <td>
      <div><b>undo()</b></div>
    </td>
    <td>撤销</td>
</tr>
<tr>
    <td>
      <div><b>redo()</b></div>
    </td>
    <td>重做</td>
</tr>
<tr>
    <td>
      <div><b>render()</b></div>
    </td>
    <td>渲染重绘表格</td>
</tr>
<tr>
    <td>
      <div><b>getSelected()</b></div>
    </td>
    <td>获取当前选择的单元格坐标数据</td>
</tr>
<tr>
    <td>
      <div><b>getRectByXY(x, y)</b></div>
    </td>
    <td>根据坐标获取单元格位置</td>
</tr>
<tr>
    <td>
      <div><b>insertRows(sri, n)</b></div>
      <div><sub>@param integer sri - 起始行</sub></div>
      <div><sub>@param integer n - 插入行数</sub></div>
    </td>
    <td>从起始行向上插入行</td>
</tr>
<tr>
    <td>
      <div><b>insertColumns(sci, n)</b></div>
      <div><sub>@param integer sci - 起始列</sub></div>
      <div><sub>@param integer n - 插入列数</sub></div>
    </td>
    <td>从起始列向左插入列</td>
</tr>
<tr>
    <td>
      <div><b>deleteRows(sri, eri)</b></div>
      <div><sub>@param integer sri - 起始行索引</sub></div>
      <div><sub>@param integer eri - 结束行索引</sub></div>
    </td>
    <td>删除行</td>
</tr>
<tr>
    <td>
      <div><b>deleteColumns(sci, eci)</b></div>
      <div><sub>@param integer sci - 起始列索引</sub></div>
      <div><sub>@param integer eci - 结束列索引</sub></div>
    </td>
    <td>删除列</td>
</tr>
<tr>
    <td>
      <div><b>getText(ri, ci)</b></div>
      <div><sub>@param integer ri - 行索引</sub></div>
      <div><sub>@param integer ci - 列索引</sub></div>
    </td>
    <td>获取单元格文本</td>
</tr>
<tr>
    <td>
      <div><b>setText(ri, ci, text)</b></div>
      <div><sub>@param integer ri - 行索引</sub></div>
      <div><sub>@param integer ci - 列索引</sub></div>
      <div><sub>@param string text - 文本</sub></div>
    </td>
    <td>设置单元格文本</td>
</tr>
<tr>
    <td>
      <div><b>getStyle(ri, ci)</b></div>
      <div><sub>@param integer ri - 行索引</sub></div>
      <div><sub>@param integer ci - 列索引</sub></div>
    </td>
    <td>获取单元格样式</td>
</tr>
<tr>
    <td>
      <div><b>setStyle(sri, sci, eri, eci, property, value)</b></div>
      <div><sub>@param integer sri - 起始行索引</sub></div>
      <div><sub>@param integer sci - 起始列索引</sub></div>
      <div><sub>@param integer eri - 结束行索引</sub></div>
      <div><sub>@param integer eci - 结束列索引</sub></div>
      <div><sub>@param string property - 属性</sub></div>
      <div><sub>@param string value - 值</sub></div>
    </td>
    <td>设置单元格样式，见`附录2`</td>
</tr>
<tr>
    <td>
      <div><b>merge(sri, sci, eri, eci)</b></div>
      <div><sub>@param integer sri - 起始行索引</sub></div>
      <div><sub>@param integer sci - 起始列索引</sub></div>
      <div><sub>@param integer eri - 结束行索引</sub></div>
      <div><sub>@param integer eci - 结束列索引</sub></div>
    </td>
    <td>合并单元格</td>
</tr>
<tr>
    <td>
      <div><b>unmerge(sri, sci, eri, eci)</b></div>
      <div><sub>@param integer sri - 起始行索引</sub></div>
      <div><sub>@param integer sci - 起始列索引</sub></div>
      <div><sub>@param integer eri - 结束行索引</sub></div>
      <div><sub>@param integer eci - 结束列索引</sub></div>
    </td>
    <td>拆分选中的单元格</td>
</tr>
<tr>
    <td>
      <div><b>formulaSelectedCell()</b></div>
    </td>
    <td>选中的单元格计算公式</td>
</tr>
<tr>
    <td>
      <div><b>freeze(ri, ci)</b></div>
      <div><sub>@param integer ri - 行索引</sub></div>
      <div><sub>@param integer ci - 列索引</sub></div>
    </td>
    <td>冻结指定行和列，设置(0,0) 可以解除冻结</td>
</tr>
<tr>
    <td>
      <div><b>focusing()</b></div>
    </td>
    <td>判断当前表格是否为焦点</td>
</tr>
</table> 

#### 附录1. 单元格属性列表
属性 | 值 | 说明
-|-|-
font-name | string | 文本字体
font-size | 8 ~ 20 | 文本字号（单位像素）
font-bold | true / false | 字体是否加粗
font-italic | true / false | 文本是否斜体
underline | true / false | 文本是否有下划线
strike | true / false | 文本是否有删除线
color | #FFFFFF | 文本颜色十六进制码
bgcolor | #FFFFFF | 单元格背景颜色十六进制码
align | left / center/ right | 文本水平对齐方式
valign | top / middle/ bottom | 文本垂直对齐方式
textwrap | true / false | 文本是否自动换行
border | {...} | 边框样式对象 `附录2`

#### 附录2. 单元格边框样式对象
属性 | 值 | 说明
-|-|-
mode | all / inside / horizontal / vertical / outside / top / bottom / left / right | 边框模式
style | thin / medium / thick / dashed / dotted | 边框样式
color | #FFFFFF | 边框颜色十六进制码

### 公有事件
事件 | 回调参数 |  说明
-|-
onChange(cb) | 单元格内容改变时触发
onKeyDown(cb) | 表格存在焦点时键盘按下时触发
onClick(cb) | 点击表格时触发

## 浏览器支持

Modern browsers (chrome, firefox, Safari)

## 开源许可证

GNU General Public License
