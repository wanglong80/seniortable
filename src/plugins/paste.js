/* global window */
import { bind } from '../component/event';

// 粘贴插件
export default class Plugin {
  setup() {
    bind(window, 'paste', (e) => {
      let text = e.clipboardData.getData('text');
      text = encodeURIComponent(text);

      const axis = this.getSelectedAxis();
      const sri = axis.ri;
      const sci = axis.ci;

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
          rowText = rowText.replace(/(?:%22)((?:%22)*)/ig, '$1');

          const colsArray = rowText.split('%09'); // 间隔符

          for (let ci = 0; ci < colsArray.length; ci += 1) {
            const value = decodeURIComponent(colsArray[ci]);
            this.setDataCellText(ri + sri, ci + sci, value);
          }
        }

        this.render();
      }
    });
  }
}
