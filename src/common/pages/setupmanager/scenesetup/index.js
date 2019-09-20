import React from 'react'
import { render } from 'react-dom'
import {Button, message, Modal,Collapse,Table, Divider, Tag,Icon,Tabs,Input,Upload} from 'antd'
import 'whatwg-fetch'
import './index.less'
import axios from 'axios'
import {PATH,URL} from '../../../utils/urls'
import Map from '../../../images/svg/map2.svg';
import BreadcrumbCustom from "../../../components/BreadcrumbCustom";
import edit from '../../../images/operation/edit.png';
import deletes from '../../../images/operation/deletes.png';
import editBtn from "../../../images/icon/editbtn.png";
import delBtn from "../../../images/icon/delbtn.png";
import markItem from "../../../images/icon/mark_item.png";

const {Panel}=Collapse;
const { TabPane } = Tabs;
const props = {
    listType: 'picture',
    defaultFileList: [],
};
export default class SceneSetUp extends React.Component {
    columns2 = [
        {
            title: '名称',
            dataIndex: 'sceneName',
            key: 'sceneName',
        },
        {
            title: '正常图标',
            dataIndex: 'sceneIcon',
            key: 'sceneIcon',
            render:(text, record)=>(
                <img src={record.sceneIcon} className="wrapper-class-name2"/>
            )
        },
        {
            title: '告警图标',
            dataIndex: 'sceneWarnIcon',
            key: 'sceneWarnIcon',
            render:(text, record)=>(
                <img src={record.sceneWarnIcon} className="wrapper-class-name2"/>
            )
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => {
                return (<span>
                    {
                        this.state.sceneEditBool?(
                            <span>
                                <span><a href="javascript:void(0);" onClick={this.changeAreaScene.bind(this,{record})} title={'编辑场景'}><img src={editBtn}/></a> </span>
                                <span><a href="javascript:void(0);" onClick={this.setAreaSceneCell.bind(this,{record})} title={'编辑场景元素'}><img src={markItem}/></a> </span>
                            </span>
                        ):null
                    }
                    {
                        this.state.sceneRemoveBool?(
                            <span> <a href="javascript:void(0);" onClick={this.delectAreaScene.bind(this,{record})} title={'删除'}><img src={delBtn}/></a></span>
                        ):null
                    }
                </span>)
            },
        },
    ];

    data2 = [
        {
            key: '1',
            icon:Map,
            preview: Map,
            name:'区域1'
        },{
            key: '2',
            icon:Map,
            preview: Map,
            name:'区域2'
        },{
            key: '3',
            icon:Map,
            preview: Map,
            name:'区域3'
        },{
            key: '4',
            icon:Map,
            preview: Map,
            name:'区域4'
        }
    ];
    constructor(props) {
        super(props)
        this.state = {
            addBtnVisible:false,//是否显示新增主背景按钮
            mainSceneData:[],
            areaSceneData:[],
            sceneAddBool:false,//添加场景权限
            sceneEditBool:false,//编辑场景权限
            sceneRemoveBool:false,//删除场景权限
            hostname:"",//域名
            origin:"",
            addOrChangeAreaScene:false,//是否显示添加或者编辑区域场景弹窗
            selectAreaSceneData:{
                id:"",//当id为空时，为新建区域场景，当不为空时为编辑区域底图
                sceneIcon:"",//场景icon
                sceneImg:"",//场景底图
                sceneWarnIcon:"",//场景预警图标
                sceneName:"",
                sceneStatus:0,//场景状态1启用 0未启用
                locationX:16,
                locationY:16,
                sceneIconVisible:false,//场景icon是否显示
                sceneImgVisible:false,//场景底图是否显示
                sceneWarnIconVisible:false//场景预警图标是否显示
            },//当前选中编辑区域场景的数据，当为添加区域场景时为null
            editMainSceneBool:false,//编辑主场景弹窗是否显示
            setMainSceneData:{//主场景编辑数据
                pathUrl:"",
            },
            tabActivityKey:"1"
        }

        //判断按钮权限
        let permList = localStorage.getItem("permList");
        if(permList.indexOf("pzgl:scene:edit")>=0){
            this.state.sceneEditBool = true;
        }
        if(permList.indexOf("pzgl:scene:add")>=0){
            this.state.sceneAddBool = true;
        }
        if(permList.indexOf("pzgl:scene:remove")>=0){
            this.state.sceneRemoveBool = true;
        }

        console.log(this.state);

        this.state.hostname = "http://"+localStorage.getItem("hostname");
        this.state.origin = localStorage.getItem("origin");
    }

