<template>
  <div class="carrier-report">
    <h2 class="all-title">运营商报告</h2>
    <Tabs type="card">
      <TabPane label="运营商报告">
        <div class="first-level">
          <table class="table-info" cellspacing="0" cellpadding="0" border="0">
            <thead>
            <tr>
              <th colspan="5" class="cus-head">1.1 用户及账号基本信息</th>
            </tr>
            </thead>
            <tbody>
              <tr>
                <td>姓名：</td>
                <td colspan="3">身份证号：</td>
              </tr>
            </tbody>
          </table>
        </div>
      </TabPane>
      <TabPane label="通讯录报告"></TabPane>
    </Tabs>
  </div>
</template>

<script>
  export default {
    name: 'SumTable',
    data () {
      return{
        Report:{
        }
      }
    },
    computed:{

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
    font-size: 20px;
    padding: 10px 0;
  }
  .carrier-report{
    width: 100%;
    box-sizing: border-box;
    padding: 0 5%;
    .first-level{
      padding-bottom: 20px;
      .table-info{
        padding-botton: 20px;
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
