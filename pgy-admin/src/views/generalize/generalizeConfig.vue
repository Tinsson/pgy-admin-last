<template>
  <div id="generalize-config">
    <h1 class="list-title">
      <span class="tit-text">{{ title }}</span>
    </h1>
    <div class="data-area" style="margin-bottom: 20px;">
      <Card :padding="0">
        <div class="card-tit" slot="title">
          <h3>
            <Icon type="images"></Icon>
            图片列表
          </h3>
          <div class="btn-box">
            <Button type="warning" size="large" icon="plus-circled" @click="AddPic">添加图片</Button>
          </div>
        </div>
        <Table :columns="PicCol"
               :data="PicData"
               :loading="picloading"></Table>
      </Card>
    </div>
    <div class="data-area">
      <Card :padding="0">
        <div class="card-tit" slot="title">
          <h3>
            <Icon type="clipboard"></Icon>
            渠道列表
          </h3>
          <div class="btn-box">
            <Button type="warning" size="large" icon="plus-circled" @click="AddChannel">添加渠道</Button>
          </div>
        </div>
        <Table :columns="UserCol"
               :data="UserData"
               :loading="loading"></Table>
      </Card>
    </div>
    <Modal v-model="PicModal.modal" title="设置图片" :width="600">
      <Form ref="PicModal" :model="PicModal.data" :rules="ValidateRules" label-position="right" :label-width="110">
        <FormItem label="图片名称：" prop="title">
          <Input v-model="PicModal.data.title"></Input>
        </FormItem>
        <FormItem label="图片：">
          <Upload :before-upload="HandleAvator" action="http://api.xrjinrong.com/backend/Auth/adminUserUppwd">
            <Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
          </Upload>
          <img v-show="ShowImg" class="pre-pic" :src="PicModal.data.img" alt="">
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="PicCancel" size="large">取消</Button>
        <Button type="primary" @click="PicOver" size="large">保存</Button>
      </div>
    </Modal>
    <Modal
      v-model="ModeModal.modal"
      title="设置推广渠道">
      <Form ref="ModeModal" :model="ModeModal.data" :rules="ValidateRules" label-position="right" :label-width="110">
        <FormItem label="渠道名称：" prop="title">
          <Input v-model="ModeModal.data.title"></Input>
        </FormItem>
        <FormItem label="按钮字体颜色：">
          <ColorPicker v-model="ModeModal.data.code_color" />
        </FormItem>
        <FormItem label="按钮背景颜色：">
          <ColorPicker v-model="ModeModal.data.submit_color" />
        </FormItem>
        <FormItem label="背景图：">
          <Select v-model="ModeModal.data.background_img" style="width: 160px">
            <Option v-for="item in PicJugeData" :value="item.img" :key="item.id">{{item.title}}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="ModalCancel" size="large">取消</Button>
        <Button type="primary" @click="AddOver" size="large">保存</Button>
      </div>
    </Modal>
    <BigPic :modalShow="BigPic.modal"
            :InitData="BigPic.img"
            :maxWidth="500"
            @CloseModal="CloseBigPic"></BigPic>
  </div>
</template>

