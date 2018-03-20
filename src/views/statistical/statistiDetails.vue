<template>
  <div id="statistical-details">
    <Card class="card-all">
      <div ref="BarTitle" class="chart-tit" slot="title">
        <span class="tit-text">统计详情</span>
        <div class="right-side">
          <Button type="primary" icon="android-arrow-back" @click="BackCountCenter">返回统计中心</Button>
          <DatePicker type="year" style="width: 120px" v-show="IsSingle" :value="CurrentYear" placement="bottom-end" @on-change="pickYear"></DatePicker>
          <DatePicker type="month" style="width: 120px" v-show="!IsSingle" :value="CurrentMonth" placement="bottom-end" @on-change="pickMonth"></DatePicker>
        </div>
      </div>
      <div class="chart-out">
        <span class="count-all" v-show="!IsSingle">总计：{{BarText1}}</span>
        <div id="BarChart1" class="chart-box" :style="{width: BarWidth+'px'}"></div>
      </div>
      <div class="chart-out" v-show="!IsSingle">
        <span class="count-all">总计：{{BarText2}}</span>
        <div id="BarChart2" class="chart-box" :style="{width: BarWidth+'px'}"></div>
      </div>
      <div class="chart-out" v-show="HasThird && !IsSingle">
        <span class="count-all">总计：{{BarText3}}</span>
        <div id="BarChart3" class="chart-box" :style="{width: BarWidth+'px',height: ThirdH}"></div>
      </div>
    </Card>
  </div>
</template>

