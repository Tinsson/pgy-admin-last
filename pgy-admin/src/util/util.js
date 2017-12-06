/**
 * 一些工具方法
 * Created by admin on 2017/10/21.
 */
import Vue from 'vue'
//获取cookie、
export function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return (arr[2]);
  else
    return null;
}

//设置cookie,增加到vue实例方便全局调用
export function setCookie (c_name, value, expiredays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
};

//删除cookie
export function delCookie (name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null)
   document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
};

//调用本地存储
export function getLocal(name){
  return window.localStorage.getItem(name);
}

//保存本地存储调用
export function saveLocal(name, value){
  window.localStorage.setItem(name,value);
}

//清除本地存储调用
export function delLocal(name){
  window.localStorage.removeItem(name);
}

//转换时间格式
export function transTimeToBack(row){
  return row.split('.')[0].replace('T',' ');
}
