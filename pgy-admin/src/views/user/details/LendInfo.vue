<template>
  <div id="lend-info">
    <Tabs value="loan" :animated="false">
      <TabPane :label="LoanLabel" name="loan">
        <div class="count-all">
          <p class="text-box">
            <span class="label">累计笔数</span>
            <span class="value">{{ UserData.jk_count }}</span>
          </p>
          <p class="text-box">
            <span class="label">当前金额</span>
            <span class="value"><span class="finance">{{ UserData.jk_this_amount }}</span>元</span>
          </p>
          <p class="text-box">
            <span class="label">借款总额</span>
            <span class="value"><span class="count">{{ UserData.jk_all_amount }}</span>元</span>
          </p>
        </div>
        <div class="count-box" v-for="item in UserData.jk_list" :key="item.id">
          <p class="yq_state">{{ item.yq_status }}</p>
          <div class="text-line">
            <div class="info-area">
              <p class="tips">金额（元）</p>
              <p class="value num">{{ item.amount }}</p>
            </div>
            <div class="info-area">
              <p class="tips">实际还款日：{{ item.pay_date }}</p>
              <p class="value state" v-if="item.pay_state">
                <Icon type="checkmark-circled"></Icon>
                已还款
              </p>
              <p class="value state nopay" v-if="!item.pay_state">
                <Icon type="alert-circled"></Icon>
                未还款
              </p>
            </div>
          </div>
          <div class="text-line">
            <div class="info-area">
              <p class="tips">借款金额：{{ item.amount }}</p>
              <p class="tips">借款日期：{{ item.jk_date }}</p>
            </div>
            <div class="info-area">
              <p class="tips">借款天数：{{ item.jk_days }}</p>
              <p class="tips">合同还款日：{{ item.hthk_date }}</p>
            </div>
            <div class="info-area">
              <p class="tips">违约金：{{ item.wy_amount }}</p>
            </div>
            <div class="info-area long">
              <p class="tips">银行卡号：{{ item.cardno }}</p>
              <p class="tips">借款银行：{{ item.bankcode }}</p>
            </div>
          </div>
          <div class="text-line">
            <div class="info-area remark">
              <p class="tips">备注：</p>
            </div>
          </div>
        </div>
      </TabPane>
      <TabPane :label="ExtendLabel" name="extend">
        <div class="count-all">
          <p class="text-box">
            <span class="label">累计笔数</span>
            <span class="value">{{ UserData.zq_count }}</span>
          </p>
          <p class="text-box">
            <span class="label">当前展期订单金额</span>
            <span class="value"><span class="finance">{{ UserData.zq_this_amount }}</span>元</span>
          </p>
          <p class="text-box">
            <span class="label">展期总金额</span>
            <span class="value"><span class="count">{{ UserData.zq_all_amount }}</span>元</span>
          </p>
        </div>
        <div class="count-box" v-for="item in UserData.zq_list" :key="item.id">
          <p class="yq_state">{{item.yq_status}}</p>
          <div class="text-line">
            <div class="info-area">
              <p class="tips">延期金额：{{ item.amount }}</p>
              <p class="tips">延期开始日：{{ item.start_date }}</p>
            </div>
            <div class="info-area">
              <p class="tips">延期费用：{{ item.fee }}元</p>
              <p class="tips">延期结束日：{{ item.hk_date }}</p>
            </div>
            <div class="info-area long">
              <p class="tips">延期时间：{{ item.days }}天</p>
              <p class="tips">延期操作日：{{ item.create_at }}</p>
            </div>
          </div>
          <div class="text-line">
            <div class="info-area remark">
              <p class="tips">备注：</p>
            </div>
          </div>
        </div>
      </TabPane>
      <TabPane :label="RepayLabel" name="repay">
        <div class="count-all">
          <p class="text-box">
            <span class="label">累计笔数</span>
            <span class="value">{{ UserData.hk_count }}</span>
          </p>
          <p class="text-box">
            <span class="label">当前金额</span>
            <span class="value"><span class="finance">{{ UserData.hk_this_amount.amount }}</span>元</span>
          </p>
          <p class="text-box">
            <span class="label">应还金额</span>
            <span class="value"><span class="count">{{ UserData.hk_all_yhamount }}</span>元</span>
          </p>
          <p class="text-box">
            <span class="label">违约金</span>
            <span class="value"><span class="count">{{ UserData.hk_all_wyamount }}</span>元</span>
          </p>
        </div>
        <div class="count-box" v-for="item in UserData.hk_list" :key="item.id">
          <div class="text-line">
            <div class="info-area">
              <p class="tips">还款金额（元）</p>
              <p class="value num">{{ item.hk_amount }}</p>
            </div>
            <div class="info-area">
              <p class="tips long">实际还款日：{{ item.pay_date }}</p>
              <p class="value state">
                <Icon type="checkmark-circled"></Icon>
                已还款
              </p>
            </div>
          </div>
          <div class="text-line">
            <div class="info-area">
              <p class="tips">借款金额：{{ item.jk_amount }}元</p>
              <p class="tips">借款日期：{{ item.jk_date }}</p>
            </div>
            <div class="info-area">
              <p class="tips">借款天数：{{ item.jk_day }}天</p>
              <p class="tips">合同还款日：{{ item.hthk_date }}</p>
            </div>
            <div class="info-area">
              <p class="tips">违约金：{{ item.wy_amount }}元</p>
              <p class="tips">应还金额：{{ item.hk_amount }}元</p>
            </div>
          </div>
          <div class="text-line">
            <div class="info-area remark">
              <p class="tips">备注：</p>
            </div>
          </div>
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
  import { getLocal } from '@/util/util'

  export default {
    name: 'LendInfo',
    data () {
      return {
        title: '借贷信息',
        LoanLabel: (h)=>{
          return h('span',{
            attrs:{
              style: 'font-size: 18px'
            }
          },'放款')
        },
        ExtendLabel: (h)=>{
          return h('span',{
            attrs:{
              style: 'font-size: 18px'
            }
          },'展期')
        },
        RepayLabel: (h)=>{
          return h('span',{
            attrs:{
              style: 'font-size: 18px'
            }
          },'还款')
        },
        UserData: {}     //用户数据
      }
    },
    created(){
      const uid = this.$route.query.id;
      this.$fetch('User/getInfo',{uid}).then((d)=>{
        this.UserData = d.data.loan;
        this.StateText(this.UserData.jk_list);
        this.StateText(this.UserData.hk_list);
      });
    },
    methods:{
      StateText(arr){
        arr.forEach(val=>{
          if(val.pay_date === null){
            val.pay_state = 0;
            val.pay_date = '无';
          }else{
            val.pay_state = 1;
          }
        })
      }
    }
  }
</script>


<style lang="less" scoped>
  @theme: #1FB5AD;
  #lend-info{
    padding: 8px 60px 50px;
  }
  .count-all{
    padding: 10px 0 20px;
    border-bottom: 2px solid #e3e3e3;
    .text-box{
      display: inline-block;
      font-size: 16px;
      .label,.value{
        display: inline-block;
        padding-right: 50px;
        .finance{
          color: #F00;
        }
        .count{
          color: #f77249;
        }
      }
    }
  }
  .count-box{
    position: relative;
    border-bottom: 2px dashed #E3E3E3;
    .yq_state{
      position: absolute;
      right: 20px;
      top: 20px;
      font-size: 22px;
      color: #F00;
    }
    .text-line{
      padding-top: 15px;
      display: flex;
      flex-direction: row;
      .info-area{
        display: inline-block;
        width: 200px;
        font-size: 14px;
        &.long{
          width: 300px;
        }
        &.remark{
          width: 100%;
          padding-bottom: 20px;
        }
        .value{
          color: @theme;
          font-size: 16px;
          &.num{
            font-size: 22px;
          }
          &.state{
            padding-top: 5px;
            &.nopay{
              color: #f74c17;
            }
          }
        }
      }
    }
  }

</style>
