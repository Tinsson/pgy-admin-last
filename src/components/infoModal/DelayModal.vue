<template>
  <Modal
    v-model="State"
    :title="`发起展期申请（${initData.name}）`"
    :styles="{top: '30px',zIndex: '10'}"
    @on-cancel="CloseBtn">
    <Form :model="DelayInfo" :label-width="120">
      <FormItem label="展期金额：">
        <Input class="unit-width" v-model="DelayInfo.amount" @on-blur="ResetCalc"/>
      </FormItem>
      <FormItem label="展期开始日：">
        <DatePicker type="date"
                    placeholder="选择日期"
                    class="unit-width"
                    format="yyyy-MM-dd"
                    placement="bottom-end"
                    :value="DelayInfo.start_date"
                    @on-change="ChoseStart"
                    style="width: 280px"></DatePicker>
      </FormItem>
      <FormItem label="展期天数：">
        <Input class="unit-width" v-model="DelayInfo.days" @on-blur="ResetCalc"/>
      </FormItem>
      <FormItem label="展期至：">
        <DatePicker type="date"
                    placeholder="选择日期"
                    format="yyyy-MM-dd"
                    class="unit-width"
                    placement="bottom-end"
                    :value="DelayInfo.end_date"
                    @on-change="ChoseEnd"
                    style="width: 280px"></DatePicker>
      </FormItem>
      <FormItem label="展期费：">
        <Input class="unit-width" v-model="DelayInfo.fee"/>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="error" @click="CloseBtn">取消</Button>
      <Button type="primary" @click="Submit">提交</Button>
    </div>
  </Modal>
</template>

<script>
  export default {
    name: 'DelayModal',
    data () {
      return{
        State: this.modalShow,
        DelayInfo:{
          uid: this.initData.uid,
          jid: this.initData.id,
          amount: this.initData.amount,
          start_date: '',
          end_date: '',
          days: '',
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
        this.DelayInfo.uid = val.uid;
        this.DelayInfo.jid = val.id;
        this.DelayInfo.amount = val.amount;
        this.DelayInfo.type = val.type;
        let days = val.days;
        this.DelayInfo.days = days;
        //获取时间
        const start = new Date(val.hk_date),
              end = new Date(start.getTime() + 1000 * 60 * 60 * 24 * days);
        this.DelayInfo.start_date = `${start.getFullYear()}-${start.getMonth()+1}-${start.getDate()}`;
        this.DelayInfo.end_date = `${end.getFullYear()}-${end.getMonth()+1}-${end.getDate(0)}`;
        this.GetTotalCount();
      }
    },
    methods: {
      CloseBtn(){
        this.$emit('CloseModal');
      },
      Submit(){
        this.$emit('SubModal',this.DelayInfo);
      },
      ChoseStart(value){
        this.DelayInfo.start_date = value;
      },
      ChoseEnd(value){
        this.DelayInfo.end_date = value;
      },
      GetTotalCount(){
        this.$post('/backend/Tocalculate/zhanqiTocal',{jid: this.DelayInfo.jid,days: this.DelayInfo.days}).then(d=>{
          this.DelayInfo.fee = d.data;
        })
      },
      ResetCalc(){
        const start = new Date(this.DelayInfo.start_date),
          end = new Date(start.getTime() + 1000 * 60 * 60 * 24 * this.DelayInfo.days);
        this.DelayInfo.end_date = `${end.getFullYear()}-${end.getMonth()+1}-${end.getDate(0)}`;
        this.GetTotalCount();
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
