<template>
  <div class="carrier-report">
    <h2 class="all-title">运营商报告</h2>
      <div class="first-level">
        <table class="table-info" cellspacing="0" cellpadding="0" border="0">
          <thead>
          <tr>
            <th colspan="5" class="cus-head">1.1 用户及账号基本信息</th>
          </tr>
          </thead>
          <tbody>
            <tr>
              <td>姓名：{{ UserBasic.name }}</td>
              <td colspan="3">身份证号：{{ UserBasic.id_card }}</td>
            </tr>
            <tr>
              <td>姓名From客户：{{UserBasic.name}}</td>
              <td colspan="3">身份证From客户：{{UserBasic.name}}</td>
            </tr>
            <tr>
              <td>手机号码：{{}}</td>
              <td>入网时长：</td>
              <td>性别：</td>
              <td>年龄：</td>
            </tr>
            <tr>
              <td>星座：</td>
              <td>邮箱：</td>
              <td colspan="2">通讯地址：</td>
            </tr>
            <tr>
              <td>籍贯：</td>
              <td>手机号码归属地：</td>
              <td>居住地址：</td>
              <td>工作地址：</td>
            </tr>
            <tr>
              <td colspan="4">账号余额：</td>
            </tr>
            <tr>
              <td colspan="2">联系人 | 手机号码：</td>
              <td colspan="2">：</td>
            </tr>
            <tr>
              <td colspan="4">有该联系人电话的通话记录，[180]天内联系[39]次，共[62.12]分钟，按时长计算排名第[1]位</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="first-level">
        <table class="table-info long" cellspacing="0" cellpadding="0" border="0">
          <thead>
          <tr>
            <th colspan="32" class="cus-head">详细统计</th>
          </tr>
          </thead>
          <tbody>
            <tr>
              <td>号码</td>
              <td>号码标识</td>
              <td>号码类型</td>
              <td>归属地</td>
              <td>近一周通话次数</td>
              <td>近一月通话次数</td>
              <td>近三月通话次数</td>
              <td>近六月通话次数</td>
              <td>近三月通话时长（秒）</td>
              <td>近六月通话时长（秒）</td>
              <td>近三月主叫次数</td>
              <td>近六月主叫次数</td>
              <td>近三月被叫次数</td>
              <td>近六月被叫次数</td>
              <td>近三月早上（5:30-11:30）通话次数</td>
              <td>近六月早上（5:30-11:30）通话次数</td>
              <td>近三月中午（11:30-13:30）通话次数</td>
              <td>近六月中午（11:30-13:30）通话次数</td>
              <td>近六月中午（11:30-13:30）通话次数</td>
              <td>近六月下午（13:30-17:30）通话次数</td>
              <td>近三月晚上（17:30-23:30）通话次数</td>
              <td>近六月晚上（17:30-23:30）通话次数</td>
              <td>近三月凌晨（23:30-5:30）通话次数</td>
              <td>近六月凌晨（23:30-5:30）通话次数</td>
              <td>近三月工作日通话次数</td>
              <td>近六月工作日通话次数</td>
              <td>近三月周末通话次数</td>
              <td>近六月周末通话次数</td>
              <td>近三月节假日通话次数</td>
              <td>近六月节假日通话次数</td>
              <td>近三月是否有全天联系</td>
              <td>近六月是否有全天联系</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
  </div>
</template>

<script>
  export default {
    name: 'SumTable',
    data () {
      return{
        Report:{
          user_basic: []
        }
      }
    },
    computed:{
      UserBasic(){
        let info = {};
        this.Report.user_basic.forEach(val=>{
          info[val.key] = val.value;
        });
        return info;
      }
    },
    created(){
      const uid = this.$route.query.uid;
      this.$fetch('/backend/report/carrier',{user_id: uid}).then(d=>{
        if(d.status === 1){
          this.Report = d.data.data;
        }
      });
    },
    methods: {
      JudgeSum(key){
        if(key === 'sum'){
          return '总共';
        }else{
          return key;
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .all-title{
    text-align: center;
    font-size: 24px;
    padding: 15px 0;
  }
  .carrier-report{
    width: 100%;
    box-sizing: border-box;
    padding: 0 5%;
    .first-level{
      padding-bottom: 20px;
      width: 100%;
      overflow: auto;
      .table-info{
        margin-bottom: 20px;
        &.long{
          width: 7000px;
        }
      }
    }
    .first-title{
      padding: 10px;
      font-size: 16px;
    }
    table{
      width: 100%;
      font-size: 12px;
      text-align: left;
      border: 1px solid #e3e3e3;
      border-bottom: none;
      .cus-head{
        height: 40px;
        white-space: nowrap;
        padding-left: 10px;
        background: #468cb4;
        font-size: 14px;
        overflow: hidden;
        color: #FFF;
        border-bottom: 1px solid #e9eaec;
      }
      tbody{
        tr{
          td{
            min-width: 0;
            height: 48px;
            padding-left: 10px;
            font-size: 14px;
            box-sizing: border-box;
            text-overflow: ellipsis;
            border-bottom: 1px solid #e9eaec;
            border-right: 1px solid #e3e3e3;
            &.td-title{
              font-weight: bold;
            }
            &:nth-last-child(1){
              border-right: none;
            }
            &.sum-left{
              border-right: 1px solid #e9eaec;
            }
            .td-name{
              font-size: 15px;
            }
            .td-amount{
              font-size: 14px;
              color: #d73435;
            }
          }
        }
      }
    }
  }
</style>
