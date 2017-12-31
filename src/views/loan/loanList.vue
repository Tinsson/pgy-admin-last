<template>
  <div id="loan-list">
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
            数据列表
          </h3>
          <div class="btn-box">
            <Button type="primary" icon="archive" @click="ExportData">导出数据</Button>
          </div>
        </div>
        <Table :columns="UserCol"
               :data="UserData"
               :loading="loading" ></Table>
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
  </div>
</template>

<script>
  import { getLocal } from '@/util/util'
  export default {
    name: 'LoanList',
    data () {
      return {
        title: '借款列表',
        loading: true,
        allTime: [],
        //基础筛选数据
        ScreenData: {
          key: ''
        },
        UserCol: [
          {
            type: 'selection',
            width: 55,
            align: 'center'
          },{
            title: '序号',
            width: '80',
            align: 'center',
            key: 'id'
          },{
            title: '姓名',
            width: '100',
            align: 'center',
            key: 'name'
          },{
            title: '手机号',
            width: '110',
            align: 'center',
            key: 'phone'
          },{
            title: '借款金额',
            key: 'amount'
          },{
            title: '借款时间',
            align: 'center',
            key: 'jk_date'
          },{
            title: '还款时间',
            align: 'center',
            key: 'hthk_date'
          },{
            title: '状态',
            width: '100',
            align: 'center',
            key: 'status'
          },{
            title: '请求时间',
            align: 'center',
            width: '150',
            key: 'request_date'
          }
        ],
        UserData: [],     //表格数据
        RowUserData: [],  //获取的原始数据
        //初始分页信息
        Page: {
          count: 0,
          cur: 1,
          size: 20,
        }
      }
    },
    created(){
      this.InitData();
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
      SimpleSearch(){
        this.ResetPageNum();
        let sinfo = this.RemoveObserve(this.ScreenData);
        if(this.allTime[0] !== ""){
          sinfo.start_time = this.allTime[0];
          sinfo.end_time = this.allTime[1];
        }else{
          sinfo.start_time = '';
          sinfo.end_time = '';
        }
        this.InitData(sinfo).then(()=>{
          this.$Message.success('筛选成功！');
        });
      },
      //初始化数据
      InitData(params = {}){
        const that = this;
        this.loading = true;
        //列表数据获取
        return new Promise((resolve)=>{
          this.$post('/backend/Loan/loanList',params).then((d)=>{
            let res = d.data.list;
            this.Page.count = d.data.count;
            this.Page.cur = 1;
            this.Page.size = 20;
            this.RowUserData = res;
            this.UserData = this.TransText(res,'error_msg','无');
            that.loading = false;
            resolve();
          })
        })
      },
      /**
       * 转换空字符串
       * @param data 初始数据（object）
       * @param key 转换的键值（string）
       * @param val1 空对应的字符（string）
       * @returns data(object);
       */
      TransText(data,key,val1){
        data.forEach((val)=>{
          val[key] = (val[key] === '')?val1:val[key];
        });
        return data;
      },
      //刷新列表
      RefreshList(){
        this.ScreenData.key = '';
        this.ResetPageNum();
        this.InitData().then(()=>{
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
              //this.InitData();
            }else{
              this.$Message.error(d.message);
            }
          }).catch((err)=>{
            this.$Message.error('服务器繁忙，请稍后再试！');
          })
        })

      },
      //导出数据
      ExportData(){
        let sinfo = this.RemoveObserve(this.ScreenData);
        sinfo.expro = 1;
        this.UploadData('/backend/Loan/loanList',sinfo).then((url)=>{
            window.location.href = url;
        });
      },
      //改变页数
      ChangePage(curpage){
        let sinfo = Object.assign(this.ScreenData,{
          page: curpage,
          num: this.Page.size
        });
        this.InitData(sinfo).then(()=>{
          this.Page.cur = curpage;
        })
      },
      //改变显示条数
      ChangeSize(size){
        let sinfo = Object.assign(this.ScreenData,{
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
