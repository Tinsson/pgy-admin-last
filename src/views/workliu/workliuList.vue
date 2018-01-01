<template>
  <div id="workliu-list">
    <h1 class="list-title">
      <span class="tit-text">{{ title }}</span>
      <Button class="tit-btn"
              type="info"
              icon="ios-reload"
              size="large"
              @click="RefreshList">刷新列表</Button>
    </h1>
    <!--<div class="screen-area">
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
            <FormItem label="申请时间：">
              <DatePicker type="datetimerange"
                          placeholder="选择日期和时间"
                          format="yyyy-MM-dd HH:mm:ss"
                          placement="bottom-end"
                          :value="allTime"
                          @on-change="PickDate"
                          style="width: 280px"></DatePicker>
            </FormItem>
            <FormItem label="状态：">
              <Select v-model="ScreenData.status" style="width:162px">
                <Option :value="0">未处理</Option>
                <Option :value="1">已放款</Option>
                <Option :value="-1">已拒绝</Option>
              </Select>
            </FormItem>
          </Form>
        </div>
      </Card>
    </div>-->
    <div class="data-area">
      <Card :padding="0">
        <div class="card-tit" slot="title">
          <h3>
            <Icon type="clipboard"></Icon>
            数据列表
          </h3>
          <div class="btn-box">
            <!--<Button type="primary" size="large" icon="archive" @click="ExportData">导出数据</Button>-->
          </div>
        </div>
        <Table :columns="UserCol"
               :data="UserData"
               :loading="loading"
               @on-selection-change="SelectTable"></Table>
        <!--<div class="page-box">
          <Page :current="Page.cur"
                :page-size="Page.size"
                :total="Page.count"
                placement="top"
                @on-change="ChangePage"
                @on-page-size-change="ChangeSize" show-sizer></Page>
        </div>-->
      </Card>
    </div>
    <AuditModal :modalShow="Audit.modal"
                :InitId="Audit.id"
                :UniqueId="Audit.id"
                :AllId="Audit.allId"
                @CloseModal="AuditCancel"></AuditModal>
  </div>
</template>