    componentDidMount(){
        //获取主底图资源
        this.getMainSceneFun();
        //获取区域场景资源列表
        this.getAreaSceneFun();

        console.log(this.props);
        if(this.props.location.state){
            this.setState({
                tabActivityKey:this.props.location.state.tabActivityKey
            })
        }
    }

    /**
     * 修改主场景底图
     * @param props0
     */
    mainSceneChangeClick=(props0)=>{
        this.setState({
            editMainSceneBool:true
        })
    }

    /**
     * 设置场景元素
     * @returns {*}
     */
    setMainSceneCell =(props0)=>{
        console.log(props0);
        let path = {
            pathname:"/setmainscenes",
            state:props0
        }
        this.props.history.push(path);
    }

    /**
     * 区域场景修改
     * @returns {*}
     */
    changeAreaScene=(props0)=>{
        this.state.selectAreaSceneData = {
            ...props0.record,
            sceneIconVisible:true,
            sceneImgVisible:true,
            sceneWarnIconVisible:true,
        }
        this.setState({
            addOrChangeAreaScene:true,
            selectAreaSceneData:this.state.selectAreaSceneData
        })
    }

    /**
     * 设置区域场景元素
     * @returns {*}
     */
    setAreaSceneCell=(props0)=>{
        let path = {
            pathname:"/setareacell",
            state:props0.record
        }
        this.props.history.push(path);
    }

    /**
     * 删除区域场景
     * @returns {*}
     */
    delectAreaScene=(props)=>{
        Modal.confirm({
            title: '提示',
            content: '是否确认删除？',
            okText: '取消',
            cancelText: '确认',
            onCancel:this.delectAreaSceneFun.bind(this,{props}),

        });
    }

