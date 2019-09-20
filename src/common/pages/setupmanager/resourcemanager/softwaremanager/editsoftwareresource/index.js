import React from 'react'
import {Input ,Radio ,Select ,Button ,message ,Checkbox } from 'antd';
import './index.less';
import axios from 'axios';
import {PATH,IP} from '../../../../../utils/urls';
import {createHashHistory} from "history";
const { Option } = Select;
export default class EditSoftWareResource extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resouceType: 0,
            appId:"",
            id:"",
            resourceId:"",
            serviceList:[],
            serviceName:"",
            depenceService1:"",
            depenceService2:"",
            depenceService3:"",
            depenceService4:"",
            depenceService5:"",
            depenceService6:"",
            cjBool:false,//采集
            khBool:false,//看护,
            programName:"",//文件名称
            serviceArgs:"",//启动参数,
            hardWareAppId:"",
            hardWareId:"",
            resouceName:""//软件名称
        };
    }

    componentDidMount() {
        console.log(this.props);
        this.props.onRef(this);

        if(this.props.dataSource == null){
            return;
        }
        let cjBool = false
        let khBool = false;
        let hardWareAppId="";
        let hardWareId="";
        if(this.props.dataSource.data){
            cjBool = this.props.dataSource.data.isCollect;
            khBool = this.props.dataSource.data.isWatch;
            this.setState({
                ...this.props.dataSource.data,
                cjBool:cjBool,
                khBool:khBool,
            })
            hardWareAppId = this.props.dataSource.data.hardwareAppId;
            hardWareId = this.props.dataSource.data.hardwareId;
        }else{
            hardWareAppId = this.props.dataSource.hardWareAppId;
            hardWareId = this.props.dataSource.hardWareId;
        }

        this.setState({
            onUpdataEquipment:this.props.onUpdataEquipment,
        })

        //获取服务资源
        this.getServiceList(hardWareId);

        this.setState({
            hardWareAppId:hardWareAppId,
            hardWareId:hardWareId,
        },()=>{
            console.log(this.state);
        })
    }

    /**
     *获取服务资源
     * @param e
     */
    getServiceList= (id)=>{
        axios.post(PATH.servicePool,{
            hardwareId:id
        }).then(response=>{
            console.log(response);
            if(response.data.code == 0){
                this.setState({
                    serviceList:response.data.data
                })
            }
        })
    }

    onChange = e =>{
        console.log(e.target.value);
        this.setState({
            resouceType: e.target.value,
        });
    }

    handleChange0 = e=> {
        console.log(e);
        this.setState({
            depenceService1:e
        })
    }
    handleChange1 = e=> {
        console.log(e);
        this.setState({
            depenceService2:e
        })
    }
    handleChange2 = e=> {
        console.log(e);
        this.setState({
            depenceService3:e
        })
    }
    handleChange3 = e=> {
        console.log(e);
        this.setState({
            depenceService4:e
        })
    }
    handleChange4 = e=> {
        console.log(e);
        this.setState({
            depenceService5:e
        })
    }
    handleChange5 = e=> {
        console.log(e);
        this.setState({
            depenceService6:e
        })
    }
    handleChange6 = e=> {
        console.log(e);
        this.setState({
            serviceName:e
        })
    }

    /**
     * 返回
     * @returns {*}
     */
    backFun=()=>{
        let path={
            pathname:"softwaremanager"
        }
        this.props.history.push(path);
    }

    /**
     * 输入框值变化
     * @returns {*}
     */
    inputChange = (event)=>{
        console.log(123);
        if(event && event.target){
            let value = event.target.value;
            switch (event.target.id) {
                case "editSoftWareInput0":
                    this.setState({appId:value});
                    break;
                case "editSoftWareInput2":
                    this.setState({programName:value});
                    break;
                case "editSoftWareInput3":
                    this.setState({serviceArgs:value});
                    break;
                case "editSoftWareInputName":
                    this.setState({resouceName:value});
                    break;
            }
        }
    }
    /**
     * 保存
     * @returns {*}
     */
    onSubmit=()=>{
        console.log(this.state);
        if(this.state.resouceName.length<0){
            message.error("内容不能为空！");
            return;
        }
        let path = "";
        if(this.state.id!=""){
            path = PATH.softwareResourceEdit;
        }else{
            path = PATH.softwareResourceAdd;
        }
        let sendData = null;
        //服务
        if(this.state.resouceType == 0){
            sendData = {
                id:this.state.id,
                resouceName:this.state.resouceName,
                resouceType: this.state.resouceType,
                serviceName:this.state.serviceName,
                depenceService1:this.state.depenceService1,
                depenceService2:this.state.depenceService2,
                depenceService3:this.state.depenceService3,
                depenceService4:this.state.depenceService4,
                depenceService5:this.state.depenceService5,
                depenceService6:this.state.depenceService6,
                isCollect:this.state.cjBool?1:0,
                isWatch:this.state.khBool?1:0,
                isSoftware:1,
                hardWareAppId:this.state.hardWareAppId,
                hardWareId:this.state.hardWareId
            }
        }else{//程序、命令行
            sendData = {
                id:this.state.id,
                resouceName:this.state.resouceName,
                resouceType: this.state.resouceType,
                isCollect:this.state.cjBool?1:0,
                isWatch:this.state.khBool?1:0,
                programName:this.state.programName,
                serviceArgs:this.state.serviceArgs,
                isSoftware:1,
                hardWareAppId:this.state.hardWareAppId,
                hardWareId:this.state.hardWareId
            }
        }
        console.log(sendData)
        axios.post(path,sendData).then(response=>{
            console.log(response);
            if(response.data.code == 0){
                message.success(response.data.msg);
                this.state.onUpdataEquipment();
            }else{
                message.error(response.data.msg);
            }
        })
    }

    /**
     * 开启采集
     * @returns {*}
     */
    onCheckBox =(e)=>{
        console.log(e);
        if(e.target.id == "openKH"){
            this.setState({
                khBool:e.target.checked
            })
        }else if(e.target.id == "openCJ"){
            this.setState({
                cjBool:e.target.checked
            })
        }
    }

    render() {
        console.log(this.state);
        let style0={};
        let style1={};
        if(this.state.resouceType == 0){
            style0={
                display:"none"
            }
            style1={
                display:"block"
            }
        }else{
            style1={
                display:"none"
            }
            style0={
                display:"block"
            }
        }
        return (
            <div className="changeAllContent">
                <div className="resourceContentCell">
                    <div className="changeTitle">所属设备:</div>
                    <Input disabled={true} value={this.state.hardWareAppId} className="changeCell"/>
                </div>
                <div className="resourceContentCell">
                    <div className="changeTitle">软件名称:</div>
                    <Input id="editSoftWareInputName" value={this.state.resouceName} onChange={event=>this.inputChange(event)} className="changeCell" placeholder="请输入软件名称"/>
                </div>
                <div className="resourceContentCell">
                    <div className="changeTitle">资源类型:</div>
                    <Radio.Group className="changeCell changeRaio" value={this.state.resouceType} onChange={this.onChange}>
                        <Radio value={0}>服务</Radio>
                        <Radio value={1}>程序</Radio>
                        <Radio value={2}>命令行</Radio>
                    </Radio.Group>
                </div>

                <div style={style1} className="resourceContentCell">
                    <div className="changeTitle">服务名称:</div>
                    <Select value={this.state.serviceName} notFoundContent="无数据" id="relyServiceSelect0" className="changeCell" onChange={this.handleChange6}>
                        {
                            this.state.serviceList.map((item,index)=>(
                                <Option value={item.dispname} key={index}>{item.dispname}</Option>
                            ))
                        }
                    </Select>
                </div>

                <div style={style1} className="resourceContentCell">
                    <div className="changeTitle">依赖服务1:</div>
                    <Select value={this.state.depenceService1} notFoundContent="无数据" id="relyServiceSelect0" className="changeCell" onChange={this.handleChange0}>
                        {
                            this.state.serviceList.map((item,index)=>(
                                <Option value={item.dispname} key={index}>{item.dispname}</Option>
                            ))
                        }
                    </Select>
                </div>
                <div style={style1} className="resourceContentCell">
                    <div className="changeTitle">依赖服务2:</div>
                    <Select value={this.state.depenceService2} notFoundContent="无数据" id="relyServiceSelect1" className="changeCell" onChange={this.handleChange1}>
                        {
                            this.state.serviceList.map((item,index)=>(
                                <Option value={item.dispname} key={index}>{item.dispname}</Option>
                            ))
                        }
                    </Select>
                </div>
                <div style={style1} className="resourceContentCell">
                    <div className="changeTitle">依赖服务3:</div>
                    <Select value={this.state.depenceService3} notFoundContent="无数据" id="relyServiceSelect2" className="changeCell" onChange={this.handleChange2}>
                        {
                            this.state.serviceList.map((item,index)=>(
                                <Option value={item.dispname} key={index}>{item.dispname}</Option>
                            ))
                        }
                    </Select>
                </div>
                <div style={style1} className="resourceContentCell">
                    <div className="changeTitle">依赖服务4:</div>
                    <Select value={this.state.depenceService4} notFoundContent="无数据" id="relyServiceSelect3" className="changeCell" onChange={this.handleChange3}>
                        {
                            this.state.serviceList.map((item,index)=>(
                                <Option value={item.dispname} key={index}>{item.dispname}</Option>
                            ))
                        }
                    </Select>
                </div>
                <div style={style1} className="resourceContentCell">
                    <div className="changeTitle">依赖服务5:</div>
                    <Select value={this.state.depenceService5} notFoundContent="无数据" id="relyServiceSelect4" className="changeCell" onChange={this.handleChange4}>
                        {
                            this.state.serviceList.map((item,index)=>(
                                <Option value={item.dispname} key={index}>{item.dispname}</Option>
                            ))
                        }
                    </Select>
                </div>
                <div style={style1} className="resourceContentCell">
                    <div className="changeTitle">依赖服务6:</div>
                    <Select value={this.state.depenceService6} notFoundContent="无数据" id="relyServiceSelect5" className="changeCell" onChange={this.handleChange5}>
                        {
                            this.state.serviceList.map((item,index)=>(
                                <Option value={item.dispname} key={index}>{item.dispname}</Option>
                            ))
                        }
                    </Select>
                </div>

                <div style={style0} className="resourceContentCell">
                    <div className="changeTitle">文件名称:</div>
                    <Input id="editSoftWareInput2" value={this.state.programName} onChange={event=>this.inputChange(event)} className="changeCell" placeholder="请输入程序路径,举例：**.exe"/>
                </div>
                <div style={style0} className="resourceContentCell">
                    <div className="changeTitle">启动参数:</div>
                    <Input id="editSoftWareInput3" value={this.state.serviceArgs} onChange={event=>this.inputChange(event)} className="changeCell" placeholder="请输入启动参数"/>
                </div>
                <div className="resourceContentCell sjxCheckBox">
                    <Checkbox id="openCJ" checked={this.state.cjBool} onChange={this.onCheckBox}>开启采集</Checkbox>
                    <Checkbox id="openKH" checked={this.state.khBool} onChange={this.onCheckBox}>开启看护</Checkbox>
                </div>

                <div className="clearBoth"></div>
            </div>
        )
    }
}