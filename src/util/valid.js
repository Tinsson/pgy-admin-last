/**
 * 验证方法
 * Created by admin on 2017/10/21.
 */

//验证用正则
const phoneReg = /^[1][34578][0-9]{9}$/;
const idcardReg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;

//验证手机号码
export function phoneCheck(rule, value, callback){
  if (!phoneReg.test(value)) {
    callback(new Error('手机号格式不正确！'));
  } else {
    callback();
  }
}

//验证
export function idCheck(rule, value, callback){
  if(!idcardReg.test(value)){
    callback(new Error('身份证格式不正确！'));
  }else{
    callback();
  }
}
