/* global window, DOMParser */
import { bind } from '../component/event';

// 表格处理器
function tableHandler(sri, sci, content) {
  console.log(content)
  const trs = content.getElementsByTagName('tr');

  let rowspanCache = {};

  for (let trIndex = 0; trIndex < trs.length; trIndex += 1) {
    const tds = trs[trIndex].getElementsByTagName('td');

    let sriBase = 0;
    for (let tdIndex = 0; tdIndex < tds.length; tdIndex += 1) {
      let td = tds[tdIndex];
      let value = td.innerText.replace(/[(^\r\n)|(^\n)|(\r\n$)|(\n$)]/g, '');
      let rowspan = td.getAttribute('rowspan');
      let colspan = td.getAttribute('colspan');

      rowspan = rowspan ? parseInt(rowspan, 10) : 1;
      colspan = colspan ? parseInt(colspan, 10) : 1;

      if (rowspan > 1) {
        for (let k = 0; k < rowspan; k += 1) {
          if (k === 0) {
            rowspanCache[`${trIndex + k},${tdIndex + 1}`] = colspan - 1;
          } else {
            rowspanCache[`${trIndex + k},${tdIndex}`] = colspan;
          }
        }
      }

      console.log('rowspanCache', rowspanCache)

      // 合并单元格
      if (rowspan > 1 || colspan > 1) {
        const eri = sri + trIndex + rowspan - 1;
        const eci = sci + tdIndex + colspan - 1;
        this.merge(sri + trIndex, sci + tdIndex, eri, eci);
        this.setText(sri + trIndex, sci + tdIndex, value);
      }
      else {
        if (rowspanCache[`${trIndex},${tdIndex}`]) {
          sriBase += (rowspanCache[`${trIndex},${tdIndex}`]);
        }

        const ci = sriBase + tdIndex;
        this.setText(sri + trIndex, sci + ci, value);
      }

      console.log('row:', sri + trIndex, 'col:', tdIndex, 'sriBase:', sriBase, 'rowspan:', rowspan, 'colspan', colspan, 'value:', value);
    }
  }

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
      if (!this.focusing()) return;
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
