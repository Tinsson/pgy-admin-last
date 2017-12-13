<template>
  <div id="review-config">
    <h1 class="list-title">
      <span class="tit-text">{{ title }}</span>
    </h1>
    <div class="data-area">
      <Card :padding="0">
        <div class="card-tit" slot="title">
          <h3>
            <Icon type="clipboard"></Icon>
            配置列表
          </h3>
          <div class="btn-box">
          </div>
        </div>
        <Table :columns="UserCol"
               :data="UserData"
               :loading="loading"></Table>
      </Card>
    </div>
  </div>
</template>

<script>
  import { getLocal } from '@/util/util'

  export default {
    name: 'ReviewConfig',
    data () {
      return {
        title: '审核人员配置',
        apiUrl: '/backend/Configvc/verifyList',
        auth_id: '',
        loading: true,
        TextArr:{
          status: ['关闭','开启']
        },
        //添加用户类型
        ModeModal:{
          modal: false,
          isEdit: false,
          id: '',
          data: {
            level: '',
            between_start: 0,
            between_end: 100,
            remark: ''
          }
        },
        UserCol: [
          {
            title: '序号',
            width: '70',
            align: 'center',
            key: 'uid'
          },{
            title: '姓名',
            key: 'admin_name'
          },{
            title: '在职状态',
            key: 'is_status'
          },{
            title: '分配方式',
            key: 'assign_type'
          },{
            title: '操作',
            key: 'operation',
            align: 'center',
            width: '330',
            render: (h, params)=>{
              //需要判断人员是否离职
              return h('div',this.$renderBtn(h, params, this.BtnData));
            }
          }
        ],
        UserData: [],     //表格数据
        BtnData: []
      }
    },
    created(){
      this.auth_id = getLocal('auth_id');
      this.InitData(this.apiUrl);
    },
    methods: {
      //去除data数据里绑定的监视器
      RemoveObserve(rowdata){
        return JSON.parse(JSON.stringify(rowdata));
      },
      //初始化数据
      InitData(url,params = {}){
        this.loading = true;
        //获取按钮信息
        this.$fetch('/backend/Menuauth/listAuthGet',{auth_id: this.auth_id}).then((d)=>{
          this.BtnData = d.data.operation;
        });
        //列表数据获取
        return new Promise((resolve)=>{
          this.$post(url,params).then((d)=>{
            let res = d.data;
            if(res.verify_list.length > 0){
              res.verify_list.forEach(val=>{
                val.assign_type = '平均分配';
              });
            }
            this.UserData = res.verify_list;
            this.loading = false;
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
      //离职操作
      QuitOpt(row){
        this.$Modal.confirm({
          title: '提示',
          content: '<p>如果设置离职，该人员下未转化的用户将进行平均分配</p>',
          onOk: () => {
            this.UploadData('/backend/Configvc/equalVerify',{admin_id: row.uid}).then(()=>{
              this.InitData(this.apiUrl);
            })
          },
          okText: '是',
          cancelText: '否'
        });
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
  .col-center{
    text-align: center;
  }
  .auto-height{
    max-height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .info-width{
    width: 200px;
  }
</style>
