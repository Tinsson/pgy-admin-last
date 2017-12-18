<template>
  <div id="statistical-trading">
    <Card class="card-all">
      <h1 slot="title">借款统计</h1>
      <Row>
        <Col span="8">
          <h2 class="card-title">借款总金额</h2>
          <p class="card-number red">¥{{ CountData.LoanAmount }}</p>
          <div class="card-content">
            <p class="info-txt">
              <span class="label">借款总笔数</span>
              <span class="value">{{CountData.RequestLoanBishu}}</span>
            </p>
          </div>
        </Col>
        <Col span="8">
          <h2 class="card-title">申请借款总笔数</h2>
          <p class="card-number blue">¥{{ CountData.RequestLoanBishu }}</p>
          <div class="card-content">
            <p class="info-txt">
              <span class="label">独立借款人</span>
              <span class="value">{{CountData.IndeLoanRen}}</span>
            </p>
          </div>
        </Col>
        <Col span="8">
        <h2 class="card-title">续借总金额</h2>
        <p class="card-number cyan">¥{{ CountData.XujieAmount }}</p>
        <div class="card-content">
          <p class="info-txt">
            <span class="label">续借人数</span>
            <span class="value">{{CountData.XujieRen}}</span>
          </p>
        </div>
        </Col>
      </Row>
      <div class="card-footer">
        <p class="third">
          <span>平均借款金额</span>
          <span class="value">{{ CountData.AveJiekuanAmountD }}/单</span>
          <span class="value">{{ CountData.AveJiekuanAmountT }}/天</span>
        </p>
        <p class="third">
          <span>平均借款订单申请数</span>
          <span class="value">{{ CountData.AveJiekuanRequestT }}/天</span>
        </p>
        <p class="third">
          <span>平均借款订单通过数</span>
          <span class="value">{{ CountData.AveJiekuanOkT }}/天</span>
        </p>
      </div>
    </Card>
    <Card class="card-all">
      <p ref="PieTitle" class="chart-tit" slot="title">借款申请及通过数统计</p>
      <div id="pieChart1" class="chart-out" :style="{width: PieWidth+'px',height: PieWidth+'px'}"></div>
      <div id="pieChart2" class="chart-out" :style="{width: PieWidth+'px',height: PieWidth+'px'}"></div>
    </Card>
    <Card class="card-all">
      <h1 slot="title">还款统计</h1>
      <Row>
        <Col span="12">
        <h2 class="card-title">还款总金额</h2>
        <p class="card-number red">¥{{ CountData.HuankuanAllAmount }}</p>
        <div class="card-content">
          <p class="info-txt">
            <span class="label">还款总次数</span>
            <span class="value">{{CountData.HuankuanOkBishu}}</span>
          </p>
        </div>
        </Col>
        <Col span="12">
        <h2 class="card-title">未还款总金额</h2>
        <p class="card-number cyan">¥{{ CountData.NotHuankuanAllAmount }}</p>
        <div class="card-content">
          <p class="info-txt">
            <span class="label">未还总笔数</span>
            <span class="value">{{CountData.NotHuankuanAllBishu}}</span>
          </p>
        </div>
        </Col>
      </Row>
      <div class="card-footer">
        <p class="half">
          <span>平均还款金额</span>
          <span class="value">{{ CountData.AveHuankuanAmountD }}/单</span>
          <span class="value">{{ CountData.AveHuankuanAmountT }}/天</span>
        </p>
        <p class="half">
          <span>平均还款笔数</span>
          <span class="value">{{ CountData.AveHuankuanBishuT }}/天</span>
        </p>
      </div>
    </Card>
    <Card>
      <h1 slot="title">展期统计</h1>
      <Row>
        <Col span="12">
        <h2 class="card-title">展期总金额</h2>
        <p class="card-number red">¥{{ CountData.ZhanqiAllAmount }}</p>
        <div class="card-content">
          <p class="info-txt">
            <span class="label">展期总笔数</span>
            <span class="value">{{CountData.ZhanqiAllBishu}}</span>
          </p>
        </div>
        </Col>
        <Col span="12">
        <h2 class="card-title">展期费总金额</h2>
        <p class="card-number blue">¥{{ CountData.ZhanqiFeeAllAmount }}</p>
        <div class="card-content">
        </div>
        </Col>
      </Row>
      <div class="card-footer">
        <p class="half">
          <span>平均展期金额</span>
          <span class="value">{{ CountData.AveZhanqiAmountB }}/单</span>
          <span class="value">{{ CountData.AveZhanqiAmountT }}/天</span>
        </p>
        <p class="half">
          <span>平均展期笔数</span>
          <span class="value">{{ CountData.AveZhanqiBishuT }}/天</span>
        </p>
      </div>
    </Card>
  </div>
