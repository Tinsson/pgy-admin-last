<template>
  <div id="commission-formula">
    <h1 class="list-title">
      <span class="tit-text">{{ title }}</span>
    </h1>
    <Card>
      <div class="card-tit" slot="title">
        <h3>
          <Icon type="pricetags"></Icon>
          参数列表
        </h3>
        <div class="btn-box">
          <Button type="info" size="large" icon="wrench" @click="AddParamModal">添加参数</Button>
        </div>
      </div>
      <Row type="flex" justify="space-between">
        <Col :span="11">
          <h4 class="table-tit">无参数值</h4>
          <Table :columns="ParamsTable.FixedCol" :data="ParamsTable.FixedData"></Table>
        </Col>
        <Col :span="11">
          <h4 class="table-tit">有参数值</h4>
          <Table :columns="ParamsTable.DynamicCol" :data="ParamsTable.DynamicData"></Table>
        </Col>
      </Row>
    </Card>
    <div class="data-area">
      <Card :padding="0">
        <div class="card-tit" slot="title">
          <h3>
            <Icon type="clipboard"></Icon>
            支付公式列表
          </h3>
          <div class="btn-box">
            <Button type="warning" size="large" icon="wrench" @click="AddModeModal">添加支付公式</Button>
          </div>
        </div>
        <Table :columns="UserCol"
               :data="UserData"
               :loading="loading"></Table>
      </Card>
    </div>
    <Modal v-model="ParamsModal.modal"
           title="设置参数">
      <Form ref="ParamsModal" :model="ParamsModal.data" :rules="ValidateRules" label-position="right" :label-width="100">
        <FormItem label="参数名称：" prop="name_cn">
          <Input v-model="ParamsModal.data.name_cn"></Input>
        </FormItem>
        <FormItem label="参数代号：" prop="name_en">
          <Input v-model="ParamsModal.data.name_en"></Input>
        </FormItem>
        <FormItem label="状态：">
          <RadioGroup v-model="ParamsModal.data.status">
            <Radio :label="0">关闭</Radio>
            <Radio :label="1">开启</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="可编辑：">
          <RadioGroup v-model="ParamsModal.data.variable" @on-change="EditJudge">
            <Radio :label="0">否</Radio>
            <Radio :label="1">是</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="参数值">
          <Input v-model="ParamsModal.data.content" :disabled="ParamsModal.disable"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="ModalCancel('ParamsModal')" size="large">取消</Button>
        <Button type="primary" @click="AddOver('ParamsModal','Commission/resultparmEdit','Commission/resultparmAdd')" size="large">保存</Button>
      </div>
    </Modal>
    <Modal
      v-model="ModeModal.modal"
      title="设置支付公式"
      :width="650">
      <Form ref="ModeModal" :model="ModeModal.data" :rules="ValidateRules" label-position="right" :label-width="100">
        <FormItem label="公式标题：" prop="title_cn">
          <Input v-model="ModeModal.data.title_cn"></Input>
        </FormItem>
        <FormItem label="英文标题：" prop="title_en">
          <Input v-model="ModeModal.data.title_en"></Input>
        </FormItem>
        <FormItem label="公式内容：">
          <Input v-model="FormulaEditText" type="textarea" :rows="2" readonly></Input>
          <div class="chose-box">
            <Select v-model="ParamsEdit" style="width:220px">
              <Option v-for="item in SelectParams" :value="item.id" :key="item.id">{{ `${item.name_cn}　${item.name_en}` }}</Option>
            </Select>
            <Button type="success" @click="FormulaAdd" style="margin-left: 5px">添加</Button>
            <Button type="error" @click="FormulaDel" style="margin-left: 15px">回删</Button>
          </div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="ModalCancel('ModeModal')" size="large">取消</Button>
        <Button type="primary" @click="AddOver('ModeModal','Commission/resultsFormulaEdit','Commission/resultsFormulaAdd')" size="large">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { getLocal } from '@/util/util'

  export default {
    name: 'CommissionFormula',
    data () {
      return {
        title: '业绩公式配置',
        apiUrl: 'Commission/resultsFormulaList',
        auth_id: '',
        loading: true,
        ParamsModal:{
          modal: false,
          isEdit: false,
          id: '',
          disable: true,
          data: {
            name_cn: '',
            name_en: '',
            status: 1,
            variable: 0,
            content: ''
          }
        },
        ParamsAll: {
          BaseAll: [],
          AssemAll: []
        },
        ParamsEdit: '',
        FormulaEditArr: [],
        ParamsTable:{
          FixedCol:[{
            title: '参数名称',
            key: 'name_cn'
          },{
            title: '参数代号',
            key: 'name_en'
          },{
            title: '状态',
            key: 'status'
          },{
            title: '操作',
            key: 'operation',
            align: 'center',
            width: '180',
            render: (h, params)=>{
              return h('div',this.RenderBtn(h, params, [{
                color: 'primary',
                name: '修改',
                class: 'EditParams'
              }]));
            }
          }],
          FixedData: [],
          DynamicCol: [{
            title: '参数名称',
            key: 'name_cn'
          },{
            title: '参数代号',
            key: 'name_en'
          },{
            title: '参数值',
            key: 'content'
          },{
            title: '状态',
            key: 'status'
          },{
            title: '操作',
            key: 'operation',
            align: 'center',
            width: '180',
            render: (h, params)=>{
              return h('div',this.RenderBtn(h, params, [{
                color: 'primary',
                name: '修改',
                class: 'EditParams'
              }]));
            }
          }],
          DynamicData: []
        },
        TextArr:{
          status: ['关闭','开启']
        },
        //添加公式内容
        ModeModal:{
          modal: false,
          isEdit: false,
          id: '',
          data: {
            title_cn: '',
            title_en: '',
            status: 1,
            content: ''
          }
        },
        UserCol: [
          {
            title: '序号',
            width: '70',
            align: 'center',
            key: 'id'
          },{
            title: '公式名称',
            key: 'title_cn'
          },{
            title: '英文代号',
            key: 'title_en'
          },{
            title: '公式内容',
            key: 'zid',
            render: (h, params)=>{
              return h('span',this.RenderFormula(params.row.zid));
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
        ValidateRules:{
          title_cn: [
            {required: true, message: '公式标题不能为空！'}
          ],
          title_en: [
            {required: true, message: '公式英文标题不能为空！'}
          ],
          content: [
            {required: true, message: '公式内容不能为空！'}
          ],
          name_cn: [
            {required: true, message: '参数名称不能为空！'}
          ],
          name_en: [
            {required: true, message: '参数代号不能为空！'}
          ]
        },
        UserData: [],     //表格数据
        RowUserData: [],  //获取的原始数据
        BtnData: []
      }
    },
    created(){
      this.auth_id = getLocal('auth_id');
      this.GetBaseParams();
      this.InitData(this.apiUrl);
    },
    computed:{
      //参数
      SelectParams(){
        return this.ParamsAll.BaseAll;
      },
      FormulaEditText(){
        let text = '';
        if(this.FormulaEditArr.length > 0){
          this.FormulaEditArr.forEach(id=>{
            this.ParamsAll.BaseAll.forEach(val=>{
              if(parseInt(id) === val.id){
                text += val.name_en;
              }
            })
          });
        }
        return text;
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
      //渲染公式
      RenderFormula(zid){
        let text = '';
        if(zid.length > 0){
          zid.split(',').forEach(id=>{
            this.ParamsAll.BaseAll.forEach(val=>{
              if(parseInt(id) === val.id){
                text += val.name_en;
              }
            })
          })
        }
        return text;
      },
      //去除data数据里绑定的监视器
      RemoveObserve(rowdata){
        return JSON.parse(JSON.stringify(rowdata));
      },
      //获取基础参数
      GetBaseParams(){
        this.$fetch('Commission/resultparmList').then(d=>{
          const paramsAll = d.data;
          let fixedInit = [],dynamicInit = [];
          this.ParamsAll.BaseAll = paramsAll;
          paramsAll.forEach(val=>{
            if(val.variable === 0){
              fixedInit.push(val);
            }else{
              dynamicInit.push(val);
            }
          })
          this.ParamsTable.FixedData = fixedInit;
          this.ParamsTable.DynamicData = dynamicInit;
        });
      },
      //初始化公式数据
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
            if(res === null){
              return false;
            }
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
      //提取列表公式
      GetListFormula(id){
        let listParams = [];
        this.UserData.forEach(val=>{
          const params = {
            name_cn: val.title_cn,
            name_en: val.title_en
          };
          if(val.id !== id){
            listParams.push(params);
          }
        });
        return listParams;
      },
      //添加配置
      AddModeModal(){
        this.$refs['ModeModal'].resetFields();
        this.ModeModal.data = {
          title_cn: '',
          title_en: '',
          zid: ''
        };
        this.FormulaEditArr = [];
        this.ParamsAll.AssemAll = this.GetListFormula();
        this.ModeModal.isEdit = false;
        this.ModeModal.modal = true;
      },
      ModalCancel(modal){
        this[modal].modal = false;
      },
      AddOver(modal,editUrl,addUrl){
        this.$refs[modal].validate(valid=>{
          if(valid){
            this[modal].modal = false;
            let ninfo = this.RemoveObserve(this[modal].data);
            const isEdit = this[modal].isEdit;
            const url = isEdit?editUrl:addUrl;
            if(isEdit){
              ninfo.id = this[modal].id;
            }
            if(modal === 'ModeModal'){
              ninfo.zid = this.FormulaEditArr.join(',');
            }
            this.UploadData(url,ninfo).then(()=>{
              this.InitData(this.apiUrl);
              this.GetBaseParams();
            });
          }
        });
      },
      //添加参数
      AddParamModal(){
        this.$refs['ParamsModal'].resetFields();
        this.ParamsModal.data = {
          name_cn: '',
          name_en: '',
          status: 1,
          variable: 0,
          content: ''
        };
        this.ParamsModal.disable = true;
        this.ParamsModal.isEdit = false;
        this.ParamsModal.modal = true;
      },
      EditJudge(val){
        this.ParamsModal.disable = (val === 0)?true:false;
      },
      //修改配置
      EditOpt(row){
        this.ParamsAll.AssemAll = this.GetListFormula(row.id);
        this.ModeModal.data = {
          title_cn: row.title_cn,
          title_en: row.title_en,
          zid: row.zid
        };
        this.FormulaEditArr = row.zid.split(',');
        this.ModeModal.isEdit = true;
        this.ModeModal.id = row.id;
        this.ModeModal.modal = true;
      },
      //修改参数
      EditParams(row){
        this.ParamsModal.data = {
          name_cn: row.name_cn,
          name_en: row.name_en,
          status: row.status === '关闭'?0:1,
          variable: row.variable,
          content: row.variable?row.content:''
        };
        this.ParamsModal.isEdit = true;
        this.ParamsModal.disable = row.variable?false:true;
        this.ParamsModal.id = row.id;
        this.ParamsModal.modal = true;
      },
      //删除参数
      DelParams(row){
        //删除确认
        this.$Modal.confirm({
          title: '温馨提示',
          content: '<p class="confirm-text">确认删除此参数吗？</p>',
          onOk: ()=>{
            this.UploadData('Sysconfig/sysFormulaBDel',{id: row.id}).then(()=>{
              this.GetBaseParams();
            });
          }
        })
      },
      FormulaAdd(){
        this.FormulaEditArr.push(this.ParamsEdit);
      },
      FormulaDel(){
        this.FormulaEditArr.pop();
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
  .table-tit{
    font-size: 14px;
    padding-bottom: 15px;
  }
  .chose-box{
    display: flex;
    flex-direction: row;
    padding-top: 15px;
  }
</style>
