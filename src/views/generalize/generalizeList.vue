<template>
  <div id="generalize-list">
    <h1 class="list-title">
      <span class="tit-text">{{ title }}</span>
      <Button class="tit-btn"
              type="success"
              icon="android-arrow-dropleft-circle"
              size="large"
              v-show="IndexStash.Show"
              @click="BackIndex">返回首页</Button>
    </h1>
    <div class="card-box">
      <div v-for="item in CountData" class="sim-card" :class="{cur:item.cur}" @click="CountList(item.status)">
        <Icon class="icon" :type="item.icon"></Icon>
        <p class="title">{{ item.name }}</p>
        <p class="value"><span class="num">{{item.count}}</span><span>{{item.cunit}}</span><span class="num" v-show="item.second">/</span><span class="num">{{item.other}}</span><span>{{item.ounit}}</span>
        </p>
        <span class="tips">点击查看</span>
      </div>
    </div>
    <div class="screen-area">
      <Card>
        <div class="card-tit" slot="title">
          <h3>
            <Icon type="ios-pricetags-outline"></Icon>
            筛选查询
          </h3>
          <div class="btn-box">
            <Button type="ghost" icon="reply" @click="ResetScreen">重置筛选</Button>
            <Button type="success" icon="search" @click="SimpleSearch">查询结果</Button>
          </div>
        </div>
        <div class="opt-box">
          <Form :model="ScreenData" inline :label-width="85">
            <FormItem label="渠道：">
              <Select v-model="ScreenData.src" style="width: 150px">
                <Option value="">全渠道</Option>
                <Option v-for="item in SrcData" :value="item.id" :key="item.id">{{ item.title }}</Option>
              </Select>
            </FormItem>
            <FormItem label="时间：">
              <DatePicker type="datetimerange"
                          placeholder="选择日期和时间"
                          format="yyyy-MM-dd HH:mm:ss"
                          placement="bottom-end"
                          :value="allTime"
                          @on-change="PickDate"
                          style="width: 280px"></DatePicker>
            </FormItem>
          </Form>
        </div>
      </Card>
    </div>
    <div class="data-area">
      <Card :padding="0">
        <div class="card-tit" slot="title">
          <h3>
            <Icon type="clipboard"></Icon>
            {{ TableTitle }}
          </h3>
          <div class="btn-box">

          </div>
        </div>
        <Table :columns="UserCol"
               :data="UserData"
               :loading="loading"></Table>
        <div class="page-box">
          <Page :current="Page.cur"
                :page-size="Page.size"
                :total="Page.count"
                placement="top"
                @on-change="ChangePage"
                @on-page-size-change="ChangeSize" show-sizer></Page>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
  import { getLocal } from '@/util/util'
  import Clipboard from 'clipboard';

  export default {
    name: 'GeneralizeList',
    data () {
      return {
        title: '推广列表',
        apiUrl: '/backend/Promoteinfo/Index',
        auth_id: '',
        loading: true,
        ClipBoard: {},
        allTime: [],
        //统计数据
        CountData: [{
          name: '今日注册',
          icon: 'android-calendar',
          count: 0,
          cunit: '人',
          second: false,
          status: 'DAYREG',
          cur: false
        },{
          name: '今日浏览',
          icon: 'android-calendar',
          count: 0,
          cunit: '人',
          second: false,
          status: 'DAYVIEW',
          cur: false
        },{
          name: '本月注册',
          icon: 'calendar',
          count: 0,
          cunit: '人',
          second: false,
          status: 'MONTHREG',
          cur: false
        },{
          name: '本月浏览',
          icon: 'calendar',
          count: 0,
          cunit: '人',
          second: false,
          status: 'MONTHVIEW',
          cur: false
        },{
          name: '今日转化',
          icon: 'pie-graph',
          count: 0,
          cunit: '人',
          second: true,
          other: 0,
          ounit: '元',
          status: 'DAYZH',
          cur: false
        },{
          name: '历史转化',
          icon: 'android-time',
          count: 0,
          cunit: '人',
          second: true,
          other: 0,
          ounit: '元',
          status: 'HISTORYZH',
          cur: false
        },{
          name: '转化率',
          icon: 'levels',
          count: 0,
          cunit: '%',
          second: false,
          status: 'ZHRATE',
          cur: false
        },{
          name: '逾期率',
          icon: 'levels',
          count: 0,
          cunit: '%',
          second: false,
          status: 'YQRATE',
          cur: false
        }],
        //基础筛选数据
        ScreenData: {
          src: '',
          start_time: '',
          end_time: '',
          status: ''
        },
        UserCol: [
          {
            title: '序号',
            width: '70',
            align: 'center',
            key: 'id'
          },{
            title: '渠道',
            width: '100',
            align: 'center',
            key: 'title'
          },{
            title: '推广链接',
            align: 'center',
            key: 'url',
            render: (h, params)=>{
              const Url = window.location.origin + '/#/extend?code=' + params.row.codebase;
              return h('div',{
                'class': {
                  clipBtn : true
                },
                style:{
                  cursor: 'pointer',
                  color: '#d73435'
                },
                attrs:{
                  src: Url
                }
              },'复制链接')
            }
          },{
            title: '浏览数',
            key: 'viewcount'
          },{
            title: '注册数',
            key: 'regcount'
          },{
            title: '转化数',
            key: 'zhcount'
          },{
            title: '转化率',
            key: 'zhrate'
          },{
            title: '逾期率',
            key: 'yqrate'
          },{
            title: '操作',
            key: 'operation',
            align: 'center',
            width: '220',
            render: (h, params)=>{
              return h('div',this.$renderBtn(h, params, this.BtnData));
            }
          }
        ],
        UserData: [],     //表格数据
        SrcData: [],      //渠道数据
        BtnData: [],      //按钮数据
        //群选打钩后操作
        SelectData: [],
        //初始分页信息
        Page: {
          count: 0,
          cur: 1,
          size: 20,
        },
        //首页暂存区
        IndexStash:{
          Show: false,
          Col: [],
          Data: []
        }
      }
    },
    created(){
      this.auth_id = getLocal('auth_id');
      this.InitData(this.apiUrl).then(()=>{
        this.IndexStash.Col = this.UserCol;
        this.IndexStash.Data = this.UserData;
      });
    },
    mounted(){
      //剪切板功能
      this.ClipBoard = new Clipboard('.clipBtn',{
        text: function(elm){
          return elm.getAttribute('src');
        }
      });
      this.ClipBoard.on('success',(e)=>{
        this.$Message.success('链接粘贴成功！');
      })
    },
    destroyed() {
      this.ClipBoard.destroy();
    },
    computed: {
      TableTitle(){
        return this.IndexStash.Show?'数据列表':'渠道列表';
      }
    },
    methods: {
      //去除data数据里绑定的监视器
      RemoveObserve(rowdata){
        return JSON.parse(JSON.stringify(rowdata));
      },
      //筛选操作(重置筛选)
      ResetScreen(){
        for(let key in this.ScreenData){
          this.ScreenData[key] = '';
        }
        this.allTime = '';
      },
      //多选打钩绑定数据
      SelectTable(data){
        let idarr = [];
        if(data.length > 0){
          data.forEach(val=>{
            idarr.push(val.id);
          })
        }
        this.SelectData = idarr;
      },
      //选择时间
      PickDate(time){
        this.allTime = time;
      },
      //二次获取数据
      SecondData(sinfo){
        return new Promise(resolve=>{
          this.$post('/backend/Promoteinfo/detail',sinfo).then(d=>{
            this.UserCol = d.data.field;
            this.UserData = d.data.list;
            this.Page.count = d.data.count;
            this.loading = false;
            resolve();
          })
        });
      },
      //统计列表
      CountList(status){
        this.loading = true;
        this.IndexStash.Show = true;
        let sinfo = this.RemoveObserve(this.ScreenData);
        this.CountData.forEach(val=>{
          if(val.status === status){
            val.cur = true;
          }else{
            val.cur = false;
          }
        });
        this.ScreenData.status = status;
        sinfo.status = status;
        this.SecondData(sinfo);
      },
      //查询结果
      SimpleSearch(sign = 1){
        let sinfo = this.RemoveObserve(this.ScreenData);
        if(sinfo.status === ''){
          this.$Message.error('当前为渠道列表，不具备筛选功能！');
          return false;
        }
        if(this.allTime[0] !== ""){
          sinfo.start_time = this.allTime[0];
          sinfo.end_time = this.allTime[1];
        }else{
          sinfo.start_time = '';
          sinfo.end_time = '';
        }
        this.SecondData(sinfo).then(()=>{
          this.$Message.success('筛选成功！');
        });
      },
      //初始化数据
      InitData(url,params = {}){
        const that = this;
        this.loading = true;
        this.$fetch('/backend/Promoteinfo/topIndex').then(d=>{
          this.CountData.forEach(val=>{
            if(val.second){
              val.count = d.data[val.status].count;
              val.other = d.data[val.status].allamount;
            }else{
              val.count = d.data[val.status];
            }
          })
        });
        //获取按钮信息
        this.$fetch('/backend/Menuauth/listAuthGet',{auth_id: this.auth_id}).then((d)=>{
          this.BtnData = d.data.operation;
        });
        //列表数据获取
        return new Promise((resolve)=>{
          this.$post(url,params).then((d)=>{
            let res = d.data;
            this.Page.count = d.data.count;
            this.UserData = res;
            this.SrcData = res;
            that.loading = false;
            resolve();
          })
        })
      },
      //提交信息操作
      UploadData(url,info){
        return new Promise((resolve)=>{
          this.$post(url,info).then((d)=>{
            if(d.status === 1){
              this.$Message.success(d.message);
              resolve(d.data);
            }else{
              this.$Message.error(d.message);
            }
          }).catch((err)=>{
            this.$Message.error('服务器繁忙，请稍后再试！');
          })
        })

      },
      //导出数据
      ExportData(){
        let sinfo = this.RemoveObserve(this.ScreenData);
        sinfo.expro = 1;
        this.UploadData('/backend/Promoteinfo/detail',sinfo).then((url)=>{
          //console.log(url);
          window.location.href = url;
        });
      },
      //改变页数
      ChangePage(curpage){
        let sinfo = Object.assign(this.ScreenData,{
          page: curpage,
          num: this.Page.size
        });
        this.InitData('/backend/Promoteinfo/detail',sinfo).then(()=>{
          this.Page.cur = curpage;
        })
      },
      //改变显示条数
      ChangeSize(size){
        let sinfo = Object.assign(this.ScreenData,{
          page: 1,
          num: size
        });
        this.InitData('/backend/Promoteinfo/detail',sinfo).then(()=>{
          this.Page.cur = 1;
          this.Page.size = size;
        })
      },
      //查看详情按钮
      DetailsOpt(row){
        const { href } = this.$router.resolve({
          path: 'generalizeDetail',
          name: '渠道详情',
          query:{
            src: row.id
          }
        });
        window.open(href, '_blank');
      },
      //查看统计
      EditOpt(row){
        const { href } = this.$router.resolve({
          path: 'generalizeCount',
          name: '渠道统计',
          query:{
            src: row.id
          }
        });
        window.open(href, '_blank');
      },
      BackIndex(){
        this.IndexStash.Show = false;
        this.UserCol = this.IndexStash.Col;
        this.UserData = this.IndexStash.Data;
        this.ScreenData.status = '';
        this.CountData.forEach(val=>{
          val.cur = false;
        })
      }
    }
  }
