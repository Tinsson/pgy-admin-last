<template>
  <div>
    <Modal
      v-model="State"
      title="设置钉钉模板（点击提交后修改才能生效）"
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
          <p class="tag-box">
            <Tag v-for="(item,index) in SubData.button" :key="item.url" type="dot" closable color="blue" @on-close="RemoveBtn(index)"><span @click="EditBtn(item, index)">{{item.name}}</span></Tag>
            <Button icon="ios-plus-empty" type="dashed" size="large" @click="AddBtn">添加按钮</Button>
          </p>
        </div>
      </div>
      <div slot="footer">
        <Button type="error" @click="CloseBtn">取消</Button>
        <Button type="primary" @click="Submit">提交</Button>
      </div>
    </Modal>
    <Modal v-model="Button.state"
           :title="Button.title"
           style="z-index: 10"
           @on-cancel="BtnCancel"
           @on-ok="BtnAdd">
      <Form :label-width="80">
        <FormItem label="按钮名称：">
          <Input v-model="Button.name"/>
        </FormItem>
        <FormItem label="按钮链接：">
          <Input v-model="Button.url"/>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>


<script>
  export default {
    name: 'DelayModal',
    data () {
      return{
        State: this.modalShow,
        FixArr:[{
          name: '{管理员名}',
          value: '{admin_name}'
        },{
          name: '{客户名}',
          value: '{name}'
        },{
          name: '{手机号}',
          value: '{phone}'
        },{
          name: '{借款金额}',
          value: '{jkamount}'
        },{
          name: '{还款金额}',
          value: '{hkamount}'
        },{
          name: '{展期金额}',
          value: '{zqamount}'
        },{
          name: '{借款时间}',
          value: '{jkdate}'
        },{
          name: '{展期开始时间}',
          value: '{zqdate_s}'
        },{
          name: '{还款时间}',
          value: '{hkdate}'
        },{
          name: '{展期结束时间}',
          value: '{zqdate_e}'
        },{
          name: '{借款天数}',
          value: '{jkday}'
        },{
          name: '{展期天数}',
          value: '{zqday}'
        },{
          name: '{申请时间}',
          value: '{rq_date}'
        },{
          name: '{借款审核状态}',
          value: '{jksh_status}'
        },{
          name: '{展期审核状态}',
          value: '{zqsh_status}'
        },{
          name: '{借款审核操作人}',
          value: '{jkcaozuoyuan}'
        },{
          name: '{借款审核操作人}',
          value: '{zqcaozuoyuan}'
        },{
          name: '--换行--',
          value: '/r'
        }],
        CusInfo: '',
        FocusKey: '',
        ShowData: {
          title: [],
          content: []
        },
        SubData:{
          title: [],
          content: [],
          button: [{
            name: '审核通过',
            url: 'www.tinsson.com'
          }]
        },
        Button:{
          state: false,
          title: '添加按钮',
          edit: false,
          key: 0,
          name: '',
          url: ''
        }
      }
    },
    props: {
      modalShow: Boolean,
      isEdit: Boolean,
      initData: Object
    },
    watch:{
      modalShow(val){
        this.State = val;
      },
      initData(val){
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
        this.$emit('SubModal',this.SubData);
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
        if(this.FocusKey){
          this.SubData[this.FocusKey].push(this.CusInfo);
          this.ShowData[this.FocusKey].push(this.CusInfo);
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
      },
      AddBtn(){
        this.Button.state = true;
        this.Button.edit = false;
        this.Button.name = '';
        this.Button.url = '';
        this.Button.title = '添加按钮';
      },
      BtnCancel(){
        this.Button.state = false;
      },
      BtnAdd(){
        if(this.Button.edit){
          let button = this.SubData.button[this.Button.key];
          button.name = this.Button.name;
          button.url = this.Button.url;
        }else{
          const data = {
            name: this.Button.name,
            url: this.Button.url
          };
          this.SubData.button.push(data);
        }
      },
      RemoveBtn(index){
        this.$Modal.confirm({
          title: '提示',
          content: `<p class="confirm-text">确认删除此按钮吗？</p>`,
          onOk: ()=>{
            this.SubData.button = this.SubData.button.splice(index,0);
          }
        })
      },
      EditBtn(item, index){
        this.Button.state = true;
        this.Button.edit = true;
        this.Button.name = item.name;
        this.Button.url = item.url;
        this.Button.key = index;
        this.Button.title = '修改按钮内容';
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
    }
  }
  .btn-modal{
    z-index: 10;
  }
</style>
