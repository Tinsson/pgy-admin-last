<template>
  <div id="consumer-details">
    <div class="info-box">
      <div class="head-info">
        <div class="text">
          <div class="avator">
            <img src="/static/images/avator.jpg" alt="">
          </div>
          <div class="text-box">
            <p class="text-line">
              <span class="text-label name">{{ UserData.name }}</span>
              <Icon type="male" color="#1FB5AD" size="18" v-if="UserData.sex === '男'"></Icon>
              <Icon type="female" color="#F8146F" size="18" v-if="UserData.sex === '女'"></Icon>
            </p>
            <p class="text-line">
              <span class="text-label">客户ID：</span>
              <span class="text-value">{{ CurId }}</span>
            </p>
            <!--<p class="text-line">
              <span class="text-label">微信号：</span>
              <span class="text-value">未关注</span>
            </p>-->
            <p class="text-line">
              <span class="text-label">手机号：</span>
              <span class="text-value">{{ UserData.phone }}</span>
            </p>
          </div>
        </div>
        <ul class="person">
          <li class="person-box">
            <p class="person-tit">审核员</p>
            <p class="person-text">{{ UserData.auditorId }}</p>
          </li>
          <li class="person-box">
            <p class="person-tit">催收员</p>
            <p class="person-text">{{ UserData.collectorId }}</p>
          </li>
        </ul>
      </div>
      <div class="center-info">
        <div class="center-nav">
          <router-link v-for="(item,index) in NavData"
                       class="link-area"
                       :key="index"
                       :class="{cur: item.cur}"
                       :to="item.path + `?id=${CurId}`">{{item.name}}</router-link>
        </div>
        <router-view></router-view>
      </div>
    </div>
    <!--<div class="side-box">
      <div class="side-card">
        <p class="side-tit">
          下载逾期报告
        </p>
        <div class="side-content">
          <img class="side-pic" src="../../assets/images/download.png" alt="">
          <a href="javascript:;" class="side-btn">下载</a>
        </div>
      </div>
      <div class="side-card">
        <p class="side-tit">
          客户大数据
        </p>
        <div class="side-content">
          <img class="side-pic" src="../../assets/images/download.png" alt="">
          <a href="javascript:;" class="side-btn">查看</a>
        </div>
      </div>
      <div class="side-card">
        <p class="side-tit">
          笔记（回车提交）
        </p>
        <div class="side-content">
          <img class="side-pic" src="../../assets/images/download.png" alt="">
          <a href="javascript:;" class="side-btn">写笔记</a>
        </div>
      </div>
    </div>-->
  </div>
</template>

<script>
  import { getLocal } from '@/util/util'

  export default {
    name: 'consumerDetails',
    data () {
      return {
        title: '用户详情',
        UserData: {},     //用户数据
        CurId: '',
        NavData: [{
            path: '/consumerDetails/BaseInfo',
            name: '基本信息',
            cur: false
          },{
            path: '/consumerDetails/ThirdParty',
            name: '第三方授权',
            cur: false
          },{
            path: '/consumerDetails/LendInfo',
            name: '借贷信息',
            cur: false
          },{
            path: '/consumerDetails/RelationInfo',
            name: '关联关系',
            cur: false
          },{
            path: '/consumerDetails/OptRecord',
            name: '操作记录',
            cur: false
          }
        ]
      }
    },
    created(){
      this.CurId = this.$route.query.id;
      if(this.CurId === undefined){

      }
      this.InitData();
      this.GetCur();
    },
    watch:{
      $route(){
          this.GetCur();
      }
    },
    methods: {
      GetCur(){
        this.NavData.forEach(val=>{
          val.cur = val.path === this.$route.path ?true:false;
        })
      },
      InitData(){
        const uid = this.CurId;
        this.$fetch('User/getInfo',{uid}).then((d)=>{
          this.UserData = d.data.jiben.info;
        });
      }
    }
  }
</script>


<style lang="less" scoped>
  @theme: #1FB5AD;
  @line: #E3E3E3;
  #consumer-details{
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0 auto;
    background: #f5f7f9;
  }
  .info-box{
    width: 100%;
    .head-info{
      width: 100%;
      padding: 15px 0;
      border: 1px solid @line;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      background: #FFF;
      .text{
        margin-left: 20px;
        font-size: 14px;
        color: #999;
        display: flex;
        flex-direction: row;
        .avator{
          width: 80px;
          height: 80px;
          margin-left: 50px;
          img{
            width: 100%;
            height: 100%;
            border-radius: 8px;
            object-fit: cover;
          }
        }
        .text-line{
          .text-label{
            display:inline-block;
            width: 100px;
            text-align: right;
            &.name{
              color: #000;
              padding-top: 10px;
              padding-right: 10px;
              font-weight: bold;
              font-size: 16px;
            }
          }
        }
      }
      .person{
        width: 180px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: 16px;
        margin-right: 50px;
        text-align: center;
        padding-top: 15px;
        font-weight: bold;
        .person-text{
          margin-top: 10px;
          font-weight: normal;
          font-size: 14px;
          color: #999;
        }
      }
    }
    .center-info{
      border: 1px solid @line;
      margin-top: 20px;
      background: #FFF;
      .center-nav{
        width: 100%;
        display: flex;
        flex-direction: row;
        .link-area{
          width: 20%;
          font-size: 16px;
          color: #333;
          text-align: center;
          border-left: 1px solid @line;
          border-bottom: 1px solid @line;
          line-height: 40px;
          &:first-child{
            border-left: none;
          }
          &.cur{
            border-bottom: 2px solid #3c8dbc;
          }
        }
      }
    }
  }
  .side-box{
    width: 300px;
    .side-card{
      width: 100%;
      margin-bottom: 20px;
      border: 1px solid @line;
      .side-tit{
        border-bottom: 1px solid @line;
        padding: 15px 20px;
        background-color: #F8F8F8;
        font-size: 16px;
        font-weight:normal;
      }
      .side-content{
        padding: 20px;
        text-align: center;
        .side-btn{
          display: block;
          font-size: 16px;
          color: #FFF;
          border-radius: 10px;
          padding: 10px 0;
          background: @theme;
        }
      }
    }
  }

</style>
