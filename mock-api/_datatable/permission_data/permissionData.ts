const permissionDatas=[
  {'id': 18, 'name': 'system', 'authority': 'system'}, {
    'id': 19,
    'name': 'menu',
    'authority': 'menu'
  }, {'id': 20, 'name': 'user', 'authority': 'user'}, {
    'id': 21,
    'name': 'jigou',
    'authority': 'jigou'
  }, {'id': 22, 'name': 'dict', 'authority': 'dict'}, {
    'id': 23,
    'name': 'role',
    'authority': 'role'
  }, {'id': 25, 'name': 'dress', 'authority': 'dress'}, {
    'id': 33,
    'name': 'psntype',
    'authority': 'psntype'
  }, {'id': 34, 'name': 'psn', 'authority': 'psn'}, {
    'id': 35,
    'name': 'department',
    'authority': 'department'
  }, {'id': 36, 'name': 'dept', 'authority': 'dept'}, {
    'id': 37,
    'name': 'project-category',
    'authority': 'project-category'
  }, {'id': 38, 'name': 'base-info', 'authority': 'base-info'}, {
    'id': 39,
    'name': 'project',
    'authority': 'project'
  }, {'id': 40, 'name': 'sys-project-category', 'authority': 'sys-project-category'}, {
    'id': 45,
    'name': 'blocktable',
    'authority': 'blocktable'
  }, {'id': 46, 'name': 'currencyinfo', 'authority': 'currencyinfo'}, {
    'id': 48,
    'name': 'caozuoyuan',
    'authority': 'caozuoyuan'
  }, {'id': 49, 'name': 'customer_class', 'authority': 'customer_class'}, {
    'id': 50,
    'name': 'syscustomer',
    'authority': 'syscustomer'
  }, {'id': 51, 'name': 'customer2', 'authority': 'customer2'}, {
    'id': 52,
    'name': 'sup_class',
    'authority': 'sup_class'
  }, {'id': 53, 'name': 'supplier', 'authority': 'supplier'}, {
    'id': 54,
    'name': 'supplier2',
    'authority': 'supplier2'
  }, {'id': 55, 'name': 'electronic-invoice', 'authority': 'electronic-invoice'}, {
    'id': 56,
    'name': '/project-acc',
    'authority': '/project-acc'
  }, {'id': 57, 'name': 'project-class', 'authority': 'project-class'}, {
    'id': 58,
    'name': 'accvoucher',
    'authority': 'accvoucher'
  }, {'id': 59, 'name': 'accvoucher-template', 'authority': 'accvoucher-template'}, {
    'id': 60,
    'name': 'sys-project',
    'authority': 'sys-project'
  }, {'id': 1001, 'name': '4', 'authority': '4'}, {
    'id': 1003,
    'name': '6',
    'authority': '6'
  }, {'id': 1007, 'name': '4', 'authority': '4'}, {
    'id': 1021,
    'name': 'eeb-bill',
    'authority': 'eeb-bill'
  }, {'id': 2001, 'name': 'account', 'authority': 'account'}, {
    'id': 2002,
    'name': 'caiwupiaoju',
    'authority': 'caiwupiaoju'
  }, {'id': 2003, 'name': 'receipt', 'authority': 'receipt'}, {
    'id': 2004,
    'name': 'reimbursement',
    'authority': 'reimbursement'
  }, {'id': 2005, 'name': 'approval-doc', 'authority': 'approval-doc'}, {
    'id': 2006,
    'name': 'contract',
    'authority': 'contract'
  }, {'id': 3001, 'name': 'sett-modes', 'authority': 'sett-modes'}, {
    'id': 3002,
    'name': 'voucher-type',
    'authority': 'voucher-type'
  }, {'id': 3003, 'name': 'iperiod', 'authority': 'iperiod'}, {
    'id': 3004,
    'name': 'bank-statement',
    'authority': 'bank-statement'
  }, {'id': 3005, 'name': 'bank', 'authority': 'bank'}, {
    'id': 3006,
    'name': 'sys-bank',
    'authority': 'sys-bank'
  }, {'id': 5000, 'name': 'accinfo', 'authority': 'accinfo'}, {
    'id': 8003,
    'name': 'bankpiaoju',
    'authority': 'bankpiaoju'
  }, {'id': 8004, 'name': 'elect-order', 'authority': 'elect-order'}, {
    'id': 8005,
    'name': 'bank-bill',
    'authority': 'bank-bill'
  }, {'id': 8006, 'name': 'bank-check', 'authority': 'bank-check'}, {
    'id': 8007,
    'name': 'acccode',
    'authority': 'acccode'
  }, {'id': 8008, 'name': 'accstandard', 'authority': 'accstandard'}, {
    'id': 8010,
    'name': 'transfer-definition',
    'authority': 'transfer-definition'
  }, {'id': 8011, 'name': 'carry-forward', 'authority': 'carry-forward'}, {
    'id': 8012,
    'name': 'correspond',
    'authority': 'correspond'
  }, {'id': 8013, 'name': 'exchange-status', 'authority': 'exchange-status'}, {
    'id': 8014,
    'name': 'customize',
    'authority': 'customize'
  }, {'id': 8015, 'name': 'amortization', 'authority': 'amortization'}, {
    'id': 8016,
    'name': 'withholding',
    'authority': 'withholding'
  }, {'id': 8017, 'name': 'transfer-generation', 'authority': 'transfer-generation'}, {
    'id': 8018,
    'name': 'acctemplate',
    'authority': 'acctemplate'
  }, {'id': 8019, 'name': 'findcode', 'authority': 'findcode'}, {
    'id': 8801,
    'name': '/qichus',
    'authority': '/qichus'
  }, {'id': 8802, 'name': '/vouchers', 'authority': '/vouchers'}, {
    'id': 8803,
    'name': '/electronic-invoice',
    'authority': '/electronic-invoice'
  }, {'id': 8804, 'name': '/cashiers', 'authority': '/cashiers'}, {
    'id': 8805,
    'name': '/account-book',
    'authority': '/account-book'
  }, {'id': 8806, 'name': '/reports', 'authority': '/reports'}, {
    'id': 8807,
    'name': '/ends',
    'authority': '/ends'
  }, {'id': 8808, 'name': '/setting', 'authority': '/setting'}, {
    'id': 8809,
    'name': '/etc',
    'authority': '/etc'
  }, {'id': 8901, 'name': 'kemu-qichu', 'authority': 'kemu-qichu'}, {
    'id': 8902,
    'name': '期初数据',
    'authority': '期初数据'
  }, {'id': 8903, 'name': 'tinazhi-voucher', 'authority': 'tinazhi-voucher'}, {
    'id': 8904,
    'name': 'list-voucher',
    'authority': 'list-voucher'
  }, {'id': 8905, 'name': 'print-voucher', 'authority': 'print-voucher'}, {
    'id': 8906,
    'name': 'kemu-total',
    'authority': 'kemu-total'
  }, {'id': 8907, 'name': 'cashier-signature', 'authority': 'cashier-signature'}, {
    'id': 8908,
    'name': 'super-signature',
    'authority': 'super-signature'
  }, {'id': 8909, 'name': 'verify-voucher', 'authority': 'verify-voucher'}, {
    'id': 8910,
    'name': 'bookkeeping',
    'authority': 'bookkeeping'
  }, {'id': 8911, 'name': 'journal', 'authority': 'journal'}, {
    'id': 8912,
    'name': 'bank-reconciliation',
    'authority': 'bank-reconciliation'
  }, {'id': 8913, 'name': 'br-qichu', 'authority': 'br-qichu'}, {
    'id': 8914,
    'name': 'br-template',
    'authority': 'br-template'
  }, {'id': 8916, 'name': 'br-blend', 'authority': 'br-blend'}, {
    'id': 8917,
    'name': 'br-balance-change',
    'authority': 'br-balance-change'
  }, {'id': 8918, 'name': 'br-un-audit', 'authority': 'br-un-audit'}, {
    'id': 8919,
    'name': 'ei-identify',
    'authority': 'ei-identify'
  }, {'id': 8922, 'name': 'ei-voucher', 'authority': 'ei-voucher'}, {
    'id': 8923,
    'name': 'ab-kemuzhang',
    'authority': 'ab-kemuzhang'
  }, {'id': 8925, 'name': 'ab-xjll', 'authority': 'ab-xjll'}, {
    'id': 8926,
    'name': 'abk-total',
    'authority': 'abk-total'
  }, {'id': 8927, 'name': 'abk-yetable', 'authority': 'abk-yetable'}, {
    'id': 8928,
    'name': 'abk-mxtable',
    'authority': 'abk-mxtable'
  }, {'id': 8929, 'name': 'abk-xstable', 'authority': 'abk-xstable'}, {
    'id': 8930,
    'name': 'abk-rjtable',
    'authority': 'abk-rjtable'
  }, {
    'id': 8931,
    'name': 'abf-customer-contacts',
    'authority': 'abf-customer-contacts'
  }, {
    'id': 8932,
    'name': 'abf-supplier-contacts',
    'authority': 'abf-supplier-contacts'
  }, {
    'id': 8933,
    'name': 'abf-project-contacts',
    'authority': 'abf-project-contacts'
  }, {'id': 8934, 'name': 'abf-dept-contacts', 'authority': 'abf-dept-contacts'}, {
    'id': 8935,
    'name': 'abf-personal-contacts',
    'authority': 'abf-personal-contacts'
  }, {
    'id': 8936,
    'name': 'abf-composite-contacts',
    'authority': 'abf-composite-contacts'
  }, {'id': 8937, 'name': 'abfcc-kumu-yetable', 'authority': 'abfcc-kumu-yetable'}, {
    'id': 8938,
    'name': 'abfcc-yetable',
    'authority': 'abfcc-yetable'
  }, {'id': 8939, 'name': 'abfcc-kemu-mxable', 'authority': 'abfcc-kemu-mxable'}, {
    'id': 8940,
    'name': 'abfcc-mxable',
    'authority': 'abfcc-mxable'
  }, {'id': 8941, 'name': 'abfcc-dept-yetable', 'authority': 'abfcc-dept-yetable'}, {
    'id': 8942,
    'name': 'abfcc-project-yetable',
    'authority': 'abfcc-project-yetable'
  }, {'id': 8943, 'name': 'abfcc-types-yetable', 'authority': 'abfcc-types-yetable'}, {
    'id': 8944,
    'name': 'abfcc-contacts-two',
    'authority': 'abfcc-contacts-two'
  }, {
    'id': 8945,
    'name': 'abfcc-contacts-analysis',
    'authority': 'abfcc-contacts-analysis'
  }, {'id': 8946, 'name': 'abfsc-kumu-yetable', 'authority': 'abfsc-kumu-yetable'}, {
    'id': 8947,
    'name': 'abfsc-yetable',
    'authority': 'abfsc-yetable'
  }, {'id': 8948, 'name': 'abfsc-kemu-mxable', 'authority': 'abfsc-kemu-mxable'}, {
    'id': 8949,
    'name': 'abfsc-mxable',
    'authority': 'abfsc-mxable'
  }, {
    'id': 8950,
    'name': 'abfsc-project-yetable',
    'authority': 'abfsc-project-yetable'
  }, {
    'id': 8951,
    'name': 'abfsc-project-mxtable',
    'authority': 'abfsc-project-mxtable'
  }, {'id': 8952, 'name': 'abfsc-contacts-two', 'authority': 'abfsc-contacts-two'}, {
    'id': 8953,
    'name': 'abfsc-contacts-analysis',
    'authority': 'abfsc-contacts-analysis'
  }, {'id': 8954, 'name': 'abfpc-kumu-sumtable', 'authority': 'abfpc-kumu-sumtable'}, {
    'id': 8955,
    'name': 'abfpc-sumtable',
    'authority': 'abfpc-sumtable'
  }, {
    'id': 8956,
    'name': 'abfpc-three-sumtable',
    'authority': 'abfpc-three-sumtable'
  }, {'id': 8957, 'name': 'abfpc-dept-sumtable', 'authority': 'abfpc-dept-sumtable'}, {
    'id': 8958,
    'name': 'abfpc-kemu-mxtable',
    'authority': 'abfpc-kemu-mxtable'
  }, {'id': 8959, 'name': 'abfpc-mxtable', 'authority': 'abfpc-mxtable'}, {
    'id': 8960,
    'name': 'abfpc-dept-mtable',
    'authority': 'abfpc-dept-mtable'
  }, {'id': 8961, 'name': 'abfpc-types-mxtable', 'authority': 'abfpc-types-mxtable'}, {
    'id': 8962,
    'name': 'abfpc-many-mxtable',
    'authority': 'abfpc-many-mxtable'
  }, {
    'id': 8963,
    'name': 'abfpc-statistics-analysis',
    'authority': 'abfpc-statistics-analysis'
  }, {'id': 8964, 'name': 'abfdc-kumu-sumtable', 'authority': 'abfdc-kumu-sumtable'}, {
    'id': 8965,
    'name': 'abfdc-sumtable',
    'authority': 'abfdc-sumtable'
  }, {'id': 8966, 'name': 'abfdc-kemu-mxtable', 'authority': 'abfdc-kemu-mxtable'}, {
    'id': 8967,
    'name': 'abfdc-mxtable',
    'authority': 'abfdc-mxtable'
  }, {'id': 8968, 'name': 'abfdc-many-mxtable', 'authority': 'abfdc-many-mxtable'}, {
    'id': 8969,
    'name': 'abfdc-statistics-analysis',
    'authority': 'abfdc-statistics-analysis'
  }, {'id': 8970, 'name': 'abfgc-kumu-yetable', 'authority': 'abfgc-kumu-yetable'}, {
    'id': 8971,
    'name': 'abfgc-dept-yetable',
    'authority': 'abfgc-dept-yetable'
  }, {'id': 8972, 'name': 'abfgc-yetable', 'authority': 'abfgc-yetable'}, {
    'id': 8973,
    'name': 'abfgc-kemu-mxtable',
    'authority': 'abfgc-kemu-mxtable'
  }, {'id': 8974, 'name': 'abfgc-mxtable', 'authority': 'abfgc-mxtable'}, {
    'id': 8975,
    'name': 'abfgc-contacts-two',
    'authority': 'abfgc-contacts-two'
  }, {
    'id': 8976,
    'name': 'abfgc-contacts-analysis',
    'authority': 'abfgc-contacts-analysis'
  }, {'id': 8977, 'name': 'abfzc-fuzhu-hztable', 'authority': 'abfzc-fuzhu-hztable'}, {
    'id': 8978,
    'name': 'abfzc-fuzhu-mxtable',
    'authority': 'abfzc-fuzhu-mxtable'
  }, {
    'id': 8979,
    'name': 'abfzc-manyfuzhu-hztable',
    'authority': 'abfzc-manyfuzhu-hztable'
  }, {
    'id': 8980,
    'name': 'abfzc-manyfuzhu-mxtable',
    'authority': 'abfzc-manyfuzhu-mxtable'
  }, {'id': 8981, 'name': 'abx-qichu-input', 'authority': 'abx-qichu-input'}, {
    'id': 8982,
    'name': 'abx-xjll-voucher-query',
    'authority': 'abx-xjll-voucher-query'
  }, {'id': 8983, 'name': 'abx-xjll-mxtable', 'authority': 'abx-xjll-mxtable'}, {
    'id': 8984,
    'name': 'abx-xjll-sumtable',
    'authority': 'abx-xjll-sumtable'
  }, {'id': 8985, 'name': 'report-definition', 'authority': 'report-definition'}, {
    'id': 8986,
    'name': 'report-generate',
    'authority': 'report-generate'
  }, {'id': 8987, 'name': 'rg-balance-table', 'authority': 'rg-balance-table'}, {
    'id': 8988,
    'name': 'rg-profit-table',
    'authority': 'rg-profit-table'
  }, {'id': 8989, 'name': 'rg-xjll-table', 'authority': 'rg-xjll-table'}, {
    'id': 8990,
    'name': 'rg-business-table',
    'authority': 'rg-business-table'
  }, {
    'id': 8991,
    'name': 'rg-income-expense-table',
    'authority': 'rg-income-expense-table'
  }, {
    'id': 8992,
    'name': 'rg-expenditure-table',
    'authority': 'rg-expenditure-table'
  }, {'id': 8993, 'name': 'ends-em-bill', 'authority': 'ends-em-bill'}, {
    'id': 8996,
    'name': 'setting-basis-info',
    'authority': 'setting-basis-info'
  }, {
    'id': 8997,
    'name': 'setting-finance-info',
    'authority': 'setting-finance-info'
  }, {'id': 8998, 'name': 'handle-voucher', 'authority': 'handle-voucher'}, {
    'id': 8999,
    'name': 'manage-voucher',
    'authority': 'manage-voucher'
  }, {'id': 9000, 'name': 'xj-journal', 'authority': 'xj-journal'}, {
    'id': 9001,
    'name': 'bank-journal',
    'authority': 'bank-journal'
  }, {'id': 9002, 'name': 'ei-exec', 'authority': 'ei-exec'}, {
    'id': 9003,
    'name': 'ei-mange',
    'authority': 'ei-mange'
  }, {'id': 9004, 'name': 'ei-add-invoice', 'authority': 'ei-add-invoice'}, {
    'id': 9005,
    'name': 'ei-invoice-like',
    'authority': 'ei-invoice-like'
  }, {'id': 9006, 'name': 'rgd-balance-table', 'authority': 'rgd-balance-table'}, {
    'id': 9007,
    'name': 'rgd-profit-table',
    'authority': 'rgd-profit-table'
  }, {'id': 9008, 'name': 'rgd-xjll-table', 'authority': 'rgd-xjll-table'}, {
    'id': 9009,
    'name': 'rgd-business-table',
    'authority': 'rgd-business-table'
  }, {
    'id': 9010,
    'name': 'rgd-income-expense-table',
    'authority': 'rgd-income-expense-table'
  }, {
    'id': 9011,
    'name': 'rgd-expenditure-table',
    'authority': 'rgd-expenditure-table'
  }, {'id': 9012, 'name': 'kemu-qichu-input', 'authority': 'kemu-qichu-input'}, {
    'id': 9013,
    'name': 'kemu-qichu-list',
    'authority': 'kemu-qichu-list'
  }, {'id': 9014, 'name': 'fuzhu-qichu-input', 'authority': 'fuzhu-qichu-input'}, {
    'id': 9015,
    'name': 'fuzhu-qichu-list',
    'authority': 'fuzhu-qichu-list'
  }, {'id': 9016, 'name': 'tg-exchange-status', 'authority': 'tg-exchange-status'}, {
    'id': 9017,
    'name': 'tg-correspond',
    'authority': 'tg-correspond'
  }, {'id': 9018, 'name': 'tg-carry-forward', 'authority': 'tg-carry-forward'}, {
    'id': 9019,
    'name': 'tg-customize',
    'authority': 'tg-customize'
  }, {'id': 9020, 'name': 'amort-with', 'authority': 'amort-with'}, {
    'id': 9021,
    'name': 'work-check',
    'authority': 'work-check'
  }, {'id': 9022, 'name': 'bill-list', 'authority': 'bill-list'}, {
    'id': 9023,
    'name': 'abk-manytable',
    'authority': 'abk-manytable'
  }, {'id': 9024, 'name': 'basis-file', 'authority': 'basis-file'}, {
    'id': 9025,
    'name': '8996',
    'authority': '8996'
  }, {'id': 9026, 'name': 'bus-para', 'authority': 'bus-para'}, {
    'id': 9027,
    'name': 'datafindcode',
    'authority': 'datafindcode'
  }, {
    'id': 9028,
    'name': 'subjectInitialBalance',
    'authority': 'subjectInitialBalance'
  }, {'id': 9029, 'name': 'project-cash', 'authority': 'project-cash'}, {
    'id': 10000,
    'name': 'welcome',
    'authority': 'welcome'
  }, {'id': 10001, 'name': '/home', 'authority': '/home'}]