</script>


<style lang="less" scoped>
  .list-title{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-weight: normal;
    padding-bottom: 10px;
  }
  .data-area{
    padding-top: 20px;
    .ivu-table-wrapper{
      border: none;
    }
    .page-box{
      padding: 20px;
      display: flex;
      flex-direction: row-reverse;
    }
  }
  .card-tit{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .card-box{
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
    padding-bottom: 20px;
    .sim-card{
      position: relative;
      width: 24%;
      padding: 15px;
      color: #FFF;
      overflow: hidden;
      cursor: pointer;
      border-radius: 5px;
      background-color: #c3c3c3;
      margin-bottom: 10px;
      .title{
        font-size: 16px;
      }
      .value{
        padding-top: 10px;
        font-size: 18px;
        .num{
          font-size: 32px;
        }
      }
      .tips{
        position: absolute;
        transition: all 0.1s linear;
        bottom: -20px;
        right: 20px;
        font-size: 14px;
      }
      &:hover{
        .tips{
          bottom: 10px;
        }
      }
      .icon{
        position: absolute;
        right: 10px;
        top: 5px;
        font-size: 60px;
      }
      &.cur{
        background-color: #2db7f5;
        &:hover{
          .tips{
            bottom: -20px;
          }
        }
      }
    }
  }

</style>
