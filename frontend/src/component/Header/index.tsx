import  {web3, borrowYourCarContract} from "../../utils/Web3"
import React, {useEffect, useState} from "react";
import {Button, Flex, List, Modal, Popover, Image, Space} from "antd";
import {Uint256} from "web3/lib/types";
import {Address} from "web3";
const GanacheTestChainId = '0x539'; // Ganache默认的ChainId = 0x539 = Hex(1337)
const GanacheTestChainName = 'Ganache Test Chain';
const GanacheTestChainRpcUrl = 'http://127.0.0.1:8545';

const Header = () =>{
  interface Car {
    carTokenId: Uint256;
    owner : Address;
    borrower: Address;
    borrowUntil : Uint256;
  }
  const [account, setAccount] = useState('');
  const [isConnect, setIsConnect] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [myCars, setMyCars] = useState([{} as Car]);
  useEffect(() => {
    // 初始化检查用户是否已经连接钱包
    // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
    const initCheckAccounts = async () => {
      // @ts-ignore
      const {ethereum} = window;
      if (Boolean(ethereum && ethereum.isMetaMask)) {
        // 尝试获取连接的用户账户
        const accounts = await web3.eth.getAccounts();
        if(accounts && accounts.length) {
          setIsConnect(true);
          setAccount(accounts[0]);
        }
      }
    }
    initCheckAccounts();
  },[]);
  const onClickConnectWallet = async () => {
    // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
    // @ts-ignore
    const {ethereum} = window;
    if (!Boolean(ethereum && ethereum.isMetaMask)) {
      alert('MetaMask is not installed!');
      return
    }

    try {
      // 如果当前小狐狸不在本地链上，切换Metamask到本地测试链
      if (ethereum.chainId !== GanacheTestChainId) {
        const chain = {
          chainId: GanacheTestChainId,
          chainName: GanacheTestChainName,
          rpcUrls: [GanacheTestChainRpcUrl],
        };

        try {
          // 尝试切换到本地网络
          await ethereum.request({method: "wallet_switchEthereumChain", params: [{chainId: chain.chainId}]})
        } catch (switchError: any) {
          // 如果本地网络没有添加到Metamask中，添加该网络
          if (switchError.code === 4902) {
            await ethereum.request({ method: 'wallet_addEthereumChain', params: [chain]
            });
          }
        }
      }

      // 小狐狸成功切换网络了，接下来让小狐狸请求用户的授权
      await ethereum.request({method: 'eth_requestAccounts'});
      // 获取小狐狸拿到的授权用户列表
      const accounts = await ethereum.request({method: 'eth_accounts'});
      // 如果用户存在，展示其account，否则显示错误信息
      setAccount(accounts[0] || 'Not able to get accounts');
      if(accounts[0])
      {
        setIsConnect(true);
      }
    } catch (error: any) {
      alert(error.message)
    }
  }
  const rent = async () => {
    try{
      if(borrowYourCarContract) {
        const result = await borrowYourCarContract.methods.rent().send({
          from: account,
          gas: "6721975"
        });
        if (result.events && result.events.CarRent) {
          setMyCars(await borrowYourCarContract.methods.seeMyCars().call({
            from: account
          }));
        } else {
          console.log("No CarRent event found.");
        }
      }
    }
    catch (error: any) {
      alert(error.message);
    }
  }
  const seeMyCars = async () =>{
    setMyCars(await borrowYourCarContract.methods.seeMyCars().call({
      from: account
    }));
    setIsModalOpen(true);
  }
  const handleOk = () =>{
    setIsModalOpen(false);
  }
  const content = (
    <div>
      <Flex justify={"space-around"}>
        <Button onClick={seeMyCars}>see my cars</Button>
        <Button onClick={rent}>rent my car</Button>
      </Flex>
    </div>
  )
  return (
    <div>
      <header className="App-header">
        <div className="title">
          Borrow Your Car
        </div>
        <div className="userProfile">
          <Space direction={"horizontal"}>
            {isConnect ?
              (<Popover content={content} title={account}>
                <Button type="primary">user: {account}</Button>
              </Popover>) :
              (<Button onClick={onClickConnectWallet}>Connect Wallet</Button>)}
          </Space>
        </div>
      </header>
      <Modal title="My Cars" open={isModalOpen} onOk={handleOk} onCancel={() => {setIsModalOpen(false);}}>
        <List
          itemLayout="horizontal"
          dataSource={myCars}
          renderItem={(item) => (
            <List.Item
              extra={
                <Image
                  width={272}
                  alt="car"
                  src={"asset/" + (parseInt(item.carTokenId) % 5).toString() + ".jpeg"}
                />
              }>
              <List.Item.Meta
                title={
                  <p>Car Token Id: {item.carTokenId.toString()}</p>
                }
                description={(parseInt(item.borrowUntil) >= (new Date().valueOf() / 1000)) ?
                  (
                    <div>
                      <p>Borrower: {item.borrower}</p>
                      <p>Borrow until: {new Date(parseInt(item.borrowUntil) * 1000).toLocaleString()}</p>
                    </div>) :
                  (<p>This car is not borrowed.</p>)}
              />
            </List.Item>
          )
          }
        />
      </Modal>
    </div>
  );
}

export default Header;

