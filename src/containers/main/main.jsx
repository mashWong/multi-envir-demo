import React from 'react';
import {Menu, Icon, Button, Badge, Avatar} from 'antd';
import './main.scss';
import Page from '../page_1/page';
import {Route, withRouter} from "react-router-dom";
import axios from 'axios';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class Main extends React.Component {
    state = {
        theme: "dark",
        current: 'mail',
        collapsed: false,
    };

    handleClick = (e) => {
        this.setState({
            theme: e.key,
        });
    };

    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    goPage = () => {
        axios.get('/bcrm/api/user/getvericode', function () {

        });
        this.props.history.push({pathname: "/main/page"})
    };

    render() {
        return (
            <div className="app-layout">
                <div className={"navigation ant-menu ant-menu-" + this.state.theme}>
                    <Button type="primary" onClick={this.toggleCollapsed} className={"foldBtu"}>
                        <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}/>
                    </Button>
                    <Menu
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        mode="inline"
                        theme={this.state.theme}
                        inlineCollapsed={this.state.collapsed}>
                        <Menu.Item key="1" onClick={this.goPage}>
                            <Icon type="pie-chart"/>
                            <span>Option 1</span>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Icon type="desktop"/>
                            <span>Option 2</span>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Icon type="inbox"/>
                            <span>Option 3</span>
                        </Menu.Item>
                        <SubMenu key="sub1" title={<span><Icon type="mail"/><span>Navigation One</span></span>}>
                            <Menu.Item key="5">Option 5</Menu.Item>
                            <Menu.Item key="6">Option 6</Menu.Item>
                            <Menu.Item key="7">Option 7</Menu.Item>
                            <Menu.Item key="8">Option 8</Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" title={<span><Icon type="appstore"/><span>Navigation Two</span></span>}>
                            <Menu.Item key="9">Option 9</Menu.Item>
                            <Menu.Item key="10">Option 10</Menu.Item>
                            <SubMenu key="sub3" title="Submenu">
                                <Menu.Item key="11">Option 11</Menu.Item>
                                <Menu.Item key="12">Option 12</Menu.Item>
                            </SubMenu>
                        </SubMenu>
                    </Menu>
                </div>
                <div className="app-context">
                    {/*<div className="app-header">*/}
                        {/*<div className="app-header-context">*/}
                            {/*<Badge count={11}>*/}
                                {/*<Icon type="mail" className="head-mail"/>*/}
                            {/*</Badge>*/}

                        {/*</div>*/}
                    {/*</div>*/}
                    <Menu onClick={this.handleClick}
                          selectedKeys={[this.state.current]}
                          mode="horizontal" className="nav-tool" theme="light">
                        <SubMenu className="userInfo" title={<span className="submenu-title-wrapper">
                        <Badge count={11}>
                            <Icon type="mail" className="head-mail"/>
                        </Badge>
                    </span>}>
                            <Menu.Item key="checkOut"><Icon type="logout"/>退出登录</Menu.Item>
                            <MenuItemGroup title={<span><Icon type="skin" style={{"marginRight": 10}}/>主题切换</span>}>
                                <Menu.Item key="dark">dark</Menu.Item>
                                <Menu.Item key="light">light</Menu.Item>
                            </MenuItemGroup>
                        </SubMenu>
                        <SubMenu className="userInfo" title={<span className="submenu-title-wrapper">
                    <Avatar className="headImg" src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"/>
                    王旭</span>}>
                            <Menu.Item key="checkOut"><Icon type="logout"/>退出登录</Menu.Item>
                            <MenuItemGroup title={<span><Icon type="skin" style={{"marginRight": 10}}/>主题切换</span>}>
                                <Menu.Item key="dark">dark</Menu.Item>
                                <Menu.Item key="light">light</Menu.Item>
                            </MenuItemGroup>
                        </SubMenu>
                    </Menu>

                    <div>
                        <Route path="/main/page" component={Page}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Main);