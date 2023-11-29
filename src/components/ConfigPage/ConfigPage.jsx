import React,{ useEffect, useState } from "react";
import { Layout, Card, Avatar, Divider, List, Skeleton, Button } from 'antd';
import { List as MovableList, arrayMove } from 'react-movable';
// react components
import AddPageForm from "components/AddPageForm/AddPageForm";
// react services
import configServices from "services/config";

const { Header, Footer, Content } = Layout;

const ConfigPage = () => {

    const [AddPageActive, setAddPageActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [slides, setSlides] = useState([]);


    const loadMoreData = () => {
        if (loading) {
          return;
        }
        setLoading(true);
        configServices.getAll()
          .then(response => {
            setSlides([...response]);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
    };

      useEffect(() => {
        loadMoreData();
      }, []);

    const headerStyle = {
        color: '#fff',
        backgroundColor: '#7dbcea',    
        height: 110
    }

    const configList = {
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center'
    }

    const footerStyle = {
        textAlign: 'center', 
        color: '#fff', 
        backgroundColor: '#7dbcea'
    }

    return (
        
        <Layout>
            <Header style={headerStyle}>
                <h1 style={{height:10}}>Alpha Innovations</h1>
                <h3 style={{paddingLeft:30}}>Dynamic Page Display - Config</h3>
            </Header>
            <Content >
                {AddPageActive ? <AddPageForm slides={slides} setSlides={setSlides}/> : ""}
                <div style={configList}>
                    <MovableList
                        values={slides}
                        onChange={({ oldIndex, newIndex }) =>
                        setSlides(arrayMove(slides, oldIndex, newIndex))
                        }
                        renderList={({ children, props }) => <ul {...props} >{children}</ul>}
                        renderItem={({ value, props }) => (
                            <div {...props} >
                                <Card style={{margin:5, width:"600px"}} title={<h4>{value.id + " - "+value.name}</h4>} bordered={false}>
                                    <div style={{}}>
                                        <label style={{fontWeight:"bold"}}>Group : </label>
                                        <label>{value.group}</label>
                                    </div>
                                    <div>
                                        <Button type="primary" style={{ margin:5, marginRight:20, marginTop:30, float:"right"}}>Delete</Button>
                                    </div>
                        
                                    {value.dommainId !== -1 }

                                </Card>
                            </div>
                        )}
                    />
                    
                </div>  
                <div id="configButton" >
                    <div>
                        <Button type="primary" style={{ margin:5}}>Save Changes</Button>
                    </div>
                    <div>
                        <Button style={{ margin:5}} onClick={() => setAddPageActive(true)}>Add Page</Button>
                    </div>
                </div>
            </Content>
            <Footer style={footerStyle}>
                
            </Footer>
        </Layout>
    );
}

export default ConfigPage