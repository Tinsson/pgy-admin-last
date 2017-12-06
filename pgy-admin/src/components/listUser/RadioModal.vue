<template>
  <Modal
    v-model="modalState"
    :title="title"
    @on-ok="EditOver"
    @on-cancel="CloseBtn">
    <Form :model="InitDep" label-position="right" :label-width="60">
      <FormItem :label="label1">
        <Input v-model="InitDep.id" :disabled="true"></Input>
      </FormItem>
      <FormItem :label="label2">
        <RadioGroup v-model="InitDep.depar_id">
          <Radio v-for="item in RdoInfo" :label="item.id" :key="item.id">{{item.title}}</Radio>
        </RadioGroup>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>

  export default {
    name: 'RadioModal',
    data () {
      return {
        modalState: this.modalShow,
      }
    },
    props: {
        title: String,
        modalShow: Boolean,
        RdoInfo: Array,
        label1: String,
        label2: String,
        InitDep: Object
    },
    watch: {
      modalShow(){
          this.modalState = this.modalShow;
      }
    },
    methods: {
      EditOver(){
        this.$emit('UpOver',this.InitDep);
      },
      CloseBtn(){
        this.$emit('CloseModal',this.modalState);
      }
    }
  }
</script>


<style lang="less" scoped>


</style>
