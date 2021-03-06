import React from 'react';
import './index.less'
import {Button,Row, Col,Modal,Input,message,Tooltip,Icon} from "antd";
import { createHashHistory } from 'history';
import FWQ from "../../../../images/areacellsvg/FWQ.svg";
import JHJ from "../../../../images/areacellsvg/JHJ.svg";
import KHD from "../../../../images/areacellsvg/KHD.svg";
import LYQ from "../../../../images/areacellsvg/LYQ.svg";
import RJZY from "../../../../images/areacellsvg/RJZY.svg";
import UPS from "../../../../images/areacellsvg/UPS.svg";
import BreadcrumbCustom from "../../../../components/BreadcrumbCustom";
import axios from 'axios'
import {PATH,URL} from '../../../../utils/urls'

const cellInitWidth = 120;
const cellInitHeight = 88;
export default class SetMainScenesCell extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            id:"",
            rightList:{//右键菜单
                width:'0px',
                left:'0px',
                top:'0px',
                visible:false,
            },
            selectCellId:-1,//当前右键选中图id,
            selectCellScale:1,//当前图的缩放
            scaleModalVisible:false,//提示窗隐藏与显示
            areaSceneHardWareList:[],//接口中获取到设备列表
            svgArray:[],//在场景中的svg数组
            hostname:"",
            origin:""
        }
        this.moving = false;
        this.state.hostname = "http://"+localStorage.getItem("hostname");
        this.state.origin = localStorage.getItem("origin");
    }


    componentWillUnmount() {

    }

    componentDidMount() {
        console.log(this.props);
        if(this.props.location.state){
            let areaMain = {
                svgCell:<img src={this.props.location.state.preview} className="areaImg"/>,
                id:-1
            }
            this.setState({
                svgArray:[areaMain],
                id:this.props.location.state.id
            })

            //获取当前区域场景的右侧列表
            this.getAreaSceneCellListFun();
        }
    }

    /**
     *获取当前区域场景的列表
     */
    getAreaSceneCellListFun(){
        axios.post(PATH.getSceneList,{
        }).then(response=>{
            console.log(response);
            if(response.data.code == 0){
                let dataArray = response.data.data;
                console.log(dataArray);
                for(let i = 0;i<dataArray.length;i++){
                    let src = this.checkHttp(dataArray[i].sceneIcon);

                    let style = {width:120,height:88,left:parseInt(dataArray[i].locationX),top:parseInt(dataArray[i].locationY)};
                    let currentWidth = 120;
                    let statusStyle=null;
                    if(dataArray[i].sceneStatus == 0){
                        statusStyle = {color:'black'};
                    }else{
                        statusStyle = {color:'#09f309'};
                    }
                    this.state.areaSceneHardWareList.push({
                        ...dataArray[i],
                        src:src,
                        style:style,
                        currentWidth:currentWidth,
                        statusStyle:statusStyle
                    });
                }
                this.setState({
                    areaSceneHardWareList:this.state.areaSceneHardWareList
                })
                //获取当前区域场景的元素
                this.getAreaSceneCellFun(this.props.location.state.id);
            }
        })
    }

    /**
     * 获取当前区域场景的元素
     */
    getAreaSceneCellFun(){
        axios.post(PATH.getSceneList,{
            sceneStatus:1//1:启动，0为启用
        }).then(response=>{
            console.log(response);
            if(response.data.code == 0){
                let dataArray = response.data.data;
                for(let i = 0;i<dataArray.length;i++){
                    let style = {
                        left:parseInt(dataArray[i].locationX),
                        top:parseInt(dataArray[i].locationY),
                        position: "absolute",
                        width:dataArray[i].width,
                        height:dataArray[i].height,
                    };
                    let index = this.getIndexById(dataArray[i].id);
                    this.state.areaSceneHardWareList[index].style = style;

                    let srcStr = this.checkHttp(dataArray[i].sceneIcon);
                    let svgCell = <div onMouseUp={(e)=>this.onImgMouseUp(e,dataArray[i].id)}
                                       style={this.state.areaSceneHardWareList[index].style}
                                       id={dataArray[i].id}
                                       onClick={()=>this.onClickCell(dataArray[i].id)}
                                       className="svgContainer">
                        <Tooltip title={dataArray[i].sceneName}>
                            <img
                                 src={srcStr}/>
                        </Tooltip>
                    </div>;
                    this.state.svgArray.push({
                        svgCell:svgCell,
                        id:dataArray[i].id
                    });

                    this.setState({
                        svgArray:this.state.svgArray
                    })
                }

                console.log(this.state);
            }
        })
    }


    /**
     * 通过设备列表id获取当前索引
     */
    getIndexById(id){
        let index = 0;
        for(let i = 0;i<this.state.areaSceneHardWareList.length;i++){
            if(this.state.areaSceneHardWareList[i].id == id){
                index = i;
                break;
            }
        }
        return index;
    }
    /**
     * 通过设备类型或设备svg
     * @param type
     * @returns {string}
     */
    getSvgByType(type){
        let svg = null;
        switch (type) {
            case 0:
                svg=FWQ
                break;
            case 1:
                svg=KHD
                break;
            case 2:
                svg=UPS
                break;
            case 3:
                svg=LYQ
                break;
            case 4:
                svg=JHJ
            case 5:
                svg=RJZY
                break;
        }
        return svg;
    }

    /**
     * 鼠标按下
     * @param e
     */
    onMouseDown(e) {
        this.moving = true;
        e.stopPropagation();
    }

    /**
     * 鼠标抬起
     * @param e
     */
    onMouseUp=(e)=> {
        if(this.moving){
            this.moving = false;
        }
        e.stopPropagation();
    }

    /**
     * 开始拖拽bool:true拖拽右侧列表设备，false：拖拽场景中设备
     * @param e
     * @param key
     */
    onDragStart=(e,key,bool)=>{
        e.dataTransfer.setData("id",key);
        if(!bool){
            e.dataTransfer.setData("type","drag");
        }else{
            e.dataTransfer.setData("type","normal");
        }
    }

    ondragover=(e)=>{
        e.dataTransfer.dropEffect = "move";
        e.preventDefault();
    }
    ondrop=(e)=>{
        let id = e.dataTransfer.getData("id");
        let type = e.dataTransfer.getData("type");
        let index = this.getIndexById(id);
        if(this.state.areaSceneHardWareList[index] == null){
            return;
        }
        if(this.state.areaSceneHardWareList[index].sceneStatus == "1" && type == "normal"){
            message.error("当前设备已设置！")
            return;
        }
        let style = {
            left:e.clientX - 260 - this.state.areaSceneHardWareList[index].style.width/2,
            top:e.clientY -179 - this.state.areaSceneHardWareList[index].style.height/2,
            position: "absolute",
            width:this.state.areaSceneHardWareList[index].style.width,
            height:this.state.areaSceneHardWareList[index].style.height,
        };
        this.state.areaSceneHardWareList[index].style = style;
        let svgCell = <div onMouseUp={(e)=>this.onImgMouseUp(e,this.state.areaSceneHardWareList[index].id)}
                           style={this.state.areaSceneHardWareList[index].style}
                           id={this.state.areaSceneHardWareList[index].id}
                           onClick={()=>this.onClickCell(this.state.areaSceneHardWareList[index].id)}
                           className="svgContainer">
            <Tooltip title={this.state.areaSceneHardWareList[index].sceneName}>
                <img src={this.state.areaSceneHardWareList[index].src}/>
            </Tooltip>
        </div>;
        if(type == "normal"){
            this.state.svgArray.push({
                svgCell:svgCell,
                id:this.state.areaSceneHardWareList[index].id
            });
        }else{
            for(let i = 0;i<this.state.svgArray.length;i++){
                if(this.state.svgArray[i].id == id){
                    this.state.svgArray[i].svgCell = svgCell;
                    break;
                }
            }
        }
        let newScenesArray = this.state.areaSceneHardWareList;
        //更新当前元素为“已设置”状态
        newScenesArray[index].sceneStatus = "1";
        newScenesArray[index].statusStyle = {color:"#09f309"};
        newScenesArray[index].left = e.clientX - 260 - this.state.areaSceneHardWareList[index].style.width/2;
        newScenesArray[index].top = e.clientY -179 - this.state.areaSceneHardWareList[index].style.height/2;
        this.setState({svgArray:this.state.svgArray, areaSceneHardWareList:newScenesArray});

        e.preventDefault();
    }

    /**
     * 元素点击
     */
    onClickCell=(e)=>{
        console.log(e);
        this.state.selectCellId = e;
        let index = this.getIndexById(e);
        console.log(index);
        for(let i = 0;i<this.state.areaSceneHardWareList.length;i++){
            this.state.areaSceneHardWareList[i].style.filter='none';
            this.state.areaSceneHardWareList[i].style.webkitFilter = 'none';
        }
        //当前设备高亮显示
        this.state.areaSceneHardWareList[index].style.filter='opacity(75%)';
        this.state.areaSceneHardWareList[index].style.webkitFilter = 'opacity(75%)';
        this.setState({
            areaSceneHardWareList:this.state.areaSceneHardWareList
        },()=>{
            console.log(this.state);
        })
    }

    /**
     * 元素右键点击
     * @param e
     */
    onImgMouseUp=(e,id)=>{
        if (!e) e=window.event;
        if (e.button==2) {
            this.state.selectCellId = id;
            let index = this.getIndexById(id);
            let rightList = this.state.rightList;
            rightList.left = this.state.areaSceneHardWareList[index].style.left+this.state.areaSceneHardWareList[index].style.width/2+"px";
            rightList.top = this.state.areaSceneHardWareList[index].style.top + this.state.areaSceneHardWareList[index].style.height/2+"px";
            rightList.width = "95px";
            rightList.visible = true;
            for(let i = 0;i<this.state.areaSceneHardWareList.length;i++){
                this.state.areaSceneHardWareList[i].style.filter='none';
                this.state.areaSceneHardWareList[i].style.webkitFilter = 'none';
            }
            //当前设备高亮显示
            this.state.areaSceneHardWareList[index].style.filter='opacity(75%)';
            this.state.areaSceneHardWareList[index].style.webkitFilter = 'opacity(75%)';
            this.setState({
                rightList:rightList,
                areaSceneHardWareList:this.state.areaSceneHardWareList
            })
        }
        e.preventDefault();
    }

    /**
     * 阻止默认鼠标右键菜单
     * @param e
     */
    onContextMenu=(e)=>{
        e.preventDefault();
    }

    /**
     * 自定义右键菜单删除
     * @returns {*}
     */
    selfDelectFun=()=>{
        let svgArray = this.state.svgArray;
        let index = -1;
        for(let i = 0;i<svgArray.length;i++){
            if(this.state.selectCellId == svgArray[i].id){
                index = i;
            }
        }

        let hardWareListIndex = this.getIndexById(this.state.selectCellId);
        this.state.areaSceneHardWareList[hardWareListIndex].sceneStatus = "0";
        this.state.areaSceneHardWareList[hardWareListIndex].statusStyle = {color:"black"};
        this.state.areaSceneHardWareList[hardWareListIndex].style.width = 120;
        this.state.areaSceneHardWareList[hardWareListIndex].style.height = 88;
        svgArray.splice(index,1);
        this.setState({
            svgArray:svgArray,
            areaSceneHardWareList:this.state.areaSceneHardWareList
        })
        this.setRightListVisible();

        message.success("删除成功！")
    }

    /**
     * 自定义右键菜单缩放
     * @returns {*}
     */
    selfScaleFun=()=>{
        this.setState({
            scaleModalVisible: true,
        });
        this.setRightListVisible();
    }

    /**
     * 自定义右键菜单重置
     * @returns {*}
     */
    selfReSetFun=()=>{
        let areaSceneHardWareList = this.state.areaSceneHardWareList;
        let index = this.getIndexById(this.state.selectCellId);
        const currentWidth = areaSceneHardWareList[index].style.width;
        const currentHeight = areaSceneHardWareList[index].style.height;
        areaSceneHardWareList[index].style.width = cellInitWidth;
        areaSceneHardWareList[index].style.height = cellInitHeight;
        areaSceneHardWareList[index].style.left = areaSceneHardWareList[index].style.left+(currentWidth - areaSceneHardWareList[index].style.width)/2;
        areaSceneHardWareList[index].style.top = areaSceneHardWareList[index].style.top+(currentHeight - areaSceneHardWareList[index].style.height)/2;
        this.setState({
            areaSceneHardWareList:areaSceneHardWareList
        })
        this.setRightListVisible();
        message.success("重置成功！")
    }

    /**
     * 隐藏自定义右键菜单
     * @returns {*}
     */
    setRightListVisible(){
        let rightList = this.state.rightList;
        rightList.width = "0px";
        rightList.visible = false;
        this.setState({
            rightList:rightList
        })
    }

    /**
     * 缩放提示框确定
     * @param e
     */
    handleOk = e => {
        let areaSceneHardWareList = this.state.areaSceneHardWareList;
        let index = this.getIndexById(this.state.selectCellId);
        const currentWidth = areaSceneHardWareList[index].style.width;
        const currentHeight = areaSceneHardWareList[index].style.height;

        let currentScale =parseInt(currentWidth/areaSceneHardWareList[index].currentWidth)+
            parseInt(this.state.selectCellScale);
        console.log(currentScale);
        if(currentScale>5 || currentScale<=0){
            message.error("缩放超出系统设置范围！")
            return;
        }

        areaSceneHardWareList[index].style.width = areaSceneHardWareList[index].style.width*this.state.selectCellScale;
        areaSceneHardWareList[index].style.height = areaSceneHardWareList[index].style.height*this.state.selectCellScale;
        areaSceneHardWareList[index].style.left = areaSceneHardWareList[index].style.left+(currentWidth - areaSceneHardWareList[index].style.width)/2;
        areaSceneHardWareList[index].style.top = areaSceneHardWareList[index].style.top+(currentHeight - areaSceneHardWareList[index].style.height)/2;
        this.setState({
            areaSceneHardWareList:areaSceneHardWareList
        })

        this.setState({
            scaleModalVisible: false,
        });

        message.success("缩放成功！");
    };

    /**
     * 缩放提示框取消
     * @param e
     */
    handleCancel = e => {
        console.log(e);

        this.setState({
            scaleModalVisible: false,
        });
    };

    /**
     * 输入框值变化
     * @returns {*}
     */
    inputChange = (event)=>{
        if(event && event.target){
            this.state.selectCellScale = event.target.value;
        }
    }

    /**
     * 点击屏幕隐藏自定义右键菜单
     * @returns {*}
     */
    clickMain(e){
        console.log("点击屏幕");
        //隐藏右侧自定义菜单
        this.setRightListVisible();
        e.preventDefault();
    }

    /**
     * 返回
     */
    handleBack(){
        const history = createHashHistory();
        history.push("/scenesetup");
    }

    /**
     * 提交修改元素
     */
    submitFun=()=>{
        console.log(this.state);
        let sendDataArray = [];
        let areaSceneHardWareList = this.state.areaSceneHardWareList;
        let svgArray = this.state.svgArray;
        for(let i = 0;i<areaSceneHardWareList.length;i++){
            for(let j = 0;j<svgArray.length;j++){
                if(svgArray[j].id == areaSceneHardWareList[i].id){
                    let obj = {
                        sceneId:this.state.id,
                        id:areaSceneHardWareList[i].id,
                        resouceType:areaSceneHardWareList[i].resouceType,
                        locationX:areaSceneHardWareList[i].style.left,
                        locationY:areaSceneHardWareList[i].style.top,
                        width:areaSceneHardWareList[i].style.width,
                        height:areaSceneHardWareList[i].style.height,
                    }
                    sendDataArray.push(obj);
                }
            }
        }
        axios.post(PATH.mainSceneAddCell,sendDataArray).then(response=>{
            console.log(response);
            if(response.data.code == 0){
                message.success(response.data.msg);
                this.handleBack();
            }else{
                message.error(response.data.msg);
            }
        })
        console.log(sendDataArray);
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
        const rightListStyle = this.state.rightList;
        return (
            <div draggable="true" onContextMenu={this.onContextMenu} onClick={this.clickMain.bind(this)}>
                <BreadcrumbCustom first="配置管理" second="场景管理" third="区域场景元素"/>
                <div className="sceneSetUpDiv">
                    <div className="bor-gr">
                        <div id="wrap">
                            {
                                this.state.svgArray.map((item,index)=>{
                                   if(index == 0){
                                       return(
                                           <div key={index}  id="areaSceneId" onMouseUp={this.onMouseUp}  onDrop={this.ondrop} onDragOver={this.ondragover}>{item.svgCell}</div>
                                       )
                                   }else{
                                       return(
                                           <div key={index}  id="areaSceneId" onDragStart={e=>this.onDragStart(e,item.id,false)} onMouseUp={this.onMouseUp}  onDrop={this.ondrop} onDragOver={this.ondragover}>{item.svgCell}</div>
                                       )
                                   }
                                })
                            }
                            {
                                rightListStyle.visible?(
                                    <div id="sceneMenuDiv" style={rightListStyle}>
                                        <div className="sceneMenu" onClick={this.selfDelectFun}><Icon className="sceneMenuIcon" type="delete" />删除</div>
                                        <div className="sceneMenu" onClick={this.selfScaleFun}><Icon className="sceneMenuIcon" type="fullscreen" />缩放</div>
                                        <div className="sceneMenu"onClick={this.selfReSetFun}><Icon className="sceneMenuIcon" type="sync" />重置</div>
                                    </div>
                                ):null
                            }
                        </div>
                        <Button  id="backBtn"onClick={this.handleBack}>返回</Button>
                        <Button  id="submitBtn"onClick={this.submitFun}>提交</Button>
                        <div className="sceneListDiv">
                            <div className="sceneTitle">
                                区域场景元素
                            </div>
                            <div className="sceneAllDiv">
                                {
                                    this.state.areaSceneHardWareList.map((item,index)=>{
                                        return(
                                            <div className="setSceneCellShow" key={index}>
                                                <Row className="setSceneRow0">
                                                    <Col span={12} className="setSceneCol0"><div key={index} className="scenesCell" draggable="true" onMouseDown={e => this.onMouseDown(e)} onDragStart={e=>this.onDragStart(e,item.id,true)} ><Tooltip title={item.sceneName} ><img className="setareacellImg" src={item.src}></img></Tooltip></div></Col>
                                                    <Col span={12} className="setSceneCol0">
                                                        {
                                                            <div style={item.statusStyle}>{item.sceneStatus == "0"?"未设置":"已设置"}</div>
                                                        }
                                                    </Col>
                                                </Row>

                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <Modal
                        title="缩放"
                        visible={this.state.scaleModalVisible}
                        onCancel={this.handleCancel}
                        footer={this.state.scaleModalVisible?(
                            [
                                <Button onClick={this.handleOk}>确定</Button>,
                                <Button onClick={this.handleCancel}>取消</Button>
                            ]
                        ):null}
                    >
                        <Input type="number" onChange={event=>this.inputChange(event)} placeholder="输入缩放比例，如：0.5" ></Input>
                    </Modal>
                </div>
            </div>
        )
    }
}