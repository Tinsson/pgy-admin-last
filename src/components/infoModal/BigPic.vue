<template>
  <Modal
    v-model="State"
    :width="this.Width + 30"
    :title="titleTxt"
    :styles="{top: '20px',zIndex: '10'}"
    @on-cancel="CloseBtn">
    <img class="big-img" :style="{maxWidth: this.Width+'px'}" :src="Img" alt="">
    <div slot="footer">
      <Button type="error" @click="CloseBtn">关闭</Button>
    </div>
  </Modal>
</template>

<script>
  export default {
    name: 'ThirdModal',
    data () {
      return{
        State: this.modalShow,
        Img: this.InitData,
        Width: this.maxWidth
      }
    },
    props: {
      modalShow: Boolean,
      InitData: String,
      maxWidth: Number,
      titleTxt: String
    },
    watch: {
      modalShow(val){
        this.State = val;
      },
      InitData(val){
        this.Img = val;
      },
      maxWidth(val){
        this.Width = val;
      }
    },
    methods: {
      CloseBtn(){
        this.$emit('CloseModal',this.modalState);
      }
    }
  }
</script>

<style lang="less" scoped>
  .big-img{
    display: inline-block;
  }
</style>
