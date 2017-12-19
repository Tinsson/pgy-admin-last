<template>
  <div id="loan-panel">
    <h1 class="list-title">
      <span class="tit-text">{{ title }}</span>
    </h1>
    <Row class="card-box">
      <Col v-for="item in CountData" class="card-col" :span="6" :key="item.name">
      <div class="sim-card" :class="{cur:item.cur}" @click="CountList(item.status)">
        <Icon class="icon" :type="item.icon"></Icon>
        <p class="title">{{ item.name }}</p>
        <p class="value"><span class="num">{{item.count}}</span><span>{{item.cunit}}</span><span class="num" v-show="item.second">/</span><span class="num">{{item.other}}</span><span>{{item.ounit}}</span>
        </p>
        <span class="tips">点击查看</span>
      </div>
      </Col>
    </Row>
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
            <FormItem label="姓名：">
              <Input v-model="ScreenData.name" style="width: 120px"></Input>
            </FormItem>
            <FormItem label="手机号：">
              <Input v-model="ScreenData.phone" style="width: 120px"></Input>
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
            用户列表
          </h3>
          <div class="btn-box">
            <Button type="primary" icon="android-chat" @click="GroupAppOpt" style="margin-right: 12px;">推送本页</Button>
            <span>资金账号：
            <Select v-model="owner" @on-change="ChoseOwner" style="display: inline-block;width: 80px;">
              <Option :value="1">李义</Option>
              <Option :value="2">张晓成</Option>
            </Select></span>
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
    <AuditModal :modalShow="Audit.modal"
                :InitId="Audit.id"
                :UniqueId="Audit.id"
                :AllId="Audit.allId"
                @CloseModal="AuditCancel"/>
    <PushApp :modalShow="Group.AppmsgModal"
             :InitData="SelectData"
             :Count="Page.count"
             @CloseModal="CloseApp"
             @UpOver="AppOpt"/>
  </div>
</template>

