<template>
  <div id="urge-list">
    <h1 class="list-title">
      <span class="tit-text">{{ title }}</span>
      <Button class="tit-btn"
              type="info"
              icon="ios-reload"
              size="large"
              @click="RefreshList">刷新列表</Button>
    </h1>
    <div class="card-box">
      <div v-for="item in CountData" class="sim-card" :class="{cur:item.cur}" @click="CountList(item.type)">
        <Icon class="icon" :type="item.icon"></Icon>
        <p class="title">{{ item.name }}</p>
        <p class="value"><span class="num">{{item.count}}</span>人</p>
        <span class="tips">点击查看</span>
      </div>
    </div>
    <div class="screen-area">
      <Card>
        <div class="card-tit" slot="title">
          <h3>
            <Icon type="ios-pricetags-outline"></Icon>
            筛选查询
          </h3>
          <!--<div class="btn-box">
            <Button type="ghost" icon="reply" @click="ResetScreen">重置筛选</Button>
            <Button type="success" icon="search" @click="SimpleSearch">查询结果</Button>
          </div>-->
        </div>
        <div class="opt-box">
          <div class="form-group">
            <label class="form-label">检索：</label>
            <Input v-model="ScreenData.key" style="width: 200px" @on-enter="SimpleSearch"></Input>
          </div>
          <Form :model="ScreenData" inline :label-width="85">
            <FormItem label="还款日：">
              <DatePicker type="daterange"
                          placeholder="选择日期"
                          format="yyyy-MM-dd"
                          placement="bottom-end"
                          :value="allTime"
                          @on-change="PickDate"
                          style="width: 200px"></DatePicker>
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
            数据列表 <span class="count-num">总数：{{Page.count}}</span>
          </h3>
          <div class="btn-box">
            <Button type="info" size="large" icon="chatbox" @click="GroupAppOpt">群发消息</Button>
            <Button type="warning" size="large" icon="archive" @click="OpenReport">导出催收报告</Button>
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
                :page-size-opts="[60,80,100,150]"
                placement="top"
                @on-change="ChangePage"
                @on-page-size-change="ChangeSize" show-sizer></Page>
        </div>
      </Card>
    </div>
    <Modal
      v-model="Remark.modal"
      @on-cancel="RemarkCancel"
      class="all-modal remark-modal"
      @on-ok="SubRemark">
      <h2 slot="header">备注信息</h2>
      <div class="remark-box">
        <Input v-model="Remark.remark" ref="OutRemark" autofocus type="textarea" :rows="4" @on-enter="SubRemark" placeholder="请输入备注信息"></Input>
      </div>
      <div slot="footer">
      </div>
    </Modal>
    <Modal v-model="Report.modal"
           @on-ok="ExportReport">
      <h2 slot="header">确认报告类型</h2>
      <Form :model="Report" :label-width="120">
        <FormItem label="报告类型：">
          <Select v-model="Report.type" style="width: 200px">
            <Option :value="1">借贷宝（txt）</Option>
            <Option :value="2">外包催收（excel）</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
    <GroupSms :modalShow="Group.SmsModal"
              :InitData="SelectData"
              :Count="Page.count"
              @CloseModal="CloseSms"
              @UpOver="SmsOpt"></GroupSms>
    <PushApp :modalShow="Group.AppmsgModal"
             :InitData="SelectData"
             :Count="Page.count"
             @CloseModal="CloseApp"
             @UpOver="AppOpt"></PushApp>
    <AuditModal :modalShow="Audit.modal"
                :InitId="Audit.id"
                :BtnId="Audit.btn"
                :UniqueId="Audit.unique"
                :AllId="Audit.allId"
                @CloseModal="AuditCancel"></AuditModal>
    <DelayModal :modalShow="Delay.modal"
                :initData="Delay.data"
                @CloseModal="DelayCancel"
                @SubModal="DelaySub"></DelayModal>
    <RepayModal :modalShow="Repay.modal"
                :initData="Repay.data"
                @CloseModal="RepayCancel"
                @SubModal="RepaySub"></RepayModal>
  </div>
</template>

