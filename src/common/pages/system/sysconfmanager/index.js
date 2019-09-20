import React from 'react'
import {Tabs,Select,Table, Divider, Tagm,message} from 'antd';
import './index.less';
import axios from 'axios';
import {PATH,IP} from '../../../utils/urls';
import SearchBar from '../../../components/searchbar'
import {createHashHistory} from 'history';
const { TabPane } = Tabs;
const { Option } = Select;
import {languageKindList, musicKindList, publishCountry} from "../../../utils/config";


export default class ResourceManager extends React.Component {
    columnsArray = [
	{
        title: '序号',
        dataIndex: 'key',
        key: 'key',
		
    },
         {
        title: 'appid',
        dataIndex: 'appId',
        key: 'appId',
    },
    {
        title: '名称',
        dataIndex: 'resouceName',
        key: 'resouceName',
    },
	{
        title: '类型',
        dataIndex: 'resourceTypeName',
        key: 'resourceTypeName',
    },
    {
        title: 'CPU利用率',
        key: 'cpuRate',
        dataIndex: 'cpuRate',
    },
    {
        title: '内存利用率',
        key: 'memoryRate',
        dataIndex: 'memoryRate',
    },
    {
        title: '硬盘利用率',
        key: 'disk',
        dataIndex: 'disk',
    },
    {
        title: '网络IO',
        key: 'io',
        dataIndex: 'io',
    },
    {
        title: '状态',
        key: 'serviceStatusName',
        dataIndex: 'serviceStatusName',
    },
	 {
        title: '电压',
        key: 'voltage',
        dataIndex: 'voltage',
    },
	{
        title: '电流',
        key: 'electric',
        dataIndex: 'electric',
    },
	{
        title: '剩余电量',
        key: 'remainingBattery',
        dataIndex: 'remainingBattery',
    },
	{
        title: '备用电源',
        key: 'standbyPower',
        dataIndex: 'standbyPower',
    },
	{
        title: '有功功率',
        key: 'activePower',
        dataIndex: 'activePower',
    },
	{
        title: '无功功率',
        key: 'reactivePower',
        dataIndex: 'reactivePower',
    },
		{
        title: '端口带宽',
        key: 'interfaceBandwidth',
        dataIndex: 'interfaceBandwidth',
    },
	
    {
        title: '更新时间',
        key: 'createTime',
        dataIndex: 'createTime',
    }
    ];
    constructor(props) {
        super(props);
        this.state = {
            resourceStatusArray:[]

        };
      
         this.fetchTableData();
    }

  

   
    /**
     * 点击操作功能
     * @returns {*}
     */
    actionClick = (props0,props1) => {
        let path = {
            pathname:'/changehardwareresource',
            state:{
                appId:this.state.hardWareArray[parseInt(props1.index)].appId,
                name:this.state.hardWareArray[parseInt(props1.index)].resouceName,
                resouceType:this.state.hardWareArray[parseInt(props1.index)].resouceType
            },
        }
        this.props.history.push(path);
    }
    
	onSearch = (searchFields) => {
        const typeId = searchFields.type ? searchFields.type : 2
        this.fetchTableData()
    }
	
	// 获取表格数据
    fetchTableData = () => {
        axios.post(PATH.resourceStatusList,{

        }).then(response=>{
            console.log(response);
			if(response.data.data.code == 0){
				message.success(response.data.data.msg);
			}

            this.setState({
                resourceStatusArray: response.data.data.records
            });
            this.setState({
                loading: false
            });
        })
    }

    searchFields = () => {
        return [{
            title: '类型',
            key: 'type',
            type: 'select',
            defaultValue: 2,
            onChange: (value) => this.fetchTableData(value),
            items: () => musicKindList.map(ele => ({
                value: ele.value,
                mean: ele.mean
            })),
        }, {
            title: '场景名称',
            key: 'country',
            type: 'select',
            defaultValue: '全部',
            items: () => [{
                value: 0,
                mean: '全部'
            }].concat(publishCountry.map(ele => ({
                value: ele.value,
                mean: ele.mean
            }))),
        }, {
            title: '日期',
            key: ['start', 'end'],
            type: 'rangePicker',
        }]
    }

    render() {
        return (
            <div>
				  <SearchBar
                    onSubmit={this.onSearch}
                    fields={this.searchFields()}
                />
              
                <Table className= "reasureManagerClass" columns={this.columnsArray} dataSource={this.state.resourceStatusArray} bordered />
            </div>
        )
    }
}