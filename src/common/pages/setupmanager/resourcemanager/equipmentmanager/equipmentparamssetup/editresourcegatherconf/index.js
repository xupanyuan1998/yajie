import React from 'react'
import {Input ,Radio ,Select ,Button  ,message} from 'antd';
import './index.less';
import axios from 'axios';
import {PATH,IP} from '../../../../../../utils/urls';
import {HARDWARETYPE} from "../../../../../../utils/config";
const { Option } = Select;
import BreadcrumbCustom from "../../../../../../components/BreadcrumbCustom";
export default class EidtResourceGegatherConf extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id:"",
            remark:"",
            oid:"",
            requestType:0,
            requestTypeName:"GET",
            monitorTypeDictId:"",
            monitorTypeDictName:"",
            resourceId:"",
            hardWareArray:[]
        };
    }

    componentDidMount() {

        console.log(this.props);
        console.log(this.props);
        this.props.onRefs(this);
        if(this.props.dataSource == null){
            return;
        }
        //新增
        if(!this.props.dataSource.data){
            this.setState({
                ...this.props.dataSource,
                id:"",
                resourceId:this.props.dataSource.id,
                onUpdataEquipment:this.props.onUpdataEquipment
            })
            //获取数据项
            this.resourceGatherConf();
        }else{//编辑
            this.setState({
                ...this.props.dataSource.data,
                onUpdataEquipment:this.props.onUpdataEquipment
            },()=>{
                console.log(this.state);
            })
            this.resourceGatherConf(this.props.dataSource.data.resourceId);
        }

        console.log(this.state);
    }

    /**
     * 获取数据项列表
     * @returns
     */
    resourceGatherConf() {
        axios.post(PATH.getDict, {
            dictType:"monitor_type"
        })
            .then(response => {
                console.log(response);
                if (response.data.code == 0) {
                    let dataArray = response.data.data;
                    console.log(response.data.data);
                    console.log(dataArray);
                    this.setState({
                        hardWareArray:dataArray,
                    })
                }
            });
    }

    onChange = e =>{
        console.log(e.target);
        this.setState({
            requestType: e.target.value
        });
    }

    /**
     * 数据项下拉菜单
     * @param e
     */
    handleChange = e=> {
        console.log(e);
        let requestTypeName="";
        if(e == 0){
            requestTypeName = "GET";
        }else{
            requestTypeName = "WALK";
        }
        this.setState({
            monitorTypeDictId:e,
            monitorTypeDictName:requestTypeName
        })
    }

    /**
     * 根据id获取数据项名称
     */
    getMonitorTypeNameByID=(id)=>{
        let name="";
        for(let i = 0;i<this.state.hardWareArray.length;i++){
            if(this.state.hardWareArray[i].dictCode == id){
                name = this.state.hardWareArray[i].dictLabel;
                break;
            }
        }
        return name;
    }

    /**
     * 返回
     * @returns {*}
     */
    backFun=()=>{
        let path={
            pathname:"equipmentparamssetup"
        }

        //this.props.history.push(path);
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
                case "editEquipMentInput0":
                    this.setState({oid:value});
                    break;
                case "editEquipMentInput1":
                    this.setState({remark:value});
                    break;
            }
        }
    }

    /**
     * 保存
     * @returns {*}
     */
    onSubmits=()=>{
        console.log(this.state);
        if(this.state.remark.length<=0){
            message.error("内容不能为空！");
            return;
        }
        let path = "";
        console.log(this.state.id)
        if(this.state.id.length<=0) {
            path = PATH.resourceGatherConfAdd;
        }else{
            path = PATH.resourceGatherConfEdit;
        }
        axios.post(path,{
            id:this.state.id,
            isSoftware:0,
            oid:this.state.oid,
            remark:this.state.remark,
            resourceId:this.state.resourceId,
            monitorTypeDictId:this.state.monitorTypeDictId,
            monitorTypeDictName:this.state.monitorTypeDictName,
            requestType:this.state.requestType,
            requestTypeName: this.state.requestTypeName
        }).then(response=>{
            console.log(response);
            if(response.data.code == 0){
                message.success(response.data.msg);
                this.state.onUpdataEquipment();
                //this.backFun();
            }else{
                message.error(response.data.msg);
            }
        })
    }

    render() {
        console.log(this.state);
        return (
            <div>
                <div className="changeAllContent">
                    <div className="resourceContentCell">
                        <div className="changeTitle">数据项:</div>
                        <Select notFoundContent="无数据"  className="changeCell" value={this.state.monitorTypeDictId} onChange={this.handleChange}>
                            {
                                this.state.hardWareArray.map((item,index)=>(
                                    <Option value={item.dictCode} key={index}>{item.dictLabel}</Option>
                                ))
                            }
                        </Select>
                    </div>
                    <div className="resourceContentCell">
                        <div className="changeTitle">OID:</div>
                        <Input onChange={event=>this.inputChange(event)}  id="editEquipMentInput0" className="changeCell" value={this.state.oid} placeholder="请输入OID"/>
                    </div>
                    <div className="resourceContentCell">
                        <div className="changeTitle">描述:</div>
                        <Input allowClear onChange={event=>this.inputChange(event)}  id="editEquipMentInput1" className="changeCell" value={this.state.remark} placeholder="请输入描述" />
                    </div>
                    <div className="resourceContentCell">
                        <div className="changeTitle">请求类型:</div>
                        <Radio.Group className="changeCell changeRaio" value={this.state.requestType} onChange={this.onChange}>
                            <Radio value={0}>GET</Radio>
                            <Radio value={1}>WALK</Radio>
                        </Radio.Group>
                    </div>
                </div>
                <div className="clearBoth"></div>
            </div>
        )
    }
}