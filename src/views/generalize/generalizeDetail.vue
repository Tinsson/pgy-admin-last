<template>
  <div id="generalize-detail">
    <h1 class="list-title">
      <span class="tit-text">{{ title }}详情数据</span>
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
            <!--<FormItem label="渠道：">
              <Select v-model="ScreenData.src" style="width: 150px">
                <Option v-for="item in SrcData" :value="item.id" :key="item.id">{{ item.title }}</Option>
              </Select>
            </FormItem>-->
            <FormItem label="时间：">
              <DatePicker type="datetimerange"
                          placeholder="选择日期和时间"
                          format="yyyy-MM-dd HH:mm:ss"
                          placement="bottom-end"
                          :value="allTime"
                          @on-change="PickDate"
                          style="width: 280px"></DatePicker>
            </FormItem>
            <!--
            <FormItem label="总人数：">
              <span class="count-span">{{CountAll.person}}</span>人
            </FormItem>
            <FormItem label="总金额：">
              <span class="count-span">{{CountAll.money}}</span>元
            </FormItem>
            -->
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
        title: '',
        apiUrl: '/backend/PromoteInfo/detail',
        loading: true,
        ClipBoard: {},
        CountAll:{
          person: 10,
          money: 20
        },
        allTime: [],
        //统计数据
        CountData: [{
          name: '今日注册',
          icon: 'android-calendar',
          count: 0,
          cunit: '人',
          second: false,
          status: 'DAYREG',
          cur: true
        },{
          name: '本月注册',
          icon: 'calendar',
          count: 0,
          cunit: '人',
          second: false,
          status: 'MONTHREG',
          cur: false
        },{
          name: '今日转化',
          icon: 'android-calendar',
          count: 0,
          cunit: '笔',
          second: true,
          other: '0',
          ounit: '元',
          status: 'DAYZH',
          cur: false
        },{
          name: '历史转化',
          icon: 'android-time',
          count: 0,
          cunit: '笔',
          second: true,
          other: '0',
          ounit: '元',
          status: 'HISTORYZH',
          cur: false
        },{
          name: '已在公众号注册',
          icon: 'pie-graph',
          count: 0,
          second: false,
          status: 'REGISTER',
          cur: false
        },{
          name: '未检测到注册',
          icon: 'help-circled',
          count: 0,
          second: false,
          status: 'NO_REGISTER'
        },{
          name: '注册并关注公众号数',
          icon: 'pie-graph',
          count: 0,
          second: false,
          status: 'REGISTERED',
          cur: false
        }],
        //基础筛选数据
        ScreenData: {
          src: '',
          start_time: '',
          end_time: '',
          status: 'DAYREG'
        },
        UserCol: [
          {
            title: '序号',
            key: 'id'
          },{
            title: '注册时间',
            key: 'time'
          },{
            title: '电话',
            key: 'phone'
          },{
            title: 'ip',
            key: 'ip'
          },{
            title: '终端',
            key: 'zhrate'
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
        },
        //首页暂存区
        IndexStash:{
          Show: false,
          Col: [],
          Data: []
        }
      }
    },
    created(){
      const src = this.$route.query.src;
      this.ScreenData.src = src;
      this.InitData(this.apiUrl,{src});
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
      //统计列表
      CountList(status){
        this.loading = true;
        this.ScreenData.status = status;
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
        this.$fetch('/backend/PromoteInfo/topIndex',params).then(d=>{
          this.title = d.data.SRC;
          this.CountData.forEach(val=>{
            if(val.second){
              val.count = d.data[val.status].count;
              val.other = d.data[val.status].allamount;
            }else{
              val.count = d.data[val.status];
            }
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