<script>
  import { getLocal } from '@/util/util'
  import Clipboard from 'clipboard'
  import GroupSms from '@/components/groupModal/GroupSms'
  import PushApp from '@/components/groupModal/PushApp'
  import AuditModal from '@/components/infoModal/AuditModal'
  import DelayModal from '@/components/infoModal/DelayModal'
  import RepayModal from '@/components/infoModal/RepayModal'

  export default {
    name: 'UrgeList',
    components:{
      GroupSms,
      PushApp,
      AuditModal,
      DelayModal,
      RepayModal
    },
    data () {
      return {
        title: '催收列表',
        apiUrl: '/backend/Collection/collectionListInfo',
        auth_id: '',
        loading: true,
        Remark: {
          modal: false,
          loan_id: 58304,
          remark: ''
        },
        allTime: [],
        //统计数据
        CountData: [{
          name: '今日还款',
          icon: 'calendar',
          count: 0,
          type: 4,
          cur: true
        },{
          name: '宽限日列表',
          icon: 'ios-search-strong',
          count: 0,
          type: 3,
          cur: false
        },{
          name: '明天还款',
          icon: 'android-calendar',
          count: 0,
          type: 2,
          cur: false
        },{
          name: '逾期列表',
          icon: 'android-time',
          count: 0,
          type: 1,
          cur: false
        }],
        //基础筛选数据
        ScreenData: {
          key: '',
          expro: 0,
          start_time: '',
          end_time: '',
          check: 4
        },
        UserCol: [
          {
            type: 'selection',
            width: 55,
            align: 'center'
          },{
            title: '姓名',
            align: 'center',
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
            align: 'center',
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
            title: '客户类型',
            align: 'center',
            key: 'type'
          },{
            title: '金额',
            key: 'amount'
          },{
            title: '应还金额',
            align: 'center',
            key: 'yh_amount'
          },{
            title: '黑名单',
            align: 'center',
            key: 'black'
          },{
            title: '逾期天数',
            align: 'center',
            key: 'overdue_day'
          },{
            title: '还款日期',
            width: '100',
            key: 'hk_date'
          },{
            title: '备注',
            width: '200',
            align: 'center',
            key: 'remark',
            render: (h,params)=>{
              return this.RenderRemark(h, params);
            }
          },{
            title: '操作',
            key: 'operation',
            width: '150',
            align: 'center',
            render: (h, params)=>{
              let rule = {};
              rule.btns = [{
                class: 'MarkOpt',
                name: 'marking',
                type: 'default',
                right: 1,
                wbtn: '取消标记'
              }];
              rule.size = 1;
              return h('div',this.$renderBtn(h, params, this.BtnData, rule));
            }
          }
        ],
        UserData: [],     //表格数据
        BtnData: [],
        RowUserData: [],  //获取的原始数据
        //群选打钩后操作
        SelectData: [],
        //导出报告
        Report: {
          modal: false,
          type: 1
        },
        Group: {
          SmsModal: false,
          AppmsgModal: false
        },
        //初始分页信息
        Page: {
          count: 0,
          cur: 1,
          size: 100,
        },
        //审核面板
        Audit:{
          modal: false,
          id: '',
          unique: '',
          allId: '',
          btn: ''
        },
        //展期操作
        Delay:{
          modal: false,
          data: {
            id: '',
            name: '',
            amount: ''
          }
        },
        //主动还款操作
        Repay:{
          modal: false,
          data:{
            id: '',
            name: '',
            amount: ''
          }
        }
      }
    },
    created(){
      this.auth_id = getLocal('auth_id');
      this.InitData('/backend/Collection/CollectionList',{
        page: this.Page.cur,
        num: this.Page.size,
        check: 4,
      },1);
    },
    mounted(){
      //剪切板功能
      this.ClipBoard = new Clipboard('.clipBtn',{
        text: function(elm){
          return elm.getAttribute('src');
        }
      });
      this.ClipBoard.on('success',(e)=>{
        e.trigger.style.color = '#F00';
        this.$Message.success('复制成功！');
      });
    },
    destroyed() {
      this.ClipBoard.destroy();
    },
    methods: {
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
      //选择时间
      PickDate(time){
          this.allTime = time;
          this.SimpleSearch(1);
      },
      //统计列表
      CountList(num){
        this.ResetPageNum();
        this.ScreenData.key = '';
        this.allTime = [];
        this.ScreenData.start_time = '';
        this.ScreenData.end_time = '';
        let sinfo = this.RemoveObserve(this.ScreenData);
        this.CountData.forEach(val=>{
            if(val.type === num){
                val.cur = true;
            }else{
                val.cur = false;
            }
        });
        this.ScreenData.check = num;
        sinfo.check = num;
        this.InitData(this.apiUrl,sinfo);
      },
      //查询结果
      SimpleSearch(sign = 1){
        this.ResetPageNum();
        if(this.allTime[0] !== ""){
          this.ScreenData.start_time = this.allTime[0];
          this.ScreenData.end_time = this.allTime[1];
        }else{
          this.ScreenData.start_time = '';
          this.ScreenData.end_time = '';
        }
        if(sign){
          this.CountData.forEach(val=>{
            val.cur = false;
          });
          this.ScreenData.check = '';
          if(this.ScreenData.key === '' && (this.ScreenData.start_time === '' || !'start_time' in this.ScreenData) && (this.ScreenData.end_time === '' || !'end_time' in this.ScreenData)){
            this.ScreenData.check = 0;
            this.CountData.forEach(val=>{
              if(val.type === 4){
                val.cur = true;
              }
            });
          }
        }
        return new Promise((resolve)=>{
          this.InitData(this.apiUrl,this.ScreenData).then(()=>{
            if(sign){
              this.$Message.success('筛选成功！')
              this.SelectData = [];
            }
            resolve();
          });
        });
      },
      //初始化数据
      InitData(url,params = {},isinit = 0){
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
        return new Promise((resolve)=>{
          this.$fetch(url,params).then((d)=>{
            let res = d.data.list;
            if(isinit){
              this.CountData[0].count = d.data.today_count;
              this.CountData[1].count = d.data.alreadyhk_count;
              this.CountData[2].count = d.data.tomorrow_count;
              this.CountData[3].count = d.data.yuqi_count;
            }
            this.Page.count = d.data.count;
            this.UserData = res;
            this.loading = false;
            resolve();
          })
        })
      },
      /**
       * 转换空字符串
       */
      TransText(data,key,val1){
        data.forEach((val)=>{
          val[key] = (val[key] === '')?val1:val[key];
        });
        return data;
      },
      //刷新列表
      RefreshList(){
        this.ResetPageNum();
        if(this.ScreenData.check === ''){
          this.ScreenData.check = 0;
          this.CountData[0].cur = true;
        }
        this.ScreenData.key = '';
        this.ScreenData.start_time = '';
        this.ScreenData.end_time = '';
        this.SimpleSearch(0);
      },
      //审核面板
      AuditPanel(row){
        this.Audit.modal = true;
        this.Audit.id = row.id;
        this.Audit.unique = row.loan_id;
        let idArr = [];
        this.UserData.forEach(val=>{
          idArr.push(val.loan_id);
        });
        this.Audit.allId = idArr;
      },
      AuditCancel(){
        this.Audit.modal = false;
      },
      //标记记录
      TagClassName(row){
        if(row.marking){
            return 'table-tag-row';
        }else{
            return '';
        }
      },
      //备注按钮
      RemarkOpt(row){
        this.Remark.loan_id = row.loan_id;
        this.Remark.remark = row.remark;
        this.Remark.modal = true;
        this.$nextTick(()=>{
          this.$refs['OutRemark'].focus();
        })
      },
      //提交备注
      SubRemark(){
        /*if(event.keyCode === 13){
          const data = {
            loan_id: this.Remark.loan_id,
            remark: this.Remark.remark
          }
          this.UploadData('/backend/Collection/remark',data).then(()=>{
            this.UserData.forEach(val=>{
              val.remark_state = false;
              if(val.loan_id === this.Remark.loan_id){
                val.remark = this.Remark.remark;
              }
            });
          });
        }*/
        this.UploadData('/backend/Collection/remark',this.Remark).then(()=>{
          this.UserData.forEach(val=>{
            if(val.loan_id === this.Remark.loan_id){
              val.remark = this.Remark.remark;
            }
          })
          this.Remark.modal = false;
        })
      },
      RemarkCancel(){
        this.Remark.modal = false;
      },
      //展期功能
      DelayOpt(row){
        this.Delay.modal = true;
        this.Delay.data = row;
      },
      DelayCancel(){
        this.Delay.modal = false;
      },
      DelaySub(data){
        this.UploadData('/backend/Loan/payDelayRequest',data).then(()=>{
          this.Delay.modal = false;
          this.InitData(this.apiUrl, this.GetCurrentScreen());
        })
      },
      //主动还款
      RepayOpt(row){
        const data = {
          uid: row.uid,
          amount: row.amount,
          wy_amount: '',
          name: row.name
        };
        this.Repay.modal = true;
        this.Repay.data = data;
      },
      RepayCancel(){
        this.Repay.modal = false;
      },
      RepaySub(data){
        this.UploadData('/backend/Loan/payMentDone',data).then(()=>{
          this.Repay.modal = false;
          this.SimpleSearch(0);
        });
      },
      //标记功能
      MarkOpt(row){
        this.UploadData('/backend/Collection/marking',{loan_id: row.loan_id}).then(()=>{
          this.SimpleSearch(0);
        })
      },
      //提交信息操作
      UploadData(url,info){
        return new Promise((resolve)=>{
          this.$post(url,info).then((d)=>{
            if(d.status === 1){
              this.$Message.success(d.message);
              resolve(d.data);
              //this.InitData();
            }else{
              this.$Message.error(d.message);
            }
          }).catch((err)=>{
            this.$Message.error('服务器繁忙，请稍后再试！');
          })
        })
      },
      //群发消息
      GroupSmsOpt(){
        this.Group.SmsModal = true;
      },
      CloseSms(){
        this.Group.SmsModal = false;
      },
      SmsOpt(info){
        this.Group.SmsModal = false;
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
          ispush: info.type,
          arr: info.regid.join(','),
          modid: info.tmplid
        };
        this.UploadData('/backend/Collection/collectionListInfo', params).then(()=>{
          this.Group.AppmsgModal = false;
        });
        /*this.UploadData('/backend/Push/pushs',sinfo).then(()=>{
          this.Group.AppmsgModal = false;
        });*/
        //this.Group.AppmsgModal = false;
      },
      OpenReport(){
        if(this.SelectData.length > 0){
          this.Report.modal = true;
        }else{
          this.$Message.error('请先勾选要导出数据的用户！');
        }
      },
      //导出报告
      ExportReport(){
        const idAll = this.SelectData.join(',');
        const url = this.Report.type === 1?'/backend/data-collection/jdb-handle':'/backend/data-collection/wb-handle';
        this.$post(url,{id: idAll}).then(d=>{
          if(d.status === 1){
            window.location.href = d.data.download_url;
          }
        })
      },
      //导出数据
      ExportData(){
        let sinfo = this.RemoveObserve(this.ScreenData);
        sinfo.expro = 1;
        this.UploadData('/backend/Collection/CollectionList',sinfo).then((url)=>{
            window.location.href = url;
        });
      },
      //获取当页筛选条件
      GetCurrentScreen(){
        return Object.assign(this.ScreenData,{
          page: this.page.cur,
          num: this.Page.size
        });
      },
      //改变页数
      ChangePage(curpage){
        let sinfo = Object.assign(this.ScreenData,{
          page: curpage,
          num: this.Page.size
        });
        this.InitData(this.apiUrl,sinfo).then(()=>{
          this.Page.cur = curpage;
        })
      },
      //改变显示条数
      ChangeSize(size){
        let sinfo = Object.assign(this.ScreenData,{
          page: 1,
          num: size
        });
        this.InitData(this.apiUrl,sinfo).then(()=>{
          this.Page.cur = 1;
          this.Page.size = size;
        })
      },
      //重置页码
      ResetPageNum(){
        this.Page.cur = 1;
        this.Page.size = 100;
        this.ScreenData.page = 1;
        this.ScreenData.num = 100;
      },
      //渲染备注功能
      SetRemarkState(arr){
        arr.forEach(val=>{
          val.remark_state = false;
        });
        return arr;
      },
      SetRemark(event){
        this.Remark.remark = event.target.value;
      },
      ShowRemark(id){
        console.log(id);
      },
      RenderRemark(h,params){
        return h('div',{
          style:{
            width: '164px',
            'min-height': '30px'
          },
          on: {
            click: ()=>{
              this.RemarkOpt(params.row);
            }
          }
        },params.row.remark);
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
  .count-num{
    font-size: 14px;
    font-weight: normal;
    padding-left: 15px;
    color: #ff6614
  }
  .card-box{
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-bottom: 20px;
    .sim-card{
      position: relative;
      width: 24%;
      padding: 15px;
      color: #FFF;
      overflow: hidden;
      cursor: pointer;
      border-radius: 5px;
      background-color: #c3c3c3;
      .title{
        font-size: 16px;
      }
      .value{
        padding: 5px 0;
        font-size: 18px;
        .num{
          font-size: 40px;
        }
      }
      .tips{
        position: absolute;
        transition: all 0.1s linear;
        bottom: -20px;
        right: 20px;
        font-size: 14px;
      }
      &:hover{
        .tips{
          bottom: 10px;
        }
      }
      .icon{
        position: absolute;
        right: 20px;
        top: 20px;
        font-size: 60px;
      }
      &.cur{
        background-color: #2db7f5;
        &:hover{
          .tips{
            bottom: -20px;
          }
        }
      }
    }
  }
</style>
