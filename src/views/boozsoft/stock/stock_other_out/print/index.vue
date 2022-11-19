<template>

    <Button @click="openPrint" class="actod-btn">打印测试</Button>

</template>
<script setup>
import {Button} from 'ant-design-vue'
import {useNewPrint} from "/@/utils/boozsoft/print/print";
import {autoTableStyle} from "/@/boozsoft/hooks/print/print-setting";
let theGlobalStyle = autoTableStyle()
function openPrint(){
  useNewPrint({data: ['l', 'mm', [140,241], false]}, (doc) => {
    function give(){

      doc.autoTable({
        styles:autoTableStyle(),
        head: [['仓库', '存货编码', '存货名称', 	'规格型号',	'单位','数量','单价','金额','批号','失效日期','质量']],
        body: [
          ['001', '00013', '00013', 	'1存货名称',	'型号','盒','3.00','250.00','750.00','20160829','2017-8-28'],
          ['001', '00013', '00013', 	'1存货名称',	'型号','盒','3.00','250.00','1,250.00','20160829','2017-8-28'],
          ['001', '00013', '00013', 	'1存货名称',	'型号','盒','3.00','250.00','500.00','20160829','2017-8-28'],
          ['001', '00013', '00013', 	'1存货名称',	'型号','盒','3.00','250.00','1,000.00','20160829','2017-8-28'],
          ['', '', '', 	'',	'','','','','','',''],
          ['', '', '', 	'',	'','','','','','',''],
          ['', '', '', 	'',	'','','','','','',''],
          ['合计', '', '', 	'',	'','','','','','',''],
          ['备注:', '', '', 	'',	'','','','','','',''],
        ],
        margin: {
          left: 10,
          top: 30,
          bottom: 10
        },
        alternateRowStyles : {
          fillColor: [255,255,255]
        },
        bodyStyles: {
          fillColor: [255,255,255]
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
            '采购入库单' ,
            100,
            3,
            10
          );

          // 第一行
          const oneY=14
          data.doc.setFontSize(14)

          doc.autoTableText(
            '单据日期：2016-10-21' ,
            tabMarginLeft,
            oneY,
            0
          );

          doc.autoTableText(
            '单据编号：II-2016-10-0003' ,
            data.cursor.x/2-35,
            oneY,
            0
          );

          doc.autoTableText(
            '来源单据：进货单' ,
            data.cursor.x - 65,
            oneY,
            0
          );

          // 第二行
          const twoY=21
          doc.autoTableText(
            '供应商：测试供应商' ,
            tabMarginLeft+5,
            twoY,
            0
          );


          doc.autoTableText(
            '经手人：' ,
            data.cursor.x/2-35+5,
            twoY,
            0
          );


          doc.autoTableText(
            '来源单号：PS-2016-10-0001' ,
            data.cursor.x - 65,
            twoY,
            0
          );



          doc.autoTableText(
            '制单人：' ,
            tabMarginLeft+5,
            data.cursor.y + 3,
            0
          );
          doc.autoTableText(
            '审核人',
            data.cursor.x/2-25,
            data.cursor.y + 3,
            0
          );
          doc.autoTableText(
            '第'+data.doc.getCurrentPageInfo().pageNumber+'页/共'+1+'页',
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
        columnStyles: {
          0: {cellWidth: 14, halign: 'left'},
          1: {cellWidth: 20, halign: 'left'},
          2: {cellWidth: 23, halign: 'right'},
          3: {cellWidth: 23, halign: 'right'},
          4: {cellWidth: 12, halign: 'right'},
          5: {cellWidth: 11, halign: 'right'},
          6: {cellWidth: 20, halign: 'right'},
          7: {cellWidth: 20, halign: 'right'},
          8: {cellWidth: 20, halign: 'right'},
          9: {cellWidth: 25, halign: 'right'},
          10: {cellWidthhalign: 'right'},
        }
      })

    }
    give()
    doc.addPage()

    give()
    doc.addPage()

    give()
    doc.addPage()

    give()
    doc.addPage()

    give()
    doc.addPage()

    give()
    doc.addPage()

    give()
    doc.addPage()

    give()
    doc.addPage()

    give()
    doc.addPage()

    give()


    })
  //
}
</script>
