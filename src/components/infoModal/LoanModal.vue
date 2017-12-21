<template>
  <Modal
    v-model="State"
    :title="`放款操作（${initData.name}）`"
    :styles="{top: '30px',zIndex: '10'}"
    @on-cancel="CloseBtn">
    <Form :model="LoanInfo" :label-width="120">
      <FormItem label="借款金额：">
        <Input class="unit-width" v-model="LoanInfo.amount" @on-blur="CalcFee(LoanInfo.type,LoanInfo.days,LoanInfo.amount)"/>
      </FormItem>
      <FormItem label="借款时间：">
        <DatePicker type="date"
                    placeholder="选择日期"
                    class="unit-width"
                    format="yyyy-MM-dd"
                    placement="bottom-end"
                    :value="LoanInfo.jk_date"
                    @on-change="ChoseStart"
                    style="width: 280px"></DatePicker>
      </FormItem>
      <FormItem label="借款天数：">
        <Input class="unit-width" v-model="LoanInfo.days" @on-blur="ClacRes('day')"/>
      </FormItem>
      <FormItem label="还款时间：">
        <DatePicker type="date"
                    placeholder="选择日期"
                    format="yyyy-MM-dd"
                    class="unit-width"
                    placement="bottom-end"
                    :value="LoanInfo.hk_date"
                    @on-change="ChoseEnd"
                    style="width: 280px"></DatePicker>
      </FormItem>
      <FormItem label="费率：">
        <Input class="unit-width" v-model="LoanInfo.fee"/>
      </FormItem>
      <FormItem label="违约金：">
        <Input class="unit-width" v-model="LoanInfo.wy_amount"/>
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
        LoanInfo:{
          uid: '',
          amount: '',
          jk_days: '',
          jk_date: '',
          hk_date: '',
          fee: '',
          wy_amount: '',
          capital_account: ''
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
        this.LoanInfo.uid = val.uid;
        this.LoanInfo.amount = val.amount;
        let days = 0;
        switch(val.type){
          case 'A':
            days = 28;
            break;
          case 'B':
            days = 15;
            break;
          case 'C':
            days = 15;
            break;
          default:
            days = 0;
        };
        this.LoanInfo.capital_account = this.$getLocal('owner');
        this.LoanInfo.days = days;
        const start = new Date(),
          end = new Date(start.getTime() + 1000 * 60 * 60 * 24 * days);
        this.LoanInfo.jk_date = `${start.getFullYear()}-${start.getMonth()+1}-${start.getDate()}`;
        this.LoanInfo.hk_date = `${end.getFullYear()}-${end.getMonth()+1}-${end.getDate(0)}`;
      }
    },
    methods: {
      CloseBtn(){
        this.$emit('CloseModal');
      },
      Submit(){
        this.$emit('SubModal',this.LoanInfo);
      },
      ChoseStart(value){
        this.LoanInfo.jk_date = value;
      },
      ChoseEnd(value){
        this.LoanInfo.hk_date = value;
        this.ClacRes('hk');
      },
      CalcFee(type, time, amount){
        let free = 0;
        time = parseInt(time);
        amount = parseInt(amount);
        if (type === 'A') {
          if (time === 15) {
            free = (amount * 0.14).toFixed(0);
          } else if (time === 28) {
            free = (amount * 0.24).toFixed(0);
          } else if (time < 0) {
            alert('请输入大于0的天数');
          } else {
            free = (amount * time * 0.01).toFixed(0);
          }
        } else if (type === 'B') {
          if (time === 15) {
            free = (amount * 0.26).toFixed(0);
          } else if (time === 14) {
            free = (amount * 0.24).toFixed(0);
          } else if (time < 0) {
            alert('请输入大于0的天数');
          } else {
            free = (amount * time * 0.018).toFixed(0);
          }
        } else if (type === 'C') {
          if (time === 10) {
            free = (amount * 0.24).toFixed(0);
          } else if (time === 15) {
            free = (amount * 0.36).toFixed(0);
          } else if (time < 0) {
            alert('请输入大于0的天数');
          } else {
            free = (amount * time * 0.024).toFixed(0);
          }
        }
        this.LoanInfo.fee = free;
      },
      ClacRes(type){
        switch(type){
          case 'day':

            break;
          case 'hk':
            break;
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
