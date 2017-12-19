<template>
  <div>
    <Modal
      v-model="State"
      :title="`${mTitle}消息模板（点击提交后修改才能生效）`"
      :width="1000"
      class="ding-modal"
      @on-cancel="CloseBtn">
      <div class="ding-area">
        <div class="edit-box">
          <div class="fix-opt">
            <h2 class="title">添加选项</h2>
            <p class="btn-box">
              <Button v-for="item in FixArr" class="button" :key="item.value" icon="ios-plus-empty" type="dashed" @click="AddTag(item)">{{item.name}}</Button>
            </p>
          </div>
          <div class="cus-box">
            <h2 class="title">自定义内容</h2>
            <Form inline :label-width="60">
              <FormItem label="内容：">
                <Input v-model="CusInfo" style="width: 280px" @on-enter="AddCus"/>
              </FormItem>
              <Button type="success" @click="AddCus">添加</Button>
            </Form>
          </div>
        </div>
        <div class="preview-box">
          <div class="opt-info">
            <h2 class="title">模板说明信息（直接输入信息）</h2>
            <Form :label-width="80" inline>
              <FormItem label="模板名称">
                <Input v-model="SubData.name" class="ipt-info"/>
              </FormItem>
              <FormItem label="英文名">
                <Input v-model="SubData.title_en" class="ipt-info"/>
              </FormItem>
              <FormItem label="备注">
                <Input v-model="SubData.remark" class="ipt-info"/>
              </FormItem>
            </Form>
          </div>
          <h2 class="title">模板内容（左侧操作输入信息）</h2>
          <Form :label-width="80" inline>
            <FormItem label="标题：">
              <Input type="textarea" class="ipt-info" :value="getTitle" @on-focus="Focus('title')" readonly/>
              <Button type="error" class="del-btn" @click="Delete('title')">回删</Button>
            </FormItem>
            <FormItem label="内容：">
              <Input type="textarea" class="ipt-info" :value="getContent" @on-focus="Focus('content')" readonly/>
              <Button type="error" class="del-btn" @click="Delete('content')">回删</Button>
            </FormItem>
          </Form>
        </div>
      </div>
      <div slot="footer">
        <Button type="error" @click="CloseBtn">取消</Button>
        <Button type="primary" @click="Submit">提交</Button>
      </div>
    </Modal>
  </div>
</template>


<script>
  export default {
    name: 'MsgModal',
    data () {
      return{
        State: this.modalShow,
        mTitle: '添加',
        FixArr:[{
          name: '{客户名}',
          value: '{name}'
        },{
          name: '{手机号}',
          value: '{phone}'
        },{
          name: '{额度}',
          value: '{edu}'
        },{
          name: '{用户ID}',
          value: '{uid}'
        },{
          name: '{客服}',
          value: '{kefu}'
        },{
          name: '{还款金额}',
          value: '{hkamount}'
        }],
        CusInfo: '',
        FocusKey: '',
        ShowData: {
          title: [],
          content: []
        },
        SubData:{
          type: 'actionCard',
          template_name: '',
          send_url: '',
          title_en: '',
          remark: '',
          title: [],
          content: []
        }
      }
    },
    props: {
      modalShow: Boolean,
      isEdit: Object,
      initData: Object
    },
    watch:{
      modalShow(val){
        this.State = val;
      },
      isEdit(val){
        if(val.status){
          this.mTitle = '编辑';
        }else{
          this.mTitle = '添加';
          this.SubData = {
            type: 'actionCard',
            template_name: '',
            send_url: '',
            title_en: '',
            remark: '',
            title: [],
            content: [],
            check_button: []
          };
          this.ShowData = {
            title: [],
            content: []
          };
        }
      },
      initData(val){
        this.SubData.title_en = val.title_en;
        this.SubData.template_name = val.template_name;
        this.SubData.remark = val.remark;
        this.SubData.check_button = val.check_button;
        this.SubData.send_url = val.send_url;
        this.SubData.title = val.title;
        this.SubData.content = val.content;

        let title = [],
            content = [];
        this.SubData.title.forEach(val=>{
          if(/^{\w+}$/.test(val)){
            this.FixArr.forEach(vval=>{
              if(vval.value === val){
                title.push(vval.name);
              }
            })
          }else{
            title.push(val);
          }
        })
        this.SubData.content.forEach(val=>{
          if(/^{\w+}$/.test(val)){
            this.FixArr.forEach(vval=>{
              if(vval.value === val){
                content.push(vval.name);
              }
            })
          }else{
            content.push(val);
          }
        })
        this.ShowData.title = title;
        this.ShowData.content = content;
      }
    },
    computed:{
      getTitle(){
        return this.ShowData.title.join('');
      },
      getContent(){
        return this.ShowData.content.join('');
      }
    },
    methods: {
      CloseBtn(){
        this.$emit('CloseModal');
      },
      Submit(){
        this.$emit('SubModal',this.SubData,this.isEdit);
      },
      AddTag(tag){
        if(this.FocusKey){
          this.SubData[this.FocusKey].push(tag.value);
          this.ShowData[this.FocusKey].push(tag.name);
        }else{
          this.AlertErr();
        }
      },
      AddCus(){
        if(this.CusInfo === ""){
          return false;
        }
        if(this.FocusKey){
          this.SubData[this.FocusKey].push(this.CusInfo);
          this.ShowData[this.FocusKey].push(this.CusInfo);
          this.CusInfo = '';
        }else{
          this.AlertErr();
        }
      },
      Focus(key){
        this.FocusKey = key;
      },
      AlertErr(){
        this.$Message.error('请选择输入框！');
      },
      Delete(key){
        this.SubData[key].pop();
        this.ShowData[key].pop();
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
  .ding-area{
    display: flex;
    flex-direction: row;
    .edit-box{
      width: 45%;
      box-sizing: border-box;
      padding-right: 10px;
      border-right: 1px solid #e3e3e3;
      .fix-opt{
        width: 100%;
        .btn-box{
          padding: 5px 0;
          .button{
            margin: 0 5px 5px 0;
          }
        }
      }
      .cus-box{
        width: 100%;
        border-top: 1px solid #e3e3e3;
        .title{
          padding: 10px 0;
        }
      }
    }
    .preview-box{
      width: 55%;
      box-sizing: border-box;
      padding-left: 10px;
      .ipt-info{
        width: 435px;
      }
      .del-btn{
        margin-top: 10px;
      }
      .tag-box{
        margin-left: 30px;
      }
      .opt-info{
        border-bottom: 1px solid #e3e3e3;
      }
      .title{
        padding: 10px 0;
      }
    }
  }
  .btn-modal{
    z-index: 10;
  }
</style>
