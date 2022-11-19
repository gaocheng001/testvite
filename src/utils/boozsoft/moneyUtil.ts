
/* eslint-disable */
// @ts-nocheck
/**
 * 转大写中文
 */
export function convertCurrency(n) {
  var isX = String(n).split("\\.").length > 1
  /*  if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
       return "数据非法"; */
  if (!/^(0|\-*[1-9]\d*)(\.\d+)?$/.test(n)) return "数据非法";
  var fuhao = (n.toString().indexOf("-") == 0 ? "负" : "");

  var unit = "仟佰拾亿仟佰拾万仟佰拾元角分", str = "";
  n += "00";
  //如果是负数就就截取
  if (fuhao == "负") {
    n = n.substring(1, n.length);
  }
  var p = n.indexOf('.');
  if (p >= 0)
    n = n.substring(0, p) + n.substr(p + 1, 2);
  unit = unit.substr(unit.length - n.length);
  for (var i = 0; i < n.length; i++) {

    str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
  }
  return fuhao + str.replace(/零(仟|佰|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
}

function isNumber(val) {
  var regPos = /^\d+(\.\d+)?$/; //非负浮点数
  var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
  if (regPos.test(val) || regNeg.test(val)) {
    return true;
  } else {
    return false;
  }
}

function checkEnter(e) {
  var et = e || window.event;
  var keycode = et.charCode || et.keyCode;
  if (keycode == 13) {
    if (window.event) {
      window.event.returnValue = false;
    } else {
      e.preventDefault(); //for firefox
    }
  }
}



function dynamicLoadCss(url) {
  var head = document.getElementsByTagName('head')[0];
  var link = document.createElement('link');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.href = url;
  head.appendChild(link);
}

function useComponent(url) {
  let component
  let componentPath = url

  $.ajax({
    url: urlPath + url,
    async: false,
    success: function (res) {
      eval(res)
    }
  });
  dynamicLoadCss(urlPath + url.substring(0, url.lastIndexOf("/") + 1) + '/../../css/' + url.substring(url.lastIndexOf("/") + 1).split(".")[0] + '.css')
  $.ajax({
    url: urlPath + url.substring(0, url.lastIndexOf("/") + 1) + '/../../' + url.substring(url.lastIndexOf("/") + 1).split(".")[0] + '.html',
    async: false,
    success: function (res) {
      component.template = res
    }
  });
  return component
}

function createComponentHelper({template, style, script}) {
  document.body.insertAdjacentHTML("beforeend", style)
  return {
    ...script,
    template
  }
}


function createComponent({script={},setup}) {
  let template = ''
  let style = ''
  const context = {template, style, script}
  if (setup != null) {
    setup(context)
  }
  return createComponentHelper( {...context})
}
