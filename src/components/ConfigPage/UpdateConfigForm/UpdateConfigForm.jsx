// packages npm
import React,{ useState, useEffect, useContext } from "react"
import { Button, Form, Input, InputNumber, Card, Space, List } from 'antd'
import VirtualList from 'rc-virtual-list';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
// react context(s)
import { Context as ConfigContext } from "contexts/configContext"

const UpdateConfigForm = ({ displayDelay, setDisplayDelay, reloadDelay, setReloadDelay, transitionDelay, setTransitionDelay, domainNames, setDomainNames}) => {
    // use states
    const [newDomainName, setNewDomainName] = useState('')

    // use context(s)
    const { 
        isConfigInitialized, 
        config
    } = useContext(ConfigContext)

    // use effect(s)
    const loadData = () => {
        if (isConfigInitialized) {
            setDisplayDelay(config.displayDelay) 
            document.getElementById("displayDelayInput").style.border = ""
            setReloadDelay(config.reloadDelay)
            document.getElementById("reloadDelayInput").style.border = ""
            setTransitionDelay(config.transitionDelay)
            setDomainNames(config.domains)
        }
    }

    useEffect(() => {
        loadData()
    }, [isConfigInitialized])

    const handleReloadDelay = (e) => {
        if (!Number.isInteger(e) || e < 5)
        {   
            document.getElementById("reloadDelayInput").style.border = "2px solid red"
            return
        }
        document.getElementById("reloadDelayInput").style.border = ""
        console.log(e)
        setReloadDelay(e)
    }

    const handleDisplayDelay = (e) => {
        if (!Number.isInteger(e) || e < 1)
        {   
            document.getElementById("displayDelayInput").style.border = "2px solid red"
            return
        }
        document.getElementById("displayDelayInput").style.border = ""
        setDisplayDelay(e)

    }

    const handleTransitionDelay = (e) => {
        if (!Number.isInteger(e) || e < 0)
        {   
            document.getElementById("transitionDelayInput").style.border = "2px solid red"
            return
        }
        document.getElementById("transitionDelayInput").style.border = ""
        setTransitionDelay(e)
    }

    const onNameChange = (event) => {
        setNewDomainName(event.target.value);
    }

    const addDomainName = (e) => {
        if (newDomainName === '')
            return

        var tempArray = []
        var tempDomain = {
            id : 0,
            name : newDomainName
        }
        tempArray.push(tempDomain)

        for (let index = 0; index < domainNames.length; index++) {
            tempDomain = {
                id : index + 1,
                name : domainNames[index].name
            }
            tempArray.push(tempDomain)
        }
        setDomainNames(tempArray)
        setNewDomainName('')
    }

    const removeDomainName = (item) => {
        var tempArray = []
        for (let index = 0; index < domainNames.length; index++) {
            if (domainNames[index].id !== item.id)
            {
                var tempDomain = {
                    id : index,
                    name : domainNames[index].name
                }
                tempArray.push(tempDomain)
            }
        }
        setDomainNames(tempArray)
    }

    return (
        <div id="configList">
            <ul>
                <Card style={{margin:5, width:"600px", height:340, backgroundColor:'#7dbcea'}} title={<h3>Config</h3>} >
                    <Form
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        autoComplete="off"
                    >
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <div>
                                <div style={{ margin:20, marginTop:0}}>
                                    <label style={{ display:'block', fontSize:10, fontWeight:'bold'}}>Reload Delay ({'>='} 5) : </label>
                                    <InputNumber 
                                                size="small" 
                                                addonAfter="min"
                                                id='reloadDelayInput'
                                                value={reloadDelay}
                                                onChange={handleReloadDelay}       
                                    />
                                </div>
                                <div style={{ margin:20}}>
                                <label style={{ display:'block', fontSize:10, fontWeight:'bold'}}>Display Delay ({'>='} 1) : </label>
                                    <InputNumber 
                                            size="small" 
                                            addonAfter="s"
                                            id='displayDelayInput'
                                            value={displayDelay}
                                            onChange={handleDisplayDelay}
                                    />
                                </div>
                                <div style={{ margin:20}}>
                                    <label style={{ display:'block', fontSize:10, fontWeight:'bold'}}>Transition Delay ({'>='} 0) : </label>
                                    <InputNumber 
                                            size="small" 
                                            addonAfter="s"
                                            id='transitionDelayInput'
                                            value={transitionDelay}
                                            onChange={handleTransitionDelay}
                                    />
                                </div>
                            </div>
                            <div >
                                <div>
                                <label style={{ display:'block', fontSize:10, fontWeight:'bold'}}>Domain names : </label>
                                        <List
                                            size="small"
                                            header=
                                            {
                                                <Space
                                                    style={{
                                                        padding: '0 0 4px',
                                                    }}
                                                >
                                                    <Input
                                                    placeholder="Please add domain"
                                                    value={newDomainName}
                                                    onChange={onNameChange}
                                                    onKeyDown={(e) => e.stopPropagation()}
                                                    />
                                                    <Button type="text" icon={<PlusOutlined />} onClick={addDomainName}>
                                                    </Button>
                                                </Space>
                                            }
                                            bordered
                                            dataSource={domainNames}
                                        >
                                            <VirtualList
                                                data={domainNames}
                                                height={domainNames.length < 3 ? domainNames.length * 50 : 150}
                                                itemHeight={4}
                                                itemKey="id"
                                            >
                                                
                                                {(item) => (
                                                    <List.Item>
                                                        <List.Item.Meta
                                                            title={item.name}
                                                        />  
                                                        
                                                        <Button type="text" icon={<MinusOutlined />} onClick={() => removeDomainName(item)}>
                                                        </Button>
                                                    </List.Item>
                                                )}
                                            </VirtualList>
                                        </List>
                                </div>
                            </div>
                        </div>
                    </Form>
                </Card>
            </ul>
        </div>  
    )
}

export default UpdateConfigForm