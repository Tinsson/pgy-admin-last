<template>
  <div id="template-edit">
    <h1 class="list-title">
      <span class="tit-text">{{ title }}</span>
    </h1>
    <div class="data-area">
      <Card :padding="0">
        <div class="card-tit" slot="title">
          <h3>
            <Icon type="clipboard"></Icon>
            数据列表
          </h3>
          <div class="btn-box">
            <Button type="warning" size="large" icon="chatbox" @click="AddModeModal">添加模板</Button>
          </div>
        </div>
        <Table :columns="UserCol"
               :data="UserData"
               :loading="loading"></Table>
      </Card>
    </div>
    <!--<Modal
      v-model="ModeModal.modal"
      title="添加模板">
      <Form ref="ModeModal" :model="ModeModal.data" :rules="ValidateRules" label-position="right" :label-width="80">
        <FormItem label="启用状态：">
          <RadioGroup v-model="ModeModal.data.status">
            <Radio :label="0">已关闭</Radio>
            <Radio :label="1">已开启</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="名称：" prop="title">
          <Input v-model="ModeModal.data.title"/>
        </FormItem>
        <FormItem label="英文名：" prop="title_en">
          <Input v-model="ModeModal.data.title_en"/>
        </FormItem>
        <FormItem label="内容：" prop="content">
          <Input v-model="ModeModal.data.content" type="textarea" :autosize="{minRows: 3,maxRows: 5}"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="ModalCancel" size="large">取消</Button>
        <Button type="primary" @click="AddOver" size="large">保存</Button>
      </div>
    </Modal>-->
    <MsgModal :modalShow="ModeModal.modal"
              :isEdit="ModeModal.isEdit"
              :initData="ModeModal.data"
              @CloseModal="ModalCancel"
              @SubModal="AddOver"></MsgModal>
  </div>
</template>

<script>
  import { getLocal } from '@/util/util'
  import MsgModal from '@/components/infoModal/MsgModal'

  export default {
    name: 'TemplateEdit',
    components:{
      MsgModal
    },
    data () {
      return {
        title: '模板编辑',
        apiUrl: '/backend/Autopush/modelList',
        auth_id: '',
        loading: true,
        TextArr:{
          status: ['关闭','开启']
        },
        //添加规则
        ModeModal:{
          modal: false,
          isEdit: {
            status: false,
            id: ''
          },
          data: {
            status: 1,
            name: '',
            title_en: '',
            title: [],
            content: []
          }
        },
        UserCol: [
          {
            title: '序号',
            width: '70',
            align: 'center',
            key: 'id'
          },{
            title: '名称',
            key: 'title'
          },{
            title: '状态',
            key: 'status',
            render: (h, params)=>{
              let text = params.row.status === 1?'开启':'关闭';
              return h("span", text);
            }
          },{
            title: '英文名',
            key: 'title_en'
          },{
            title: '内容',
            key: 'content'
          },{
            title: '操作',
            key: 'operation',
            align: 'center',
            width: '330',
            render: (h, params)=>{
              return h('div',this.RenderBtn(h, params, this.BtnData));
            }
          }
        ],
        ValidateRules:{
          title: [
            {required: true, message: '名称不能为空！'}
          ],
          content: [
            {required: true, message: '内容不能为空！'}
          ],
          title_en: [
            {required: true, message: '英文名不能为空！'}
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
      //循环渲染按钮
      RenderBtn(h,params,bdata){
        let res = [];
        bdata.forEach((val)=>{
          const btn = h('Button',{
            props: {
              type: val.color
            },
            style: {
              marginRight: '5px'
            },
            on: {
              click: ()=>{
                this[val.class](params.row)
              }
            },
          },val.name);
          res.push(btn);
        });
        return res;
      },
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
      //添加模板
      AddModeModal(){
        this.ModeModal.data = {
          status: 1,
          name: '',
          title_en: '',
          title: [],
          content: []
        };
        this.ModeModal.isEdit.status = false;
        this.ModeModal.modal = true;
      },
      ModalCancel(){
        this.ModeModal.modal = false;
      },
      AddOver(data,isEdit){
        const url = isEdit.status?'/backend/Autopush/modelUp':'/backend/Autopush/modelAdd';
        //data.title = data.title.join('');
        //data.content = data.content.join('');
        console.log(isEdit);
        if(isEdit.status){
          data.id = isEdit.id;
        }
        this.$post(url,data).then(()=>{
          this.InitData(this.apiUrl);
          this.ModeModal.modal = false;
        });
        /*this.$refs['ModeModal'].validate(valid=>{
          if(valid){
            this.ModeModal.modal = false;
            let ninfo = this.RemoveObserve(this.ModeModal.data);
            const isEdit = this.ModeModal.isEdit;
            const url = isEdit?'/backend/Autopush/modelUp':'/backend/Autopush/modelAdd';
            if(isEdit){
              ninfo.id = this.ModeModal.id;
            }
            this.UploadData(url,ninfo).then(()=>{
              this.InitData(this.apiUrl);
            });
          }
        });*/

      },
      //修改模板
      EditOpt(row){
        this.ModeModal.data = {
          title: row.title,
          title_en: row.title_en,
          content: row.content,
          status: row.status
        };
        this.ModeModal.isEdit.status = true;
        this.ModeModal.isEdit.id = row.id;
        this.ModeModal.modal = true;
      },
      //删除模版
      Delopt(row){
        this.$Modal.confirm({
          title: '提示',
          content: `<p class="confirm-text">删除此模板？</p>`,
          onOk: ()=>{
            this.UploadData('/backend/Autopush/modelDel',{id: row.id}).then(()=>{
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
