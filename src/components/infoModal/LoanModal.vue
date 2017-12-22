<template>
  <Modal
    v-model="State"
    :title="`放款操作（${initData.name}）`"
    :styles="{top: '30px',zIndex: '10'}"
    @on-cancel="CloseBtn">
    <Form :model="LoanInfo" :label-width="120">
      <FormItem label="借款金额：">
        <Input class="unit-width" v-model="LoanInfo.amount" @on-change="ChangeAmount"/>
      </FormItem>
      <!--<FormItem label="合同还款金额：">
        <Input class="unit-width" v-model="LoanInfo.ht_amount"/>
      </FormItem>-->
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
        <Input class="unit-width" v-model="LoanInfo.jk_days" @on-blur="ClacRes('day')"/>
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
          limit: '',
          ht_amount: '',
          jk_days: '',
          jk_date: '',
          hk_date: '',
          fee: 0,
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
        const days = val.jk_date;
        this.LoanInfo.uid = val.uid;
        this.LoanInfo.amount = val.amount;
        this.LoanInfo.capital_account = this.$getLocal('owner');
        this.LoanInfo.jk_days = days;
        this.LoanInfo.limit = val.limit;
        const start = new Date(),
          end = new Date(start.getTime() + 1000 * 60 * 60 * 24 * days);
        this.LoanInfo.jk_date = `${start.getFullYear()}-${start.getMonth()+1}-${start.getDate()}`;
        this.LoanInfo.hk_date = `${end.getFullYear()}-${end.getMonth()+1}-${end.getDate(0)}`;
        this.GetTotalCount();
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
      GetTotalCount(){
        this.$post('/backend/Tocalculate/LoanTocal',{N:this.LoanInfo.amount,T:this.LoanInfo.jk_days}).then(d=>{
          this.LoanInfo.ht_amount = d.data;
        })
      },
      ClacRes(type){
        switch(type){
          case 'day':
            const start = new Date(this.LoanInfo.jk_date),
              end = new Date(start.getTime() + 1000 * 60 * 60 * 24 * this.LoanInfo.jk_days);
            this.LoanInfo.hk_date = `${end.getFullYear()}-${end.getMonth()+1}-${end.getDate(0)}`;
            break;
          case 'hk':
            let stamp = new Date(this.LoanInfo.hk_date) - new Date(this.LoanInfo.jk_date);
            this.LoanInfo.jk_days = parseInt(stamp/1000/60/60/24);
            break;
        }
      },
      ChangeAmount(){
        if(this.LoanInfo.amount > this.LoanInfo.limit){
          this.LoanInfo.amount = this.LoanInfo.limit;
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
