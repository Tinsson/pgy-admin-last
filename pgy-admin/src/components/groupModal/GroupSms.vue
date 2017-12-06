<template>
  <Modal
    v-model="SmsState"
    title="群发短信"
    @on-ok="EditOver"
    @on-cancel="CloseBtn">
    <Form label-position="right" :label-width="120">
      <FormItem label="发送对象：">
        <div class="object-info">
          共<span class="important-num">{{CountNum}}</span>个用户
          <p class="switch-box">
            <i-switch size="large" v-model="Result.all">
              <span slot="open">全部</span>
              <span slot="close">非全</span>
            </i-switch>
          </p>
        </div>
      </FormItem>
      <FormItem label="短信模板：">
        <Select v-model="Result.type" style="width: 300px;"
                placeholder="请选择短信模板">
          <Option :value="1">模板一</Option>
          <Option :value="2">模板二</Option>
          <Option :value="3">模板三</Option>
          <Option :value="4">模板四</Option>
        </Select>
      </FormItem>
      <FormItem label="发送统计">
        发送条数：<span>{{CountNum}}</span>　可用短信条数：<span class="important-num">100000</span>条
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
  export default {
    name: 'GroupSms',
    data () {
      return{
        SmsState: this.modalShow,
        Result: {
          id: this.InitData,
          type: 1,
          all: false
        }
      }
    },
    props: {
      modalShow: Boolean,
      InitData: Array,
      Count: Number
    },
    watch: {
      modalShow(val){
        this.SmsState = val;
      },
      InitData(val){
        this.Result.id = val;
      }
    },
    computed:{
      CountNum(){
          if(this.InitData.length > 0){
            if(this.Result.all){
              return this.Count;
            }else{
              return this.InitData.length;
            }
          }else{
            return 0;
          }
      }
    },
    methods: {
      EditOver(){
        this.$emit('UpOver',this.Result);
      },
      CloseBtn(){
        this.$emit('CloseModal',this.modalState);
      }
    }
  }
</script>

<style lang="less" scoped>
  .important-num{
    color: #f74c17;
  }
  .object-info{
    display: flex;
    flex-direction: row;
    .switch-box{
      margin-left: 20px;
    }
  }
</style>
