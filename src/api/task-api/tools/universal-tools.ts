/****** Jesse Ye ******/
/**
 * 字符串工具
 */
export const StrTool = {
  /**
   * 校验 字符是否 空白
   */
  hasBlank(value: string) {
    return null == value || value == '' || value.length == 0
  },
  eq(val: string, val2: string) {
    return val.trim() == val2.trim()
  },
  /**
   * 校验 字符是否存在大写
   */
  hasCapital(str: string) {
    let result = str.match(/^.*[A-Z]+.*$/);
    if (result == null) return false;
    return true;
  },
  /**
   * 校验 字符是否存在 除数字字母以外 特殊字符
   */
  hasOther(str: string) {
    let result = str.match(/^.*[^0-9A-Za-z]+.*$/);
    if (result == null) return false;
    return true;
  },
  /**
   * 随机生成指定长度字符串
   */
  randomPassword(size) {
    let seed = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N','1','0', '2', '3', '4', '5', '6', '7', '8', '9', '_', '-', '$', '%', '&', '@', '+', '!',
      'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'm', 'n', 'p', 'Q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    )
    let seedlength = seed.length;
    let createPassword = '';
    for (let i = 0; i < size; i++) {
      let j = Math.floor(Math.random() * seedlength);
      createPassword += seed[j];
    }
    return createPassword;
  },randomCode(size) {
    let seed = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N','1','0', '2', '3', '4', '5', '6', '7', '8', '9',
      'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'm', 'n', 'p', 'Q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    )
    let seedlength = seed.length;
    let createPassword = '';
    for (let i = 0; i < size; i++) {
      let j = Math.floor(Math.random() * seedlength);
      createPassword += seed[j];
    }
    return createPassword;
  },
  /**
   * 替换 除数字、字母与中文 以外的字符
   */
  closeSpecialChars3(text){
    return StrTool.hasBlank(text)?'':text.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')
  },
  /**
   * 替换 除数字、字母 以外的字符
   */
  closeSpecialChars2(text){
    return StrTool.hasBlank(text)?'':text.replace(/[^\a-\z\A-\Z0-9]/g,'')
  },
  /**
   * 替换 除数字 以外的字符
   */
  closeSpecialChars(text){
    return StrTool.hasBlank(text)?'':text.replace(/[^0-9]/g,'')
  }
}

/**
 * 对象工具
 */
export const ObjTool = {
  /**
   * 校验 相等
   */
  eq(val, val2) {
    return val == val2
  },
  /**
   * 删除对象属性
   * obj: 对象, keys 属性名称...
   */
  dels(obj: any, keys: any) {
    keys.forEach((key) => delete obj[key])
    return obj
  },
  /**
   * 检查对象属性值是否发生改变
   * defualtObj: 旧对象, lastObj 最新对象
   */
  objChange(defualtObj: any, lastObj: any) {
    let keys = defualtObj.keys
    for (const key in keys) {
      if (defualtObj[key] != lastObj[key]) return true
    }
    return false;
  }
}

/**
 * JSON 工具
 */
export const JsonTool = {
  /*** 对象转JSON ***/
  json(obj) {
    return JSON.stringify(obj)
  },
  /*** JSON转对象 ***/
  parseObj(str) {
    if (StrTool.hasBlank(str)) return []
    return JSON.parse(str)
  },
  /*** 代理对象转对象 ***/
  parseProxy(obj) {
    return JSON.parse(JSON.stringify(obj))
  }
}

/**
 * 时间工具
 */
