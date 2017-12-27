<template>
  <div id="workliu-mobile">
    <ul>
      <li v-for="item in Record"
          :key="item.id"
          class="record-li"
          :class="{active: item.active}"
          @touchmove="TouchMove(item.id, $event)"
          @touchstart="TouchStart">
        <div class="out-box" @click="HideRecord(item.id)">
          <h3 class="head-title">
            <span class="part">{{item.name}}</span>
            <span class="part">{{item.phone}}</span>
            <span class="part">{{CalcJkdate(item)}}</span>
          </h3>
          <div class="sub-data">
            <div class="box">
              <p class="title">{{JudgeType(item.types)}}金额(元)</p>
              <P class="value amount">{{item.jk_amount}}</P>
            </div>
            <div class="box">
              <p class="title">时间(天)</p>
              <p class="value time">7</p>
            </div>
            <!--<div class="box">
              <p class="title">展期费用(元)</p>
              <p class="value fee">126</p>
            </div>-->
          </div>
          <p class="status-block" :class="`type${item.types}`">
            {{JudgeType(item.types)}}
          </p>
        </div>
        <div class="delete-btn" @click="RejectOpt(item)">拒绝</div>
      </li>
    </ul>
    <div class="no-data" v-if="Record.length === 0">
      暂无数据
    </div>
  </div>
</template>

<script>
  import router from '@/router'

  export default {
    name: 'WorkliuMobile',
    data () {
      return{
        PageX: 0,
        Record:[]
      }
    },
    created(){
      const url = this.$route.query.admin_url;
      const token = this.$getLocal('token');
      if(url){
        if(token){
          document.title = '工作信息流手机操作平台';
          document.body.style.background = 'rgb(235,234,241)';
          this.InitData();
        }else{
          const params = this.$route.query;
          router.push({path: '/login',query: params});
        }
      }
    },
    methods:{
      InitData(){
        this.$post('/backend/Workliu/workliuList').then(d=>{
          this.Record = d.data.list;
          this.Record.forEach(val=>{
            val.active = false;
          })
        })
      },
      JudgeType(types){
        let text = '';
        switch(types){
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
        return text;
      },
      TouchMove(id,event){
        const moveX = event.changedTouches[0].pageX;
        const absX = moveX - this.PageX;
        if(absX < -50){
          this.Swiper(id);
        }
      },
      TouchStart(event){
        this.PageX = event.changedTouches[0].pageX;
      },
      HideRecord(id){
        this.Swiper(id, false);
      },
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
        if(confirm(tips)){
          this.$post(url,{jid: row.id,status: -1}).then((d)=>{
            if(d.status === 1){
              this.$Message.success(d.message);
              this.InitData();
            }else{
              this.$Message.error(d.message);
            }
          });
        }
      },
      Swiper(id,sign = true){
        this.Record.forEach((val,index)=>{
          if(val.id === id){
            this.$set(this.Record, index, Object.assign(val,{active: sign}));
          }else{
            this.$set(this.Record, index, Object.assign(val,{active: false}));
          }
        });
      },
      CalcJkdate(row){
        return (row.zqid > 0)?row.zq_request_date:row.jk_request_date;
      }
    }
  }
</script>

<style lang="less" scoped>
  #workliu-mobile{
    width: 100vw;
    overflow: hidden;
    /*background: rgb(200,200,204);*/
    .record-li{
      width: 100vw;
      position: relative;
      margin-bottom: 15px;
      padding-left: 5vw;
      background: #FFF;
      border-top: 1px solid #e3e3e3;
      border-bottom: 1px solid #e3e3e3;
      transition: 0.3s all ease-in-out;
      &.active{
        margin-left: -80px;
      }
      .head-title{
        padding: 8px 0;
        font-size: 13px;
        color: #333;
        border-bottom: 1px solid #e3e3e3;
        .part{
          display: inline-block;
          padding: 0 6px;
        }
      }
      .sub-data{
        display: flex;
        flex-direction: row;
        padding: 10px 0;
        .box{
          padding: 0 20px 0 6px;
          .title{
            color: #999;
            font-size: 12px;
          }
          .value{
            font-size: 18px;
            &.amount{
              color: #f1693f;
            }
            &.time{
              color: #333;
            }
            &.fee{
              color: #777;
            }
          }
        }
      }
      .status-block{
        display: block;
        position: absolute;
        bottom: 0;
        right: 0;
        width: 65px;
        height: 65px;
        line-height: 65px;
        font-size: 14px;
        text-align: center;
        color: #FFF;
        background: #096dd9;
        &.type2{
          background: #7cb305;
        }
        &.type3{
          background: #d48806;
        }
      }
      .delete-btn{
        position: absolute;
        display: block;
        top: 0;
        right: -80px;
        width: 80px;
        height: 101px;
        line-height: 101px;
        font-size: 17px;
        color: #FFF;
        text-align: center;
        background: #F00;
      }
    }
    .no-data{
      text-align: center;
      font-size: 16px;
      color: #333;
      line-height: 50px;
    }
  }
</style>
