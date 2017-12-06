<template>
  <div id="bad-debt-list">
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
            <FormItem label="用户名：">
              <Input v-model="ScreenData.name" style="width: 120px"></Input>
            </FormItem>
            <FormItem label="用户手机号：">
              <Input v-model="ScreenData.phone" style="width: 120px"></Input>
            </FormItem>
            <FormItem label="还款日：">
              <DatePicker type="datetimerange"
                          placeholder="选择日期和时间"
                          format="yyyy-MM-dd HH:mm:ss"
                          placement="bottom-end"
                          :value="allTime"
                          @on-change="PickDate"
                          style="width: 280px"></DatePicker>
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
            <!--<Button type="warning" size="large" icon="chatbubble" @click="GroupSmsOpt">群发短信</Button>-->
            <Button type="info" size="large" icon="chatbox" @click="GroupAppOpt">群发APP消息</Button>
            <Button type="primary" size="large" icon="archive" @click="ExportData">导出数据</Button>
          </div>
        </div>
        <Table :columns="UserCol"
               :data="UserData"
               :row-class-name="TagClassName"
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
    <Modal
      v-model="Remark.modal"
      @on-ok="SubRemark">
      <h2 slot="header">备注信息</h2>
      <Input v-model="Remark.remark" type="textarea" :rows="4" placeholder="请输入备注信息"></Input>
    </Modal>
    <GroupSms title="群发短信"
              :modalShow="Group.SmsModal"
              :InitData="SelectData"
              @CloseModal="CloseSms"
              @UpOver="SmsOpt"></GroupSms>
    <PushApp :modalShow="Group.AppmsgModal"
             :InitData="SelectData"
             :Count="Page.count"
             @CloseModal="CloseApp"
             @UpOver="AppOpt"></PushApp>
  </div>
</template>

<script>
  import { getLocal } from '@/util/util'
  import GroupSms from '@/components/groupModal/GroupSms'
  import PushApp from '@/components/groupModal/PushApp'

  export default {
    name: 'badDebtList',
    components:{
      GroupSms,
      PushApp
    },
    data () {
      return {
        title: '坏账列表',
        auth_id: '',
        loading: true,
        Remark: {
          modal: false,
          loan_id: '',
          remark: ''
        },
        allTime: [],
        //基础筛选数据
        ScreenData: {
          name: '',
          phone: '',
          start_time: '',
          end_time: ''
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
            title: '用户姓名',
            width: '100',
            align: 'center',
            key: 'name'
          },{
            title: '用户手机号',
            width: '150',
            align: 'center',
            key: 'phone'
          },{
            title: '金额',
            key: 'amount'
          },{
            title: '逾期天数',
            key: 'overdue_day'
          },{
            title: '备注',
            key: 'remark'
          },{
            title: '类型',
            key: 'type'
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
        //群选打钩后操作
        SelectData: [],
        Group: {
          SmsModal: false,
          AppmsgModal: false
        },
        //初始分页信息
        Page: {
          count: 0,
          cur: 1,
          size: 20,
        }
      }
    },
    created(){
      this.auth_id = getLocal('auth_id');
      this.InitData('Collection/overdueList');
    },
    methods: {
      //循环渲染按钮
      RenderBtn(h,params,bdata){
        let res = [];
        bdata.forEach((val)=>{
          let btn = '';
          if(val.class === 'DetailsOpt'){
            let innerbtn = h('Button',{
              props: {
                type: val.color
              },
              style: {
                marginRight: '5px'
              }
            },val.name);
            btn = h('router-link',{
              props: {
                to: '/consumerDetails?id=' + params.row.id
              },
              attrs: {
                target: '_blank'
              }
            },[innerbtn]);
          }else if(val.class === 'DelayOpt'){
            let name = params.row.allow_delay?'已展期':'展期';
            let color = params.row.allow_delay?'default':val.color;
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
          }else if(val.class === 'MarkOpt'){
            let name = params.row.marking?'取消标记':'标记';
            let color = params.row.marking?'default': val.color;
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
          if(this.CountData[3].cur && val.class === 'DelayOpt'){
          }else{
            res.push(btn);
          }
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
      //选择时间
      PickDate(time){
        this.allTime = time;
      },
      //查询结果
      SimpleSearch(sign = 1){
        let sinfo = this.RemoveObserve(this.ScreenData);
        if(this.allTime[0] !== ""){
          sinfo.start_time = this.allTime[0];
          sinfo.end_time = this.allTime[1];
        }else{
          sinfo.start_time = '';
          sinfo.end_time = '';
        }
        this.InitData('Collection/collectionListInfo',sinfo).then(()=>{
          if(sign){
            this.$Message.success('筛选成功！')
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
            let res = d.data.list;
            this.Page.count = d.data.count;
            this.RowUserData = res;
            this.UserData = this.TransText(res,'error_msg','无');
            that.loading = false;
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
        this.InitData('Collection/CollectionList').then(()=>{
          this.$Message.success('刷新成功');
        });
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
      },
      //提交备注
      SubRemark(){
        this.UploadData('Collection/remark',this.Remark).then(()=>{
          this.SimpleSearch(0);
        });
      },
      //展期功能
      DelayOpt(row){
        let tips = row.allow_delay?'是否关闭展期？':'是否开通展期？';
        this.$Modal.confirm({
          title: '提示',
          content: `<p class="confirm-text">${tips}</p>`,
          onOk: ()=>{
            this.UploadData('Collection/allowDelay',{uid: row.id}).then(()=>{
              this.SimpleSearch(0);
            });
          }
        })
      },
      //标记功能
      MarkOpt(row){
        this.UploadData('Collection/marking',{loan_id: row.loan_id}).then(()=>{
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
            }else{
              this.$Message.error(d.message);
            }
          }).catch((err)=>{
            this.$Message.error('服务器繁忙，请稍后再试！');
          })
        })

      },
      //群发短信
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
        let sinfo = this.RemoveObserve(info);
        sinfo.regid = (sinfo.type.length > 0)?sinfo.regid.join(','):'';
        this.UploadData('Push/pushs',sinfo).then(()=>{
          this.Group.AppmsgModal = false;
        });
        //this.Group.AppmsgModal = false;
      },
      //导出数据
      ExportData(){
        let sinfo = this.RemoveObserve(this.ScreenData);
        sinfo.expro = 1;
        this.UploadData('Collection/overdueList',sinfo).then((url)=>{
          //window.location.href = url;
        });
      },
      //改变页数
      ChangePage(curpage){
        let sinfo = Object.assign(this.ScreenData,{
          page: curpage,
          num: this.Page.size
        });
        this.InitData('Collection/overdueList',sinfo).then(()=>{
          this.Page.cur = curpage;
        })
      },
      //改变显示条数
      ChangeSize(size){
        let sinfo = Object.assign(this.ScreenData,{
          page: 1,
          num: size
        });
        this.InitData('Collection/overdueList',sinfo).then(()=>{
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
