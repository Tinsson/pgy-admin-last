<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {

    }
  },
  created(){
      this.$store.commit('INIT_DATA');
  }
}
</script>

<style lang="less">
  /*全局样式*/
  #app{
    height: auto;
    min-height: 100%;
  }
  .confirm-text{
    font-size: 18px;
  }
  /*标记样式*/
  .ivu-table .table-tag-row td{
    background-color: #ff6600!important;
    color: #fff!important;
  }
  .ivu-table .table-hang-row td{
    background-color: #76d2fb!important;
    color: #333!important;
  }
  .ivu-table .super-admin td{
    background-color: #4ba2f8!important;
    color: #FFF!important;
  }
  .all-modal .ivu-modal-body{
    padding: 0!important;
  }
  .all-modal .ivu-select{
    position:relative!important;
  }
  .all-modal .ivu-cascader{
    position: relative!important;
  }
  .all-modal .ivu-tabs-tab{
    font-size: 16px;
  }
  .all-modal .ivu-tabs-bar{
    border-color: #ffffff!important;
  }
  .all-modal .ivu-card-body{
    padding: 15px!important;
  }
  .all-modal .ivu-select-dropdown{
    position: absolute!important;
    top: 32px!important;
  }
  .remark-modal .ivu-modal-footer{
    border: none;
    padding: 0;
  }
  .remark-modal .remark-box{
    padding: 15px;
  }
  .table-input{
    color: #333;
    width: 230px;
    min-height: 30px;
    border: 1px solid #bbb;
    border-radius: 5px;
    box-sizing: border-box;
    padding: 2px 5px;
  }
  .auth-icon{
    width: 32px;
    height: 32px;
    display: inline-block;
    margin-right: 5px;
  &.TB{
     background: url('./assets/images/taobao.png') no-repeat center;
     background-size: cover;
   }
  &.MB{
     background: url('./assets/images/phone.png') no-repeat center;
     background-size: cover;
   }
  &.JD{
     background: url('./assets/images/jd.png') no-repeat center;
     background-size: cover;
   }
  }
  .opt-box{
    display: flex;
    flex-direction: row;
    .form-group{
      display: flex;
      flex-direction: row;
      align-content: center;
      padding-bottom: 10px;
      margin-right: 15px;
      .form-label{
        width: 60px;
        font-size: 12px;
        line-height: 30px;
      }
    }
  }
</style>
