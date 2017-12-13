<template>
  <div id="generalize-detail">
    <h1 class="list-title">
      <span class="tit-text">{{ title }}渠道推广数据统计</span>
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
            <FormItem label="时间：">
              <DatePicker type="datetimerange"
                          placeholder="选择日期和时间"
                          format="yyyy-MM-dd HH:mm:ss"
                          placement="bottom-end"
                          :value="allTime"
                          @on-change="PickDate"
                          style="width: 280px"></DatePicker>
            </FormItem>
            <FormItem label="总人数：">
              <span class="count-span">{{CountAll.person}}</span>人
            </FormItem>
            <FormItem label="总金额：">
              <span class="count-span">{{CountAll.money}}</span>元
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

          </div>
        </div>
        <Table :columns="UserCol"
               :data="UserData"
               :loading="loading"></Table>
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
  import Clipboard from 'clipboard';

  export default {
    name: 'GeneralizeDetail',
    data () {
      return {
        title: '今日头条',
        apiUrl: '/backend/PromoteInfo/detail',
        loading: true,
        ClipBoard: {},
        CountAll:{
          person: 10,
          money: 20
        },
        allTime: [],
        //基础筛选数据
        ScreenData: {
          src: '',
          start_time: '',
          end_time: '',
          status: ''
        },
        UserCol: [
          {
            title: '日期',
            key: 'time'
          },{
            title: '注册数',
            key: 'register'
          },{
            title: '浏览数',
            key: 'browse'
          },{
            title: '转化人数',
            key: 'zhnum'
          },{
            title: '总金额',
            key: 'amount'
          },{
            title: '关注公众号数',
            key: 'wxsub'
          }
        ],
        UserData: [],     //表格数据
        SrcData: [],      //渠道数据
        BtnData: [],      //按钮数据
        //初始分页信息
        Page: {
          count: 0,
          cur: 1,
          size: 20,
        }
      }
    },
    created(){
      const src = this.$route.query.src;
      //this.InitData(this.apiUrl,{src});
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
      //二次获取数据
      SecondData(sinfo){
        return new Promise(resolve=>{
          this.$post('/backend/PromoteInfo/detail',sinfo).then(d=>{
            this.UserCol = d.data.field;
            this.UserData = d.data.list;
            this.Page.count = d.data.count;
            this.loading = false;
            resolve();
          })
        });
      },
      //查询结果
      SimpleSearch(sign = 1){
        let sinfo = this.RemoveObserve(this.ScreenData);
        if(sinfo.status === ''){
          this.$Message.error('当前为渠道列表，不具备筛选功能！');
          return false;
        }
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
        this.$fetch('/backend/PromoteInfo/topIndex',params).then(d=>{
          this.CountData.forEach(val=>{
            val.count = d.data[val.status];
          })
        });
        //列表数据获取
        return new Promise((resolve)=>{
          this.$post(url,params).then((d)=>{
            let res = d.data;
            this.Page.count = res.count;
            this.UserCol = res.field;
            this.UserData = res.list;
            this.SrcData = res.list;
            that.loading = false;
            resolve();
          })
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
      //改变页数
      ChangePage(curpage){
        let sinfo = Object.assign(this.ScreenData,{
          page: curpage,
          num: this.Page.size
        });
        this.InitData('/backend/PromoteInfo/detail',sinfo).then(()=>{
          this.Page.cur = curpage;
        })
      },
      //改变显示条数
      ChangeSize(size){
        let sinfo = Object.assign(this.ScreenData,{
          page: 1,
          num: size
        });
        this.InitData('/backend/PromoteInfo/detail',sinfo).then(()=>{
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
  .count-span{
    font-size: 18px;
    padding: 0 5px;
    color: #d7000f;
  }
</style>
