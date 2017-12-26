<template>
  <Modal
    v-model="State"
    :title="`还款操作（${initData.name}）`"
    :styles="{top: '30px',zIndex: '10'}"
    @on-cancel="CloseBtn">
    <Form :model="RepayInfo" :label-width="120">
      <FormItem label="还款类型：">
        <Select v-model="RepayInfo.type" style="width:280px" @on-change="ChangeType">
          <Option :value="2">提前还款</Option>
          <Option :value="3">销账还款</Option>
        </Select>
      </FormItem>
      <FormItem label="当前未还本金">
        <Input class="unit-width" v-model="RepayInfo.amount" readonly/>
      </FormItem>
      <FormItem label="当前应还金额">
        <Input class="unit-width" v-model="RepayInfo.amountn" readonly/>
      </FormItem>
      <FormItem label="实际还款本金：">
        <Input class="unit-width" v-model="RepayInfo.yh_amount" @on-change="LimitAmount"/>
      </FormItem>
      <FormItem label="实际还款金额：">
        <Input class="unit-width" v-model="RepayInfo.yh_amountn" @on-change="LimitAmountn"/>
      </FormItem>
      <!--<FormItem label="违约金：">
        <Input class="unit-width" v-model="RepayInfo.wy_amount"/>
      </FormItem>-->
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
          type: 2,
          amount: '',
          amountn: '',
          yh_amount: '',
          yh_amountn: ''
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
      GetTotalCount(){
        this.$post('/backend/Tocalculate/fangkuanTocal',{jid: this.RepayInfo.jid}).then(d=>{
          this.RepayInfo.amountn = d.data;
          this.ChangeType(2);
        })
      },
      ChangeType(type){
        if(type === 2){
          this.RepayInfo.yh_amount = this.RepayInfo.amount;
          this.RepayInfo.yh_amountn = this.RepayInfo.amountn;
        }
      },
      LimitAmount(){
        if(parseFloat(this.RepayInfo.yh_amount) > parseFloat(this.RepayInfo.amount)){
          this.RepayInfo.yh_amount = this.RepayInfo.amount;
        }
      },
      LimitAmountn(){
        if(parseFloat(this.RepayInfo.yh_amountn) > parseFloat(this.RepayInfo.amountn)){
          this.RepayInfo.yh_amountn = this.RepayInfo.amountn;
        }
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