export function DateTool() {
  function now() {
    return new Date();
  }

  function nowStr() {
    return format(now());
  }

  function format(date) {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString();
    let day = (date.getDate()).toString();
    let hour = (date.getHours()).toString();
    let minute = (date.getMinutes()).toString();
    let second = (date.getSeconds()).toString();
    if (month.length == 1) month = "0" + month;
    if (day.length == 1) day = "0" + day;
    if (hour.length == 1) hour = "0" + hour;
    if (minute.length == 1) minute = "0" + minute;
    if (second.length == 1) second = "0" + second;
    let dateTime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    return dateTime;
  }

  function formatDate(date) {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString();
    let day = (date.getDate()).toString();
    if (month.length == 1) month = "0" + month;
    if (day.length == 1) day = "0" + day;
    let dateTime = year + "-" + month + "-" + day;
    return dateTime;
  }

  return {
    /**
     * 当前日期时间对象
     */
    now,
    /**
     * 当前日期时间对象
     */
    nowStr,
    /**
     * date 转化指定格式 YYY
     */
    dateTimeStr(date) {
      return null == date ? nowStr() : format(date)
    },
    dateStr(date) {
      return null == date ? null : formatDate(date)
    },
    /**
     * 当前日期
     * 格式: yyyy-MM-dd
     */
    nowDate() {
      return nowStr().substring(0, 10);
    },
    /**
     * 当前时间
     * 格式: HH:mm:ss
     */
    nowTime() {
      return nowStr().substring(11, 19);
    },
    /**
     * 时间偏移 返回 date()
     * 参数一 date() 偏移时间
     * 参数二 毫秒 偏移长度 支持正负
     */
    offset() {
      if (arguments.length == 1) {
        return new Date(now().getTime() + (arguments[0]))
      } else if (arguments.length == 2) {
        return new Date(arguments[0].getTime() + (arguments[1]))
      }
      return null;
    },
    /**
     * 时间偏移 返回格式化后的date()
     * 参数一 date() 偏移时间
     * 参数二 毫秒 偏移长度 支持正负
     */
    offsetToStr() {
      if (arguments.length == 1) {
        return format(new Date(now().getTime() + (arguments[0])))
      } else if (arguments.length == 2) {
        return format(new Date((arguments[0].getTime() + arguments[1])))
      }
      return null;
    },
      getLastDay(year, month) {
      let date = new Date(year, month, 1);
      let lastday = new Date(date.getTime() - 1000 * 60 * 60 * 24).getDate();
      return lastday;
    },/**
     * 字符串 时间比较大小
     * @param dateStr1  2022-01-22
     * @param dateStr2  2022-01-23
     */
    compareDate(dateStr1,dateStr2){
      let date1 = new Date(dateStr1)
      let date2 = new Date(dateStr2)
      return date1 === date2?0:(date1>date2?1:-1)
    }
    
  }
}

/**
 * 雪花随机生成工具 浏览器语法冲突
 */
