<template>
  <div id="review-panel">
    <h1 class="list-title">
      <span class="tit-text">审核</span>
      <Button class="tit-btn"
              type="info"
              icon="ios-reload"
              size="large"
              @click="RefreshList">刷新列表</Button>
    </h1>
    <div class="card-box">
      <div v-for="item in CountData" class="sim-card" :class="{cur:item.cur}" @click="CountList(item.status)">
        <Icon class="icon" :type="item.icon"></Icon>
        <p class="title">{{ item.name }}</p>
        <p class="value"><span class="num">{{item.count}}</span>人</p>
        <span class="tips">点击查看</span>
      </div>
    </div>
    <h1 class="list-title">
      <span class="tit-text">放款</span>
    </h1>
    <div class="card-box">
      <div v-for="item in CountData2" class="sim-card" :class="{cur:item.cur}" @click="CountList2(item.status)">
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
            <span v-show="fangKuan">资金账号：</span>
            <Select v-show="fangKuan" v-model="Owner" @on-change="ChoseOwner" style="display: inline-block;width: 80px;margin-right: 10px;">
              <Option :value="1">李义</Option>
              <Option :value="2">张晓成</Option>
            </Select></span>
            <Button v-show="isPotential" type="info" icon="chatbox" @click="GroupAppOpt">群发消息</Button>
            <Button v-show="!fangKuan" :type="HangType" icon="pin" @click="ShowHang">{{HangText}}</Button>
            <Button type="warning" v-show="PassShow" icon="checkmark" @click="SumPass">一键通过</Button>
          </div>
        </div>
        <Table :columns="UserCol"
               :data="UserData"
               :row-class-name="HangStatus"
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
                :BtnId="Audit.btn"
                :UniqueId="Audit.id"
                :AllId="Audit.allId"
                @CloseModal="AuditCancel"></AuditModal>
    <PushApp :modalShow="Group.AppmsgModal"
             :InitData="SelectData"
             :Condition="SeniorData"
             :Count="Page.count"
             @CloseModal="CloseApp"
             @UpOver="AppOpt"></PushApp>
  </div>
</template>