<script>
  import { getLocal } from '@/util/util'
  import Clipboard from 'clipboard';
  import BigPic from '@/components/infoModal/BigPic'

  export default {
    name: 'GeneralizeConfig',
    components:{
      BigPic
    },
    data () {
      return {
        title: '推广配置',
        apiUrl: 'Promote/promoteList',
        auth_id: '',
        loading: true,
        ClipBoard: {},
        picloading: true,
        PicCol:[
          {
            title: '序号',
            key: 'id'
          },{
            title: '图片名称',
            key: 'title',
          },{
            title: '图片',
            key: 'img',
            align: 'center',
            render: (h, params)=> {
              return h('Button', {
                props: {
                  type: 'text'
                },
                style: {
                  color: 'rgb(59,167,242)'
                },
                on: {
                  click: () => {
                    this.CheckBigPic(params.row.img);
                  }
                }
              }, '查看大图')
            }
          },{
            title: '操作',
            key: 'operation',
            align: 'center',
            width: '330',
            render: (h, params)=>{
              return h('div',this.RenderBtn(h, params, this.PicBtnData));
            }
          }
        ],
        UserCol: [
          {
            title: '序号',
            width: '70',
            align: 'center',
            key: 'id'
          },{
            title: '渠道名称',
            align: 'center',
            key: 'title'
          },{
            title: '创建时间',
            align: 'center',
            key: 'create_at'
          },{
            title: '更新时间',
            key: 'update_at'
          },{
            title: '推广链接',
            key: 'extend_url',
            render: (h, params)=>{
              const Url = window.location.origin + window.location.pathname + '#/extend?code=' + params.row.codebase;
              return h('div',{
                'class': {
                  clipBtn : true
                },
                style:{
                  cursor: 'pointer',
                  color: '#d73435'
                },
                attrs:{
                  src: Url
                }
              },'复制链接')
            }
          },{
            title: '按钮字体颜色',
            key: 'code_color',
            render: (h, params)=>{
              return h('div',[h('span',{
                style: {
                  width: '10px',
                  height: '10px',
                  marginRight: '2px',
                  border: '1px solid #333',
                  display: 'inline-block',
                  backgroundColor: params.row.code_color
                }
              }),h('span',params.row.code_color)])
            }
          },{
            title: '按钮背景颜色',
            key: 'sub_color',
            render: (h, params)=>{
              return h('div',[h('span',{
                style: {
                  width: '11px',
                  height: '11px',
                  marginRight: '2px',
                  border: '1px solid #333',
                  display: 'inline-block',
                  backgroundColor: params.row.submit_color
                }
              }),h('span',params.row.submit_color)])
            }
          },{
            title: '背景图',
            key: 'bg_pic',
            align: 'center',
            render: (h, params)=>{
              return h('Button',{
                props:{
                  type: 'text'
                },
                style:{
                  color: 'rgb(59,167,242)'
                },
                on: {
                  click: ()=>{
                    this.CheckBigPic(params.row.background_img);
                  }
                }
              },'查看大图')
            }
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
        BigPic: {
          modal: false,
          img: ''
        },
        //设置图片
        PicModal:{
          modal: false,
          isEdit: false,
          id: '',
          data: {
            title: '',
            img: ''
          }
        },
        //设置推广渠道
        ModeModal:{
          modal: false,
          isEdit: false,
          id: '',
          data: {
            title: '',
            code_color: '#ffd225',
            submit_color: '#ffd225',
            background_img: ''
          }
        },
        ValidateRules:{
          title: [
            {required: true, message: '渠道名称不能为空！'}
          ]
        },
        PicData: [],      //图片数据
        UserData: [],     //表格数据
        PicBtnData: [{
          name: '编辑',
          color: 'primary',
          class: 'EditPic'
        },{
          name: '删除',
          color: 'error',
          class: 'DelPic'
        }],    //图片按钮数据
        BtnData: [],      //按钮数据
        RowUserData: [],  //获取的原始数据
      }
    },
    created(){
      this.auth_id = getLocal('auth_id');
      this.InitPic();
      this.InitData(this.apiUrl,{},1);
    },
    mounted(){
      //剪切板功能
      this.ClipBoard = new Clipboard('.clipBtn',{
        text: function(elm){
          return elm.getAttribute('src');
        }
      });
      this.ClipBoard.on('success',(e)=>{
        this.$Message.success('链接粘贴成功！');
      })
    },
    destroyed() {
      this.ClipBoard.destroy();
    },
    computed:{
      ShowImg(){
        if(this.PicModal.data.img === ''){
          return false;
        }else{
          return true;
        }
      },
      PicJugeData(){
        if(this.PicData.length > 0){
          return this.PicData;
        }else{
          return [{
            id: 0,
            title: '',
            img: ''
          }]
        }
      }
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
      //初始图片数据
      InitPic(){
        this.picloading = true;
        this.$post('Promote/imgList').then(d=>{
          this.PicData = d.data;
          this.picloading = false;
        })
      },
      //初始化数据
      InitData(url,params = {},isinit = 0){
        const that = this;
        this.loading = true;
        //列表数据获取
        return new Promise((resolve)=>{
          this.$post(url,params).then((d)=>{
            let res = d.data;
            this.RowUserData = res;
            this.$fetch('Menuauth/listAuthGet',{auth_id: this.auth_id}).then((d)=>{
              this.BtnData = d.data.operation;
              this.UserData = res;
              that.loading = false;
              resolve();
            });

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
      //查看大图
      CheckBigPic(img){
        this.BigPic.img = img;
        this.BigPic.modal = true;
      },
      CloseBigPic(){
        this.BigPic.modal = false;
      },
      //添加推广渠道
      AddChannel(){
        this.$refs['ModeModal'].resetFields();
        this.ModeModal.data = {
          title: '',
          code_color: '#ffd225',
          submit_color: '#ffd225',
          background_img: ''
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
            const url = isEdit?'Promote/promoteEdit':'Promote/promoteAdd';
            if(isEdit){
              ninfo.id = this.ModeModal.id;
            }
            this.UploadData(url,ninfo).then(()=>{
              this.InitData(this.apiUrl);
            });
          }
        });
      },
      //编辑推广渠道
      EditOpt(row){
        this.ModeModal.data = {
          title: row.title,
          code_color: row.code_color,
          submit_color: row.submit_color,
          background_img: row.background_img
        };
        this.ModeModal.isEdit = true;
        this.ModeModal.id = row.id;
        this.ModeModal.modal = true;
      },
      Delopt(row){
        this.$Modal.confirm({
          title: '提示',
          content: `<p class="confirm-text">删除此推广渠道吗？</p>`,
          onOk: ()=>{
            this.UploadData('Promote/promoteDel',{id: row.id}).then(()=>{
              this.InitData(this.apiUrl);
            });
          }
        })
      },
      //编辑图片
      AddPic(){
        this.$refs['PicModal'].resetFields();
        this.PicModal.data = {
          title: '',
          img: ''
        };
        this.PicModal.isEdit = false;
        this.PicModal.modal = true;
      },
      EditPic(row){
        this.PicModal.data = {
          title: row.title,
          img: row.img
        };
        this.PicModal.isEdit = true;
        this.PicModal.id = row.id;
        this.PicModal.modal = true;
      },
      PicCancel(){
        this.PicModal.modal = false;
      },
      PicOver(){
        this.$refs['PicModal'].validate(valid=>{
          if(valid){
            this.PicModal.modal = false;
            let ninfo = this.RemoveObserve(this.PicModal.data);
            const isEdit = this.PicModal.isEdit;
            const url = isEdit?'Promote/imgEdit':'Promote/imgAdd';
            if(isEdit){
              ninfo.id = this.PicModal.id;
            }
            this.UploadData(url,ninfo).then(()=>{
              this.InitPic();
            });
          }
        });
      },
      DelPic(row){
        this.$Modal.confirm({
          title: '提示',
          content: `<p class="confirm-text">删除此图片吗？</p>`,
          onOk: ()=>{
            this.UploadData('Promote/imgDel',{id: row.id}).then(()=>{
              this.InitPic();
            });
          }
        })
      },
      HandleAvator(file){
        const that = this;
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (f) {
          that.PicModal.data.img = this.result;
        };
        return false;
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
  .card-box{
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-bottom: 20px;
    .sim-card{
      position: relative;
      width: 24%;
      padding: 15px;
      color: #FFF;
      overflow: hidden;
      cursor: pointer;
      border-radius: 5px;
      background-color: #c3c3c3;
      .title{
        font-size: 16px;
      }
      .value{
        padding: 5px 0;
        font-size: 18px;
        .num{
          font-size: 40px;
        }
      }
      .tips{
        position: absolute;
        transition: all 0.1s linear;
        bottom: -20px;
        right: 20px;
        font-size: 14px;
      }
      &:hover{
        .tips{
          bottom: 10px;
        }
      }
      .icon{
        position: absolute;
        right: 20px;
        top: 20px;
        font-size: 60px;
      }
      &.cur{
        background-color: #2db7f5;
        &:hover{
          .tips{
            bottom: -20px;
          }
        }
      }
    }
  }
  .pre-pic{
    max-width: 450px;
    display: inline-block;
  }
</style>