/*export function SnowflakeTool() {
  let Snowflake = (function () {
    function Snowflake(_workerId, _dataCenterId, _sequence) {
      this.twepoch = 1288834974657n;
      //this.twepoch = 0n;
      this.workerIdBits = 5n;
      this.dataCenterIdBits = 5n;
      this.maxWrokerId = -1n ^ (-1n << this.workerIdBits); // 值为：31
      this.maxDataCenterId = -1n ^ (-1n << this.dataCenterIdBits); // 值为：31
      this.sequenceBits = 12n;
      this.workerIdShift = this.sequenceBits; // 值为：12
      this.dataCenterIdShift = this.sequenceBits + this.workerIdBits; // 值为：17
      this.timestampLeftShift = this.sequenceBits + this.workerIdBits + this.dataCenterIdBits; // 值为：22
      this.sequenceMask = -1n ^ (-1n << this.sequenceBits); // 值为：4095
      this.lastTimestamp = -1n;
      //设置默认值,从环境变量取
      this.workerId = 1n;
      this.dataCenterId = 1n;
      this.sequence = 0n;
      if (this.workerId > this.maxWrokerId || this.workerId < 0) {
        throw new Error('_workerId must max than 0 and small than maxWrokerId-[' + this.maxWrokerId + ']');
      }
      if (this.dataCenterId > this.maxDataCenterId || this.dataCenterId < 0) {
        throw new Error('_dataCenterId must max than 0 and small than maxDataCenterId-[' + this.maxDataCenterId + ']');
      }

      this.workerId = BigInt(_workerId);
      this.dataCenterId = BigInt(_dataCenterId);
      this.sequence = BigInt(_sequence);
    }
    Snowflake.prototype.tilNextMillis = function (lastTimestamp) {
      var timestamp = this.timeGen();
      while (timestamp <= lastTimestamp) {
        timestamp = this.timeGen();
      }
      return BigInt(timestamp);
    };
    Snowflake.prototype.timeGen = function () {
      return BigInt(Date.now());
    };
    Snowflake.prototype.nextId = function () {
      var timestamp = this.timeGen();
      if (timestamp < this.lastTimestamp) {
        throw new Error('Clock moved backwards. Refusing to generate id for ' +
          (this.lastTimestamp - timestamp));
      }
      if (this.lastTimestamp === timestamp) {
        this.sequence = (this.sequence + 1n) & this.sequenceMask;
        if (this.sequence === 0n) {
          timestamp = this.tilNextMillis(this.lastTimestamp);
        }
      } else {
        this.sequence = 0n;
      }
      this.lastTimestamp = timestamp;
      return ((timestamp - this.twepoch) << this.timestampLeftShift) |
        (this.dataCenterId << this.dataCenterIdShift) |
        (this.workerId << this.workerIdShift) |
        this.sequence;
    };
    return Snowflake;
  }());
  function generate(n) {
    let arr = []
    if (null != n && n > 0) {
      const snowflake = new Snowflake(2021n, 11n, 0n)
      for (let i = 0; i < n; i++) {
        arr.push(snowflake.nextId() + '');
      }
    }
    return arr.length == [...new Set(arr)].length?arr: generate(n)
  }
  return {
    /!*** 单次生成 ***!/
    singleGenerate() {
      return new Snowflake(2021n, 11n, 0n).nextId() + ''
    },
    /!*** 批量生成 不质保 ***!/
    batchGenerate(n) {
      return generate(n)
    }
  }
};*/
export function  uuid() {
  let  s:any = [];
  let  hexDigits =  "0123456789ghijkmunabcdefopqrs" ;
  for  ( var  i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] =  "4" ;   // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);   // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] =  "-" ;

  let  uuid = s.join( "" );
  return  uuid;
}
/**
 * 数值工具
 */
export const NumberTool =  {
  inputLimit(text) {
    if (StrTool.hasBlank(text)) return ''
    return text.replace(/[^\d\-]/g, '')
  },
  /*** 字符串金额转换成金额 ***/
  inputAmountLimit(text) {
    debugger
    if (StrTool.hasBlank(text)) return ''
    return text.replace(/[^\d\.\-]/g, '')
  },
  /*** 字符串金额转换成金额 ***/
  amountReplace(text) {
    if (StrTool.hasBlank(text)) return ''
    return Number.parseFloat(text.replace(/[^\d\.\-]/g, '')).toFixed(2)
  },
  /*** 字符串金额转换成千分位金额 ***/
  amountThousands(text) {
    if (StrTool.hasBlank(text)) return ''
    return Number.parseFloat(text.replace(/[^\d\.\-]/g, '')).toFixed(2).replace(/(-?\d+)(\d{3})/, "$1,$2")
  },
  /*** 向上取整 保留位数 ***/
  toCeil(v,num = 0) {
    if (!(num >= 0 && num <= 100)) {
      throw new RangeError('toCeil() digits argument must be between 0 and 100.');
    }
    let val = Math.ceil(v * Math.pow(10, num)) / Math.pow(10, num) + '';
    if (num > 0) {
      const intp = val.split('.')[0],
        decp = val.split('.')[1] || '';
      if (decp.length < num) {
        val = intp + '.' + decp.padEnd(num, '0');
      }
    }
    return val;
  },/**
     * 数字前缀补零
     * @param str 原值
     * @param n 补零长度
     */
    zeroFill(str,n){
      return (Array(n).join(0) + str).slice(-n)
    }
}
