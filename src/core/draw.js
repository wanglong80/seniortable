/* global window */
function dpr() {
  return window.devicePixelRatio || 1;
}

function thinLineWidth() {
  return dpr() - 0.5;
}

// 正常像素单位
function npx(px) {
  return parseInt(px * dpr(), 10);
}

// 细的像素单位（一般用来画细线）
function npxLine(px) {
  const n = npx(px);
  return n > 0 ? n - 0.5 : 0.5;
}

// 画字体线（下划线、删除线）
function drawFontLine(type, tx, ty, align, valign, blheight, blwidth) {
  const floffset = { x: 0, y: 0 };
  if (type === 'underline') {
    if (valign === 'bottom') {
      floffset.y = 0;
    } else if (valign === 'top') {
      floffset.y = -(blheight + 2);
    } else {
      floffset.y = -blheight / 2;
    }
  } else if (type === 'strike') {
    if (valign === 'bottom') {
      floffset.y = blheight / 2;
    } else if (valign === 'top') {
      floffset.y = -((blheight / 2) + 2);
    }
  }

  if (align === 'center') {
    floffset.x = blwidth / 2;
  } else if (align === 'right') {
    floffset.x = blwidth;
  }
  this.line(
    [tx - floffset.x, ty - floffset.y],
    [tx - floffset.x + blwidth, ty - floffset.y],
  );
}

class Draw {
  constructor(el, width, height) {
    this.el = el;
    this.ctx = el.getContext('2d');
    this.resize(width, height);
    this.ctx.scale(dpr(), dpr());
  }

  resize(width, height) {
    // console.log('dpr:', dpr);
    this.el.style.width = `${width}px`;
    this.el.style.height = `${height}px`;
    this.el.width = npx(width);
    this.el.height = npx(height);
  }

  clear() {
    const { width, height } = this.el;
    this.ctx.clearRect(0, 0, width, height);
    return this;
  }

  attr(options) {
    Object.assign(this.ctx, options);
    return this;
  }

  save() {
    this.ctx.save();
    this.ctx.beginPath();
    return this;
  }

  restore() {
    this.ctx.restore();
    return this;
  }

  beginPath() {
    this.ctx.beginPath();
    return this;
  }

  translate(x, y) {
    this.ctx.translate(npx(x), npx(y));
    return this;
  }

  clearRect(x, y, w, h) {
    this.ctx.clearRect(x, y, w, h);
    return this;
  }

  fillRect(x, y, w, h) {
    this.ctx.fillRect(npx(x) - 0.5, npx(y) - 0.5, npx(w), npx(h));
    return this;
  }

  // 向单元格填充文本
  fillText(text, x, y) {
    // console.log(`填充文本：${text} X:${x}Y:${y}`);
    this.ctx.fillText(text, npx(x), npx(y));
    return this;
  }

  /*
   * 绘制文本
    txt: render text
    box: DrawBox
    attr: {
      align: left | center | right
      valign: top | middle | bottom
      color: '#333333',
      strike: false,
      font: {
        name: 'Arial',
        size: 14,
        bold: false,
        italic: false,
      }
    }
    textWrap: text wrapping
  */
  text(txt, box, attr = {}, textWrap = true) {
    const { ctx } = this;
    const {
      align, valign, font, color, strike, underline,
    } = attr;
    const tx = box.textx(align);
    ctx.save();
    ctx.beginPath();
    this.attr({
      textAlign: align,
      textBaseline: valign,
      font: `${font.italic ? 'italic' : ''} ${font.bold ? 'bold' : ''} ${npx(font.size)}px ${font.name}`,
      fillStyle: color,
      strokeStyle: color,
    });
    const txtWidth = ctx.measureText(txt).width;
    let hoffset = 0;
    if (textWrap) {
      const n = Math.ceil(txtWidth / box.innerWidth());
      hoffset = ((n - 1) * font.size) / 2;
    }
    let ty = box.texty(valign, font.size, hoffset);
    // console.log('tx: ', tx, ', ty:', ty);
    if (textWrap && txtWidth > box.innerWidth()) {
      const textLine = { len: 0, start: 0 };
      for (let i = 0; i < txt.length; i += 1) {
        if (textLine.len >= box.innerWidth()) {
          this.fillText(txt.substring(textLine.start, i), tx, ty);
          if (strike) {
            drawFontLine.call(this, 'strike', tx, ty, align, valign, font.size, textLine.len);
          }
          if (underline) {
            drawFontLine.call(this, 'underline', tx, ty, align, valign, font.size, textLine.len);
          }
          ty += font.size + 2;
          textLine.len = 0;
          textLine.start = i;
        }
        textLine.len += ctx.measureText(txt[i]).width;
      }
      if (textLine.len > 0) {
        this.fillText(txt.substring(textLine.start), tx, ty);
        if (strike) {
          drawFontLine.call(this, 'strike', tx, ty, align, valign, font.size, textLine.len);
        }
        if (underline) {
          drawFontLine.call(this, 'underline', tx, ty, align, valign, font.size, textLine.len);
        }
      }
    } else {
      this.fillText(txt, tx, ty);
      if (strike) {
        drawFontLine.call(this, 'strike', tx, ty, align, valign, font.size, txtWidth);
      }
      if (underline) {
        drawFontLine.call(this, 'underline', tx, ty, align, valign, font.size, txtWidth);
      }
    }
    ctx.restore();
    return this;
  }

