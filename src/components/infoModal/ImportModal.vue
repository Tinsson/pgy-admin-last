<template>
  <Modal
    v-model="State"
    title="批量导入"
    class="remark-modal"
    @on-cancel="CloseBtn">
    <div class="all-content">
      <div class="opt-btn down" @click="DownloadTemp">下载模板</div>
      <div class="opt-btn import">导入数据</div>
    </div>
    <div slot="footer">
    </div>
  </Modal>
</template>

<script>
  export default {
    name: 'DelayModal',
    data () {
      return{
        State: false,
        TempUrl: ''
      }
    },
    props: {
      modalShow: Boolean,
      initData: String
    },
    watch:{
      modalShow(val){
        this.State = val;
      },
      initData(val){
        this.TempUrl = val;
      }
    },
    methods: {
      CloseBtn(){
        this.$emit('CloseModal');
      },
      Submit(){
        this.$emit('SubModal',this.LoanInfo);
      },
      ChoseStart(value){
        this.LoanInfo.jk_date = value;
      },
      DownloadTemp(){
        window.open(this.TempUrl);
      }
    }
  }
</script>

<style lang="less" scoped>
  .big-img{
    display: inline-block;
  }
  .unit-width{
    width: 280px;
  }
  .all-content{
    display: flex;
    flex-direction: row;
    padding: 20px;
    justify-content: space-between;
    .opt-btn{
      width: 200px;
      height: 80px;
      line-height: 80px;
      border-radius: 5px;
      color: #FFF;
      font-size: 18px;
      background: #333;
      text-align: center;
      cursor: pointer;
      &.down{
        background: linear-gradient(to right,rgb(102,176,238), rgb(76,194,171));
      }
      &.import{
        background: linear-gradient(to right,rgb(233,102,148),rgb(234,103,102));
      }
    }
  }
</style>
