<template>
  <Modal
    v-model="State"
    title="批量导入"
    class="remark-modal"
    @on-cancel="CloseBtn">
    <div class="all-content">
      <div class="opt-btn down" @click="DownloadTemp">下载模板</div>
      <Upload
        :headers="Config"
        :action="TempUrl"
        :on-success="UploadSuccess" :on-error="UploadError">
        <div class="opt-btn import">导入数据</div>
      </Upload>
    </div>
    <div slot="footer">
    </div>
  </Modal>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'DelayModal',
    data () {
      return{
        State: false,
        Config:{
          token: ''
        },
        TempUrl: 'http://apinew.pgyxwd.com/excel/temp.xlsx'
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
    created(){
      this.TempUrl = this.$axios.defaults.baseURL + '/backend/user/UserImprot';
      this.Config.token = this.$getLocal('token');
    },
    methods: {
      CloseBtn(){
        this.$emit('CloseModal');
      },
      ImportOver(){
        this.$emit('ImportSuccess');
      },
      ChoseStart(value){
        this.LoanInfo.jk_date = value;
      },
      DownloadTemp(){
        window.location.href = 'http://apinew.pgyxwd.com/excel/temp.xlsx';
      },
      UploadSuccess(res){
        if(res.status){
          this.$Message.info({
            content: res.message,
            duration: 10,
            closable: true
          });
          this.ImportOver();
        }
      },
      UploadError(){
        this.$Message.error('导入失败！');
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
