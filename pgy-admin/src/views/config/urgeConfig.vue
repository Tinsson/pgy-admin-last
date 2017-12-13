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
            <RadioGroup v-model="ModeType.type">
              <p class="ipt-line">
                <Radio :label="1" :disabled="!ModeType.edit">按人数</Radio>
                <span class="after-info" v-show="AccordPerson">
                  每
                  <Input v-show="ModeType.edit" class="line-control" v-model="ModeType.number"></Input>
                  <span class="value" v-show="!ModeType.edit">{{ ModeType.number }}</span>
                  <span class="unit">人</span>
                </span>
              </p>
              <p class="ipt-line">
                <Radio :label="2" :disabled="!ModeType.edit">按时间</Radio>
                <span class="after-info" v-show="!AccordPerson">
                  每
                  <Input class="line-control" v-show="ModeType.edit" v-model="ModeType.number"></Input>
                  <Select class="line-control" v-show="ModeType.edit" v-model="ModeType.per">
                    <Option value="day">天</Option>
                    <Option value="week">周</Option>
                    <Option value="month">月</Option>
                  </Select>
                  <span class="value" v-show="!ModeType.edit">{{ModeType.number}}</span>
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
          </div>
        </div>
        <Table :columns="UserCol"
               :data="UserData"
               :loading="loading"></Table>
      </Card>
    </div>
    <Modal
      v-model="ModeModal.modal"
      title="主动分配">
      <p class="assign-line">
        <span>分 <span class="assign-name">{{ ModeModal.name }}</span> 的所有用户给</span>
        <Select v-model="ModeModal.give_user" style="width: 120px">
          <Option v-for="item in SelectData" :value="item.uid" :key="item.uid">{{item.name}}</Option>
        </Select>
      </p>
      <div slot="footer">
        <Button type="text" @click="AssignCancel" size="large">取消</Button>
        <Button type="primary" @click="AssignSub" size="large">提交分配</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: 'UserConfig',
    data () {
      return {
        title: '催收人员配置',
        apiUrl: '/backend/Configvc/collectionList',
        auth_id: '',
        loading: true,
        ModeType:{
          edit: false,
          type: 1,
          number: 11,
          per: 'circle'
        },
        TextArr:{
          status: ['离职','在职'],
          tunit: {
            day:'天',
            week:'周',
            month:'月',
            circle: '人'
          }
        },
        //主动分配
        ModeModal:{
          modal: false,
          uid: 0,
          name: '',
          give_user: ''
        },
        UserCol: [
          {
            title: '序号',
            width: '70',
            align: 'center',
            key: 'uid'
          },{
            title: '名称',
            key: 'admin_name'
          },{
            title: '状态',
            key: 'is_status'
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
        BtnData: []
      }
    },
    created(){
      this.auth_id = this.$getLocal('auth_id');
      this.InitData(this.apiUrl);
    },
    computed:{
      AccordPerson(){
        return this.ModeType.type === 1?true:false;
      },
      TimeUnit(){
        return this.TextArr.tunit[this.ModeType.per];
      },
      SelectData(){
        let data = [];
        this.UserData.forEach(val=>{
          if(val.uid !== this.ModeModal.uid){
            data.push({
              uid: val.uid,
              name: val.admin_name
            })
          }
        })
        return data;
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
            this.UserData = res.collection_list;
            res.config_list.forEach(val=>{
              if(val.is_used){
                this.ModeType.type = val.type;
                this.ModeType.number = val.number;
                this.ModeType.per = val.per;
              }
            });
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
            if(this.ModeType.type === 1){
              this.ModeType.per = 'circle';
            }
            this.UploadData('/backend/Configvc/updateConfig',{
              type: this.ModeType.type,
              number: this.ModeType.number,
              per: this.ModeType.per
            }).then(()=>{
              this.ModeType.edit = false;
            });
            break;
          case 'cancel':
            this.ModeType.edit = false;
            break
        }
      },
      //离职操作
      QuitOpt(row){
        this.$Modal.confirm({
          title: '提示',
          content: `<p class="confirm-text">确认该催收人员离职吗？</p>`,
          onOk: ()=>{
            this.UploadData('/backend/Configvc/equalCollection',{admin_id: row.uid}).then(()=>{
              this.InitData(this.apiUrl);
            });
          }
        });
      },
      //主动分配操作
      AssignUrge(row){
        this.ModeModal.uid = row.uid;
        this.ModeModal.name = row.admin_name;
        this.ModeModal.modal = true;
      },
      AssignCancel(){
        this.ModeModal.modal = false;
      },
      AssignSub(){
        this.UploadData('',{}).then(()=>{
          this.InitData(this.apiUrl);
          this.ModeModal.modal = false;
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
  .assign-line{
    text-align: center;
    .assign-name{
      font-size: 16px;
      color: #d73435;
    }
  }
</style>
