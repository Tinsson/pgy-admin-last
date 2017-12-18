<template>
  <div id="operate-res" v-show="state">
    <div class="res-box" v-if="success">
      <img src="../../assets/images/success.png" alt="">
      <p class="tip-text">操作成功</p>
    </div>
    <div class="res-box" v-else>
      <img src="../../assets/images/fail.png" alt="">
      <p class="tip-text">操作失败</p>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import router from '@/router'

  export default {
    name: 'OperateRes',
    data () {
      return{
        state: false,
        success: true
      }
    },
    created(){
      const url = this.$route.query.admin_url;
      const token = this.$getLocal('token');
      if(url){
        if(token){
          let params = this.$route.query;
          let obj = {};
          Object.keys(params).forEach(val=>{
            if(val !== 'admin_url'){
              obj[val] = params[val];
            }
          });
          this.$post(url,obj).then(d=>{
            console.log(d);
          })
        }else{
          router.push({path: '/login',query: { admin_url: url }});
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  #operate-res{
    width: 100%;
    height: 100%;
    .res-box{
      padding-top: 100px;
      text-align: center;
      img{
        width: 30vw;
      }
      .tip-text{
        padding-top: 50px;
        font-size: 20px;
        text-align: center;
        color: #333;
      }
    }
  }
</style>
