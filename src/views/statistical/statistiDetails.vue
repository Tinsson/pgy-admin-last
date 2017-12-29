<template>
  <div id="statistical-details">
    <Card class="card-all">
      <div ref="BarTitle" class="chart-tit" slot="title">
        <span class="tit-text">统计详情</span>
        <div class="right-side">
          <Select v-model="CountType">
            <Option value="month">最近6个月</Option>
            <Option value="week">最近7个星期</Option>
            <Option value="day">最近7天</Option>
          </Select>
        </div>
      </div>
      <div id="BarChart" :style="{width: BarWidth+'px',height: '300px'}"></div>
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
        BarWidth: '',
        BarOption:{
          title : {
            text: '借款统计',
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
        }
      }
    },
    mounted(){
      switch(this.$route.query.type){
        case 'registried':
          break;
        case 'loan':
          break;
        case 'delay':
          break;
        case 'overdue':
          break;
        case 'overcount':
          break;
        case 'overamount':
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
        let BarChart = this.$echarts.init(document.getElementById('BarChart'));
        BarChart.setOption(this.BarOption);
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
</style>
