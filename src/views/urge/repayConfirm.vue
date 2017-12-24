<template>
  <div id="repay-confirm">
    <h1 class="list-title">
      <span class="tit-text">{{ title }}</span>
      <Button class="tit-btn"
              type="info"
              icon="ios-reload"
              size="large"
              @click="RefreshList">刷新列表</Button>
    </h1>
    <div class="data-area">
      <Card :padding="0">
        <div class="card-tit" slot="title">
          <h3>
            <Icon type="clipboard"></Icon>
            数据列表
          </h3>
        </div>
        <SumTable :head="SumData.head"
                  :data="SumData.data"
                  :loading="loading"
                  @repay="ConfirmRepay"/>
      </Card>
    </div>
  </div>
</template>

<script>
  import { getLocal } from '@/util/util'
  import SumTable from '@/components/cusTable/SumTable'

  export default {
    name: 'repayConfirm',
    components: {
      SumTable
    },
    data () {
      return {
        title: '还款确认列表',
        apiUrl: '/backend/Collection/payConfirmList',
        auth_id: '',
        loading: true,
        allTime: [],
        //基础筛选数据
        ScreenData: {
          search: '',
          start_time: '',
          end_time: ''
        },
        SumData:{
          head: [{
            title: '还款客户',
            key: 'title'
          },{
            title: '姓名',
            key: 'name'
          },{
            title: '手机号',
            key: 'phone'
          },{
            title: '借款金额',
            key: 'loan'
          },{
            title: '应还金额',
            key: 'yh_amount'
          },{
            title: '借款时间',
            key: 'jk_date'
          },{
            title: '应还时间',
            key: 'yh_date'
          },{
            title: '操作',
            key: 'operation'
          }],
          data: []
        },
        UserData: [],     //表格数据
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
      this.InitData(this.apiUrl);
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
        this.$fetch('/backend/Menuauth/listAuthGet',{auth_id: this.auth_id}).then((d)=>{
          this.BtnData = d.data.operation;
        });
        //列表数据获取
        return new Promise((resolve)=>{
          this.$post(url,params).then((d)=>{
            let res = d.data.list;
            this.Page.count = d.data.count;
            this.SumData.data = res;
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
      ConfirmRepay(id){
        this.$Modal.confirm({
          title: '提示',
          content: `<p class="confirm-text">确认对该用户的此数据进行还款操作吗？</p>`,
          onOk: ()=>{
            this.UploadData('/backend/Loan/payMentDone',{jid: id}).then(()=>{
              let sinfo = Object.assign(this.ScreenData,{
                page: this.Page.cur,
                num: this.Page.size
              });
              this.InitData(this.apiUrl,sinfo);
            })
          }
        });
      },
      //导出数据
      ExportData(){
        let sinfo = this.RemoveObserve(this.ScreenData);
        sinfo.expro = 1;
        this.UploadData(this.apiUrl,sinfo).then((url)=>{
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
