export function    autoTableStyle() {
  return {
    font: 'fuhuiR',
    fontStyle: 'normal',
    overflow: 'linebreak', // linebreak, ellipsize, visible or hidden
    fillColor: [255,255,255], // Either false for transparent, rbg array e.g. [255, 255, 255] or gray level e.g 200
    textColor: 20,
    halign: 'left', // left, center, right, justify
    valign: 'top', // top, middle, bottom
    fontSize: 16 * 0.8,
    cellPadding: {
      top:1,
      left:1,
      right:1,
      bottom:1,
    }, // number or {top,left,right,left,vertical,horizontal}
    cellWidth: 'auto', // 'auto'|'wrap'|number
    minCellHeight: 0,
    minCellWidth: 0,
    // lineColor: [0, 0, 0],
    lineColor:[0, 0, 0],
    lineWidth: 0.2
  }
}
