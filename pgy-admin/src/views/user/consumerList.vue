<template>
  <div id="consumer">
    <div id="listRole" v-show="!isEdit">
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
              <Button type="warning" icon="clipboard" @click="SeniorShow">高级检索</Button>
            </div>
          </div>
          <div class="opt-box">
            <Form :model="ScreenData" inline :label-width="85">
              <FormItem label="用户手机号：">
                <Input v-model="ScreenData.phone" placeholder="输入手机号码"></Input>
              </FormItem>
              <FormItem label="芝麻分范围：">
                <Row style="width: 200px">
                  <Col span="10">
                    <Input v-model="ScreenData.start_zmop" placeholder="下限"></Input>
                  </Col>
                  <Col span="2" style="text-align: center">-</Col>
                  <Col span="10">
                    <Input v-model="ScreenData.end_zmop" placeholder="上限"></Input>
                  </Col>
                </Row>
              </FormItem>
              <!--<FormItem label="运营商：">
                <RadioGroup v-model="ScreenData.rz_status">
                  <Radio label="已认证"></Radio>
                  <Radio label="未认证"></Radio>
                </RadioGroup>
              </FormItem>-->
              <FormItem label="注册时间：">
                <DatePicker type="datetimerange"
                            placeholder="选择日期和时间"
                            format="yyyy-MM-dd HH:mm:ss"
                            :value="ScreenData.sim_time"
                            @on-change="PickDate"
                            style="width: 280px"></DatePicker>
              </FormItem>
              <!--<FormItem label="审核状态：">
                <RadioGroup v-model="ScreenData.sh_status">
                  <Radio label="已认证"></Radio>
                  <Radio label="未认证"></Radio>
                </RadioGroup>
              </FormItem>-->
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
              <Button type="info" size="large" icon="chatbox" @click="GroupAppOpt">群发APP消息</Button>
              <Button type="primary" size="large" icon="archive" @click="ExportData">导出数据</Button>
            </div>
          </div>
          <Table :columns="UserCol"
                 :data="UserData"
                 :loading="loading"
                 @on-selection-change="SelectTable"></Table>
          <div class="page-box">
            <Page :current="Page.cur"
                  :page-size="Page.size"
                  :total="Page.count"
                  placement="top"
                  @on-change="ChangePage"
                  @on-page-size-change="ChangeSize" show-sizer></Page>
          </div>
        </Card>
      </div>
      <Modal v-model="SeniorModal"
             :width="600"
             @on-ok="SeniorSearch">
        <h2 slot="header">高级筛选</h2>
        <Form :model="SeniorData" label-position="right" class="auto-height" :label-width="90" inline>
          <h3 class="senior-subtit">基础数据：</h3>
          <FormItem label="用户姓名：">
            <Input v-model="SeniorData.name"></Input>
          </FormItem>
          <FormItem label="身份证号：">
            <Input v-model="SeniorData.idcard"></Input>
          </FormItem>
          <FormItem label="用户手机号：">
            <Input v-model="SeniorData.phone"></Input>
          </FormItem>
          <FormItem label="用户类型：">
            <Select v-model="SeniorData.type" placeholder="请选择用户类型" style="width:162px">
              <Option value="A">A</Option>
              <Option value="B">B</Option>
              <Option value="C">C</Option>
              <Option value="D">D</Option>
              <Option value="E">E</Option>
            </Select>
          </FormItem>
          <h3 class="senior-subtit">状态检索：</h3>
          <RadioGroup v-model="SeniorData.status_bz">
            <div class="chose-area">
              <Radio label="AUDIT">审核状态：</Radio>
              <Select v-model="SeniorData.sh_status" placeholder="请选择审核状态" style="width:162px">
                <Option value="1">仅注册</Option>
                <Option value="2">活体识别通过</Option>
                <Option value="3">活体识别未通过</Option>
                <Option value="4">微信客服审核通过</Option>
                <Option value="5">微信客服审核不通过</Option>
                <Option value="6">同盾审核通过</Option>
                <Option value="7">同盾审核未通过</Option>
                <Option value="8">成安审核通过</Option>
                <Option value="9">成安审核未通过</Option>
              </Select>
            </div>
            <div class="chose-area">
              <Radio label="LOAN">交易状态：</Radio>
              <Select v-model="SeniorData.pay_status" placeholder="请选择交易状态" style="width:162px">
                <Option value="1">未借款</Option>
                <Option value="2">借款已还</Option>
                <Option value="3">正常借款中</Option>
                <Option value="4">逾期未还</Option>
                <Option value="5">展期中</Option>
                <Option value="6">展期逾期未还</Option>
              </Select>
            </div>
            <div class="chose-area long">
              <Radio label="CERT" class="rz-state">认证状态：</Radio>
              <div class="option">
                <div class="opt-box">
                  <Checkbox :indeterminate="Idtmte1"
                            class="check-all1"
                            :value="CheckAll1"
                            @click.prevent.native="CheckAll(1)">基础认证</Checkbox>
                  <Checkbox :indeterminate="Idtmte2"
                            class="check-all2"
                            :value="CheckAll2"
                            @click.prevent.native="CheckAll(2)" :disabled="LimitState">提额认证</Checkbox>
                </div>
                <div class="opt-box">
                  <div class="base">
                    <CheckboxGroup v-model="BaseCheck" @on-change="BaseCheckChange">
                      <Checkbox label="RG">仅注册</Checkbox>
                      <Checkbox label="ID">身份验证</Checkbox>
                      <Checkbox label="CB">已绑卡</Checkbox>
                      <Checkbox label="MB">已运营商验证</Checkbox>
                      <Checkbox label="BI">基本资料认证</Checkbox>
                      <Checkbox label="ZM">芝麻分已认证</Checkbox>
                    </CheckboxGroup>
                  </div>
                  <div class="uplimit">
                    <CheckboxGroup v-model="UpCheck" @on-change="UpCheckChange">
                      <Checkbox label="TB" :disabled="LimitState">淘宝已认证</Checkbox>
                      <Checkbox label="WX" :disabled="LimitState">微信客服认证</Checkbox>
                    </CheckboxGroup>
                  </div>
                </div>
                <div class="opt-box">
                  <div class="rdo-box">
                    <Radio v-model="RenzTypeB">并</Radio>
                    <Radio v-model="RenzTypeQ">且</Radio>
                  </div>
                </div>
              </div>
            </div>
          </RadioGroup>
          <FormItem label="芝麻分范围：">
            <Row style="width: 300px">
              <Col span="10">
              <Input type="text" v-model="SeniorData.start_zmop" placeholder="下限"></Input>
              </Col>
              <Col span="2" style="text-align: center">至</Col>
              <Col span="10">
              <Input type="text" v-model="SeniorData.end_zmop" placeholder="上限"></Input>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="注册时间：">
            <DatePicker type="datetimerange"
                        placeholder="选择日期和时间"
                        format="yyyy-MM-dd HH:mm:ss"
                        @on-change="PickDate"
                        :value="allTime"
                        style="width: 280px"
                        placement="top"></DatePicker>
          </FormItem>
          <FormItem label="来源渠道：">
            <Select v-model="SeniorData.qudao" placeholder="请选择来源渠道" style="width:162px">
              <Option value="0">未知</Option>
              <Option value="1">Android</Option>
              <Option value="2">IOS</Option>
              <Option value="3">Web平台</Option>
            </Select>
          </FormItem>
        </Form>
        <p slot="footer">
          <Button type="ghost" @click="SeniorReset">重置</Button>
          <Button type="info" @click="SeniorSearch">提交筛选</Button>
        </p>
      </Modal>
      <PushApp :modalShow="Group.AppmsgModal"
               :InitData="SelectData"
               :Count="Page.count"
               @CloseModal="CloseApp"
               @UpOver="AppOpt"></PushApp>
      <AuditModal :modalShow="Audit.modal"
                  :InitId="Audit.id"
                  :UniqueId="Audit.id"
                  :AllId="Audit.allId"
                  @CloseModal="AuditCancel"></AuditModal>
    </div>
    <ConsumerEdit v-show="isEdit"
                  :info="EditData"
                  :uid="EditId"
                  @BackOpt="ListShow"></ConsumerEdit>
  </div>
