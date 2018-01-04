<template>
  <div id="link-modal">
    <Modal v-model="State"
           title="添加联系人"
           width="600"
           :styles="{top: '30px',zIndex: '10'}"
           @on-cancel="close">
      <Form ref="LinkForm" :model="LinkForm" :label-width="100">
        <FormItem label="关系:">
          <Select class="ipt-info" v-model="LinkForm.relationship">
            <Option value="F">父亲</Option>
            <Option value="M">母亲</Option>
            <Option value="P">配偶</Option>
            <Option value="Y">朋友</Option>
            <Option value="T">同事</Option>
            <Option value="L">领导</Option>
          </Select>
        </FormItem>
        <FormItem label="名字:">
          <Input class="ipt-info" v-model="LinkForm.name" />
        </FormItem>
        <FormItem label="手机号:">
          <Input class="ipt-info" v-model="LinkForm.phone" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="SubmitData">提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>

export default {
  name: "LinkModal",
  props: {
    initData: {
      type: Object
    }
  },
  data() {
    return {
      State: false,
      LinkForm: {
        uid: '',
        relationship: '',
        name: '',
        phone: '',
      }
    }
  },
  watch: {
    initData(val){
      this.LinkForm = val;
    }
  },
  methods: {
    show(){
      this.State = true;
    },
    close() {
      this.State = false;
    },
    SubmitData(){
      this.$emit('SubModal', this.LinkForm);
    }
  }
}
</script>
<style lang="less" scoped>
  .ipt-info{
    width: 360px;
  }
</style>
