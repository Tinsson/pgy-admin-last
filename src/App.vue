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

<style>
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
    background-color: #69c0ff!important;
    color: #fff!important;
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
  /*钉钉模版对话框*/

</style>
