<template>
  <Modal
    v-model="State"
    :title="设置钉钉模板"
    class="ding-modal"
    @on-cancel="CloseBtn">
    <div class="ding-area">

    </div>
    <div slot="footer">
      <Button type="error" @click="CloseBtn">取消</Button>
      <Button type="primary" @click="Submit">提交</Button>
    </div>
  </Modal>
</template>

<script>
  export default {
    name: 'DelayModal',
    data () {
      return{
        State: this.modalShow,
      }
    },
    props: {
      modalShow: Boolean,
      initData: Object
    },
    watch:{
      modalShow(val){
        this.State = val;
      },
      initData(val){
      }
    },
    methods: {
      CloseBtn(){
        this.$emit('CloseModal');
      },
      Submit(){
        this.$emit('SubModal',this.DelayInfo);
      }
    }
  }
</script>

<style lang="less" scoped>
  .ding-modal{
    width: 600px;
  }
  .big-img{
    display: inline-block;
  }
  .unit-width{
    width: 280px;
  }
  .ding-area{
    display: flex;
    flex-direction: row;
  }
</style>
