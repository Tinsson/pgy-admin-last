<template>
  <div id="extend" :style="{backgroundImage: bgImage}">
    <div class="form-box">
      <div class="info-box">
        <div class="ipt-area">
          <span class="icon">
            <Icon type="android-phone-portrait"></Icon>
          </span>
          <input class="ipt-box" v-model="SubData.phone" type="text" placeholder="请输入手机号码">
        </div>
      </div>
      <div class="info-box">
        <div class="ipt-area left">
          <span class="icon">
            <Icon type="image"></Icon>
          </span>
          <input class="ipt-box" v-model="AuthPic.Txt" type="text" placeholder="请输入图片验证码">
        </div>
        <div class="ipt-area right">
          <p v-show="!AuthPic.status" @click="GetAuthPic" class="button" :style="{color: CodeColor,background: SubColor}">点击获取图片</p>
          <img v-show="AuthPic.status" ref="CodeImg" class="auth-pic" @click="ChangeImg" :src="AuthPic.Data" alt="">
        </div>
      </div>
      <div class="info-box">
        <div class="ipt-area left">
          <span class="icon">
            <Icon type="locked"></Icon>
          </span>
          <input class="ipt-box" v-model="SubData.smscode" type="text" placeholder="请输入短信验证码">
        </div>
        <div class="ipt-area right">
          <p class="button" v-show="!IsSend" @click="SendSms" :style="{color: CodeColor,background: SubColor}">
            {{AuthTips}}
          </p>
          <P class="button" v-show="IsSend" :style="{color: CodeColor,background: SubColor}">
            {{CountDown}}s
          </P>
        </div>
      </div>
      <div class="info-box">
        <div class="ipt-area">
          <p class="sub-btn" @click="RegisterBtn" :style="{color: CodeColor,background: SubColor}">立即注册</p>
        </div>
      </div>
    </div>
    <p class="bot-info">宁波蒲公英信息科技有限公司</p>
  </div>
</template>

<script>
  import qs from 'qs'

  export default {
    name: 'Extend',
    data () {
      return {
        baseUrl: '',
        title: '推广页面',
        code: '',
        bgImage: '',
        AuthTips: '点击获取短信',
        CodeColor: '',
        AuthPic:{
          IsShow: false,
          Data: '',
          Txt: ''
        },
        SubColor: '',
        SubData:{
          phone: '',
          src: '',
          smscode: ''
        },
        IsSend: false,
        CountDown: 60,
      }
    },
    created(){
      this.baseUrl = (process.env.NODE_ENV === 'development')?'http://www.zzdd.com/api':'http://api.xrjinrong.com/api';
      this.code = this.$route.query.code;
      this.InitData(this.code);
    },
    mounted(){
      const title = '欣荣钱包推广'
      document.body.style.overflow = 'hidden';
      document.setTitle = function(t) {
        document.title = t;
        var i = document.createElement('iframe');
        i.style.display = 'none';
        i.onload = function() {
          setTimeout(function(){
            i.remove();
          }, 9)
        }
        document.body.appendChild(i);
      }
      document.title = title;
      document.setTitle(title);
    },
    methods: {
      //初始化数据
      InitData(code){
        return new Promise((resolve)=>{
          this.$axios.get(this.baseUrl+'/Promote/index?code='+code).then((d)=>{
            const res = d.data.data;
            this.SubData.src = res.id;
            this.CodeColor = res.code_color;
            this.SubColor = res.submit_color;
            this.bgImage = `url(${res.background_img})`;
            resolve();
          })
        })
      },
      WrongPhone(){
        if(!/^[1][34578][0-9]{9}$/.test(this.SubData.phone)){
          return true;
        }else{
          return false;
        }
      },
      GetAuthPic(){
        if(this.WrongPhone()){
          alert('请输入格式正确的手机号！');
          return;
        }
        this.AuthPic.status = true;
        this.AuthPic.Data = this.baseUrl+'/Promote/getImgCode?phone='+this.SubData.phone;
      },
      ChangeImg(){
        this.$refs['CodeImg'].setAttribute('src','');
        this.$refs['CodeImg'].setAttribute('src',this.baseUrl+'/Promote/getImgCode?phone='+this.SubData.phone);
      },
      SendSms(){
        if(this.WrongPhone()){
          alert('请输入格式正确的手机号！');
          return;
        }else if(this.AuthPic.Txt === ''){
          alert('请先输入图片验证码！');
          return;
        }
        this.$axios.post(this.baseUrl+'/Promote/getCode',qs.stringify({
          phone: this.SubData.phone,
          vicode: this.AuthPic.Txt
        })).then((d)=>{
          alert(d.data.message);
          if(d.data.status === 1){
            this.IsSend = true;
            this.StartCountDown();
          }
        })
      },
      StartCountDown(){
        setTimeout(()=>{
          if(this.CountDown === 0){
            this.CountDown = 60;
            this.AuthTips = '重新发送';
            this.IsSend = false;
          }else{
            this.CountDown--;
            this.StartCountDown();
          }
        },1000);
      },
      RegisterBtn(){
        this.$axios.post(this.baseUrl+'/Promote/pReg',qs.stringify(this.SubData)).then((d)=>{
          if(d.data.status === 1){
            this.$router.push('/registered');
          }else{
            alert(d.data.message);
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  #extend{
    width: 100vw;
    height: 100vh;
    background-color: #333;
    background-size: 100% 100%;
  }
  .bot-info{
    text-align: center;
    color: #fff;
    font-size: 13px;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 30px;
    line-height: 30px;
  }
  .form-box{
    position: fixed;
    left:0;
    bottom: 20vh;
    width:100%;
    padding: 0 5vw;
    .info-box{
      margin-bottom: 10px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .ipt-area{
      width: 100%;
      height: 35px;
      line-height: 35px;
      border-radius: 35px;
      background: #FFF;
      display: flex;
      flex-direction: row;
      overflow: hidden;
      &.left{
        width: 57%;
      }
      &.right{
        width: 40%;
        .button{
          text-align: center;
          font-size: 14px;
          width: 100%;
        }
      }
      .icon{
        width: 28px;
        text-align: center;
        display: inline-block;
        font-size: 26px;
        margin-left: 10px;
      }
      .ipt-box{
        width: 80%;
        margin-left: 6px;
        margin-top: 5px;
        font-size: 12px;
        height: 25px;
        line-height: 25px;
        border:none;
        outline: none;
      }
      .sub-btn{
        width: 100%;
        text-align: center;
        font-size: 14px;
      }
    }
  }
  .auth-pic{
    width: 100%;
    height: 100%;
    display: inline-block;
  }
</style>