<script>
  import { getLocal } from '@/util/util'
  import AuditModal from '@/components/infoModal/AuditModal'
  import PushApp from '@/components/groupModal/PushApp'

  export default {
    name: 'LoanPanel',
    components: {
      AuditModal,
      PushApp
    },
    data () {
      return {
        title: '放款面板',
        apiUrl: '/backend/Loanmake/getlistOnServerside',
        auth_id: '',
        loading: true,
        allTime: [],
        owner: 1,
        //统计数据
        CountData: [{
          name: '潜在客户',
          icon: 'ios-list-outline',
          count: 0,
          cunit: '人',
          second: false,
          status: 'potential_customers',
          cur: true
        },{
          name: '今日放款',
          icon: 'android-calendar',
          count: 0,
          cunit: '人',
          second: false,
          status: 'fk_today',
          cur: false
        },{
          name: '昨日放款',
          icon: 'android-calendar',
          count: 0,
          cunit: '人',
          second: false,
          status: 'fk_yesterday',
          cur: false
        },{
          name: '放款总数',
          icon: 'ios-list',
          count: 0,
          cunit: '人',
          second: false,
          status: 'fk_total_number',
          cur: false
        },{
          name: '待放款列表',
          icon: 'android-bookmark',
          count: 0,
          cunit: '人',
          second: false,
          status: 'fk_customers_ready',
          cur: false
        }],
        //基础筛选数据
        ScreenData: {
          type: 'potential_customers',
          name: '',
          phone: ''
        },
        UserCol: [
          {
            type: 'selection',
            width: 55,
            align: 'center'
          },{
            title: '客户ID',
            width: '80',
            align: 'center',
            key: 'id'
          },{
            title: '姓名',
            width: '100',
            align: 'center',
            key: 'name'
          },{
            title: '性别',
            key: 'sex'
          },{
            title: '手机',
            key: 'phone'
          },{
            title: '身份证',
            key: 'idcard'
          },{
            title: '状态',
            key: 'status'
          },{
            title: '授权状态',
            key: 'auth_status'
          },{
            title: '操作',
            key: 'operation',
            align: 'center',
            width: '220',
            render: (h, params)=>{
              return h('div',this.$renderBtn(h, params, this.BtnData));
            }
          }
        ],
        UserData: [],     //表格数据
        BtnData: [],      //按钮数据
        //群选打钩后操作
        SelectData: [],
        Group: {
          AppmsgModal: false
        },
        //初始分页信息
        Page: {
          count: 0,
          cur: 1,
          size: 20,
        },
        Audit:{
          modal: false,
          id: '',
          allId: ''
        }
      }
    },
    created(){
      this.auth_id = getLocal('auth_id');
      this.InitData(this.apiUrl,{type: 'potential_customers'});
    },
    computed: {

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
      },
      //二次获取数据
      SecondData(sinfo){
        return new Promise(resolve=>{
          this.$post(this.apiUrl,sinfo).then(d=>{
            this.UserCol = this.GetField(d.data.field);
            this.UserData = d.data.fk_list;
            this.Page.count = d.data.total;
            this.loading = false;
            resolve();
          })
        });
      },
      //统计列表
      CountList(status){
        this.loading = true;
        this.ScreenData.type = status;
        let sinfo = this.RemoveObserve(this.ScreenData);
        this.CountData.forEach(val=>{
          if(val.status === status){
            val.cur = true;
          }else{
            val.cur = false;
          }
        });
        this.SecondData(sinfo);
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
        this.SecondData(sinfo).then(()=>{
          this.$Message.success('筛选成功！');
        });
      },
      //初始化数据
      InitData(url,params = {}){
        const that = this;
        this.loading = true;
        this.$fetch('/backend/Loanmake/getBlockStatics').then(d=>{
          this.CountData.forEach(val=>{
            val.count = d.data[val.status];
          })
        });
        //获取按钮信息
        this.$fetch('/backend/Menuauth/listAuthGet',{auth_id: this.auth_id}).then((d)=>{
          this.BtnData = d.data.operation;
        });
        //列表数据获取
        return new Promise((resolve)=>{
          this.$post(url,params).then((d)=>{
            let res = d.data;
            this.Page.count = d.data.total;
            this.UserCol = this.GetField(res.field);
            this.UserData = res.fk_list;
            that.loading = false;
            resolve();
          })
        })
      },
      //统一标签
      GetField(filed){
        let res = filed;
        res.push({
          title: '操作',
          key: 'operation',
          align: 'center',
          width: '220',
          render: (h, params)=>{
            return h('div',this.$renderBtn(h, params, this.BtnData));
          }
        });
        res.unshift({
          type: 'selection',
          width: 55,
          align: 'center'
        });
        return res;
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
      //选择资金账号
      ChoseOwner(value){
        this.UploadData('',{});
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
        this.UploadData('/backend/Push/pushs',sinfo).then(()=>{
          this.Group.AppmsgModal = false;
        });
      },
      AuditPanel(row){
        this.Audit.modal = true;
        this.Audit.id = row.id;
        let idArr = [];
        this.UserData.forEach(val=>{
          idArr.push(val.id);
        });
        this.Audit.allId = idArr;
      },
      AuditCancel(){
        this.Audit.modal = false;
      },
      ShowHang(){

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
    flex-wrap: wrap;
    padding-bottom: 20px;
    .card-col{
      padding: 0 8px;
    }
    .sim-card{
      position: relative;
      width: 100%;
      padding: 15px;
      color: #FFF;
      overflow: hidden;
      cursor: pointer;
      border-radius: 5px;
      background-color: #c3c3c3;
      margin-bottom: 10px;
      .title{
        font-size: 16px;
      }
      .value{
        padding-top: 10px;
        font-size: 18px;
        .num{
          font-size: 32px;
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
        right: 10px;
        top: 5px;
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
  .count-span{
    font-size: 18px;
    padding: 0 5px;
    color: #d7000f;
  }
</style>
