<template>
  <div id="user-config">
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
            <Button type="warning" size="large" icon="wrench" @click="AddModeModal">添加类型</Button>
          </div>
        </div>
        <Table :columns="UserCol"
               :data="UserData"
               :loading="loading"></Table>
      </Card>
    </div>
    <Modal
      v-model="ModeModal.modal"
      title="设置等级">
      <Form ref="ModeModal" :model="ModeModal.data" :rules="ValidateRules" label-position="right" :label-width="100">
        <FormItem label="等级：" prop="level">
          <Input v-model="ModeModal.data.level"></Input>
        </FormItem>
        <FormItem label="分数下限：" prop="between_start">
          <InputNumber v-model="ModeModal.data.between_start"></InputNumber>
        </FormItem>
        <FormItem label="分数上限：" prop="between_end">
          <InputNumber v-model="ModeModal.data.between_end"></InputNumber>
        </FormItem>
        <FormItem label="备注：">
          <Input v-model="ModeModal.data.remark" type="textarea" :rows="3"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="ModalCancel" size="large">取消</Button>
        <Button type="primary" @click="AddOver" size="large">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { getLocal } from '@/util/util'

  export default {
    name: 'UserConfig',
    data () {
      return {
        title: '用户类型配置',
        apiUrl: 'Sysconfig/sysLevelList',
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
            key: 'id'
          },{
            title: '等级',
            key: 'level'
          },{
            title: '分数下限',
            key: 'between_start'
          },{
            title: '分数上限',
            key: 'between_end'
          },{
            title: '备注',
            key: 'remark'
          },{
            title: '操作',
            key: 'operation',
            align: 'center',
            width: '330',
            render: (h, params)=>{
              return h('div',this.$renderBtn(h, params, this.BtnData));
            }
          }
        ],
        ValidateRules:{
          level: [
            {required: true, message: '等级不能为空！'}
          ],
          between_start: [
            {required: true, message: '下限不能为空！'}
          ],
          between_end: [
            {required: true, message: '上限不能为空！'}
          ]
        },
        UserData: [],     //表格数据
        RowUserData: [],  //获取的原始数据
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
        const that = this;
        this.loading = true;
        //获取按钮信息
        this.$fetch('Menuauth/listAuthGet',{auth_id: this.auth_id}).then((d)=>{
          this.BtnData = d.data.operation;
        });
        //列表数据获取
        return new Promise((resolve)=>{
          this.$post(url,params).then((d)=>{
            let res = d.data;
            this.RowUserData = res;
            this.UserData = res;
            if(res.length > 0){
              this.UserData.forEach(val=>{
                for(let key in val){
                  if(key in this.TextArr){
                    val[key] = this.TextArr[key][val[key]];
                  }
                }
              })
            }
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
      //添加操作
      AddModeModal(){
        this.$refs['ModeModal'].resetFields();
        this.ModeModal.data = {
          level: '',
          between_start: 0,
          between_end: 100,
          remark: ''
        };
        this.ModeModal.isEdit = false;
        this.ModeModal.modal = true;
      },
      ModalCancel(){
        this.ModeModal.modal = false;
      },
      AddOver(){
        this.$refs['ModeModal'].validate(valid=>{
          if(valid){
            this.ModeModal.modal = false;
            let ninfo = this.RemoveObserve(this.ModeModal.data);
            const isEdit = this.ModeModal.isEdit;
            const url = isEdit?'Sysconfig/sysLevelUp':'Sysconfig/sysLevelAdd';
            if(isEdit){
              ninfo.id = this.ModeModal.id;
            }
            this.UploadData(url,ninfo).then(()=>{
              this.InitData(this.apiUrl);
            });
          }
        });
      },
      //修改操作
      EditOpt(row){
        this.ModeModal.data = {
          level: row.level,
          between_start: row.between_start,
          between_end: row.between_end,
          remark: row.remark
        };
        this.ModeModal.isEdit = true;
        this.ModeModal.id = row.id;
        this.ModeModal.modal = true;
      },
      //删除用户类型
      Delopt(row){
        this.$Modal.confirm({
          title: '提示',
          content: `<p class="confirm-text">删除此用户类型？</p>`,
          onOk: ()=>{
            this.UploadData('Sysconfig/sysLevelDel',{id: row.id}).then(()=>{
              this.InitData(this.apiUrl);
            });
          }
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