    /**
     * 删除区域场景
     * @returns {*}
     */
    delectAreaSceneFun(props){
        axios.post(PATH.removeAreaScene+"?ids="+props.props.record.id,{
            ids:props.props.record.id
        },{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(response=>{
            console.log(response);
            if(response.data.code == 0){
                message.success(response.data.msg);
                //获取区域场景资源列表
                this.getAreaSceneFun();
            }else{
                message.error(response.data.msg);
            }
        })
    }

    /**
     * 获取主底图资源
     * mainSceneImg
     * @returns {*}
     */
    getMainSceneFun=()=>{
        axios.get(PATH.getMineScene,{})
            .then(response=>{
                console.log(response);
                if(response.data.code == 0){
                    //判断是否有主场景数据
                    if(response.data.data.mainSceneImg){
                        let mainSceneData = {
                            preview:this.checkHttp(response.data.data.mainSceneImg)
                        }
                        this.state.setMainSceneData.pathUrl = response.data.data.mainSceneImg;
                        this.setState({
                            mainSceneData:[mainSceneData],
                            setMainSceneData:this.state.setMainSceneData
                        })
                    }else{//如果没有主场景数据，那么现实添加按钮
                        this.setState({
                            addBtnVisible:true
                        })
                    }
                    console.log(this.state.mainSceneData);
                }else{
                    // message.error(response.data.msg)
                }
            })
    }

    /**
     * 获取区域场景资源列表
     */
    getAreaSceneFun=()=>{
        axios.post(PATH.getSceneList,{})
            .then(response=>{
                console.log(response);
                if(response.data.code == 0){
                    let dataArray = response.data.data;
                    for(let i = 0;i<dataArray.length;i++){
                        dataArray[i].sceneImg=(this.checkHttp(dataArray[i].sceneImg));
                        dataArray[i].sceneIcon=(this.checkHttp(dataArray[i].sceneIcon));
                        dataArray[i].sceneWarnIcon=(this.checkHttp(dataArray[i].sceneWarnIcon));
                    }
                    this.setState({
                        areaSceneData:dataArray
                    })
                }else{
                    message.error(response.data.msg);
                }
            })
    }

    /**
     * 添加区域场景
     * @returns {*}
     */
    addAreaFun=()=>{
        this.state.selectAreaSceneData = {
            id:"",//当id为空时，为新建区域场景，当不为空时为编辑区域底图
            sceneIcon:"",//场景icon
            sceneImg:"",//场景底图
            sceneWarnIcon:"",//场景预警图标
            sceneName:"",
            sceneStatus:0,//场景状态1启用 0未启用
            locationX:16,
            locationY:16,
            sceneIconVisible:false,//场景icon是否显示
            sceneImgVisible:false,//场景底图是否显示
            sceneWarnIconVisible:false//场景预警图标是否显示
        }
        this.setState({
            selectAreaSceneData:this.state.selectAreaSceneData,
            addOrChangeAreaScene:true
        },()=>{
            console.log(this.state);
        })
    }

    /**
     * 添加主场景
     * @returns {*}
     */
    addMainSceneFun=()=>{
        let path = {
            pathname:"/changeareascene",
        }
        this.props.history.push(path);
    }

    /**
     * 区域场景添加或者编辑弹出点击确定
     * @param e
     */
    areaSceneHandleOk = e => {
        if(this.state.selectAreaSceneData.locationX<16 || this.state.selectAreaSceneData.locationY<16){
            message.error("尺寸不能小于16");
            return;
        }
        let path = "";
        if(this.state.selectAreaSceneData.id == ""){
            path = PATH.addAreaScene;
        }else{
            path = PATH.editAreaScene;
        }
        axios.post(path,this.state.selectAreaSceneData).then(response=>{
            console.log(response);
            if(response.data.code == 0){
                message.success(response.data.msg)
                //获取区域场景资源列表
                this.getAreaSceneFun();
            }else{
                message.error(response.data.msg);
            }
        })
        this.setState({
            addOrChangeAreaScene: false,
        });
    };
    /**
     * 区域场景添加或者编辑弹出点击取消
     * @param e
     */
    areaSceneHandleCancel = e => {
        this.setState({
            addOrChangeAreaScene: false,
        });
    };

    /**
     *场景底图上传
     * @returns {*}
     */
    onChangeSceneImg=({file})=>{
        if (file.status !== 'uploading') {
            const formata = new FormData;
            formata.append("file",file.originFileObj);
            axios.post(PATH.uploadFile,formata)
                .then(response=>{
                    console.log(response);
                    if(response.data.code == 0){
                        this.state.selectAreaSceneData.sceneImg = response.data.url;
                        this.state.selectAreaSceneData.sceneImgVisible = true;
                        this.setState({
                            selectAreaSceneData:this.state.selectAreaSceneData
                        })
                    }
                })
        }
    }

    /**
     *场景icon上传
     * @returns {*}
     */
    onChangeSceneIcon=({file})=>{
        if (file.status !== 'uploading') {
            console.log(file);
            const formata = new FormData;
            formata.append("file",file.originFileObj);
            axios.post(PATH.uploadFile,formata)
                .then(response=>{
                    console.log(response);
                    if(response.data.code == 0){
                        this.state.selectAreaSceneData.sceneIcon = response.data.url;
                        this.state.selectAreaSceneData.sceneIconVisible = true;
                        this.setState({
                            selectAreaSceneData:this.state.selectAreaSceneData
                        })
                    }
                })
        }
    }

    /**
     *场景预警icon上传
     * @returns {*}
     */
    onChangeSceneWarnIcon=({file})=>{
        if (file.status !== 'uploading') {
            console.log(file);
            const formata = new FormData;
            formata.append("file",file.originFileObj);
            axios.post(PATH.uploadFile,formata)
                .then(response=>{
                    if(response.data.code == 0){
                        this.state.selectAreaSceneData.sceneWarnIcon = response.data.url;
                        this.state.selectAreaSceneData.sceneWarnIconVisible = true;
                        this.setState({
                            selectAreaSceneData:this.state.selectAreaSceneData
                        })
                    }
                })
        }
    }

    /**
     * 输入框改变
     * @returns {*}
     */
    inputChange = (event)=>{
        if(event && event.target){
            switch (event.target.id) {
                case "areaSceneName":
                    this.state.selectAreaSceneData.sceneName = event.target.value;
                    break;
                case "areaSceneX":
                    this.state.selectAreaSceneData.locationX = event.target.value;
                    break;
                case "areaSceneY":
                    this.state.selectAreaSceneData.locationY = event.target.value;
                    break;
            }
            this.setState({
                selectAreaSceneData:this.state.selectAreaSceneData
            })
        }
    }

    /**
     * 上传成功图片
     * @param file
     */
    uploadChange=({ file })=>{
        if (file.status !== 'uploading') {
            console.log(file.name);
            const formata = new FormData;
            formata.append("file",file.originFileObj);
            axios.post(PATH.uploadFile,formata)
                .then(response=>{
                    if(response.data.code == 0){
                        this.state.setMainSceneData.pathUrl = response.data.url,
                        this.setState({
                            setMainSceneData:this.state.setMainSceneData
                        })
                        message.success("上传成功！")
                    }
                })
        }
    }

    /**
     * 上传主底图成功后，调用修改主场景接口
     */
    editMainSceneFun=()=>{
        this.setState({
            editMainSceneBool:false
        })
        axios.post(PATH.editMainScene,{
            mainSceneImg:this.state.setMainSceneData.pathUrl
        }).then(response=>{
            console.log(response);
            if(response.data.code == 0){
                //长传成功后，刷新主底图资源
                this.getMainSceneFun();
                message.success(response.data.msg);
            }else{
                message.error(response.data.msg);
            }
        })
    }

    /**
     * 取消修改主场景
     * @returns {*}
     */
    editMainSceneCancleFun=()=>{
        this.setState({
            editMainSceneBool:false
        })
    }

    tabChange=(e)=>{
        console.log(e);
        this.setState({
            tabActivityKey:e
        })
    }

    /**
     * 判断图片路径是否有域名
     * @param url
     * @returns {*}
     */
    checkHttp(url){
        let newUrl=url;
        if(url.indexOf("http://")<0){
            if(this.state.hostname.indexOf("localhost")<0){
                newUrl = this.state.origin+url;
            }else{
                newUrl = URL+url;
            }
        }
        return newUrl;
    }

    render() {
        //添加或者编辑区域场景的样式
        let styleTitle = {};
        if(!this.state.selectAreaSceneData.id){//编辑时提示文字底高度
            styleTitle = {height:"32px",lineHeight:"32px"};
        }else{ //新增时提示文字底高度
            styleTitle = {height:"80px",lineHeight:"80px"};
        }
        console.log(this.state);
        return (
            <div id="sceneManagerDiv">
                <BreadcrumbCustom first="配置管理" second="场景管理" />
                <div className="sceneSetUpDiv">
                    <Tabs activeKey={this.state.tabActivityKey} onChange={this.tabChange}>
                        <TabPane tab="主场景配置" key="1">
                            <div>
                                {
                                    (this.state.sceneAddBool&&this.state.addBtnVisible)?(
                                        <Button className="mainSceneEditBtn" id="addAreaSceneBtn" onClick={this.addMainSceneFun}>添加主场景</Button>
                                    ):null
                                }
                                <Button className="mainSceneEditBtn" onClick={()=>this.mainSceneChangeClick(this.state.mainSceneData[0])}>修改底图</Button>
                                <Button className="mainSceneEditBtn" onClick={()=>this.setMainSceneCell(this.state.mainSceneData[0])}>设置场景元素</Button>
                            </div>
                            <div className="mainSceneDiv">
                                {
                                    this.state.mainSceneData.length>0?(
                                        <img src={this.checkHttp(this.state.mainSceneData[0].preview)} className="wrapper-class-name"/>
                                    ):null
                                }
                            </div>
                        </TabPane>
                        <TabPane tab="区域场景配置" key="2">
                            {
                                this.state.sceneAddBool?(
                                    <Button id="addAreaSceneBtn" onClick={this.addAreaFun}>添加区域场景</Button>
                                ):null
                            }
                            <Table locale={{ emptyText: '无数据'}} size={"small"} columns={this.columns2} dataSource={this.state.areaSceneData} bordered pagination={false}/>
                        </TabPane>
                    </Tabs>
                </div>

                <Modal
                    title={this.state.selectAreaSceneData.id?"编辑区域场景":"新增区域场景"}
                    visible={this.state.addOrChangeAreaScene}
                    onCancel={this.areaSceneHandleCancel}

                    footer={this.state.addOrChangeAreaScene?(
                        [
                            <Button onClick={this.areaSceneHandleOk}>确定</Button>,
                            <Button onClick={this.areaSceneHandleCancel}>取消</Button>
                        ]
                    ):null}

                >
                    <div className="changeAreaAllContent">
                        <div className="resourceContentCell">
                            <div className="changeTitle">场景名称:</div>
                            <Input id="areaSceneName" value={this.state.selectAreaSceneData.sceneName} onChange={event => this.inputChange(event)} className="changeCell" placeholder="场景名称"/>
                        </div>
                        <div className="resourceContentCell" key={Math.random()}>
                            <div className="changeTitle" style={styleTitle}>场景底图:</div>
                            {
                                this.state.selectAreaSceneData.sceneImgVisible?(
                                    <img className="areaChangeImg" src={this.checkHttp(this.state.selectAreaSceneData.sceneImg)}/>
                                ):null
                            }
                            <Upload {...props} className="areaLoadScene" onChange={this.onChangeSceneImg}>
                                <Button>
                                    <Icon type="upload" /> 上传
                                </Button>
                                <span className="areaLoadSceneMsg">请使用svg格式</span>
                            </Upload>

                        </div>
                        <div className="resourceContentCell" key={Math.random()}>
                            <div className="changeTitle" style={styleTitle}>场景图标:</div>
                            {
                                this.state.selectAreaSceneData.sceneIconVisible?(
                                    <img className="areaChangeImg" src={this.checkHttp(this.state.selectAreaSceneData.sceneIcon)}/>
                                ):null
                            }
                            <Upload {...props} className="areaLoadScene" onChange={this.onChangeSceneIcon}>
                                <Button>
                                    <Icon type="upload" /> 上传
                                </Button>
                                <span className="areaLoadSceneMsg">请使用svg格式</span>
                            </Upload>
                        </div>
                        <div className="resourceContentCell" key={Math.random()}>
                            <div className="changeTitle" style={styleTitle}>预警图标:</div>
                            {
                                this.state.selectAreaSceneData.sceneWarnIconVisible?(
                                    <img className="areaChangeImg" src={this.checkHttp(this.state.selectAreaSceneData.sceneWarnIcon)}/>
                                ):null
                            }
                            <Upload {...props} className="areaLoadScene" onChange={this.onChangeSceneWarnIcon}>
                                <Button>
                                    <Icon type="upload" /> 上传
                                </Button>
                                <span className="areaLoadSceneMsg">请使用svg格式</span>
                            </Upload>
                        </div>
                        <div className="resourceContentCell">
                            <div className="changeTitle">图标尺寸:</div>
                            <div className="changeCell3 changeCellX">X</div>
                            <Input id="areaSceneX" value={this.state.selectAreaSceneData.locationX} onChange={event => this.inputChange(event)} className="changeCell2" placeholder="X" />
                            <div className="changeCell3 changeCellX">Y</div>
                            <Input id="areaSceneY" value={this.state.selectAreaSceneData.locationY} onChange={event => this.inputChange(event)} className="changeCell2" placeholder="Y" />
                            <div className="changeCell3">像素</div>
                        </div>
                        <div className="clearBoth"></div>
                    </div>
                </Modal>

                <Modal
                    title={"编辑主场景"}
                    visible={this.state.editMainSceneBool}
                    onCancel={this.editMainSceneCancleFun}
                    footer={this.state.editMainSceneBool?(
                        [
                            <Button onClick={this.editMainSceneFun}>确定</Button>,
                            <Button onClick={this.editMainSceneCancleFun}>取消</Button>
                        ]
                    ):null}

                    width="50%"
                >
                    <div className="changeMainSceneClass">
                        <div className="changeMainBtnDiv" key={Math.random()}>
                            <div className="changeMainTitle">请选择底图文件</div>
                            <Input className="changeInput" value={this.state.setMainSceneData.pathUrl}/>
                            <Upload onChange={this.uploadChange} className="changeMainUpload">
                                <Button>
                                    <Icon type="上传" /> 上传
                                </Button>
                            </Upload>
                        </div>
                        <div className="mainScenePreview">
                            {
                                this.state.setMainSceneData.pathUrl?(
                                    <img src={this.checkHttp(this.state.setMainSceneData.pathUrl)} />
                                ):null
                            }
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}