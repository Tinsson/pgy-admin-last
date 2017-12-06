<template>
  <div id="opt-record">
    <Tabs value="user" :animated="false">
      <TabPane :label="UserLabel" name="user">
        <div class="belong-info">
          <p class="text"><span class="tips">审核员：</span>方启宇</p>
          <p class="text"><span class="tips">催收员：</span>张杰</p>
        </div>
        <Table :columns="UserCol" :data="UserData" size="large"></Table>
      </TabPane>
      <TabPane :label="UrgeLabel" name="urge">
        <div class="belong-info">
          <p class="text"><span class="tips">审核员：</span>方启宇</p>
          <p class="text"><span class="tips">催收员：</span>张杰</p>
        </div>
        <Table :columns="UrgeCol" :data="UrgeData" size="large"></Table>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
  import { getLocal } from '@/util/util'

  export default {
    name: 'OptRecord',
    data () {
      return {
        title: '操作记录',
        UserLabel: (h)=>{
          return h('span',{
            attrs:{
              style: 'font-size: 18px'
            }
          },'用户记录')
        },
        UrgeLabel: (h)=>{
          return h('span',{
            attrs:{
              style: 'font-size: 18px'
            }
          },'催收记录')
        },
        //用户数据
        UserCol: [{
            title: '时间',
            key: 'time'
          },{
            title: '行为',
            key: 'action'
          },{
            title: '类型',
            key: 'type'
          }
        ],
        UserData: [{
            time: '2017-09-26',
            action: '注册成功',
            type: '注册类'
        }],
        //催收数据
        UrgeCol: [{
            title: '催收明细',
            key: 'detail'
        },{
            title: '备注',
            key: 'remark'
        }],
        UrgeData: [{
            detail: '2017-04-13 08:57:34  逾期  -',
            remark: '进行延期。。。'
        }]
      }
    },
    created(){

    },
    methods: {

    }
  }
</script>


<style lang="less" scoped>
  @theme: #1FB5AD;
  #opt-record{
    padding: 8px 60px 50px;
  }
  .belong-info{
    padding: 15px 0 20px;
    .text{
      display: inline-block;
      width: 150px;
      font-size: 16px;
      font-weight: bold;
      .tips{
        color: @theme;
      }
    }
  }
</style>
