/* global window */
import { bind } from '../component/event';

function charFilter(str) {
  let fileType = '';
  // 非可见字符asc,多个就可以用数组
  const ascNum = 173;
  for (let i = 0; i < str.length; i++) {
    console.log(`${str.charAt(i)}:${str.charCodeAt(i)}`);
    if (str.charCodeAt(i) !== ascNum) {
      fileType += str.charAt(i);
    }
  }
  return fileType;
}


// 粘贴插件
export default class Plugin {
  setup() {
    bind(window, 'paste', (e) => {
      let text = e.clipboardData.getData('text');
      //  text = charFilter(text);

      console.log(text);
      text = encodeURIComponent(text);
      console.log(text);


      const axis = this.getSelectedAxis();
      const sri = axis.ri;
      const sci = axis.ci;

      // 得到粘贴板内容的数组
      const rowsArray = text.split('%0D%0A'); // 换行符
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
