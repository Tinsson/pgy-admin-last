<template>
  <div id="auto-post">
    <h1 class="list-title">
      <span class="tit-text">{{ title }}</span>
      <Button class="tit-btn"
              type="info"
              icon="ios-reload"
              size="large"
              @click="RefreshList">刷新列表</Button>
    </h1>
    <div class="screen-area">
      <Card>
        <div class="card-tit" slot="title">
          <h3>
            <Icon type="ios-pricetags-outline"></Icon>
            筛选查询
          </h3>
          <div class="btn-box">
            <Button type="ghost" icon="reply" @click="ResetScreen">重置筛选</Button>
            <Button type="success" icon="search" @click="SimpleSearch">查询结果</Button>
          </div>
        </div>
        <div class="opt-box">
          <Form :model="ScreenData" inline :label-width="85">
            <FormItem label="名称：">
              <Input v-model="ScreenData.name" style="width: 120px"></Input>
            </FormItem>
            <FormItem label="类型：">
              <Select v-model="ScreenData.status" style="width: 160px">
                <Option value="1">短信</Option>
                <Option value="2">APP</Option>
              </Select>
            </FormItem>
          </Form>
        </div>
      </Card>
    </div>
    <div class="data-area">
      <Card :padding="0">
        <div class="card-tit" slot="title">
          <h3>
            <Icon type="clipboard"></Icon>
            数据列表
          </h3>
          <div class="btn-box">
            <Button type="warning" size="large" icon="chatbox" @click="AddRulesModal">添加规则</Button>
          </div>
        </div>
        <Table :columns="UserCol"
               :data="UserData"
               :loading="loading"
               @on-selection-change="SelectTable"></Table>
      </Card>
    </div>
    <Modal
      v-model="RulesModal.modal"
      title="设置规则">
      <Form ref="RulesModal" :model="RulesModal.data" :rules="ValidateRules" label-position="right" :label-width="80" class="auto-height">
        <FormItem label="启用状态：">
          <RadioGroup v-model="RulesModal.data.disable">
            <Radio :label="0">已禁用</Radio>
            <Radio :label="1">已启用</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="推送：">
          <RadioGroup v-model="RulesModal.data.sms_type">
            <Radio :label="0">app推送</Radio>
            <Radio :label="1">短信推送</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="类型：" porp="type">
          <Select v-model="RulesModal.data.type" class="info-width">
            <Option :value="0">获客类</Option>
            <Option :value="1">认证类</Option>
            <Option :value="2">交易类</Option>
            <Option :value="3">催收提醒类</Option>
          </Select>
        </FormItem>
        <FormItem label="行为：" v-show="BehaviorData.show" prop="behavior">
          <Select v-model="RulesModal.data.behavior" class="info-width">
            <Option v-for="(opt, index) in BehaviorArr" :value="index" :key="opt">{{opt}}</Option>
          </Select>
        </FormItem>
        <FormItem label="状态：" prop="status">
          <Select v-model="RulesModal.data.status" class="info-width">
            <Option v-for="(opt, index) in StatusArr" :value="index" :key="opt">{{opt}}</Option>
          </Select>
        </FormItem>
        <FormItem label="时间约束：">
          <RadioGroup v-model="RulesModal.data.period">
            <Radio v-for="(opt, index) in TriggerArr" :label="index" :key="opt">{{opt}}</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="时长：" prop="trigger_date">
          <Row>
            <Col span="3">
              <Input :number="true" v-model="RulesModal.data.trigger_date"></Input>
            </Col>
            <Col span="2" class="col-center">分钟</Col>
            <!--<Col span="3" v-show="IsUrge">
              <Input :number="true" v-model="RulesModal.data.hour"></Input>
            </Col>
            <Col span="2" class="col-center" v-show="IsUrge">时</Col>
            <Col span="3" v-show="IsUrge">
            <Input :number="true" v-model="RulesModal.data.min"></Input>
            </Col>
            <Col span="2" class="col-center" v-show="IsUrge">分</Col>
            <Col span="3" v-show="IsUrge">
            <Input :number="true" v-model="RulesModal.data.sec"></Input>
            </Col>
            <Col span="2" class="col-center" v-show="IsUrge">秒</Col>-->
          </Row>
        </FormItem>
        <FormItem label="名称：" prop="title">
          <Input v-model="RulesModal.data.title"></Input>
        </FormItem>
        <FormItem label="内容：" prop="content">
          <Input v-model="RulesModal.data.content" type="textarea" :autosize="{minRows: 3,maxRows: 5}"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="ModalCancel" size="large">取消</Button>
        <Button type="primary" @click="AddOver" size="large">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { getLocal } from '@/util/util'

  export default {
    name: 'AutoPost',
    data () {
      return {
        title: '自动推送',
        apiUrl: 'Autopush/autoPushList',
        auth_id: '',
        loading: true,
        TextArr:{
          trigger: ['立即触发','多少小时触发','多少天触发'],
          display: ['禁用','启用'],
          status: ['失败','成功','未逾期','已逾期'],
          type: ['获客类','认证类','交易类','催收提醒类'],
          sms_type: ['app推送','短信推送']
        },
        //行为选择
        BehaviorData:{
          show: true,
          type: [
            ['注册'],
            ['基础认证完毕','提额认证完毕'],
            ['借款','还款','续借','展期'],
            []
          ],
        },
        StatusData:[
          ['成功','失败'],
          ['成功','失败'],
          ['成功','失败'],
          ['未逾期','已逾期']
        ],
        TriggerData:{
          single: ['之后触发'],
          double: ['距离还款日','逾期超过']
        },
        //基础筛选数据
        ScreenData: {
          name: '',
          status: ''
        },
        //添加规则
        RulesModal:{
          modal: false,
          isEdit: false,
          id: '',
          data: {
            sms_type: 0,
            type: 0,
            behavior: 0,
            status: 0,
            trigger: 0,
            trigger_date: 0,
            disable: 1,
            title: '',
            content: ''
          }
        },
        UserCol: [
          {
            type: 'selection',
            width: 55,
            align: 'center'
          },{
            title: '序号',
            width: '70',
            align: 'center',
            key: 'id'
          },{
            title: '名称',
            width: '100',
            align: 'center',
            key: 'title'
          },{
            title: '状态',
            key: 'status'
          },{
            title: '行为',
            key: 'behavior'
          },{
            title: '推送类型',
            key: 'type'
          },{
            title: '推送方式',
            key: 'sms_type'
          },{
            title: '触发状态',
            key: 'trigger'
          },{
            title: '触发时间(分)',
            key: 'trigger_date'
          },{
            title: '操作',
            key: 'operation',
            align: 'center',
            width: '330',
            render: (h, params)=>{
              return h('div',this.RenderBtn(h, params, this.BtnData));
            }
          }
        ],
        UserData: [],     //表格数据
        RowUserData: [],  //获取的原始数据
        BtnData: [],
        //验证规则
        ValidateRules:{
          type: [
            {required: true, message: '类型不能为空！'}
          ],
          behavior: [
            {required: true, message: '行为不能为空！'}
          ],
          status: [
            {required: true, message: '状态不能为空！'}
          ],
          trigger_date: [
            {required: true, message: '触发时间不能为空！'}
          ],
          title: [
            {required: true, message: '名称不能为空！'}
          ],
          content: [
            {required: true, message: '内容不能为空！'}
          ]
        },
        //群选打钩后操作
        SelectData: []
      }
    },
    created(){
      this.auth_id = getLocal('auth_id');
      this.InitData(this.apiUrl);
    },
    computed: {
      BehaviorArr(){
        this.BehaviorData.show = (this.RulesModal.data.type === 3)?false:true;
        return this.BehaviorData.type[this.RulesModal.data.type];
      },
      StatusArr(){
        return this.StatusData[this.RulesModal.data.type];
      },
      TriggerArr(){
        if(this.RulesModal.data.type === 3){
          return this.TriggerData.double;
        }else{
          return this.TriggerData.single;
        }
      },
      IsUrge(){
        const type = this.RulesModal.data.type;
        if(type === 3){
          this.RulesModal.data.day = 0;
          this.RulesModal.data.hour = 0;
          this.RulesModal.data.min = 0;
          this.RulesModal.data.sec = 0;
        }
        return (type === 3)?false:true;
      }
    },
    methods: {
      //循环渲染按钮
      RenderBtn(h,params,bdata){
        let res = [];
        bdata.forEach((val)=>{
          let btn = '';
          if(val.class === 'ChangeStatus'){
            const color = params.row.disable?'warning':val.color;
            const name = params.row.disable?'禁用': val.name;
            btn = h('Button',{
              props: {
                type: color
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: ()=>{
                  this[val.class](params.row)
                }
              },
            },name);
          }else{
            btn = h('Button',{
              props: {
                type: val.color
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: ()=>{
                  this[val.class](params.row)
                }
              },
            },val.name);
          }

          res.push(btn);
        });
        return res;
      },
      //去除data数据里绑定的监视器
      RemoveObserve(rowdata){
        return JSON.parse(JSON.stringify(rowdata));
      },
      //筛选操作(重置筛选)
      ResetScreen(){
        for(let key in this.ScreenData){
          this.ScreenData[key] = '';
        }
        this.allTime = '';
      },
      //多选打钩绑定数据
      SelectTable(data){
        let idarr = [];
        if(data.length > 0){
          data.forEach(val=>{
            idarr.push(val.id);
          })
        }
        this.SelectData = idarr;
      },
      //查询结果
      SimpleSearch(sign = 1){
        let sinfo = this.RemoveObserve(this.ScreenData);
        this.InitData(this.apiUrl,sinfo).then(()=>{
          if(sign){
            this.$Message.success('筛选成功！');
          }
        });
      },
      //初始化数据
      InitData(url,params = {}){
        const that = this;
        this.loading = true;
        //获取按钮信息
        this.$fetch('Menuauth/listAuthGet',{auth_id: this.auth_id}).then((d)=>{
          this.BtnData = d.data.operation;
        });
        //列表数据获取
        return new Promise((resolve)=>{
          this.$post(url,params).then((d)=>{
            let res = d.data;
            this.RowUserData = res;
            this.UserData = res;
            if(res.length > 0){
              this.UserData.forEach(val=>{
                for(let key in val){
                  if(key in this.TextArr){
                    val[key] = this.TextArr[key][val[key]];
                  }
                }
              })
            }
            that.loading = false;
            resolve();
          })
        })
      },
      //刷新列表
      RefreshList(){
        this.InitData('Collection/CollectionList').then(()=>{
          this.$Message.success('刷新成功');
        });
      },
      //提交信息操作
      UploadData(url,info){
        return new Promise((resolve)=>{
          this.$post(url,info).then((d)=>{
            if(d.status === 1){
              this.$Message.success(d.message);
              resolve(d.data);
            }else{
              this.$Message.error(d.message);
            }
          }).catch((err)=>{
            this.$Message.error('服务器繁忙，请稍后再试！');
          })
        })
      },
      //添加规则
      AddRulesModal(){
        this.$refs['RulesModal'].resetFields();
        this.RulesModal.data = {
          sms_type: 0,
          type: 0,
          behavior: 0,
          status: 0,
          trigger: 0,
          trigger_date: 0,
          disable: 1,
          title: '',
          content: '',
          day: 0,
          hour: 0,
          min: 0,
          sec: 0
        };
        this.RulesModal.isEdit = false;
        this.RulesModal.modal = true;
      },
      ModalCancel(){
        this.RulesModal.modal = false;
      },
      AddOver(){
        this.$refs['RulesModal'].validate(valid=>{
          if(valid){
            let ninfo = this.RemoveObserve(this.RulesModal.data);
            const isEdit = this.RulesModal.isEdit;
            const url = isEdit?'Autopush/autoPushUp':'Autopush/autoPushAdd';
            if(isEdit){
              ninfo.id = this.RulesModal.id;
            }
            this.UploadData(url,ninfo).then(()=>{
              this.RulesModal.modal = false;
              this.InitData(this.apiUrl);
            });
          }
        });
      },
      //开启规则
      ChangeStatus(row){
        this.UploadData('Autopush/autoPushDisable',{id: row.id}).then(()=>{
          this.SimpleSearch(0);
        });
      },
      //修改规则
      EditOpt(row){
        this.$post('Autopush/autoPushReqUp',{id: row.id}).then(d=>{

          this.RulesModal.data = {
            sms_type: d.data.sms_type,
            type: d.data.type,
            behavior: d.data.behavior,
            status: d.data.status,
            trigger: d.data.trigger,
            trigger_date: d.data.trigger_date,
            disable: d.data.disable,
            title: d.data.title,
            content: d.data.content,
          };
          this.RulesModal.isEdit = true;
          this.RulesModal.id = row.id;
          this.RulesModal.modal = true;
        })


      },
      //删除规则
      Delopt(row){
        this.$Modal.confirm({
          title: '提示',
          content: `<p class="confirm-text">删除此规则</p>`,
          onOk: ()=>{
            this.UploadData('Autopush/autoPushDel',{id: row.id}).then(()=>{
              this.SimpleSearch(0);
            });
          }
        })
      }
    }
  }
</script>


<style lang="less" scoped>
  .list-title{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-weight: normal;
    padding-bottom: 10px;
  }
  .data-area{
    padding-top: 20px;
    .ivu-table-wrapper{
      border: none;
    }
    .page-box{
      padding: 20px;
      display: flex;
      flex-direction: row-reverse;
    }
  }
  .card-tit{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .col-center{
    text-align: center;
  }
  .auto-height{
    max-height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .info-width{
    width: 200px;
  }
</style>