<script>
  import { getLocal } from '@/util/util'
  import Clipboard from 'clipboard'
  import GroupSms from '@/components/groupModal/GroupSms'
  import AuditModal from '@/components/infoModal/AuditModal'

  export default {
    name: 'WorkLiuList',
    components:{
      GroupSms,
      AuditModal
    },
    data () {
      return {
        title: '工作流列表',
        apiUrl: '/backend/Workliu/workliuList',
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
          end_time: '',
          //status: ''
        },
        UserCol: [
          {
            title: '序号',
            width: '70',
            align: 'center',
            key: 'id'
          },{
            title: '姓名',
            width: '80',
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
            width: '110',
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
            title: '订单金额',
            key: 'amount',
            render: (h,params)=>{
              let text = (params.row.zqid > 0)?params.row.zq_amount:params.row.jk_amount;
              return h('span', text);
            }
          },{
            title: '出资人',
            key: 'capital_name'
          },{
            title: '费用',
            key: 'fee'
          },{
            title: '类型',
            key: 'types',
            render: (h,params)=>{
              let text = '';
              switch(params.row.types){
                case 1:
                  text = '借款';
                  break;
                case 2:
                  text = '展期';
                  break;
                case 3:
                  text = '还款';
                  break;
              }
              return h('span',text);
            }
          },{
            title: '状态',
            key: 'status',
            render: (h, params)=>{
              let text = '';
              switch(params.row.status){
                case 0:
                  text = '未处理';
                  break;
                case 1:
                  text = '审核通过';
                  break;
                case 2:
                  text = '服务费已确认';
                  break;
                case 8:
                  text = '展期通过';
                  break;
                case -1:
                  text = '已拒绝';
                  break;
                default:
                  text = '未知'
              }
              return h('span',{
                style: {
                  color: '#f00'
                }
              },text);
            }
          },{
            title: '还款时间',
            width: '150',
            key: 'hkri'
          },{
            title: '申请时间',
            width: '150',
            key: 'req_date',
            render: (h,params)=>{
              let text = (params.row.zqid > 0)?params.row.zq_request_date:params.row.jk_request_date;
              return h('span', text);
            }
          },{
            title: '操作',
            key: 'operation',
            align: 'center',
            width: '320',
            render: (h, params)=>{
              return h('div',this.RenderBtn(h, params, this.BtnData));
            }
          }
        ],
        UserData: [],     //表格数据
        BtnData: [],
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
        },
        //审核面板
        Audit:{
          modal: false,
          id: '',
          allId: ''
        }
      }
    },
    created(){
      this.auth_id = getLocal('auth_id');
      this.InitData(this.apiUrl);
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
    methods: {
      RenderBtn(h,params,bdata){
        let arr = [];
        bdata.forEach((val)=> {
          let btn = h('Button', {
            props: {
              type: val.color
            },
            style: {
              marginRight: '5px'
            },
            on: {
              click: () => {
                this[val.class](params.row)
              }
            },
          }, val.name);
          const types = params.row.types,
                status = params.row.status,
                hktype = params.row.hktype;
          if((val.class === 'AddOpt' || val.class === 'RejectOpt') && status === 0 && types === 1){
            arr.push(btn);
          }else if((val.class === 'DelayOpt' || val.class === 'RejectOpt') && types === 2){
            arr.push(btn);
          }else if(val.class === 'DetailsOpt' && status === 1){
            arr.push(btn);
          }else if((val.class === 'LoanOpt' || val.class === 'RejectOpt') && status === 2){
            arr.push(btn);
          }else if((val.class === 'PreRepayOpt' || val.class === 'RejectOpt') && types === 3 && hktype === 2){
            arr.push(btn);
          }else if((val.class === 'WriteOffOpt' || val.class === 'RejectOpt') && types === 3 && hktype === 3){
            arr.push(btn);
          }
        });
        return arr;
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
        this.InitData(this.apiUrl,sinfo).then(()=>{
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
        this.$fetch("/backend/Menuauth/listAuthGet",{auth_id: this.auth_id}).then((d)=>{
          this.BtnData = d.data.operation;
        });
        //列表数据获取
        return new Promise((resolve)=>{
          this.$post(url,params).then((d)=>{
            let res = d.data.list;
            this.Page.count = d.data.count;
            this.UserData = res;
            this.RowUserData = res;
            that.loading = false;
            resolve();
          })
        })
      },
      //刷新列表
      RefreshList(){
        this.InitData(this.apiUrl).then(()=>{
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
      //移除操作
      Delopt(row){

      },
      //审核通过
      AddOpt(row){
        let url = row.types === 0?'/backend/Loan/payDelayOk':'/backend/Loan/jkAuditOk';
        let type = row.types === 0?'展期':'放款审核';
        this.$Modal.confirm({
          title: '提示',
          content: `<p class="confirm-text">确认通过该用户的${type}？</p>`,
          onOk: ()=>{
            this.UploadData(url,{jid: row.id,status: 1}).then(()=>{
              this.SimpleSearch(0);
            });
          }
        })
      },
      //确认服务费
      DetailsOpt(row){
        let url = row.types === 0?'/backend/Loan/zqWaiterOk':'/backend/Loan/jkWaiterOk';
        this.$Modal.confirm({
          title: '提示',
          content: `<p class="confirm-text">确认当前服务费</p>`,
          onOk: ()=>{
            this.UploadData(url,{jid: row.id}).then(()=>{
              this.SimpleSearch(0);
            });
          }
        })
      },
      //放款操作
      LoanOpt(row){
        let url = row.types === 0?'/backend/Loan/payDelayOk':'/backend/Loan/payLoanOk';
        let tips = row.types === 0?'确认通过该展期吗？':'确认通过该借款吗？';
        this.$Modal.confirm({
          title: '提示',
          content: `<p class="confirm-text">${tips}</p>`,
          onOk: ()=>{
            this.UploadData(url,{jid: row.id,status: 1}).then(()=>{
              this.SimpleSearch(0);
            });
          }
        })
      },
      //展期通过操作
      DelayOpt(row){
        this.$Modal.confirm({
          title: '提示',
          content: `<p class="confirm-text">确认展期成功通过吗？</p>`,
          onOk: ()=>{
            this.UploadData('/backend/Loan/payDelayOk',{jid: row.id,status: 1}).then(()=>{
              this.SimpleSearch(0);
            });
          }
        })
      },
      //销账通过
      WriteOffOpt(row){
        this.$Modal.confirm({
          title: '提示',
          content: `<p class="confirm-text">确认销账成功吗？</p>`,
          onOk: ()=>{
            this.UploadData('/backend/Loan/payMentDoneOk',{jid: row.id}).then(()=>{
              this.SimpleSearch(0);
            });
          }
        })
      },
      //提前还款
      PreRepayOpt(row){
        this.$Modal.confirm({
          title: '提示',
          content: `<p class="confirm-text">确认提前还款成功通过吗？</p>`,
          onOk: ()=>{
            this.UploadData('/backend/Loan/payMentDoneOk',{jid: row.id}).then(()=>{
              this.SimpleSearch(0);
            });
          }
        })
      },
      //拒绝操作
      RejectOpt(row){
        let url = '',
            tips = '';
        switch(row.types){
          case 1:
            url = '/backend/Loan/jkAuditOk';
            tips = '确认拒绝该借款吗？';
            break;
          case 2:
            url = '/backend/Loan/zqAuditOk';
            tips = '确认拒绝该展期吗？';
            break;
          case 3:
            url = '/backend/Loan/hkDeTo';
            tips = '确认拒绝该还款吗？';
            break;
        }
        this.$Modal.confirm({
          title: '提示',
          content: `<p class="confirm-text">${tips}</p>`,
          onOk: ()=>{
            this.UploadData(url,{jid: row.id,status: -1}).then(()=>{
              /*let num = '';
              this.UserData.forEach((val,index)=>{
                if(val.id === row.id){
                  num = index;
                }
              });
              this.UserData = [...this.UserData.slice(0, num),...this.UserData.slice(num+1,this.UserData.length)];*/
              this.SimpleSearch(0);
            });
          }
        })
      },
      //导出数据
      ExportData(){
        let sinfo = this.RemoveObserve(this.ScreenData);
        sinfo.expro = 1;
        this.UploadData(this.apiUrl,sinfo).then((url)=>{
          console.log(url);
          //window.location.href = url;
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

</style>