</template>

<script>
  import { getLocal } from '@/util/util'
  import ConsumerEdit from '@/views/user/consumerEdit'
  import PushApp from '@/components/groupModal/PushApp'
  import AuditModal from '@/components/infoModal/AuditModal'

  export default {
    name: 'consumerList',
    components: {
      ConsumerEdit,
      PushApp,
      AuditModal
    },
    data () {
      return {
        title: '用户列表',
        auth_id: '',
        loading: true,
        allTime: [],
        isEdit: false, //是否为编辑操作
        //基础筛选数据
        ScreenData: {
          phone: '',
          start_zmop: '',
          end_zmop: '',
          start_time: '',
          end_time: '',
          sim_time: []
        },
        SeniorModal: false,
        LimitState: true,
        Idtmte1: false,
        BaseCheck: [],
        CheckAll1: false,
        Idtmte2: false,
        UpCheck: [],
        CheckAll2: false,
        RenzTypeB: false,
        RenzTypeQ: false,
        SeniorData: {
          name: '',
          phone: '',
          idcard: '',
          type:'',
          status_bz: '',
          pay_status: '',
          sh_status: '',
          rz_status: '',
          start_zmop: '',
          end_zmop: '',
          start_time: '',
          end_time: '',
          qudao: ''
        },
        UserCol: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },{
            title: '用户ID',
            key: 'id'
          },{
            title: '用户手机号',
            key: 'phone'
          },{
            title: '用户姓名',
            key: 'name'
          },{
            title: '身份证号',
            width: '160',
            key: 'idcard'
          },{
            title: '芝麻分',
            align: 'center',
            key: 'zmop'
          },{
            title: '注册时间',
            key: 'create_at'
          },{
            title: '客户类型',
            align: 'center',
            key: 'type'
          },{
            title: '是否黑名单',
            align: 'center',
            key: 'black'
          },{
            title: '审核员',
            key: 'auditorId'
          },{
            title: '操作',
            key: 'operation',
            align: 'center',
            width: '150',
            render: (h, params)=>{
              return h('div',this.RenderBtn(h, params, this.BtnData));
            }
          }
        ],
        SelectData: [],
        Group: {
          SmsModal: false,
          AppmsgModal: false
        },
        UserData: [],     //表格数据
        RowUserData: [],  //获取的原始数据
        //初始分页
        Page: {
          count: 0,
          cur: 1,
          size: 20,
        },
        BtnData: [],      //按钮数据
        EditData: {},      //点击编辑后的数据
        EditId: 0,
        Audit:{
          modal: false,
          id: '',
          allId: ''
        }
      }
    },
    created(){
      this.auth_id = getLocal('auth_id');
      this.InitData();
    },
    watch:{
      RenzTypeB(val){
        if(val){
          this.RenzTypeQ = false;
        }
      },
      RenzTypeQ(val){
        if(val){
          this.RenzTypeB = false;
        }
      },
      CheckAll1(val){
        if(val){
          this.LimitState = false;
        }else{
          this.LimitState = true;
          this.Idtmte2 = false;
          this.CheckAll2 = false;
          this.UpCheck = [];
        }
      }
    },
    methods: {
      //循环渲染按钮
      RenderBtn(h,params,bdata){
        let res = [];
        bdata.forEach((val)=>{
          const btn = h('Button',{
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
          res.push(btn);
        });
        return res;
      },
      //选择时间
      PickDate(time){
        this.allTime = time;
        this.ScreenData.sim_time = time;
        this.SeniorData.start_time = time[0];
        this.SeniorData.end_time = time[1];
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
      SimpleSearch(){
        this.SeniorReset();
        let sinfo = this.RemoveObserve(this.ScreenData);
        if(this.allTime[0] !== ""){
          sinfo.start_time = this.allTime[0];
          sinfo.end_time = this.allTime[1];
        }else{
          sinfo.start_time = '';
          sinfo.end_time = '';
        }
        this.InitData(sinfo).then(()=>{
          for(let key in this.ScreenData){
            this.SeniorData[key] = this.ScreenData[key];
          }
        });
      },
      //初始化列表数据
      InitData(params = {}){
        const that = this;
        this.loading = true;
        //获取按钮信息
        this.$fetch('Menuauth/listAuthGet',{auth_id: this.auth_id}).then((d)=>{
          this.BtnData = d.data.operation;
        });
        //列表数据获取
        return new Promise((resolve, reject)=>{
          this.$post('User/getUserList',params).then((d)=>{
              if(d.status === 1){
                if(d.data.length === 0){
                  this.Page.count = 0;
                  this.UserData = [];
                }else{
                  let res = d.data.list;
                  this.Page.count = d.data.count;
                  this.RowUserData = res;
                  this.UserData = this.TransText(res,'black','否','是');
                }
                that.loading = false;
                resolve();
              }else{
                reject();
              }
          })
        });
      },
      /**
       * 转换数字状态成中文
       * @param data 初始数据（object）
       * @param key 转换的键值（string）
       * @param val1 1对应的字符（string）
       * @param val2 0对应的字符（string）
       * @returns data(object);
       */
      TransText(data,key,val1,val2){
        data.forEach((val)=>{
          val[key] = (val[key] === 0)?val1:val2;
        });
        return data;
      },
      /**
       * 转换中文状态成数字
       * @param data 初始数据（object）
       * @param key 转换的键值（string）
       * @param val1 1对应的字符（string）
       */
      TransNum(data,key,val1){
        if(data[key] === '') return data;
        data[key] = (data[key] === val1)?1:0;
      },
      //刷新列表
      RefreshList(){
        this.InitData().then(()=>{
          this.$Message.success('刷新成功');
        });
      },
      //提交信息操作
      UploadData(url,info){
        this.$post(url,info).then((d)=>{
          if(d.status === 1){
            this.$Message.success(d.message);
            this.InitData();
          }else{
            this.$Message.error(d.message);
          }
        }).catch((err)=>{
          this.$Message.error('服务器繁忙，请稍后再试！');
        })
      },
      //添加部门
      SeniorShow(){
        this.SeniorModal = true;
      },
      //高级筛选重置
      SeniorReset(){
        this.BaseCheck = [];
        this.UpCheck = [];
        this.allTime = [];
        this.RenzTypeB = false;
        this.RenzTypeQ = false;
        this.LimitState = true;
        this.CheckAll1 = false;
        this.CheckAll2 = false;
        this.Idtmte1 = false;
        this.Idtmte2 = false;
        for(let key in this.SeniorData){
            this.SeniorData[key] = '';
        }
      },
      //高级筛选提交
      SeniorSearch(){
        if(!this.RenzTypeB && !this.RenzTypeQ && this.SeniorData.status_bz === 'CERT'){
            this.$Message.error('请选择认证状态类型（并，且）');
        }else{
          if(this.RenzTypeB){
              this.SeniorData.rz_tag = 'and';
          }else{
              this.SeniorData.rz_tag = 'or';
          }
          this.SeniorData.rz_status = [...this.BaseCheck,...this.UpCheck].join(',');
          this.InitData(this.SeniorData).then(()=>{
              for(let key in this.ScreenData){
                  this.ScreenData[key] = this.SeniorData[key];
              }
              this.SeniorModal = false;
          });
        }

        //this.InitData(this.SeniorData);
      },
      //全选功能
      CheckAll(num){
        if(num === 2 && this.LimitState) return;
        if (this[`Idtmte${num}`]) {
          this[`CheckAll${num}`] = false;
        } else {
          this[`CheckAll${num}`] = !this[`CheckAll${num}`];
        }
        this[`Idtmte${num}`] = false;

        if (this[`CheckAll${num}`]) {
          if(num === 1){
            this.BaseCheck = ['RG','ID','CB','MB','BI','ZM'];
          }else{
            this.UpCheck = ['TB','WX'];
          }
        } else {
          if(num === 1){
            this.BaseCheck = [];
          }else{
            this.UpCheck = [];
          }
        }
      },
      //多选框功能
      BaseCheckChange(data){
        if(data.length === 6){
          this.Idtmte1 = false;
          this.CheckAll1 = true;
        }else if(data.length > 0){
          this.Idtmte1 = true;
          this.CheckAll1 = false;
        }else{
          this.Idtmte1 = false;
          this.CheckAll1 = false;
        }
      },
      UpCheckChange(data){
        if(data.length === 2){
          this.Idtmte2 = false;
          this.CheckAll2 = true;
        }else if(data.length > 0){
          this.Idtmte2 = true;
          this.CheckAll2 = false;
        }else{
          this.Idtmte2 = false;
          this.CheckAll2 = false;
        }
      },
      //编辑操作
      EditOpt(row){
        this.EditId = row.id;
        this.$fetch('User/editUser',{uid: row.id}).then((d)=>{
          this.EditData = d.data;
          this.isEdit = true;
        }).catch(()=>{
          this.$Message.error('服务器繁忙，请稍后再试！');
        });
      },
      //从编辑返回
      ListShow(){
        this.InitData().then(()=>{
          this.isEdit = false;
        });
      },
      //审核面板
      DetailsOpt(row){
        this.Audit.modal = true;
        this.Audit.id = row.id;
        let idArr = [];
        this.RowUserData.forEach(val=>{
          idArr.push(val.id);
        });
        this.Audit.allId = idArr;
      },
      AuditCancel(){
        this.Audit.modal = false;
      },
      //删除用户
      Delopt(row){
        //删除确认
        this.$Modal.confirm({
          title: '温馨提示',
          content: '<p class="confirm-text">确认删除此用户吗？</p>',
          onOk: ()=>{
            this.UploadData('Auth/deparDel',{id: row.id});
          }
        })
      },
      //App推送
      GroupAppOpt(){
        this.Group.AppmsgModal = true;
      },
      CloseApp(){
        this.Group.AppmsgModal = false;
      },
      AppOpt(info){
        let sinfo = this.RemoveObserve(info);
        sinfo.regid = (sinfo.type.length > 0)?sinfo.regid.join(','):'';
        console.log(sinfo);
        this.UploadData('Push/pushs',sinfo).then(()=>{
          this.Group.AppmsgModal = false;
        });
      },
      //导出数据
      ExportData(){
        let sinfo = this.RemoveObserve(this.SeniorData);
        sinfo.expro = 1;
        this.$post('User/getUserList',sinfo).then((d)=>{
          window.location.href = d.data;
        });
      },
      //改变页数
      ChangePage(curpage){
        let sinfo = Object.assign(this.SeniorData,{
          page: curpage,
          num: this.Page.size
        });
        this.InitData(sinfo).then(()=>{
          this.Page.cur = curpage;
        })
      },
      //改变显示条数
      ChangeSize(size){
        let sinfo = Object.assign(this.SeniorData,{
            page: 1,
            num: size
        });
        this.InitData(sinfo).then(()=>{
          this.Page.cur = 1;
          this.Page.size = size;
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
  .senior-subtit{
    padding-bottom: 15px;
  }
  .chose-area{
    display: inline-block;
    width: 262px;
    margin-bottom: 24px;
    &.long{
      width: 100%;
      display: flex;
      flex-direction: row;
      .rz-state{
        padding-top: 110px;
      }
      .option{
        width: 450px;
        display: flex;
        flex-direction: row;
        .opt-box{
          width: 30%;
          display: flex;
          flex-direction: column;
          .check-all1{
            padding-top: 60px;
          }
          .check-all2{
            padding-top: 75px;
          }
          .base{
            padding-bottom: 15px;
          }
          .rdo-box{
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
          }
        }
      }
    }
  }
  .auto-height{
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 530px;
  }

</style>
