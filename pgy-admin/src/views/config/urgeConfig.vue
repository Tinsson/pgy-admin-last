<template>
  <div id="user-config">
    <h1 class="list-title">
      <span class="tit-text">{{ title }}</span>
    </h1>
    <div class="data-area">
      <Card>
        <div class="card-tit" slot="title">
          <h3>
            <Icon type="settings"></Icon>
            分配方式
          </h3>
        </div>
        <div class="mode-area">
          <div class="ipt-area">
            <RadioGroup v-model="ModeType.status">
              <p class="ipt-line">
                <Radio :label="0">按人数</Radio>
                <span class="after-info" v-show="AccordPerson">
                  每
                  <Input v-show="ModeType.edit" class="line-control" v-model="ModeType.person"></Input>
                  <span class="value" v-show="!ModeType.edit">{{ ModeType.person }}</span>
                  <span class="unit">人</span>
                </span>
              </p>
              <p class="ipt-line">
                <Radio :label="1">按时间</Radio>
                <span class="after-info" v-show="!AccordPerson">
                  每
                  <Input class="line-control" v-show="ModeType.edit" v-model="ModeType.time"></Input>
                  <Select class="line-control" v-show="ModeType.edit" v-model="ModeType.tunit">
                    <Option :value="1">天</Option>
                    <Option :value="2">周</Option>
                    <Option :value="3">月</Option>
                  </Select>
                  <span class="value" v-show="!ModeType.edit">{{ModeType.time}}</span>
                  <span class="unit" v-show="!ModeType.edit">{{ TimeUnit }}</span>
                </span>
                <span class="sub-btn">
                  <Button type="info" v-show="!ModeType.edit" @click="ModeBtn('fix')">修改</Button>
                  <Button type="success" v-show="ModeType.edit" @click="ModeBtn('sub')">保存</Button>
                  <Button type="error" v-show="ModeType.edit" @click="ModeBtn('cancel')">取消</Button>
                </span>
              </p>
            </RadioGroup>
          </div>
        </div>
      </Card>
    </div>
    <div class="data-area">
      <Card :padding="0">
        <div class="card-tit" slot="title">
          <h3>
            <Icon type="clipboard"></Icon>
            人员列表
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
        <FormItem label="备注：">
          <Input v-model="ModeModal.data.remark"></Input>
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
        title: '催收人员配置',
        apiUrl: '/backend/Sysconfig/sysLevelList',
        auth_id: '',
        loading: true,
        ModeType:{
          edit: false,
          status: 0,
          person: 11,
          time: 11,
          tunit: 1
        },
        TextArr:{
          status: ['离职','在职'],
          tunit: ['天','周','月']
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
            title: 'name',
            key: 'level'
          },{
            title: 'id',
            key: 'between_start'
          },{
            title: '状态',
            key: 'between_end'
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
    computed:{
      AccordPerson(){
        return this.ModeType.status === 0?true:false;
      },
      TimeUnit(){
        return this.TextArr.tunit[this.ModeType.tunit - 1];
      }
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
        this.$fetch('/backend/Menuauth/listAuthGet',{auth_id: this.auth_id}).then((d)=>{
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
      //配置按钮操作
      ModeBtn(type){
        switch(type){
          case 'fix':
            this.ModeType.edit = true;
            break;
          case 'sub':
            this.UploadData('',{}).then(()=>{
              this.ModeType.edit = false;
            });
            break;
          case 'cancel':
            this.ModeType.edit = false;
            break
        }
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
            const url = isEdit?'/backend/Sysconfig/sysLevelUp':'/backend/Sysconfig/sysLevelAdd';
            if(isEdit){
              ninfo.id = this.ModeModal.id;
            }
            this.UploadData(url,ninfo).then(()=>{
              this.InitData(this.apiUrl);
            });
          }
        });
      },
      //离职操作
      QuitOpt(row){

      },
      //主动分配操作
      AssignUrge(row){

      },
      //删除用户类型
      Delopt(row){
        this.$Modal.confirm({
          title: '提示',
          content: `<p class="confirm-text">删除此用户类型？</p>`,
          onOk: ()=>{
            this.UploadData('/backend/Sysconfig/sysLevelDel',{id: row.id}).then(()=>{
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
  .ipt-line{
    padding-bottom: 10px;
    width: 450px;
    position: relative;
    .after-info{
      margin-left: 20px;
      .unit,.value{
        margin-left: 10px;
      }
    }
    .sub-btn{
      position: absolute;
      bottom: 11px;
      right: 0;
    }
  }
  .line-control{
    width: 70px;
    margin-left: 10px;
    display: inline-block;
  }
</style>