</template>

<script>
  import { getLocal } from '@/util/util'

  export default {
    name: 'StatiTrading',
    data () {
      return {
        title: '交易信息',
        apiUrl: '/backend/Statistical/statiTrading',
        loading: true,
        CountData: {
          AveHuankuanAmountD: "523.42",
          AveHuankuanAmountT: "2093.67",
          AveHuankuanBishuT: "4.00",
          AveJiekuanAmountD: "687.62",
          AveJiekuanAmountT: "1833.67",
          AveJiekuanOkT: "2.67",
          AveJiekuanRequestT: "3.00",
          AveZhanqiAmountB: "616.67",
          AveZhanqiAmountT: "1233.33",
          AveZhanqiBishuT: "2.00",
          BabaiShangOk: 3,
          BabaiShangRequest: 3,
          BabaiXiaOk: 5,
          BabaiXiaRequest: 6,
          HuankuanAllAmount: "6281.00",
          HuankuanBishu: 14,
          HuankuanOkBishu: 12,
          IndeLoanRen: 3,
          LoanAmount: "5501.00",
          LoanBishu: 8,
          NotHuankuanAllAmount: 2,
          NotHuankuanAllBishu: 2,
          RequestLoanBishu: 9,
          XujieAmount: null,
          XujieRen: 0,
          ZhanqiAllAmount: "3700.00",
          ZhanqiAllBishu: 6,
          ZhanqiFeeAllAmount: "232.29"
        },
        PieWidth: '',
        PieOption1:{
          title : {
            text: '借款申请统计',
            subtext: '',
            x:'center'
          },
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['800分以下','800分以上']
          },
          series : [
            {
              name: '申请情况',
              type: 'pie',
              radius : '55%',
              center: ['50%', '60%'],
              data:[
                {value: 2, name:'800分以下', itemStyle:{normal:{color:'rgb(106,164,231)'}}},
                {value: 10, name:'800分以上', itemStyle:{normal:{color:'rgb(239,145,74)'}}}
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        },
        PieOption2:{
          title : {
            text: '借款通过统计',
            subtext: '',
            x:'center'
          },
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['800分以下','800分以上']
          },
          series : [
            {
              name: '通过情况',
              type: 'pie',
              radius : '55%',
              center: ['50%', '60%'],
              data:[
                {value: 0, name:'800分以下', itemStyle:{normal:{color:'rgb(108,108,227)'}}},
                {value: 0, name:'800分以上', itemStyle:{normal:{color:'rgb(231,66,72)'}}}
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
      }
    },
    mounted(){
      this.PieWidth = (this.$refs['PieTitle'].offsetWidth / 2) - 10;
      this.InitData(this.apiUrl);
    },
    methods: {
      //初始化数据
      InitData(url,params = {}){
        this.loading = true;
        //列表数据获取
        return new Promise((resolve)=>{
          this.$post(url,params).then((d)=>{
            let res = d.data;
            this.PieOption1.series[0].data[0].value = res.BabaiXiaRequest;
            this.PieOption1.series[0].data[1].value = res.BabaiShangRequest;
            this.PieOption2.series[0].data[0].value = res.BabaiXiaOk;
            this.PieOption2.series[0].data[1].value = res.BabaiShangOk;
            this.DrawChart();
            this.CountData = res;
            this.loading = false;
            resolve();
          })
        })
      },
      DrawChart(){
        let PieChart1 = this.$echarts.init(document.getElementById('pieChart1'));
        let PieChart2 = this.$echarts.init(document.getElementById('pieChart2'));
        PieChart1.setOption(this.PieOption1);
        PieChart2.setOption(this.PieOption2);
      }
    }
  }
</script>


<style lang="less" scoped>
  .card-all{
    margin-bottom: 10px;
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
    font-size: 34px;
    line-height: 38px;
    height: 38px;
    &.red{
      color:rgb(231,66,102);
    }
    &.yellow{
      color: rgb(247,202,66);
    }
    &.cyan{
      color: rgb(80,194,191);
    }
    &.blue{
      color: rgb(53,138,245);
    }
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
      width: 50%;
      display: flex;
      flex-direction: row;
      .value{
        margin-left:8px;
      }
    }
  }
  .card-footer{
    border-top: 1px solid #e8e8e8;
    padding-top: 9px;
    margin-top: 8px;
    width: 100%;
    color: rgba(0, 0, 0, 0.65);
    display: flex;
    flex-direction: row;
    p{
      display: inline-block;
      &.third{
        width: 33.33333333%;
      }
      &.half{
        width: 50%;
      }
    }
    .value{
      margin-left: 8px;
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
  .chart-out{
    display: inline-block;
  }
</style>
