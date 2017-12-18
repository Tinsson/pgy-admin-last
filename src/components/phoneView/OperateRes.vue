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
  export default {
    name: 'OperateRes',
    data () {
      return{
        state: true,
        success: true
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
