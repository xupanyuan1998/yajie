import React from 'react';
import {Link} from 'react-router-dom'
import {Menu, Icon, Switch, Layout,message} from 'antd'
import Top from './header'
import Contents from './content'
import Footer from './bottom'
import './index.less'
import BreadcrumbCustom from "../components/BreadcrumbCustom";
import {PATH} from "../utils/urls";
import axios from 'axios';
import menuImage from '../images/home/menu.png';

const SubMenu = Menu.SubMenu;
const {Sider} = Layout

export default class Container extends React.Component {
    state = {
        theme: 'dark',
        current: 'index',
        collapsed: false,
        mode: 'inline',  // 水平垂直展现
        menuTreeNode:"",
        allMenuList:[],//菜单列表
        OpenKeys:[]  //展开的一级菜单id
    }

    componentWillMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    tick(){
        if(localStorage.getItem("current_system_token") && localStorage.getItem("current_system_token")!="null"){
            console.log(localStorage.getItem("current_system_token"));
            //获取菜单列表
            this.getMenu();
            clearInterval(this.timerID);
        }
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    /**
     * 获取权限菜单
     * @returns {*}
     */
    getMenu(){
        clearInterval(this.timerID);
        axios.get(PATH.getMenu,{})
            .then(response=>{
                console.log(response);
                if(response.data.code == 0){
                    //按钮权限
                    localStorage.setItem("permList",response.data.data.permList);
                    //菜单权限
                    this.state.allMenuList = response.data.data.menuList;

                    console.log("菜单列表")
                    console.log(this.state.allMenuList)
                    const menuTreeNode = this.renderMenu(this.state.allMenuList);


                    this.setState({
                        menuTreeNode
                    })
                }else{
                    this.props.history.push('/login');
                    message.error(response.data.msg);
                    location.reload(true);
                }
            })
    }

    componentDidMount() {
        this.handleClick([], 'index')
    }

    changeTheme = (value) => {
        this.setState({
            theme: value ? 'dark' : 'light',
        });
    }
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
            mode: this.state.collapsed ? 'inline' : 'vertical',
        });
    }
    clear = () => {
        this.setState({
            current: 'index',
        });
    }
    handleClick = (e, special) => {
        this.setState({
            current: e.key || special,
        });
    }

    /**
     * 左侧菜单递归显示
     * */

    renderMenu = (allMenu) => {
        return allMenu.map((subMenu,index) => {
            if (subMenu.children && subMenu.children.length) {
                return (
                    <SubMenu key={subMenu.menuId} className="menuitem-css" title={<span>
                         <img src={menuImage} className="menu-img"/>
                         <div className="menu-text">
                            {subMenu.menuName}
                        </div>
                    </span>}>
                        { this.renderSecondMenu(subMenu.children) }
                    </SubMenu>
                )
            }
            return (
                <Menu.Item key={subMenu.menuId} className="homemenu-css">
                    <Link to={`/${subMenu.url}`}>
                        <img src={menuImage} className="menu-img"/>
                        <div className="menu-text">
                            <span className="nav-text">{subMenu.menuName}</span>
                        </div>
                    </Link>
                </Menu.Item>
            )
        })
    }
    renderSecondMenu = (allMenu) => {
        return allMenu.map((subMenu,index) => {
            if(index!=0){
                return(
                    <Menu.Item key={subMenu.menuId} className="child-menu child-bor">
                        <Link to={`/${subMenu.url}`}><span className="nav-text">{subMenu.menuName}</span></Link>
                    </Menu.Item>
                )
            }
            return (
                <Menu.Item key={subMenu.menuId} className="child-menu">
                    <Link to={`/${subMenu.url}`}><span className="nav-text">{subMenu.menuName}</span></Link>
                </Menu.Item>

            )
        })
    }
    render() {
        return (
            <Layout className="containAll">
                <Top toggle={this.toggle} collapsed={this.state.collapsed} clear={this.clear}/>
                <Layout style={{marginBottom:"48px"}}>
                    <Sider
                        collapsible
                        collapsed={this.state.collapsed}
                        onCollapse={this.onCollapse}
                        className="leftMenu leftmenu-new"
                        style={{marginBottom:"15px"}}
                    >
                        <Menu
                            theme='light'
                            onClick={this.handleClick}
                            defaultOpenKeys={['1','4','15','23','30','46']}
                            selectedKeys={[this.state.current]}
                            className="menu"
                            mode={this.state.mode}
                            style={{background:"#e2f0ee"}}

                        >
                            {this.state.menuTreeNode}
                        </Menu>
                    </Sider>
                    <Layout>
                        <Contents/>
                    </Layout>
                </Layout>

                <Footer />
            </Layout>
        );
    }
}