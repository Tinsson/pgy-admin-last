<template>
  <div id="consumer">
    <div id="listRole">
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
              <Button type="primary" icon="upload" @click="OpenImport">批量导入</Button>
              <!--<Button type="ghost" icon="reply" @click="ResetScreen">重置筛选</Button>
              <Button type="success" icon="search" @click="SimpleSearch">查询结果</Button>-->
              <Button type="warning" icon="clipboard" @click="SeniorShow">高级检索</Button>
            </div>
          </div>
          <div class="opt-box">
            <div class="form-group">
              <label class="form-label">检索：</label>
              <Input v-model="ScreenData.key" style="width: 200px" @on-enter="SimpleSearch"></Input>
            </div>
            <Tag v-for="item in ScreenTag"
                 style="margin-top: 0"
                 :key="item.key"
                 :name="item.key"
                 type="dot"
                 closable
                 color="blue"
                 @on-close="TagCancel">{{item.name}}</Tag>
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
              <Button type="info" size="large" icon="chatbox" @click="GroupAppOpt">群发消息</Button>
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
             class="all-modal"
             :width="600"
             @on-ok="SeniorSearch">
        <h2 slot="header">高级筛选</h2>
        <Form class="ipt-form" :model="SeniorData" label-position="right" :label-width="120">
          <FormItem label="用户类型：">
            <Select v-model="SeniorData.type" placeholder="请选择用户类型" style="width:162px">
              <Option value="A">A</Option>
              <Option value="B">B</Option>
              <Option value="C">C</Option>
              <Option value="D">D</Option>
            </Select>
          </FormItem>
          <FormItem label="审核状态：">
            <Select v-model="SeniorData.sh_status" placeholder="请选择审核状态" style="width:162px">
              <Option :value="2">已通过</Option>
              <Option :value="3">未通过</Option>
            </Select>
          </FormItem>
          <CheckboxGroup v-model="CheckboxStatus"  @on-change="getCheckStatus" class="rdo-group" >
            <div class="chose-area">
              <Checkbox label="LOAN">交易状态：</Checkbox>
              <Select v-model="SeniorData.pay_status" placeholder="请选择交易状态" style="width:162px">
                <Option v-for="(item, index) in PayArr" :key="item" :value="index + 1">{{item}}</Option>
              </Select>
            </div>
          </CheckboxGroup>
          <FormItem label="来源渠道：">
            <Select v-model="SeniorData.qudao" placeholder="请选择来源渠道" style="width:162px">
              <Option v-for="item in channel" :key="item.id" :value="item.id">{{item.title}}</Option>
            </Select>
          </FormItem>
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
                        style="width: 275px"
                        placement="top"></DatePicker>
          </FormItem>
        </Form>
        <p slot="footer">
          <Button type="ghost" @click="SeniorReset">重置</Button>
          <Button type="info" @click="SeniorSearch">提交筛选</Button>
        </p>
      </Modal>
      <ImportModal :modalShow="ImportState.show"
                   :InitData="ImportState.tempUrl"
                   @ImportSuccess="ImportOver"
                   @CloseModal="CloseImport"></ImportModal>
      <PushApp :modalShow="Group.AppmsgModal"
               :InitData="SelectData"
               :Condition="SeniorData"
               :Count="Page.count"
               @CloseModal="CloseApp"
               @UpOver="AppOpt"></PushApp>
      <AuditModal :modalShow="Audit.modal"
                  :InitId="Audit.id"
                  :BtnId="Audit.btn"
                  :UniqueId="Audit.id"
                  :AllId="Audit.allId"
                  @CloseModal="AuditCancel"></AuditModal>
    </div>
  </div>
</template>