  // 设置线的粗细、样式、颜色
  // 建议函数名改为 setLineStyle
  setLineStyle(style, color) {
    const { ctx } = this;
    ctx.lineWidth = thinLineWidth;
    ctx.strokeStyle = color;
    // console.log('style:', style);
    if (style === 'medium') {
      ctx.lineWidth = npx(2) - 0.5;
    } else if (style === 'thick') {
      ctx.lineWidth = npx(3);
    } else if (style === 'dashed') {
      ctx.setLineDash([npx(3), npx(2)]);
    } else if (style === 'dotted') {
      ctx.setLineDash([npx(1), npx(1)]);
    } else if (style === 'double') {
      ctx.setLineDash([npx(2), 0]);
    }
    return this;
  }

  // 画直线
  // 参数为 [[x0,y0], [x1,y1], [x2,y2], ...]
  // 从 [x0,y0] 出发 分别向 [x1,y1] [x2,y2]... 画直线
  line(...xys) {
    const { ctx } = this;
    if (xys.length > 1) {
      const [x, y] = xys[0];
      ctx.moveTo(npxLine(x), npxLine(y));
      for (let i = 1; i < xys.length; i += 1) {
        const [x1, y1] = xys[i];
        ctx.lineTo(npxLine(x1), npxLine(y1));
      }
      ctx.stroke();
    }
    return this;
  }

  // 绘出单元格线框样式
  // 参数
  strokeBorders(borderBox) {
    const { ctx } = this;
    ctx.save();
    ctx.beginPath();
    // border
    const {
      borderTop, borderRight, borderBottom, borderLeft,
    } = borderBox;
    if (borderTop) {
      this.setLineStyle(...borderTop);
      // console.log('box.topxys:', box.topxys());
      this.line(...borderBox.topxys());
    }
    if (borderRight) {
      this.setLineStyle(...borderRight);
      this.line(...borderBox.rightxys());
    }
    if (borderBottom) {
      this.setLineStyle(...borderBottom);
      this.line(...borderBox.bottomxys());
    }
    if (borderLeft) {
      this.setLineStyle(...borderLeft);
      this.line(...borderBox.leftxys());
    }
    ctx.restore();
  }

  dropdown(box) {
    const { ctx } = this;
    const {
      x, y, width, height,
    } = box;
    const sx = x + width - 15;
    const sy = y + height - 15;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(npx(sx), npx(sy));
    ctx.lineTo(npx(sx + 8), npx(sy));
    ctx.lineTo(npx(sx + 4), npx(sy + 6));
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 0, 0, .45)';
    ctx.fill();
    ctx.restore();
  }

  error(box) {
    const { ctx } = this;
    const { x, y, width } = box;
    const sx = x + width - 1;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(npx(sx - 8), npx(y - 1));
    ctx.lineTo(npx(sx), npx(y - 1));
    ctx.lineTo(npx(sx), npx(y + 8));
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 0, 0, .65)';
    ctx.fill();
    ctx.restore();
  }

  frozen(box) {
    const { ctx } = this;
    const { x, y, width } = box;
    const sx = x + width - 1;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(npx(sx - 8), npx(y - 1));
    ctx.lineTo(npx(sx), npx(y - 1));
    ctx.lineTo(npx(sx), npx(y + 8));
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 255, 0, .85)';
    ctx.fill();
    ctx.restore();
  }

  rect(box, dtextcb) {
    const { ctx } = this;
    const {
      x, y, width, height, bgcolor,
    } = box;
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = bgcolor || '#fff';
    ctx.rect(npxLine(x + 1), npxLine(y + 1), npx(width - 2), npx(height - 2));
    ctx.clip();
    ctx.fill();
    dtextcb();
    ctx.restore();
  }
}

export default {};
export {
  Draw,
  thinLineWidth,
  npx,
  npxLine,
};
