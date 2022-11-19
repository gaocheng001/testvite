<template>

  <!--    <Button @click="openPrint" class="actod-btn">打印</Button>-->

</template>
<script setup>
import {useNewPrint} from "/@/utils/boozsoft/print/print";
import {autoTableStyle} from "/@/boozsoft/hooks/print/print-setting";
import {findStockPrintAllByCcode} from "/@/api/stockPrint";

let theGlobalStyle = autoTableStyle()

async function openPrint(data, getColumns) {
  const result=await findStockPrintAllByCcode({ccode:'caigoudaohuo'})
  const stockPrintBody = result.stockPrintBody
    .map(it => {
      return {dataIndex: it.printNameP, title: it.printName, width: it.printKd}
    })
  const tpl = {
    columns: stockPrintBody,
    body: []
  }
  data.forEach(it => {
    const row = []
    tpl.columns.forEach(it2 => {
      row.push(it[it2.dataIndex])
    })
    tpl.body.push(row)
  })

  const abc = data.map(it => {
    return Object.values(it)
  })

  function createModel() {
    const columnStyles = {}
    let widthSum = 0
    tpl.columns.forEach((it, i) => {
      columnStyles[i] = {cellWidth: it.width * 0.4, halign: 'left'}
      widthSum += it.width * 0.4
    })

    if (widthSum > 5000) {
      alert('列总宽度超出页面宽度，不能进行打印')
    }

    const model = {

      columns: tpl.columns,
      body: tpl.body,
      columnStyles
    }

    return model
  }

  const model = createModel()

  useNewPrint({data: ['l', 'mm', [140, 241], false]}, (doc) => {
    function give() {

      doc.autoTable({
        styles: autoTableStyle(),
        head: [model.columns],
        body: model.body,
        margin: {
          left: 10,
          top: 30,
          bottom: 10
        },
        alternateRowStyles: {
          fillColor: [255, 255, 255]
        },
        bodyStyles: {
          fillColor: [255, 255, 255]
        },
        addPageContent: (data) => {
          //data.table.finalY 表格最大可容纳y轴坐标，超出时将根据设置决定是否另取一页.在页面需要分页时出现
          let tabHeigth = data.table.height,
            tabMarginTop = data.settings.margin.top,
            tabSize = data.table.finalY - tabMarginTop,//表格最大Y轴-表格顶部距离得到每页表格的最大值
            tabMarginLeft = data.settings.margin.left;

          //data.cursor.y ,data.cursor.x:表格最后一个单元坐标
          data.doc.setFontSize(18)
          // data.doc.setFont('fuhuiR', 'bold')

          doc.autoTableText(
            '采购到货单',
            100,
            3,
            10
          );

          // 第一行
          const oneY = 14
          data.doc.setFontSize(14)

          doc.autoTableText(
            '单据日期：2016-10-21',
            tabMarginLeft,
            oneY,
            0
          );

          doc.autoTableText(
            '单据编号：II-2016-10-0003',
            data.cursor.x / 2 - 35,
            oneY,
            0
          );

          doc.autoTableText(
            '来源单据：进货单',
            data.cursor.x - 65,
            oneY,
            0
          );

          // 第二行
          const twoY = 21
          doc.autoTableText(
            '供应商：测试供应商',
            tabMarginLeft + 5,
            twoY,
            0
          );


          doc.autoTableText(
            '经手人：',
            data.cursor.x / 2 - 35 + 5,
            twoY,
            0
          );


          doc.autoTableText(
            '来源单号：PS-2016-10-0001',
            data.cursor.x - 65,
            twoY,
            0
          );


          doc.autoTableText(
            '制单人：',
            tabMarginLeft + 5,
            data.cursor.y + 3,
            0
          );
          doc.autoTableText(
            '审核人',
            data.cursor.x / 2 - 25,
            data.cursor.y + 3,
            0
          );
          doc.autoTableText(
            '第' + data.doc.getCurrentPageInfo().pageNumber + '页/共' + 1 + '页',
            // '第'+data.doc.getCurrentPageInfo().pageNumber+'页',
            data.cursor.x - 30,
            data.cursor.y + 3,
            0
          );
        },
        didParseCell(data) {
          data.cell.styles.halign = 'center'
          if (data.section == 'head' && data.row.index == 0) {
            // data.cell.styles.fontStyle = 'bold'
            data.cell.styles.fontStyle = 'bold'


          }

        },
        columnStyles: model.columnStyles
      })

    }

    give()

  })
  //
}

defineExpose({
  openPrint
});
</script>
