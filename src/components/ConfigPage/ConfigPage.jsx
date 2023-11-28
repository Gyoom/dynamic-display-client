import React,{ useEffect, useState } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import { Avatar, Divider, List, Skeleton, Button } from 'antd';
import { List as MovableList, arrayMove } from 'react-movable';

const ConfigPage = () => {
//     const [initLoading, setInitLoading] = useState(true);
//     const [loading, setLoading] = useState(false);
//     const [data, setData] = useState([]);
//     const [list, setList] = useState([]);
//     const fakeDataUrl = `https://randomuser.me/api/?results=3&inc=name,gender,email,nat,picture&noinfo`;


//     useEffect(() => {
//         fetch(fakeDataUrl)
//         .then((res) => res.json())
//         .then((res) => {
//             setInitLoading(false);
//             setData(res.results);
//             setList(res.results);
//         });
//     }, []);
    
//     const onLoadMore = () => {
//         setLoading(true);
//         setList(
//         data.concat(
//             [...new Array(count)].map(() => ({
//             loading: true,
//             name: {},
//             picture: {},
//             })),
//         ),
//         );
//         fetch(fakeDataUrl)
//         .then((res) => res.json())
//         .then((res) => {
//             const newData = data.concat(res.results);
//             setData(newData);
//             setList(newData);
//             setLoading(false);
//             // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
//             // In real scene, you can using public method of react-virtualized:
//             // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
//             window.dispatchEvent(new Event('resize'));
//         });
//     };
//     const loadMore =
//         !initLoading && !loading ? (
//         <div
//             style={{
//             textAlign: 'center',
//             marginTop: 12,
//             height: 32,
//             lineHeight: '32px',
//             }}
//         >
//             <Button onClick={onLoadMore}>loading more</Button>
//         </div>
//         ) : null;

//     console.log(list)
//     return (
//         <MovableList
//         className="demo-loadmore-list"
//         loading={initLoading}
//         itemLayout="horizontal"
//         loadMore={loadMore}
//         dataSource={list}
//         renderItem={(item) => (
//             <List.Item
//                 actions={[<a key="list-loadmore-edit">edit</a>, <a key="list-loadmore-more">more</a>]}
//             >
//             <Skeleton avatar title={false} loading={item.loading} active>
//                 <List.Item.Meta
//                 avatar={<Avatar src={item.picture.large} />}
//                 title={item.name?.last}
//                 description="Ant Design, a design language for background applications, is refined by Ant UED Team"
//                 />
//                 <div>content</div>
//             </Skeleton>
//             </List.Item>
//         )}
//         />
//   );
    const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);


    return (
        <Layout>
            <Header><h1>E-Products</h1>
                <div>
                
                </div>
            </Header>
            <Content >    
                <MovableList
                    style={{ margin: "auto"}}
                    values={items}
                    onChange={({ oldIndex, newIndex }) =>
                    setItems(arrayMove(items, oldIndex, newIndex))
                    }
                    renderList={({ children, props }) => <ul {...props}>{children}</ul>}
                    renderItem={({ value, props }) => 
                        <li {...props}>{value}</li>
                        
                    }
                />
            </Content>
        </Layout>
    );
}

export default ConfigPage