<script>
  import { getLocal } from '@/util/util'
  import Clipboard from 'clipboard'
  import PushApp from '@/components/groupModal/PushApp'
  import AuditModal from '@/components/infoModal/AuditModal'
  import ImportModal from '@/components/infoModal/ImportModal'

  export default {
    name: 'consumerList',
    components: {
      PushApp,
      AuditModal,
      ImportModal
    },
    data () {
      return {
        title: '用户列表',
        auth_id: '',
        loading: true,
        channel: [],
        allTime: [],
        //基础筛选数据
        ScreenData: {
          key: ''
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
        CheckboxStatus: [],
        PayArr: ['未借款','借款已还','正常借款中','逾期未还','展期中','展期逾期未还'],
        SeniorData: {
          type:'',
          status_bz: '',
          pay_status: '',
          sh_status: '',
          start_zmop: '',
          end_zmop: '',
          start_time: '',
          end_time: '',
          qudao: ''
        },
        ScreenTag: [],
        ImportState:{
          show: false,
          tempUrl: ''
        },
        UserCol: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },{
            title: '用户ID',
            width: '80',
            key: 'id'
          },{
            title: '姓名',
            key: 'name',
            render: (h, params)=>{
              return h('div',{
                'class': {
                  clipBtn : true
                },
                style:{
                  cursor: 'pointer',
                  color: '#0f76c7'
                },
                attrs:{
                  src: params.row.name
                }
              }, params.row.name);
            }
          },{
            title: '手机号',
            key: 'phone',
            render: (h, params)=>{
              return h('div',{
                'class': {
                  clipBtn : true
                },
                style:{
                  cursor: 'pointer',
                  color: '#0f76c7'
                },
                attrs:{
                  src: params.row.phone
                }
              }, params.row.phone);
            }
          },{
            title: '身份证号',
            width: '160',
            key: 'idcard'
          },{
            title: '芝麻分',
            align: 'center',
            key: 'zmop'
          },{
            title: '客户类型',
            align: 'center',
            key: 'type'
          },{
            title: '来源渠道',
            align: 'center',
            key: 'qudao'
          },{
            title: '注册时间',
            width: '150',
            key: 'create_at'
          },{
            title: '操作',
            key: 'operation',
            align: 'center',
            width: '150',
            render: (h, params)=>{
              return h('div',this.$renderBtn(h, params, this.BtnData));
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
        Audit:{
          modal: false,
          id: '',
          allId: [],
          btn: ''
        }
      }
    },
    created(){
      this.auth_id = getLocal('auth_id');
      this.InitData();
    },
    mounted(){
      //剪切板功能
      this.ClipBoard = new Clipboard('.clipBtn',{
        text: function(elm){
          return elm.getAttribute('src');
        }
      });
      this.ClipBoard.on('success',(e)=>{
        this.$Message.success('复制成功！');
      })
      this.getChannel();
    },
    destroyed() {
      this.ClipBoard.destroy();
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
      //批量导入
      ImportData(file){
        console.log(file);
        return false;
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
      getChannel(){
        this.$fetch('/backend/User/getproqd').then(d=>{
          console.log(d);
          if(d.status === 1){
            this.channel = d.data.data;
          }
        })
      },
      //初始化列表数据
      InitData(params = {}){
        const that = this;
        this.loading = true;
        //获取按钮信息
        this.$fetch('/backend/Menuauth/listAuthGet',{auth_id: this.auth_id}).then((d)=>{
          this.BtnData = d.data.operation;
          this.BtnData.forEach(val=>{
            if(val.class === "AuditPanel"){
              this.Audit.btn = val.id;
            }
          })
        });
        //列表数据获取
        return new Promise((resolve, reject)=>{
          this.$post('/backend/User/getUserList',params).then((d)=>{
              if(d.status === 1){
                if(d.data.length === 0){
                  this.Page.count = 0;
                  this.UserData = [];
                }else{
                  let res = d.data.list;
                  this.Page.count = d.data.count;
                  this.RowUserData = res;
                  this.UserData = res;
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
        this.ResetPageNum();
        this.ScreenData.key = '';
        this.SeniorData.key = '';
        this.InitData().then(()=>{
          this.$Message.success('刷新成功');
        });
      },
      //提交信息操作
      UploadData(url,info){
        return new Promise((resolve,reject)=>{
          this.$post(url,info).then((d)=>{
            if(d.status === 1){
              this.$Message.success(d.message);
              resolve(d);
              this.InitData();
            }else{
              this.$Message.error(d.message);
            }
          }).catch((err)=>{
            this.$Message.error('服务器繁忙，请稍后再试！');
          })
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
      getCheckStatus(arr){
        //console.log(status);
        this.SeniorData.status_bz = arr[0];
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
          this.ScreenTag = [];
          this.AddTagTips();
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
      //添加提示标签
      AddTagTips(){
        const senior = this.SeniorData;
        if(senior.type !== ""){
          this.ScreenTag.push({key: 'type',name: `${senior.type}类客户`});
        }
        if(senior.sh_status !== ""){
          if(senior.sh_status === 2){
            this.ScreenTag.push({key: 'sh_status',name: '已通过'});
          }else if(senior.sh_status === 3){
            console.log(11111);
            this.ScreenTag.push({key: 'sh_status',name: '未通过'});
          }
        }
        if(senior.status_bz === 'LOAN' && senior.pay_status !== ""){
          this.ScreenTag.push({key: 'pay_status', name: this.PayArr[senior.pay_status - 1]});
        }
        if(senior.qudao !== ""){
          this.channel.forEach(val=>{
            if(senior.qudao === val.id){
              this.ScreenTag.push({key: 'qudao', name: val.title});
            }
          })
        }
        if(senior.start_zmop !== "" && senior.end_zmop === ""){
          this.ScreenTag.push({key: 'zmop', name: `${senior.start_zmop}分以上`});
        }
        if(senior.start_zmop === "" && senior.end_zmop !== ""){
          this.ScreenTag.push({key: 'zmop', name: `${senior.end_zmop}分以下`});
        }
        if(senior.start_zmop !== "" && senior.end_zmop !== ""){
          this.ScreenTag.push({key: 'zmop', name: `${senior.start_zmop}分~${senior.end_zmop}分`});
        }

        if(senior.start_time !== "" && senior.end_time === ""){
          let start = senior.start_time.split(" ")[0];
          this.ScreenTag.push({key: 'time', name: `${start}以后`});
        }
        if(senior.start_time === "" && senior.end_time !== ""){
          let end = senior.end_time.split(" ")[0];
          this.ScreenTag.push({key: 'time', name: `${end}之前`});
        }
        if(senior.start_time !== "" && senior.end_time !== ""){
          let start = senior.start_time.split(" ")[0];
          let end = senior.end_time.split(" ")[0];
          this.ScreenTag.push({key: 'time', name: `${start}~${end}`});
        }
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
      //导入数据
      OpenImport(){
        this.ImportState.show = true;
      },
      CloseImport(){
        this.ImportState.show = false;
      },
      ImportOver(){
        this.ImportState.show = false;
        this.InitData();
      },
      //审核面板
      AuditPanel(row){
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
        let params = {
          ispush: info.data.type,
          arr: info.data.regid.join(','),
          modid: info.data.tmplid
        };
        if(info.data.type === 1){
          params = Object.assign(params, info.condition);
        }
        this.UploadData('/backend/User/getUserList', params).then((res)=>{
          this.Group.AppmsgModal = false;
        });
      },
      //导出数据
      ExportData(){
        let sinfo = this.RemoveObserve(this.SeniorData);
        sinfo.expro = 1;
        this.$post('/backend/User/getUserList',sinfo).then((d)=>{
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
      },
      ResetPageNum(){
        this.Page.cur = 1;
        this.Page.size = 20;
        this.ScreenData.page = 1;
        this.ScreenData.num = 20;
      },
      TagCancel(event, name){
        //console.log(name);
        if(name === "zmop"){
          this.SeniorData.start_zmop = "";
          this.SeniorData.end_zmop = "";
        }else if(name === "time"){
          this.allTime = [];
          this.SeniorData.start_time = "";
          this.SeniorData.end_time = "";
        }else{
          this.SeniorData[name] = "";
        }
        let index = -1;
        this.ScreenTag.forEach((val,ind)=>{
          if(val.key === name){
            index = ind
          }
        });
        this.ScreenTag.splice(index, 1);
        this.SeniorSearch();
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
  .ipt-form{
    padding-top: 20px;
  }
  .card-tit{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .senior-subtit{
    padding-bottom: 15px;
  }
  .rdo-group{
    display: block;
    padding-left: 31px;
  }
  .chose-area{
    display: block;
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
          flex-wrap: wrap;
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
  .upload-btn{
    display: inline-block;
  }

</style>
