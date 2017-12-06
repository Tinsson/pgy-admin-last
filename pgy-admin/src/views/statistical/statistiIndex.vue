<template>
  <div id="statistical-index">
    <Row :gutter="20">
      <Col span="6">
        <Card>
          <h2 class="card-title">总注册数</h2>
          <p class="card-number">{{ CountData.TotalRegis }}</p>
          <div class="card-content">
            <p class="info-txt">
              <span class="half">
                <span class="label"></span>
                <span class="value"></span>
              </span>
            </p>
          </div>
          <div class="card-footer">
            <span>总绑卡数</span>
            <span class="value">{{ CountData.BindCardNum }}</span>
          </div>
        </Card>
      </Col>
      <Col span="6">
        <Card>
          <h2 class="card-title">借款总金额</h2>
          <p class="card-number">¥{{ CountData.LoanAmount }}</p>
          <div class="card-content">
            <p class="info-txt">
              <span class="half">
                <span class="label">借款总笔数</span>
                <span class="value">{{CountData.RequestLoanBishu}}</span>
              </span>
            </p>
          </div>
          <div class="card-footer">
            <span>借款平均金额</span>
            <span class="value">¥{{ AveLoan }}</span>
          </div>
        </Card>
      </Col>
      <Col span="6">
        <Card>
          <h2 class="card-title">还款总金额</h2>
          <p class="card-number">¥{{ CountData.HuankuanAllAmount }}</p>
          <div class="card-content">
            <p class="info-txt">
                <span class="half">
                  <span class="label">还款总笔数</span>
                  <span class="value">{{CountData.HuankuanBishu}}</span>
                </span>
            </p>
          </div>
          <div class="card-footer">
            <span>还款平均金额</span>
            <span class="value">¥{{AveRepay}}</span>
          </div>
        </Card>
      </Col>
      <Col span="6">
        <Card>
          <h2 class="card-title">展期总金额</h2>
          <p class="card-number">¥{{ CountData.ZhanqiAllAmount }}</p>
          <div class="card-content">
            <p class="info-txt">

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
      <Col span="13">
        <Card>
          <p ref="PieTitle" class="chart-tit" slot="title">身份证识别及活体识别</p>
          <div id="pieChart1" class="chart-out" :style="{width: PieWidth+'px',height: PieWidth+'px'}"></div>
          <div id="pieChart2" class="chart-out" :style="{width: PieWidth+'px',height: PieWidth+'px'}"></div>
        </Card>
      </Col>
      <Col span="11">
        <Card>
          <p ref="BarTitle" class="chart-tit" slot="title">第三方认证</p>
          <div id="BarChart" :style="{width: BarWidth+'px',height: PieWidth+'px'}"></div>
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
        apiUrl: 'Statistical/statiIndex',
        auth_id: '',
        loading: true,
        CountData: {
          TotalRegis: 0,
          LoanAmount: 0,
          RequestLoanBishu: 0,
          HuankuanAllAmount: 0,
          HuankuanBishu: 0,
          ZhanqiAllAmount: 0,
          IdcardNum: 0,
          LivingNum: 0,
          BindCardNum: 0
        },
        PieWidth: '',
        PieOption1:{
          title : {
            text: '身份证识别比例',
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
            data: ['识别','未识别']
          },
          series : [
            {
              name: '识别情况',
              type: 'pie',
              radius : '55%',
              center: ['50%', '60%'],
              data:[
                {value: 2, name:'识别', itemStyle:{normal:{color:'rgb(106,164,231)'}}},
                {value: 10, name:'未识别', itemStyle:{normal:{color:'rgb(239,145,74)'}}}
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
            text: '活体识别比例',
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
            data: ['识别','未识别']
          },
          series : [
            {
              name: '识别情况',
              type: 'pie',
              radius : '55%',
              center: ['50%', '60%'],
              data:[
                {value: 0, name:'识别', itemStyle:{normal:{color:'rgb(108,108,227)'}}},
                {value: 0, name:'未识别', itemStyle:{normal:{color:'rgb(231,66,72)'}}}
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
        BarWidth: '',
        BarOption:{
          title : {
            text: '第三方认证情况一览表',
            subtext: '',
            x:'center'
          },
          color: ['#3398DB'],
          tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis : [
            {
              type : 'category',
              data : ['运营商认证', '反欺诈认证', '芝麻认证', '淘宝认证', '微信认证'],
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis : [
            {
              type : 'value'
            }
          ],
          series : [
            {
              name:'认证数',
              type:'bar',
              barWidth: '60%',
              data:[0, 0, 0, 0,0]
            }
          ]
        }
      }
    },
    created(){
      this.auth_id = getLocal('auth_id');
    },
    mounted(){
      this.PieWidth = (this.$refs['PieTitle'].offsetWidth / 2) - 10;
      this.BarWidth = (this.$refs['BarTitle'].offsetWidth);
      this.InitData(this.apiUrl);
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
        //列表数据获取
        return new Promise((resolve)=>{
          this.$post(url,params).then((d)=>{
            let res = d.data;
            this.PieOption1.series[0].data[0].value = res.IdcardNum;
            this.PieOption1.series[0].data[1].value = res.TotalRegis - res.IdcardNum;
            this.PieOption2.series[0].data[0].value = res.LivingNum;
            this.PieOption2.series[0].data[1].value = res.TotalRegis - res.LivingNum;
            this.BarOption.series[0].data[0] = res.YunyingsAuditNum;
            this.BarOption.series[0].data[1] = res.FraudNum;
            this.BarOption.series[0].data[2] = res.ZmopNum;
            this.BarOption.series[0].data[3] = res.TaobaoNum;
            this.BarOption.series[0].data[4] = res.WechatNum;
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
        let BarChart = this.$echarts.init(document.getElementById('BarChart'));
        PieChart1.setOption(this.PieOption1);
        PieChart2.setOption(this.PieOption2);
        BarChart.setOption(this.BarOption);
      }
    }
  }
</script>


<style lang="less" scoped>
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
    color: rgba(0, 0, 0, 0.65);
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