<script>
  import { getLocal,saveLocal } from '@/util/util'
  import AuditModal from '@/components/infoModal/AuditModal'
  import PushApp from '@/components/groupModal/PushApp'
  import Clipboard from 'clipboard'
  import qs from 'qs'

  export default {
    name: 'ReviewPanel',
    components: {
      AuditModal,
      PushApp
    },
    data () {
      return {
        title: '审核放款面板',
        apiUrl: '/backend/loan-audit/list',  //审核
        apiUrl2: '/backend/loan-make/list',  //放款
        auth_id: '',
        Owner: 1,
        loading: true,
        allTime: [],
        CardType: 1,
        //统计数据
        CountData: [{
          name: '审核中',
          icon: 'ios-list-outline',
          count: 0,
          cunit: '人',
          second: false,
          status: 'check_waiting',
          cur: true
        },{
          name: '今日通过（未放款）',
          icon: 'android-calendar',
          count: 0,
          cunit: '人',
          second: false,
          status: 'check_pass_today',
          cur: false
        },{
          name: '已通过未放款',
          icon: 'android-bookmark',
          count: 0,
          cunit: '人',
          second: false,
          status: 'check_pass',
          cur: false
        },{
          name: '不通过列表',
          icon: 'android-delete',
          count: 0,
          cunit: '人',
          second: false,
          status: 'check_deny',
          cur: false
        }],
        CountData2: [{  //放款卡片
          name: '待放款列表',
          icon: 'android-bookmark',
          count: 0,
          cunit: '人',
          second: false,
          status: 'fk_customers_ready',
          cur: false
        },{
          name: '今日放款',
          icon: 'android-calendar',
          count: 0,
          cunit: '人',
          second: false,
          status: 'fk_today',
          cur: false
        },{
          name: '潜在客户',
          icon: 'ios-list-outline',
          count: 0,
          cunit: '人',
          second: false,
          status: 'potential_customers',
          cur: false
        }],
        //基础筛选数据
        ScreenData: {
          type: 'check_waiting',
          key: '',
          is_hang: -1
        },
        UserCol: [
          {
            type: 'selection',
            width: 55,
            align: 'center'
          },{
            title: 'ID',
            width: '80',
            align: 'center',
            key: 'id'
          },{
            title: '姓名',
            width: '100',
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
            title: '手机',
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
            title: '性别',
            key: 'sex'
          },{
            title: '状态',
            key: 'status'
          },{
            title: '授权状态',
            key: 'auth_status',
            render: (h,params)=>{
              const auth = params.row.auth_status;
              let elmArr = [];
              Object.keys(auth).forEach(key=>{
                if(auth[key]){
                  const elm = h('span',{
                    class:['auth-icon',key]
                  });
                  elmArr.push(elm);
                }
              });
              return h('div',elmArr);
            }
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
          SmsModal: false,
          AppmsgModal: false
        },
        SeniorData: {
          type: ''
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
          allId: '',
          btn: ''
        }
      }
    },
    created(){
      this.auth_id = getLocal('auth_id');
      this.Owner = parseInt(getLocal('owner'));
      this.InitData(this.apiUrl,{type: 'check_waiting'});
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
    },
    destroyed() {
      this.ClipBoard.destroy();
    },
    computed: {
      HangText(){
        return this.ScreenData.is_hang === 1?'取消挂起显示':'显示挂起';
      },
      HangType(){
        return this.ScreenData.is_hang === 1?'default':'primary';
      },
      PassShow(){
        if(this.CountData[0].cur || this.CountData[3].cur){
          return true;
        }else{
          return false;
        }
      },
      fangKuan(){
        if(this.CardType === 2){
          return true;
        }else{
          return false;
        }
      },
      isPotential(){
        return this.CountData2[2].cur || this.CountData[1].cur || this.CountData[2].cur //|| this.ScreenData.type === 'all';
      }
    },
    watch:{
      UserCol(col){
        col.forEach(val=>{
          if(val.key === "auth_status"){
            val.align = 'center';
            val.width = '160';
            val.render = this.AuthIcon;
          }
        });
      }
    },
    methods: {
      //去除data数据里绑定的监视器
      RemoveObserve(rowdata){
        return JSON.parse(JSON.stringify(rowdata));
      },
      //筛选操作(重置筛选)
      ResetScreen(){
        /*for(let key in this.ScreenData){
          if(key !== 'type'){
            this.ScreenData[key] = '';
          }
        }*/
        this.ScreenData.name = '';
        this.ScreenData.phone = '';
      },
      //多选打钩绑定数据
      SelectTable(data){
        console.log(data);
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
      RefreshList(){
        this.loading = true;
        this.ResetPageNum();
        if(this.ScreenData.type === 'all'){
          this.CountData[0].cur = true;
          this.ScreenData.type = 'check_waiting';
        }
        this.ScreenData.key = '';
        this.SimpleSearch(0).then(()=>{
          this.$Message.success('刷新成功！');
        });
      },
      //统一标签
      GetField(filed){
        let res = filed;
        res.forEach(val=>{
          if(val.key === 'name'){
            val.render = this.ClipName;
          }else if(val.key === 'phone'){
            val.render = this.ClipPhone;
          }
        })
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
      //二次获取数据
      SecondData(sinfo,sign = 1){
        let url = this.apiUrl;
        if(sign === 2){
          url = this.apiUrl2;
        }
        return new Promise(resolve=>{
          this.$fetch(url,sinfo).then(d=>{
            if(sign === 1){
              this.UserData = d.data.customer_list;
            }else if(sign === 2){
              this.UserCol = this.GetField(d.data.field);
              this.UserData = d.data.fk_list;
            }
            this.Page.count = d.data.total;
            this.loading = false;
            resolve();
          })
        });
      },
      AuthIcon(h,params){
        const auth = params.row.auth_status;
        let elmArr = [];
        Object.keys(auth).forEach(key=>{
          if(auth[key]){
            const elm = h('span',{
              class:['auth-icon',key]
            });
            elmArr.push(elm);
          }
        });
        return h('div',{
          style:{
            width: '125px'
          }
        },elmArr);
      },
      //统计列表
      CountList(status){
        this.loading = true;
        this.ScreenData.type = status;
        this.SeniorData.type = status;
        this.CardType = 1;
        this.SelectData = [];
        let sinfo = this.RemoveObserve(this.ScreenData);
        sinfo.page = 1;
        sinfo.num = 20;
        this.CountData2.forEach(val=>{
          val.cur = false;
        });
        this.CountData.forEach(val=>{
          if(val.status === status){
            val.cur = true;
          }else{
            val.cur = false;
          }
        });
        this.SecondData(sinfo);
      },
      CountList2(status){
        this.loading = true;
        this.ScreenData.type = status;
        this.SeniorData.type = status;
        this.CardType = 2;
        this.SelectData = [];
        let sinfo = this.RemoveObserve(this.ScreenData);
        sinfo.page = 1;
        sinfo.num = 20;
        this.CountData.forEach(val=>{
          val.cur = false;
        });
        this.CountData2.forEach(val=>{
          if(val.status === status){
            val.cur = true;
          }else{
            val.cur = false;
          }
        });
        this.SecondData(sinfo,2);
      },
      //选择资金账号
      ChoseOwner(value){
        saveLocal('owner',value);
      },
      //查询结果
      SimpleSearch(sign = 1,isPage = 0){
        if(sign){
          this.ScreenData.type = 'all';
          this.CountData.forEach(val=>{
            val.cur = false;
          })
          this.CountData2.forEach(val=>{
            val.cur = false;
          })
        }
        if(isPage){
          this.ScreenData = Object.assign(this.ScreenData,{
            page: this.Page.cur,
            num: this.Page.size
          })
        }
        return new Promise((resolve)=>{
          this.SecondData(this.ScreenData,this.CardType).then(()=>{
            if(sign){
              this.$Message.success('筛选成功！');
            }
            resolve();
          });
        });
      },
      //初始化数据
      InitData(url,params = {}){
        const that = this;
        this.loading = true;
        this.$fetch('/backend/loan-make/block-data').then(d=>{
          this.CountData2.forEach(val=>{
            val.count = d.data[val.status];
          })
        });
        this.$fetch('/backend/loan-audit/block-data').then(d=>{
          this.CountData.forEach(val=>{
            val.count = d.data[val.status];
          })
        });
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
            let res = d.data;
            this.Page.count = d.data.total;
            this.UserData = res.customer_list;
            that.loading = false;
            resolve();
          })
        })
      },
      //提交信息操作
      UploadData(url,info){
        return new Promise((resolve)=>{
          this.$post(url,info).then((d)=>{
            console.log(d);
            if(d.status === 1){
              this.$Message.success(d.message);
              resolve(d);
            }else{
              this.$Message.error(d.message);
            }
          }).catch((err)=>{
            this.$Message.error('服务器繁忙，请稍后再试！');
          })
        })

      },
      //改变页数
      ChangePage(curpage){
        let sinfo = Object.assign(this.ScreenData,{
          page: curpage,
          num: this.Page.size
        });
        this.SecondData(sinfo,this.CardType).then(()=>{
          this.Page.cur = curpage;
        })
      },
      //改变显示条数
      ChangeSize(size){
        let sinfo = Object.assign(this.ScreenData,{
          page: 1,
          num: size
        });
        this.SecondData(sinfo,this.CardType).then(()=>{
          this.Page.cur = 1;
          this.Page.size = size;
        })
      },
      //重置页码
      ResetPageNum(){
        this.Page.cur = 1;
        this.Page.size = 20;
        this.ScreenData.page = 1;
        this.ScreenData.num = 20;
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
        this.SimpleSearch(0,1);
      },
      HangStatus(row){
        if(row.is_hangup){
          return 'table-hang-row';
        }else{
          return '';
        }
      },
      ShowHang(){
        this.ScreenData.is_hang = this.ScreenData.is_hang === 1?-1:1;
        console.log(this.ScreenData.is_hang);
        this.SimpleSearch(0);
      },
      SumPass(){
        if(this.SelectData.length > 0){
          const id = this.SelectData.join(',');
          const admin_id = this.$getLocal('admin_id');
          this.UploadData('/backend/User/auditUserMore',{uid: id,status: 2, admin_id}).then(()=>{
            this.SimpleSearch(0,1);
          })
        }else{
          this.$Message.error('请先勾选需要通过的用户！');
        }
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
        params = Object.assign(params, info.condition);
        let sendUrl = this.apiUrl;
        this.CountData2.forEach(val=>{
          if(val.cur){
            sendUrl = this.apiUrl2;
          }
        });
        console.log(sendUrl,params);
        this.$axios.get(sendUrl + qs.stringify(params)).then((res)=>{
          this.$Message.info(res.data.message);
          this.Group.AppmsgModal = false;
        });
      },
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
    //justify-content: space-between;
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
      margin: 5px;
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
  .count-span{
    font-size: 18px;
    padding: 0 5px;
    color: #d7000f;
  }
  .auth-icon{
    width: 32px;
    height: 32px;
    display: inline-block;
    margin-right: 5px;
    &.TB{
      background: url('../../assets/images/taobao.png') no-repeat center;
      background-size: cover;
    }
    &.MB{
      background: url('../../assets/images/phone.png') no-repeat center;
      background-size: cover;
    }
    &.JD{
      background: url('../../assets/images/phone.png') no-repeat center;
      background-size: cover;
    }
  }
</style>
