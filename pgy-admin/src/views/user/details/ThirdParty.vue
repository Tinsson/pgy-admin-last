<template>
  <div id="third-party">
    <h2 class="sub-tit">第三方授权数据</h2>
    <div class="info-cross">
      <span class="label">法院执行</span>
      <span class="value">XXXXX</span>
    </div>
    <div class="division-line"></div>
    <div class="info-cross">
      <span class="label">运营商信息</span>
      <span class="value">移动联通电信</span>
      <a href="javascript:;" class="btn">查看详情</a>
    </div>
    <div class="info-cross">
      <span class="label">电商信息</span>
      <span class="value">淘宝</span>
      <a href="javascript:;" class="btn">查看详情</a>
    </div>
    <div class="info-cross single">
      <a href="javascript:;" class="btn">关键数据</a>
    </div>
    <div class="division-line"></div>
    <div class="info-cross">
      <span class="label">芝麻分</span>
      <span class="value">{{zmop}}分</span>
      <a href="javascript:;" class="btn">修改芝麻分</a>
    </div>
    <div class="info-cross">
      <span class="label">欺诈评分</span>
      <span class="value">0分</span>
      <a href="javascript:;" class="btn">欺诈报告</a>
    </div>
    <div class="division-line"></div>
    <div class="info-cross">
      <span class="label">客户类型</span>
      <span class="value">A类用户</span>
    </div>
    <div class="division-line"></div>
    <div class="info-cross">
      <span class="label">同盾数据</span>
      <span class="value">贷前黑名单</span>
      <a href="javascript:;" class="btn">同盾数据</a>
    </div>
    <div class="base-line"></div>
  </div>
</template>

<script>
  import { getLocal } from '@/util/util'

  export default {
    name: 'ThirdParty',
    data () {
      return {
        title: '第三方授权',
        zmop: '',
        UserData: [],     //用户数据
      }
    },
    created(){
      const uid = this.$route.query.id;
      this.$fetch('User/getInfo',{uid}).then((d)=>{
        this.zmop = d.data.three_auth.zmop_fen;
      });
    }
  }
</script>


<style lang="less" scoped>
  @theme: #1FB5AD;
  @line: #E3E3E3;
  #third-party{
    padding: 0 60px 60px;
  }
  .sub-tit{
    padding: 25px 0;
  }
  .info-cross{
    display: flex;
    flex-direction: row;
    padding-top: 15px;
    font-size: 16px;
    &.single{
      padding-left: 350px;
    }
    .label{
      display: inline-block;
      width: 150px;
    }
    .value{
      display: inline-block;
      width: 200px;
      color: #999;
    }
    .btn{
      color: @theme;
      font-size: 14px;
      padding: 4px 15px;
      border: 1px solid @theme;
      border-radius: 5px;
      &:hover{
        background-color: @theme;
        color: #FFF;
      }
    }
  }
  .division-line{
    width: 100%;
    padding-top: 15px;
    border-bottom: 2px solid @line;
  }
  .base-line{
    width: 100%;
    padding-top: 50px;
    border-bottom: 2px dashed #E3E3E3;
  }
</style>
