<template>
  <div id="statistical-index">
    <Row :gutter="20">
      <Col class="card-col" span="8">
        <router-link to="/statistical/statistiDetails">
          <Card>
            <h2 class="card-title">总注册数</h2>
            <p class="card-number">{{ CountData.TotalRegis }}</p>
            <div class="card-content">
              <p class="info-txt">
                <span class="half">
                  <span class="label">借款总人数</span>
                  <span class="value">{{ CountData.IndeLoanRen }}</span>
                </span>
                <span class="half">
                  <span class="label">人均借款金额</span>
                  <span class="value">{{ CountData.AveJiekuanAmoutnAll }}</span>
                </span>
              </p>
            </div>
            <div class="card-footer">
              <span>通过率</span>
              <span class="value">{{ CountData.throughRate }}</span>
              <span>放款率</span>
              <span class="value">{{ CountData.LoanRate }}</span>
            </div>
          </Card>
        </router-link>
      </Col>
      <Col class="card-col" span="8">
        <Card>
          <h2 class="card-title">借款总金额</h2>
          <p class="card-number">¥{{ CountData.LoanAmount }}</p>
          <div class="card-content">
            <p class="info-txt">
              <span class="half">
                <span class="label">借款总笔数</span>
                <span class="value">{{CountData.LoanBishu}}</span>
              </span>
            </p>
          </div>
          <div class="card-footer">
            <span>笔均借款金额</span>
            <span class="value">¥{{ CountData.AveJiekuanAmountD }}</span>
            <span>人均借款笔数</span>
            <span class="value">{{CountData.AveLoanRen}}</span>
          </div>
        </Card>
      </Col>
      <Col class="card-col" span="8">
        <Card>
          <h2 class="card-title">展期总金额</h2>
          <p class="card-number">¥{{ CountData.ZhanqiAllAmount }}</p>
          <div class="card-content">
            <p class="info-txt">
              <span class="half">
                <span class="label">展期总笔数</span>
                <span class="value">{{CountData.ZhanqiAllBishu}}</span>
              </span>
            </p>
          </div>
          <div class="card-footer">
            <span>展期费总金额</span>
            <span class="value">¥{{CountData.ZhanqiFeeAllAmount}}</span>
            <span>人均展期笔数</span>
            <span class="value">{{ CountData.AveZhqnqiBishuR }}</span>
          </div>
        </Card>
      </Col>
      <Col class="card-col" span="8">
        <Card>
          <h2 class="card-title">逾期总金额</h2>
          <p class="card-number">{{ CountData.LoanYuqiAmountAll }}</p>
          <div class="card-content">
            <p class="info-txt">
                <span class="half">
                  <span class="label">逾期总人数</span>
                  <span class="value">{{ CountData.LoanYuqiRenAll }}</span>
                </span>
            </p>
          </div>
          <div class="card-footer">
            <span>笔均逾期金额</span>
            <span class="value">{{ CountData.AveLoanYuqiAmount }}</span>
          </div>
        </Card>
      </Col>
      <Col class="card-col" span="8">
      <Card>
        <h2 class="card-title">笔数总逾期率</h2>
        <p class="card-number">{{ CountData.BishuYuqiReteAll }}</p>
        <div class="card-content">
          <p class="info-txt">
              <span>
                <span class="label">笔数逾期率（今年）</span>
                <span class="value">{{ CountData.BishuYuqiReteYear }}</span>
              </span>
          </p>
        </div>
        <div class="card-footer">
          <span></span>
          <span class="value"></span>
        </div>
      </Card>
      </Col>
      <Col class="card-col" span="8">
      <Card>
        <h2 class="card-title">金额总逾期率</h2>
        <p class="card-number">{{ CountData.AmountYuqiReteAll }}</p>
        <div class="card-content">
          <p class="info-txt">
              <span>
                <span class="label">金额逾期率（今年）</span>
                <span class="value">{{ CountData.AmountYuqiReteYear }}</span>
              </span>
          </p>
        </div>
        <div class="card-footer">
          <span></span>
          <span class="value"></span>
        </div>
      </Card>
      </Col>
    </Row>
    <Row :gutter="14" class="pie-box">
      <Col span="12">
        <Card>
          <p ref="PieTitle" class="chart-tit" slot="title">实时账户数据</p>
          <div class="count-all">
            <p class="single"><Icon class="icon" type="social-yen"></Icon><span class="text">在借金额：{{CountData.ThisAmount.ALL}}</span></p>
            <p class="single"><Icon class="icon" type="social-yen"></Icon><span class="text">逾期金额：{{CountData.ThisYuqiAmount.ALL}}</span></p>
            <p class="single"><Icon class="icon" type="ios-people"></Icon><span class="text">在借人数：{{CountData.ThisRenshu.ALL}}</span></p>
            <p class="single"><Icon class="icon" type="ios-people"></Icon><span class="text">逾期人数：{{CountData.ThisYuqiRenshu.ALL}}</span></p>
          </div>
          <div class="divide-box">
            <div class="side-part">
              <h3 class="sub-title">L</h3>
              <p class="line"><Icon class="icon" type="social-yen"></Icon>在借金额：{{CountData.ThisAmount.L}}</p>
              <p class="line"><Icon class="icon" type="ios-people"></Icon>在借人数：{{CountData.ThisRenshu.L}}</p>
              <p class="line"><Icon class="icon" type="social-yen"></Icon>逾期金额：{{CountData.ThisYuqiAmount.L}}</p>
              <p class="line"><Icon class="icon" type="ios-people"></Icon>逾期人数：{{CountData.ThisYuqiRenshu.L}}</p>
            </div>
            <div class="side-part">
              <h3 class="sub-title">Z</h3>
              <p class="line"><Icon class="icon" type="social-yen"></Icon>在借金额：{{CountData.ThisAmount.Z}}</p>
              <p class="line"><Icon class="icon" type="ios-people"></Icon>在借人数：{{CountData.ThisRenshu.Z}}</p>
              <p class="line"><Icon class="icon" type="social-yen"></Icon>逾期金额：{{CountData.ThisYuqiAmount.Z}}</p>
              <p class="line"><Icon class="icon" type="ios-people"></Icon>逾期人数：{{CountData.ThisYuqiRenshu.Z}}</p>
            </div>
          </div>
        </Card>
      </Col>
      <Col span="12">
        <Card>
          <p ref="BarTitle" class="chart-tit" slot="title">今日数据</p>
          <Row :gutter="10">
            <Col v-for="item in TodayCount" :key="item.tops" class="count-info" :span="12">
              <div class="record">
                <span class="icon-box"><Icon :type="item.icon"></Icon></span>
                <div class="info-box">
                  <p class="num">{{item.value}}</p>
                  <p class="tips">{{item.tips}}</p>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
  import { getLocal } from '@/util/util'

  export default {
    name: 'Statistical',
    data () {
      return {
        title: '统计首页',
        apiUrl: '/backend/Statistical/statiTrading',
        auth_id: '',
        loading: true,
        TodayCount:[{
          icon: 'clock',
          tips: '注册',
          value: '0'
        },{
          icon: 'ios-list',
          tips: '新增笔数',
          value: '0'
        },{
          icon: 'social-yen',
          tips: '放款金额',
          value: '0'
        },{
          icon: 'ios-list',
          tips: '放款笔数',
          value: '0'
        },{
          icon: 'social-yen',
          tips: '展期金额',
          value: '0'
        },{
          icon: 'ios-list',
          tips: '展期笔数',
          value: '0'
        },{
          icon: 'social-yen',
          tips: '展期费',
          value: '0'
        },{
          icon: 'ios-list',
          tips: '还款笔数',
          value: '0'
        }],
        CountData: {
          TotalRegis: 0,
          LoanAmount: 0,
          RequestLoanBishu: 0,
          HuankuanAllAmount: 0,
          HuankuanBishu: 0,
          ZhanqiAllAmount: 0,
          IdcardNum: 0,
          LivingNum: 0,
          BindCardNum: 0,
          AveJiekuanAmountD: 0,
          ThisAmount:{
            ALL: '',
            L: '',
            Z: ''
          },
          ThisYuqiAmount:{
            ALL: '',
            L: '',
            Z: ''
          },
          ThisRenshu: {
            ALL: '',
            L: '',
            Z: ''
          },
          ThisYuqiRenshu:{
            ALL: '',
            L: '',
            Z: ''
          }
        }
      }
    },
    created(){
      this.auth_id = getLocal('auth_id');
    },
    mounted(){
      this.InitData(this.apiUrl).then(()=>{
        console.log(this.CountData);
      });
    },
    computed: {
      AveLoan(){
        let res = this.CountData.LoanAmount / this.CountData.RequestLoanBishu;
        return res.toFixed(2);
      },
      AveRepay(){
        let res = this.CountData.HuankuanAllAmount / this.CountData.HuankuanBishu
        return res.toFixed(2);
      }
    },
    methods: {
      //初始化数据
      InitData(url,params = {}){
        this.loading = true;
        /*this.$post('/backend/Statistical/statiTrading').then((d)=>{
          this.CountData = Object.assign(this.CountData,d.data);
        });*/
        //列表数据获取
        return new Promise((resolve)=>{
          this.$post(url,params).then((d)=>{
            let res = d.data;
            this.CountData = Object.assign(this.CountData,res);
            this.TodayCount[0].value = this.CountData.DayReg;
            this.TodayCount[1].value = this.CountData.DayNewBishu;
            this.TodayCount[2].value = this.CountData.DayLoanAmount;
            this.TodayCount[3].value = this.CountData.DayLoanBishu;
            this.TodayCount[4].value = this.CountData.DayZhanqiAmount;
            this.TodayCount[5].value = this.CountData.DayZhanqiBishu;
            this.TodayCount[6].value = this.CountData.DayZhanqiFee;
            this.TodayCount[7].value = this.CountData.DayHuankuanBishu;
            this.loading = false;
            resolve();
          })
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .card-col{
    padding-bottom: 10px;
  }
  .card-title{
    color: rgba(0, 0, 0, 0.45);
    font-weight: normal;
    font-size: 16px;
    line-height: 22px;
  }
  .card-number{
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
    color: rgba(0, 0, 0, 0.85);
    margin-top: 4px;
    margin-bottom: 0;
    font-size: 32px;
    line-height: 38px;
    height: 38px;
  }
  .card-content{
    margin-bottom: 12px;
    position: relative;
    width: 100%;
    height: 42px;
    .info-txt{
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      display: flex;
      flex-direction: row;
      .half{
        width: 50%;
        color: #333;
        .value{
          margin-left:8px;
        }
      }
    }
  }
  .card-footer{
    border-top: 1px solid #e8e8e8;
    padding-top: 9px;
    margin-top: 8px;
    color: rgba(0, 0, 0, 0.65);
    font-size: 12px;
    .value{
      margin: 0 8px;
      color: rgba(0, 0, 0, 0.85);
    }
  }
  .pie-box{
    margin-top: 10px;
  }
  .chart-tit{
    width: 100%;
    font-size: 18px;
  }
  .count-all{
    width: 100%;
    border: 1px solid #e3e3e3;
    padding: 10px;
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .single{
      width: 50%;
      display: block;
      font-size: 14px;
      padding-bottom: 10px;
      .icon{
        font-size: 40px;
        padding: 0 8px;
        color: #259bf1;
      }
      .text{
        display: inline-block;
        margin-bottom: 5px;
      }
    }
  }
  .divide-box{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin-top: 16px;
    .side-part{
      width: 48%;
      border: 1px solid #e3e3e3;
      padding: 10px;
      border-radius: 5px;
      .sub-title{
        font-size: 20px;
        padding: 0 0 10px 10px;
      }
      .line{
        font-size: 14px;
        padding-bottom: 5px;
        text-align: center;
        .icon{
          font-size: 40px;
          padding: 0 8px;
          color: #259bf1;
        }
      }
    }
  }
  .chart-out{
    display: inline-block;
  }
  .count-info{
    padding: 0 10px;
    .record{
      padding-top: 10px;
      border-bottom: 2px solid #e3e3e3;
      .icon-box{
        width: 60px;
        margin-bottom: -2px;
        display: inline-block;
        height: 60px;
        text-align: center;
        font-size: 40px;
        color: #259bf1;
        border-bottom: 2px solid #259bf1;
      }
      .info-box{
        display: inline-block;
        padding-left: 20px;
        .num{
          font-size: 20px;
        }
      }
    }
  }
</style>
