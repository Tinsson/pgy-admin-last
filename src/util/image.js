/**
 * 转换图片文件成base64
 * Created by admin on 2017/11/17.
 */


//转换图片
export function getBase64(file){
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function (f) {
    let res = this.result;
    console.log(res);
    return this.result;
  }
}

