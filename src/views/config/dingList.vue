<template>
  <div id="ding-list">
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
            <Button type="warning" @click="AddTemp">添加模板</Button>
          </div>
        </div>
        <Table :columns="UserCol"
               :data="UserData"
               :loading="loading"></Table>
      </Card>
    </div>
    <Modal
      v-model="DingDetail.modal"
      class="ding-modal"
      title="模板详情">
      <p class="ding-title">{{ DingDetail.title }}</p>
      <div class="ding-content">
        <p class="line">
          <span v-for="item in DingDetail.content" :key="item">{{item}}</span>
        </p>
      </div>
      <Row class="ding-btn">
        <Col class="btn-box" v-for="item in DingDetail.btns" :key="item.title" :span="BtnSpan">
          <Button type="info" long size="large">{{item.title}}</Button>
        </Col>
      </Row>
      <div class="ding-footer" slot="footer"></div>
    </Modal>
    <DingModal :modalShow="ModalData.show"
               :isEdit="ModalData.edit"
               :initData="ModalData.data"
               @CloseModal="ModalCancel"
               @SubModal="DingSubmit"></DingModal>
  </div>
</template>

<script>
  import DingModal from '@/components/infoModal/DingModal'

  export default {
    name: 'DingList',
    components: {
      DingModal
    },
    data () {
      return {
        title: '钉钉推送模版',
        apiUrl: '/backend/Dingdingtp/templateList',
        auth_id: '',
        loading: true,
        //模板详情
        DingDetail:{
          modal: false,
          id: '',
          title: '',
          content: [],
          btns: []
        },
        //模板添加编辑模型
        ModalData:{
          edit: {
            status: false,
            id: ''
          },
          show: false,
          data: {}
        },
        UserCol: [
          {
            title: '序号',
            width: '70',
            align: 'center',
            key: 'id'
          },{
            title: '模板名',
            key: 'template_name'
          },{
            title: '英文名',
            key: 'title_en'
          },{
            title: '发送地址',
            key: 'send_url'
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
        UserData: [],     //表格数据
        BtnData: []
      }
    },
    created(){
      this.auth_id = this.$getLocal('auth_id');
      this.InitData(this.apiUrl);
    },
    computed:{
      BtnSpan(){
        return 24 / this.DingDetail.btns.length;
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
            this.UserData = res.template_list;
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
      //查看详情
      DetailsOpt(row){
        this.$post('/backend/Dingdingtp/templateDetail',{id: row.id}).then(d=>{
          const res = d.data.template_detail;
          this.DingDetail.title = res.title.join('');
          this.DingDetail.content = res.content.join('');
          this.DingDetail.btns = res.check_button;
          this.DingDetail.modal = true;
        })
      },
      //编辑模板
      EditOpt(row){
        this.$post('/backend/Dingdingtp/templateDetail',{id: row.id}).then(d=>{
          this.ModalData.data = d.data.template_detail;
          console.log(d.data.template_detail);
          this.ModalData.edit.status = true;
          this.ModalData.edit.id = row.id;
          this.ModalData.show = true;
        })
      },
      //添加模板
      AddTemp(){
        this.ModalData.edit.status = false;
        this.ModalData.show = true;
        this.ModalData.data = {
          type: 'actionCard',
          template_name: '',
          send_url: '',
          title_en: '',
          remark: '',
          title: [],
          content: [],
          check_button: []
        };
      },
      ModalCancel(){
        this.ModalData.show = false;
      },
      DingSubmit(data, is_edit){
        let info = data;
        const url = is_edit.status?'/backend/Dingdingtp/templateEdit':'/backend/Dingdingtp/templateAdd';
        if(is_edit.status){
          info.id = is_edit.id;
        }
        this.UploadData(url,{template_data: JSON.stringify(info)}).then((d)=>{
          this.InitData(this.apiUrl);
          this.ModalCancel();
        })
      },
      Delopt(row){
        this.$Modal.confirm({
          title: '提示',
          content: `<p class="confirm-text">删除此消息模板？</p>`,
          onOk: ()=>{
            this.UploadData('/backend/Dingdingtp/templateDelete',{id: row.id}).then(()=>{
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
  .ding-title{
    font-size: 18px;
    text-align: center;
  }
  .ding-content{
    font-size: 14px;
    padding: 15px 35px;
    .line{
      line-height: 25px;
    }
  }
  .ding-btn{
    padding-top: 10px;
  }
  .btn-box{
    padding: 0 10px;
  }
  .ding-footer{

  }
</style>
