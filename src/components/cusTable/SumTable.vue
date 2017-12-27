<template>
  <div class="sum-table">
    <table cellspacing="0" cellpadding="0" border="0">
      <thead>
        <tr>
          <th class="cus-head" v-for="item in head" :key="item.key">{{item.title}}</th>
        </tr>
      </thead>
      <tbody v-for="item in data">
        <tr v-for="(iitem,index) in item.info">
          <td :rowspan="item.info.length" class="sum-left" v-if="index === 0">
            <p class="td-name">{{item.name}}</p>
            <p class="td-amount">{{item.amount}}</p>
            <p class="td-time">{{item.get_time}}</p>
          </td>
          <td>{{iitem.name}}</td>
          <td>{{iitem.phone}}</td>
          <td>{{iitem.amount}}</td>
          <td>{{iitem.amount}}</td>
          <td>{{iitem.jk_date}}</td>
          <td>{{iitem.hk_date}}</td>
          <td>
            <Button type="primary" @click="Confirm(iitem.uid, item.amount)">确认还款</Button>
          </td>
        </tr>
      </tbody>
    </table>
    <Spin size="large" fix v-if="loading"></Spin>
  </div>
</template>

<script>
  export default {
    name: 'SumTable',
    data () {
      return{

      }
    },
    props: {
      head: Array,
      data: Array,
      loading: Boolean
    },
    methods: {
      CloseBtn(){
        this.$emit('CloseModal',this.modalState);
      },
      Confirm(uid,amount){
        const data = {
          uid,amount
        };
        this.$emit('repay',data);
      }
    }
  }
</script>

<style lang="less" scoped>
  .sum-table{
    width: 100%;
    table{
      width: 100%;
      font-size: 12px;
      .cus-head{
        height: 40px;
        white-space: nowrap;
        overflow: hidden;
        background-color: #f8f8f9;
        border-bottom: 1px solid #e9eaec;
      }
      tbody{
        tr{
          td{
            min-width: 0;
            height: 48px;
            box-sizing: border-box;
            text-align: center;
            text-overflow: ellipsis;
            border-bottom: 1px solid #e9eaec;
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
