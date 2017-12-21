<template>
  <div v-show="State" class="remark-input">
    <Input v-model="Data" @on-enter="SubOver">
  </div>
</template>

<script>
  export default {
    name: 'SumTable',
    data () {
      return{
        State: false,
        Data: ''
      }
    },
    props: {
      initData: [String, Number]
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
