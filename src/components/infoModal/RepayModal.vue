<template>
  <Modal
    v-model="State"
    :title="`还款操作（${initData.name}）`"
    :styles="{top: '30px',zIndex: '10'}"
    @on-cancel="CloseBtn">
    <Form :model="RepayInfo" :label-width="120">
      <FormItem label="@：">
        <Select class="unit-width" v-model="RepayInfo.at">
          <Option :value="1">李义</Option>
          <Option :value="2">张晓成</Option>
        </Select>
      </FormItem>
      <FormItem label="销账金额：">
        <Input class="unit-width" v-model="RepayInfo.amount"/>
      </FormItem>
      <FormItem label="实际还款时间：">
        <DatePicker type="date"
                    placeholder="选择日期"
                    class="unit-width"
                    format="yyyy-MM-dd"
                    placement="bottom-end"
                    :value="RepayInfo.date"
                    @on-change="ChoseDate"
                    style="width: 280px"></DatePicker>
      </FormItem>
      <FormItem label="实际还款金额：">
        <span>{{ RepayInfo.actual }}</span>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="error" @click="CloseBtn">关闭</Button>
      <Button type="primary" @click="Submit">提交</Button>
    </div>
  </Modal>
</template>

<script>
  export default {
    name: 'DelayModal',
    data () {
      return{
        State: false,
        RepayInfo:{
          id: '',
          at: 1,
          amount: '',
          date: new Date(),
          actual: ''
        }
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
        this.RepayInfo.id = val.id;
        this.RepayInfo.amount = val.amount;
      }
    },
    methods: {
      CloseBtn(){
        this.$emit('CloseModal',this.modalState);
      },
      Submit(){
        this.$emit('SubModal',this.RepayInfo);
      },
      ChoseDate(val){
        this.RepayInfo.date;
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
</style>
