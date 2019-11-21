/* global window */
import { bind } from '../component/event';

// 粘贴插件
export default class Plugin {
  setup() {
    bind(window, 'paste', (e) => {
      let text = e.clipboardData.getData('text/plain');
      text = encodeURIComponent(text);

      const axis = this.getSelectedAxis();
      const sri = axis.ri;
      const sci = axis.ci;

      // 得到粘贴板内容的数组
      const rowsArray = text.split('%0A');
      if (rowsArray.length > 0) {
        // 从excel 复制的数据最后一行会有空的回车符，这里要手动的去掉
        if (rowsArray[rowsArray.length - 1].length === 0) {
          rowsArray.splice(rowsArray.length - 1, 1);
        }

        for (let ri = 0; ri < rowsArray.length; ri += 1) {
          const colsArray = rowsArray[ri].split('%09');

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
