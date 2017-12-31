<template>
  <div id="statistical-details">
    <Card class="card-all">
      <div ref="BarTitle" class="chart-tit" slot="title">
        <span class="tit-text">统计详情</span>
        <div class="right-side">
          <Select v-model="CountType">
            <Option value="month">最近6个月</Option>
            <Option value="day">最近7天</Option>
          </Select>
        </div>
      </div>
      <div id="BarChart1" class="chart-box" :style="{width: BarWidth+'px'}"></div>
      <div id="BarChart2" class="chart-box" :style="{width: BarWidth+'px'}"></div>
      <div id="BarChart3" class="chart-box" :style="{width: BarWidth+'px',height: ThirdH}"></div>
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
        apiUrl: '/backend/Statistical/statiIndex',
        CountType: 'month',
        CountData: {},
        ThirdH: '300px',
        HasThird: false,
        BarWidth: '',
        BarOption1:{
          title : {
            text: '总金额',
            subtext: '',
            x:'center'
          },
          color: ['#358AF5'],
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
          color: ['#fa8c16'],
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
              data:[2, 3, 4, 5, 6, 7, 8]
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
              data:[2, 3, 4, 5, 6, 7, 8]
            }
          ]
        }
      }
    },
    mounted(){
      switch(this.$route.query.type){
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
      }
      this.BarWidth = this.$refs['BarTitle'].offsetWidth;
      this.DrawChart();
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
            this.CountData = res;
            this.loading = false;
            resolve();
          })
        })
      },
      DrawChart(){
        let BarChart1 = this.$echarts.init(document.getElementById('BarChart1'));
        let BarChart2 = this.$echarts.init(document.getElementById('BarChart2'));
        BarChart1.setOption(this.BarOption1);
        BarChart2.setOption(this.BarOption2);
        if(this.HasThird){
          let BarChart3 = this.$echarts.init(document.getElementById('BarChart3'));
          BarChart3.setOption(this.BarOption3);
        }
      },
      //注册统计
      InitReg(){
        this.BarOption1.title.text = '注册总人数';
        this.BarOption2.title.text = '通过数';
        this.ThirdH = '0px';
      },
      //借款统计
      InitLoan(){
        this.BarOption1.title.text = '借款总金额';
        this.BarOption2.title.text = '借款总笔数';
        this.ThirdH = '0px';
      },
      //展期统计
      InitDelay(){
        this.BarOption1.title.text = '展期总金额';
        this.BarOption2.title.text = '展期总笔数';
        this.BarOption3.title.text = '展期费总额';
        this.HasThird = true;
      },
      //逾期统计
      InitOverDue(){
        this.BarOption1.title.text = '逾期总金额';
        this.BarOption2.title.text = '逾期总人数';
        this.ThirdH = '0px';
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
    width: 120px;
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
</style>
