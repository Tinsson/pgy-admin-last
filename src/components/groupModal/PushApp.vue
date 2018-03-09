<template>
  <Modal
    v-model="AppPushState"
    title="发送消息"
    @on-cancel="CloseBtn">
    <Form ref="Result" :model="Result" :rules="ValidateRules" label-position="right" :label-width="120">
      <FormItem label="发送对象：">
        <div class="object-info">
          共<span class="important-num">{{CountNum}}</span>个用户
          <!--<p class="switch-box">
            <i-switch size="large" v-model="Result.all">
              <span slot="open">全部</span>
              <span slot="close">非全</span>
            </i-switch>
          </p>-->
        </div>
      </FormItem>
      <FormItem label="推送类型：">
        <RadioGroup v-model="Result.type">
          <Radio :label="1">当前条件全部用户</Radio>
          <Radio :label="2">
            <span>仅勾选对象</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="信息模板：" prop="tmplid">
        <Select v-model="Result.tmplid" style="width: 300px;"
                placeholder="请选择信息模板">
          <Option v-for="item in ModeOpt" :value="item.id" :key="item.id">{{ item.title }}</Option>
        </Select>
      </FormItem>
      <FormItem label="发送统计：">
        发送条数：<span>{{CountNum}}</span>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="ghost" @click="CloseBtn">取消</Button>
      <Button type="primary" @click="EditOver">推送</Button>
    </div>
  </Modal>
</template>

<script>
  export default {
    name: 'GroupSms',
    data () {
      return{
        AppPushState: this.modalShow,
        Result: {
          regid: [],
          type: 2,
          tmplid: 0,
          all: false
        },
        ModeOpt: [],
        ValidateRules: {
          tmplid: [
            {required: true, message: '信息模板不能为空！'}
          ]
        }
      }
    },
    props: {
      modalShow: Boolean,
      InitData: Array,
      Count: Number,
      Condition: Object
    },
    watch: {
      modalShow(val){
        this.AppPushState = val;
      },
      InitData(val){
        this.Result.regid = val;
      }
    },
    created(){
      this.GetModeList();
    },
    computed:{
      CountNum(){
          if(this.Result.type === 1){
            return this.Count;
          }else if(this.Result.type === 2){
            return this.InitData.length;
          }
      }
    },
    methods: {
      GetModeList(){
        this.$fetch('/backend/Autopush/modelList').then(d=>{
          this.ModeOpt = d.data;
        })
      },
      EditOver(){
        //console.log(this.Result.regid);
        this.$refs['Result'].validate(valid=>{
          if(valid){
            this.$emit('UpOver',{data:{...this.Result}, condition:{...this.Condition}});
          }
        })
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