<script>
  import { getLocal } from '@/util/util'

  export default {
    name: 'StatisticalDetail',
    data () {
      return {
        title: '统计详情',
        loading: false,
        apiUrl: '/backend/Statistical/staticinfo',
        CountType: '',
        CountData: {},
        IsSingle: false,
        ThirdH: '300px',
        HasThird: false,
        CurrentMonth: '',
        CurrentYear: '',
        BarWidth: '',
        BarText1: '0',
        BarText2: '0',
        BarText3: '0',
        BarOption1:{
          title : {
            text: '总金额',
            subtext: '',
            x:'center'
          },
          color: ['#358AF5','#13c2c2'],
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
              data : ['2017-06', '2017-07', '2017-08', '2017-09', '2017-10', '2017-11', '2017-12'],
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
              name:'',
              type:'bar',
              data:[2, 3, 4, 5, 6, 7, 8]
            }
          ]
        },
        BarOption2:{
          title : {
            text: '总人数',
            subtext: '',
            x:'center'
          },
          color: ['#fa8c16','#722ed1'],
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
              data : ['2017-06', '2017-07', '2017-08', '2017-09', '2017-10', '2017-11', '2017-12'],
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
              name:'',
              type:'bar',
              data:[0, 0, 0, 0, 0, 0, 0]
            }
          ]
        },
        BarOption3:{
          title : {
            text: '注册人数',
            subtext: '',
            x:'center'
          },
          color: ['#13c2c2'],
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
              data : ['2017-06', '2017-07', '2017-08', '2017-09', '2017-10', '2017-11', '2017-12'],
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
              name:'',
              type:'bar',
              barWidth: '60%',
              data:[0, 0, 0, 0, 0, 0, 0]
            }
          ]
        }
      }
    },
    mounted(){
      this.CountType = this.$route.query.type;
      const now = new Date();
      this.CurrentMonth = `${now.getFullYear()}-${now.getMonth()+1}`;

      this.CurrentYear = `${now.getFullYear()}`;
      this.Distinguish();
      this.BarWidth = this.$refs['BarTitle'].offsetWidth;
    },
    methods: {
      //初始化数据
      InitData(url,params = {}){
        this.loading = true;
        //列表数据获取
        return new Promise((resolve)=>{
          this.$post(url,params).then((d)=>{
            let res = d.data;
            resolve(res);
          })
        })
      },
      MonthNum(m){
        if(parseInt(m) < 10){
          return '0' + String(parseInt(m));
        }else{
          return m;
        }
      },
      DrawChart(){
        let BarChart1 = this.$echarts.init(document.getElementById('BarChart1'));
        let BarChart2 = this.$echarts.init(document.getElementById('BarChart2'));
        BarChart1.setOption(this.BarOption1, true);
        BarChart2.setOption(this.BarOption2);
        if(this.HasThird){
          let BarChart3 = this.$echarts.init(document.getElementById('BarChart3'));
          BarChart3.setOption(this.BarOption3);
        }
      },
      Distinguish(){
        switch(this.CountType){
          case 'registried':
            this.InitReg();
            break;
          case 'loan':
            this.InitLoan();
            break;
          case 'delay':
            this.InitDelay();
            break;
          case 'overdue':
            this.InitOverDue();
            break;
          case 'bishu':
            this.InitBishu();
            break;
          case 'amount':
            this.InitAmount();
            break;
        }
      },
      //注册统计
      InitReg(){
        this.BarOption1.title.text = '注册总人数';
        this.BarOption2.title.text = '通过数';
        this.ThirdH = '0px';
        let params = {
          status: 'reg',
          y: this.CurrentMonth.split('-')[0],
          m: this.MonthNum(this.CurrentMonth.split('-')[1])
        };
        this.InitData(this.apiUrl,params).then(res=>{
          this.BarText1 = res.regAll;
          this.BarText2 = res.passALl;
          this.BarOption1.xAxis[0].data = Object.keys(res.data);
          this.BarOption2.xAxis[0].data = Object.keys(res.data);
          this.BarOption1.series[0].data = Object.values(res.data);
          this.BarOption2.series[0].data = Object.values(res.data_);
          this.DrawChart();
        });
      },
      //借款统计
      InitLoan(){
        this.BarOption1.title.text = '借款总金额';
        this.BarOption2.title.text = '借款总笔数';
        this.ThirdH = '0px';
        let params = {
          status: 'loan',
          y: this.CurrentMonth.split('-')[0],
          m: this.MonthNum(this.CurrentMonth.split('-')[1])
        };
        this.InitData(this.apiUrl,params).then(res=>{
          this.BarText1 = res.amountAll;
          this.BarText2 = res.countAll;
          this.BarOption1.title.subtext = '当月新增总金额：' + res.newAmountAll;
          this.BarOption2.title.subtext = '当月新增总笔数：' + res.newCountAll;
          this.BarOption1.xAxis[0].data = Object.keys(res.data);
          this.BarOption2.xAxis[0].data = Object.keys(res.data);
          this.BarOption1.series[0].data = this.getInnerSpeciel(res.data,'amount');
          this.BarOption2.series[0].data = this.getInnerSpeciel(res.data,'count');
          this.BarOption1.series[0].name = '借款金额';
          this.BarOption2.series[0].name = '借款笔数';
          this.BarOption1.series[1] = {
            name:'新增金额',
            type:'bar',
            data: this.getInnerSpeciel(res.data_,'amount')
          };
          this.BarOption2.series[1] = {
            name: '新增笔数',
            type: 'bar',
            data: this.getInnerSpeciel(res.data_,'count')
          };
          console.log(this.getInnerSpeciel(res.data_,'count'));
          this.DrawChart();
        });
      },
      //展期统计
      InitDelay(){
        this.BarOption1.title.text = '展期总金额';
        this.BarOption2.title.text = '展期总笔数';
        this.BarOption3.title.text = '展期费总额';
        this.HasThird = true;
        let params = {
          status: 'delay',
          y: this.CurrentMonth.split('-')[0],
          m: this.MonthNum(this.CurrentMonth.split('-')[1])
        };
        this.InitData(this.apiUrl,params).then(res=>{
          this.BarText1 = res.amountAll;
          this.BarText2 = res.countAll;
          this.BarText3 = res.feeAll;
          this.BarOption1.xAxis[0].data = Object.keys(res.data);
          this.BarOption2.xAxis[0].data = Object.keys(res.data);
          this.BarOption3.xAxis[0].data = Object.keys(res.data);
          this.BarOption1.series[0].data = this.getInnerSpeciel(res.data,'amount');
          this.BarOption2.series[0].data = this.getInnerSpeciel(res.data,'count');
          this.BarOption3.series[0].data = this.getInnerSpeciel(res.data,'fee');
          this.DrawChart();
        });
      },
      //逾期统计
      InitOverDue(){
        this.BarOption1.title.text = '逾期总金额';
        this.BarOption2.title.text = '逾期总人数';
        this.ThirdH = '0px';
        let params = {
          status: 'yuqi',
          y: this.CurrentMonth.split('-')[0],
          m: this.MonthNum(this.CurrentMonth.split('-')[1])
        };
        this.InitData(this.apiUrl,params).then(res=>{
          this.BarText1 = res.amountAll;
          this.BarText2 = res.renAll;
          this.BarOption1.xAxis[0].data = Object.keys(res.data);
          this.BarOption2.xAxis[0].data = Object.keys(res.data);
          this.BarOption1.series[0].data = this.getInnerSpeciel(res.data,'amount');
          this.BarOption2.series[0].data = this.getInnerSpeciel(res.data,'count');
          this.DrawChart();
        });
      },
      //笔数逾期率统计
      InitBishu(){
        this.BarOption1.title.text = '笔数逾期率';
        this.ThirdH = '0px';
        this.IsSingle = true;
        let params = {
          status: 'bishu',
          y: this.CurrentYear
        };
        this.InitData(this.apiUrl,params).then(res=>{
          this.BarOption1.xAxis[0].data = Object.keys(res);
          this.BarOption1.series[0].data = Object.values(res);
          this.DrawChart();
        });
      },
      //金额逾期率统计
      InitAmount(){
        this.BarOption1.title.text = '金额逾期率';
        this.ThirdH = '0px';
        this.IsSingle = true;
        let params = {
          status: 'amount',
          y: this.CurrentYear
        };
        this.InitData(this.apiUrl,params).then(res=>{
          this.BarOption1.xAxis[0].data = Object.keys(res);
          this.BarOption1.series[0].data = Object.values(res);
          this.DrawChart();
        });
      },
      pickMonth(date){
        console.log(date);
        this.CurrentMonth = date;
        this.Distinguish();
      },
      pickYear(date){
        this.CurrentYear = date;
        this.Distinguish();
      },
      getInnerValue(arr,key){
        let res = [];
        arr.forEach(val=>{
          res.push(val[key]);
        });
        return res;
      },
      getInnerSpeciel(obj,key){
        let res = [];
        Object.keys(obj).forEach(val=>{
          res.push(obj[val][key]);
        });
        return res;
      },
      BackCountCenter(){
        this.$router.push({
          path: '/statistical/statistiIndex'
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .chart-tit{
    width: 100%;
    font-size: 18px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .right-side{
    display: inline-block;
    width: 250px;
  }
  .tit-text{
    padding: 5px 0;
  }
  .chart-box{
    height: 300px;
    margin: 30px 0;
  }
  .third-chart{
    display: none;
  }
  .chart-out{
    position: relative;
    .count-all{
      position: absolute;
      top: 10px;
      right: 35px;
    }
  }
</style>
