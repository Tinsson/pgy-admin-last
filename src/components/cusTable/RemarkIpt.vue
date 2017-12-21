<template>
  <div v-show="State" class="remark-input">
    <Input v-model="Data" @on-enter="SubOver"/>
  </div>
</template>

<script>
  export default {
    name: 'RemarkIpt',
    data () {
      return{
        State: true,
        Data: ''
      }
    },
    props: {
      initData: [String, Number],
      show: String
    },
    watch: {
      show(state){
        this.State = state;
      }
    },
    methods: {
      SubOver(){
        this.$emit('enter',this.Data);
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
