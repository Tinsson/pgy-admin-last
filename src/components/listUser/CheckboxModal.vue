<template>
  <Modal
    v-model="modalState"
    :title="title"
    @on-ok="EditOver"
    @on-cancel="CloseBtn">
    <Form :model="InitData" label-position="right" :label-width="60">
      <FormItem :label="label1">
        <Input v-model="InitData.id" :disabled="true"></Input>
      </FormItem>
      <FormItem :label="label2">
        <CheckboxGroup v-model="InitData.check_id">
          <Checkbox v-for="(item,index) in CheckInfo" :label="item.id" :key="index">{{item.role_name}}</Checkbox>
        </CheckboxGroup>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>

  export default {
    name: 'CheckboxModal',
    data () {
      return {
        modalState: this.modalShow,
      }
    },
    props: {
        title: String,     //模态框标题
        modalShow: Boolean,
        CheckInfo: Array,
        label1: String,
        label2: String,
        InitData: Object
    },
    watch: {
      modalShow(){
          this.modalState = this.modalShow;
      }
    },
    methods: {
      EditOver(){
        this.$emit('UpOver',this.InitData);
      },
      CloseBtn(){
        this.$emit('CloseModal',this.modalState);
      }
    }
  }
</script>


<style lang="less" scoped>


</style>
