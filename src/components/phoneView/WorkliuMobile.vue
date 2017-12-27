<template>
  <div id="workliu-mobile">
    <ul>
      <li v-for="item in Record"
          :key="item.id"
          :dataID="item.id"
          class="record-li"
          @touchmove="TouchMove"
          @touchstart="TouchStart"
          @click="HideRecord(item)">
        <h3 class="head-title">
          <span class="part">{{item.name}}</span>
          <span class="part">{{item.phone}}</span>
          <span class="part">{{item.jk_request_date}}</span>
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
          <div class="box">
            <p class="title">展期费用(元)</p>
            <p class="value fee">126</p>
          </div>
        </div>
        <p class="status-block">
          {{JudgeType(item.types)}}
        </p>
        <div class="delete-btn" @click="RejectOpt(item.id)">拒绝</div>
      </li>
    </ul>
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
      document.title = '工作信息流手机操作平台';
      document.body.style.background = 'rgb(235,234,241)';
      this.InitData();
    },
    methods:{
      InitData(){
        this.$post('/backend/Workliu/workliuList').then(d=>{
          this.Record = d.data.list;
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
      TouchMove(event){
        const moveX = event.changedTouches[0].pageX;
        const absX = moveX - this.PageX;

      },
      TouchStart(event){
        console.log(event);
        this.PageX = event.changedTouches[0].pageX;
      },
      HideRecord(event){
        console.log(event);
        return this.GetItem;
      },
      GetItem(item){
        console.log(item);
      },
      RejectOpt(){

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
      transition: 0.3s all linear;
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
        &.lime{
          background: #7cb305;
        }
        &.gold{
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
  }
</style>
