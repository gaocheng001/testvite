function abc(){
  //  单据打印表头模板表
  const abc={
    id:'',  // 主键
    tenantId:'', // 公司唯一码
    ccode:'', // 模板唯一码
    printModel:'', // 模板名称
    iyear:'', // 单据类型（CGDHD采购到货单、XHD销货单、........）
    cstyle:'',  // 单据类型（1系统模板、0自定义模板）系统模板不可更改
    titleName:'',  // 表格大标题打印名称（限制字数）
    titleSize:'',  // 表格大标题打印字段大小（字号大小）
  }

  // 单据打印表头模板表(stock_print_head)
  const a2={
    id:'',  // 主键
    tenantId:'', // 公司唯一码
    ccode:'', // 对应模板唯一码
    printClass:'', // 栏目属性（1系统档案、0自定义档案、2文本）
    printName:'',  // 表头对应字段名称（原表格所有表头字段，文本类型不用读）
    printNameP:'',  // 表头字段打印名称
    isPrint:'',  // 是否打印（1打印、0不打印）
    printNum:'', // 位置编码（1开始）
    printDq:'',  // 对齐方式（L左，B中间，R右）
    printKd:'',  // 打印宽度（1——1000）
    fontSime:'', // 字体大小
    cfree1:'',  //
    cfree2:'',  //
    cfree3:'',  //
    cfree4:'',  //
    cfree5:'',  //
  }

  //  单据打印表体模板表(stock_print_body)
  const a3={
    id:'',  // 主键
    tenantId:'', // 公司唯一码
    ccode:'', // 对应模板唯一码
    printClass:'', // 栏目属性（1系统、0自定义、2文本）
    printName:'',  // 表体对应字段名称（原表格所有表体字段，文本类型不用读）
    printNameP:'',  // 表体字段打印名称
    isPrint:'',  // 是否打印（1打印、0不打印）
    printNum:'', // 位置编码（1开始）
    printDq:'',  // 对齐方式（L左，B中间，R右）
    printKd:'',  // 打印宽度（1——1000）
    fontSime:'', // 字体大小
    cfree1:'',  //
    cfree2:'',  //
    cfree3:'',  //
    cfree4:'',  //
    cfree5:'',  //
  }
}














