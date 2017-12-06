<template>
  <div id="relation-info">
    <h2 class="sub-tit">联系人信息</h2>
    <div class="line-box" v-for="item in LinkInfo">
      <div class="name">
        <span class="label">名字：</span>
        <span class="value">{{ item.name }}</span>
      </div>
      <div class="phone">
        <span class="label">手机号：</span>
        <span class="value">{{ item.phone }}</span>
      </div>
    </div>
    <div class="check-box">
      <a href="javascript:;" class="btn">查看通讯录</a>
    </div>
    <div class="check-box">
      <a href="javascript:;" class="btn">查看通话记录</a>
    </div>
  </div>
</template>

<script>
  import { getLocal } from '@/util/util'

  export default {
    name: 'RelationInfo',
    data () {
      return {
        title: '关联关系',
        LinkInfo: [],     //用户数据
      }
    },
    created(){
      const uid = this.$route.query.id;
      this.$fetch('User/getInfo',{uid}).then((d)=>{
        this.LinkInfo = d.data.link.lianxiren;
      });
    }
  }
</script>


<style lang="less" scoped>
  @theme: #1FB5AD;
  #relation-info{
    padding: 0 60px 60px;
  }
  .sub-tit{
    padding: 20px 0;
  }
  .line-box{
    display: flex;
    flex-direction: row;
    font-size: 14px;
    padding-bottom: 10px;
    .name{
      width: 200px;
    }
    .label{
      display: inline-block;
      width: 60px;
    }
  }
  .check-box{
    margin-top: 30px;
    .btn{
      display: inline-block;
      padding: 5px 20px;
      border: 1px solid @theme;
      border-radius: 5px;
      font-size: 16px;
      color: @theme;
      &:hover{
        color: #FFF;
        background-color: @theme;
      }
    }
  }

</style>
