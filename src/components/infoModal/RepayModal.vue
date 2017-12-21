<template>
  <Modal
    v-model="State"
    :title="`还款操作（${initData.name}）`"
    :styles="{top: '30px',zIndex: '10'}"
    @on-cancel="CloseBtn">
    <Form :model="RepayInfo" :label-width="120">
      <FormItem label="还款类型：">
        <Select v-model="RepayInfo.type" style="width:280px">
          <Option :value="2">提前还款</Option>
          <Option :value="3">销账还款</Option>
        </Select>
      </FormItem>
      <FormItem label="借款金额：">
        <Input class="unit-width" v-model="RepayInfo.amount"/>
      </FormItem>
      <FormItem label="实际还款金额：">
        <Input class="unit-width" v-model="RepayInfo.sj_amount"/>
      </FormItem>
      <FormItem label="费率：">
        <Input class="unit-width" v-model="RepayInfo.fee"/>
      </FormItem>
      <FormItem label="违约金：">
        <Input class="unit-width" v-model="RepayInfo.wy_amount"/>
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
          uid: '',
          jid: '',
          type: '',
          amount: '',
          sj_amount: '',
          wy_amount: '',
          fee: ''
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
        this.RepayInfo = Object.assign(this.RepayInfo, val);
        this.GetTotalCount();
      }
    },
    methods: {
      CloseBtn(){
        this.$emit('CloseModal');
      },
      Submit(){
        this.$emit('SubModal',this.RepayInfo);
      },
      ChoseDate(val){
        this.RepayInfo.date;
      },
      GetTotalCount(){
        this.$post('/backend/Tocalculate/fangkuanTocal',{jid: this.RepayInfo.jid}).then(d=>{
          this.RepayInfo.sj_amount = d.data;
        })
      },
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
