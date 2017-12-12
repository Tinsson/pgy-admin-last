<template>
  <div id="admin" class="layout">
    <Row type="flex">
      <Col span="3" class="layout-menu-left">
      <Menu theme="dark"
            :active-name="currentpath"
            :open-names="openname"
            :accordion="true"
            width="auto">
        <div class="layout-logo-left">
          <img class="logo" src="../assets/images/logo.png" alt="">
          蒲公英后台
        </div>
        <div class="user-panel">
          <div class="pull-left hand" @click="OpenCenter">
            <img v-show="NoPic" class="avator" src="../assets/images/avator.jpg" alt="">
            <img v-show="!NoPic" class="avator" :src="AvatorImg" alt="">
          </div>
          <div class="pull-left">
            <p class="text">{{ username }}</p>
            <p class="state"><i class="icon-state"></i>online</p>
          </div>
        </div>
        <Submenu v-for="item in authView" :name="item.path" :key="item.path">
          <template slot="title">
            <Icon :type="item.meta.icon"></Icon>
            {{item.name}}
          </template>
          <router-link v-for="child in item.children" :to="item.path+'/'+child.path" :key="child.path">
            <MenuItem :name="item.path+'/'+child.path">{{child.name}}</MenuItem>
          </router-link>
        </Submenu>
      </Menu>
      </Col>
      <Col span="21" class="layout-menu-right" :style="{minHeight: RightHeight}">
      <div class="layout-header">
        <p class="login-out" @click="loginOut">
          <Icon type="power"></Icon>
          退出登录
        </p>
      </div>
      <div class="layout-content" :style="{minHeight: contentHeight,backgroundColor: contentBg}">
        <div class="layout-content-main">
          <router-view></router-view>
        </div>
      </div>
      </Col>
    </Row>
    <Modal v-model="CenterModal.modal"
           title="修改个人信息">
      <Form ref="CenterModal" :model="CenterModal.data" :rules="ValidateRules" label-position="right" :label-width="100">
        <FormItem label="用户名字：">
          <Input v-model="CenterModal.data.username" disabled></Input>
        </FormItem>
        <FormItem label="密码：">
          <Input v-model="CenterModal.data.pwd1"></Input>
        </FormItem>
        <FormItem label="再次输入：">
          <Input v-model="CenterModal.data.pwd2"></Input>
        </FormItem>
        <FormItem label="头像：">
          <Upload :before-upload="HandleAvator" action="http://api.xrjinrong.com/backend/Auth/adminUserUppwd">
            <Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
          </Upload>
          <img v-show="ShowImg" class="avator-modal" :src="CenterModal.data.img" alt="">
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="ModalCancel" size="large">取消</Button>
        <Button type="primary" @click="SubmitOver" size="large">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { delLocal,getLocal,saveLocal } from '@/util/util'

  export default {
    name: 'app',
    data () {
      const height = window.innerHeight;
      return {
        AvatorImg: '',
        NowPath: '/index',
        RightHeight: `${height}px`,
        contentHeight: `${height - 100}px`,
        currentpath: '',
        openname: ['/auth'],
        contentBg: '#FFFFFF',
        CenterModal:{
          modal: false,
          data: {
            admin_id: '',
            username: '',
            pwd1: '',
            pwd2: '',
            img: ''
          }
        },
        ValidateRules:{
          pwd1:[
            {required: true, message: '密码不能为空！'}
          ],
          pwd2:[
            {required: true, message: '请重复输入相同的密码！'}
          ]
        }
      }
    },
    created(){
      //设置当前路由
      this.CenterModal.data.username = getLocal('username');
      this.CenterModal.data.admin_id = getLocal('admin_id');
      this.AvatorImg = getLocal('avator');
      this.currentpath = getLocal('path');
      if(/consumerDetails/.test(this.currentpath)){
        this.contentBg = '#f5f7f9';
      }else{
        this.contentBg = '#FFFFFF';
      }
      this.NowPath = this.currentpath;
      //设置打开的导航组件
      this.openname[0] = '/'+this.currentpath.split('/')[1];
    },
    mounted(){
      //调整页面高度
      window.onresize = () => {
        this.RightHeight = `${window.innerHeight}px`;
        this.contentHeight = `${window.innerHeight - 100}px`;
      }
    },
    methods: {
      loginOut(){
        //确认退出登录
        this.$Modal.confirm({
          title: '温馨提示',
          content: '<p class="confirm-text">确认退出登录吗？</p>',
          onOk: ()=>{
            window.localStorage.clear();
            saveLocal('path','/login');
            this.$router.push({path:"/"});
          }
        })
      },
      OpenCenter(){
        this.CenterModal.modal = true;
      },
      ModalCancel(){
        this.CenterModal.modal = false;
      },
      SubmitOver(){
        this.$post('/backend/Auth/adminUserUppwd',this.CenterModal.data).then((d)=>{
          if(d.status === 1){
            this.$Message.success(d.message);
            this.AvatorImg = d.data.img;
            saveLocal('avator',d.data.img);
            this.CenterModal.modal = false;
          }else{
            this.$Message.error(d.message);
          }
        }).catch((err)=>{
          this.$Message.error('服务器繁忙，请稍后再试！');
        })
      },
      HandleAvator(file){
        const that = this;
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (f) {
          that.CenterModal.data.img = this.result;
        };
        return false;
      }
    },
    watch: {
      '$route'(){
        const path = this.$route.path;
        this.openname[0] = '/'+path.match(/\/([^\/]*)\//)[1];
        this.currentpath = path;
        this.NowPath = path;
      },
      RightHeight(val){
        //防抖
        if(!this.timer){
          this.RightHeight = val;
          this.timer = true;
          let that = this;
          setTimeout(function(){
              that.timer = false;
          },400)
        }
      }
    },
    computed: {
      ...mapState(['username','authView']),
      ShowImg(){
        if(this.CenterModal.data.img === ''){
          return false;
        }else{
          return true;
        }
      },
      NoPic(){
        if(this.AvatorImg === 'null'){
          return true;
        }else{
          return false;
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  /*html{
    min-height: 100%;
  }*/
  .layout{
    background: #f5f7f9;
    position: relative;
  }
  .layout-breadcrumb{
    padding: 10px 15px 0;
  }
  .layout-content{
    min-height: 840px;
    margin: 15px;
    //overflow: hidden;
    background: #fff;
    border-radius: 4px;
  }
  .layout-content-main{
    padding: 10px;
  }
  .layout-copy{
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
  }
  .layout-menu-left{
    background: #464c5b;
  }
  .layout-header{
    height: 60px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0,0,0,.1);
    .login-out{
      width: 120px;
      height: 60px;
      cursor: pointer;
      font-size: 16px;
      text-align: center;
      line-height: 60px;
      float: right;
      &:hover{
        color: #FFF;
        background: #333;
      }
    }
  }
  .layout-logo-left{
    width: 90%;
    height: 30px;
    line-height: 30px;
    font-size: 18px;
    color: #FFF;
    text-align: center;
    border-radius: 3px;
    margin: 15px auto;
    display: flex;
    justify-content: center;
    .logo{
      display: inline-block;
      width: 35px;
      height: 35px;
    }
  }
  /*右边用户信息*/
  .user-panel{
    position: relative;
    display: flex;
    flex-direction: row;
    width: 100%;
    padding: 10px;
    overflow: hidden;
    background-color: #283238;
    .pull-left{
      display: inline-block;
      padding-right: 10%;
      color: #FFF;
      &.hand{
        cursor: pointer;
      }
      .avator{
        width: 45px;
        object-fit: cover;
        border-radius: 50%;
        margin-right: 3px;
      }
      .text{
        font-size: 16px;
      }
      .state{
        font-size: 14px;
        .icon-state{
          width: 12px;
          height: 12px;
          margin-right: 5px;
          vertical-align: middle;
          border-radius: 50%;
          display: inline-block;
          background-color: #3c763d;
        }
      }
    }
  }
  .avator-modal{
    width: 50px;
    height: 50px;
    display: inline-block;
    object-fit: cover;
    margin-right: 20px;
  }
</style>
