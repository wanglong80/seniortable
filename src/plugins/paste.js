/* global window, DOMParser */
import { bind } from '../component/event';

// 表格处理器
function tableHandler(sri, sci, content) {
  const trs = content.getElementsByTagName('tr');

  const rowColspanMap = {};

  let ri = 0;
  for (let i = 0; i < trs.length; i += 1) {
    const tds = trs[i].getElementsByTagName('td');

    let ci = 0;
    for (let j = 0; j < tds.length; j += 1) {
      let value = tds[j].innerText;
      value = value.replace(/[(^\r\n)|(^\n)|(\r\n$)|(\n$)]/g, '');
      let rowspan = tds[j].getAttribute('rowspan');
      let colspan = tds[j].getAttribute('colspan');

      rowspan = rowspan ? parseInt(rowspan, 10) : 0;
      colspan = colspan ? parseInt(colspan, 10) : 0;
      rowspan = colspan > 0 && rowspan === 0 ? 1 : rowspan;
      colspan = rowspan > 0 && colspan === 0 ? 1 : colspan;

      if (rowspan > 0) {
        for (let k = 0; k < rowspan; k += 1) {
          rowColspanMap[`${i + k},${j}`] = colspan;
        }
      }

      // 如果当前行存在列被合并的情况
      let colspanOnCurrentRow = 0;
      if (rowColspanMap[`${i},${j}`]) {
        colspanOnCurrentRow = rowColspanMap[`${i},${j}`]; // 还是有bug
      }

      // 合并单元格
      if (rowspan > 0 || colspan > 0) {
        const eri = sri + i + rowspan - 1;
        const eci = sci + j + colspan - 1;
        this.merge(sri + i, sci + j, eri, eci);
        // console.log('mergeCells', sri + i, sci + j, rowspan, mergeCN);
        this.setText(sri + ri, sci + ci, value);
      } else if (colspanOnCurrentRow > 0) {
        ci += (colspanOnCurrentRow > 0 ? colspanOnCurrentRow : 0);
        this.setText(sri + ri, sci + ci, value);
        console.log('colspanOnCurrentRow', colspanOnCurrentRow);
      } else {
        ci += (colspan > 0 ? colspan - 1 : 0);
        this.setText(sri + ri, sci + ci, value);
      }

      console.log('row:', sri + ri, 'col:', ci, 'rowspan', rowspan, 'colspan', colspan, 'value:', value);

      ci += (colspan > 0 ? colspan - 1 : 0);
      ci += 1;
    }

    ri += 1;
  }

  console.log(rowColspanMap);

  this.render();
}

// 文本处理器
function textHandler(sri, sci, text) {
  // 得到粘贴板内容的数组
  const rowsArray1 = text.split('%0D%0A');
  const rowsArray2 = text.split('%0A');
  let rowsArray = [];

  if (rowsArray1.length > 1) {
    if (rowsArray1[0].split('%09').length === rowsArray1[1].split('%09').length) {
      rowsArray = rowsArray1;
    }
  } else {
    rowsArray = rowsArray1;
  }

  if (rowsArray2.length > 1) {
    if (rowsArray2[0].split('%09').length === rowsArray2[1].split('%09').length) {
      rowsArray = rowsArray2;
    }
  } else {
    rowsArray = rowsArray2;
  }

  if (rowsArray.length > 0) {
    // 从excel 复制的数据最后一行会有空的回车符，这里要手动的去掉
    if (rowsArray[rowsArray.length - 1].length === 0) {
      rowsArray.splice(rowsArray.length - 1, 1);
    }

    for (let ri = 0; ri < rowsArray.length; ri += 1) {
      let rowText = rowsArray[ri];
      rowText = rowText.replace(/(?:%22)((?:%22)*)/ig, '$1'); // 解决魔鬼引号问题

      const colsArray = rowText.split('%09'); // 列间隔符

      for (let ci = 0; ci < colsArray.length; ci += 1) {
        const value = decodeURIComponent(colsArray[ci]);
        this.setText(ri + sri, ci + sci, value);
      }
    }

    this.render();
  }
}

// 粘贴插件
export default class Plugin {
  setup() {
    bind(window, 'paste', (e) => {
      const { sri, sci } = this.getSelected();

      const clipboardData = e.clipboardData.getData('text/html');
      const parser = new DOMParser();
      const html = parser.parseFromString(clipboardData, 'text/html');
      const table = html.getElementsByTagName('table')[0];

      if (table) {
        tableHandler.call(this, sri, sci, table);
      } else {
        const text = e.clipboardData.getData('text');
        textHandler.call(this, sri, sci, text);
      }
    });
  }
}
