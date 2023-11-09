import {Uint256} from "web3";
import React, {useEffect, useState} from "react";
import {borrowYourCarContract, web3} from "../../utils/Web3";
import moment from 'moment'
import type { Dayjs } from 'dayjs'
import {Button, DatePicker, DatePickerProps, Flex, Image, Input, List, Modal, Space, TimePicker} from "antd";
import {SearchProps} from "antd/es/input";
const CarPages = () => {
  interface Car {
    carTokenId: Uint256;
    owner : string;
    borrower: string;
    borrowUntil : Uint256;
  }
  const { Search } = Input;
  const [cars, setCars] = useState([{} as Car]);
  const [account, setAccount] = useState(String(null));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [curCarTokenId, setCurCarTokenId] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [searchId, setSearchId] = useState("");
  const onChangeDate: DatePickerProps['onChange'] = (date, dateString) => {
    setReturnDate(dateString);
  };
  const onChangeTime = (time : Dayjs | null, timeString : string) => {
    setReturnTime(timeString);
  };
  const onSearch: SearchProps['onSearch'] = (value, _e) => {
    setSearchId(value);
  };
  const getAccount = async () =>{
    if (borrowYourCarContract) {
      const accounts = await web3.eth.getAccounts();
      if(accounts.length === 0) {
        return;
      }
      setAccount(accounts[0]);
      console.log(account);
    }
  }
  const getCarInfo = async () =>{
    if(account)
    {
      setCars(await borrowYourCarContract.methods.showAllCars().call());
      return;
    }
    else
    {
      setCars(await borrowYourCarContract.methods.showAllCars().call({
        from: account
      }));
    }
  }
  useEffect(() => {
    console.log(new Date().valueOf());
    console.log(cars);
    getAccount();
    getCarInfo();
  }, []);
  const openBorrowCar = (carTokenId : Uint256) => {
    setIsModalOpen(true);
    setCurCarTokenId(carTokenId);
  }
  const handleOk = () =>{
    if(returnTime === "" || returnDate === "")
    {
      alert("please input return time!");
      return;
    }
    const borrowUntil  = new Date(returnDate + " " + returnTime);
    const duration = Math.ceil((borrowUntil.valueOf() - (new Date().valueOf())) / 1000);
    if(duration <= 0)
    {
      alert("Please do not choose a past time!");
      return;
    }
    setIsModalOpen(false);
    borrowCar(curCarTokenId, duration.toString());
  }
  const handleCancel = () => {
    setIsModalOpen(false);
  }
  const borrowCar = async (carTokenId: Uint256, duration : Uint256) =>{
    try{
      if(!account)
      {
        alert("Not connect yet!");
        return;
      }
      // @ts-ignore
      const result = await borrowYourCarContract.methods.borrow(carTokenId, duration).send({
        from: account,
        gas: "6721975"
      });
      console.log(result);
      if (result.events && result.events.CarBorrowed) {
        setCars(await borrowYourCarContract.methods.showAllCars().call({
          from: account
        }));
      } else {
        console.log("No CarBorrowed event found.");
      }
    }
    catch (error : any){
      alert(error.message);
    }
  }

  // @ts-ignore
  return (
    <div >
      <Space direction={"vertical"} style={{display: 'flex', padding: '15px'}}>
        <Flex align={"flex-end"} gap={"small"}>
          <Search placeholder={"search car Token Id"} allowClear onSearch={onSearch} enterButton/>
        </Flex>
        <List
          itemLayout="horizontal"
          dataSource={cars.filter((item) => {
            return (parseInt(item.carTokenId).toString() === searchId || (searchId === "" && parseInt(item.borrowUntil) < (new Date().valueOf() / 1000) && item.owner !== account));
          })}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Image
                  width={272}
                  alt="car"
                  src={"asset/" + (parseInt(item.carTokenId) % 5).toString() + ".jpeg" }
                />}
                title={<p>Car Token Id: {parseInt(item.carTokenId).toString()}</p>}
                description={
                <div>
                  <div>
                    <p>owner: {item.owner}</p>
                  </div>
                  <div>
                    {((parseInt(item.borrowUntil) >= (new Date().valueOf() / 1000)) ?
                      (<div>
                        <p>borrower: {item.borrower}</p>
                        <p>Borrow until: {new Date(parseInt(item.borrowUntil) * 1000).toLocaleString()}</p>
                      </div>) :
                      (<p>This Car is not borrowed</p>))
                    }
                  </div>
                </div>
                }
              />
              <Button onClick={() => openBorrowCar(item.carTokenId)} disabled={(parseInt(item.borrowUntil) >= (new Date().valueOf() / 1000) || item.owner === account)}>Borrow</Button>
            </List.Item>
          )
          }
        />
      </Space>
      <Modal title="Select return time" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Flex justify={"space-around"}>
          <DatePicker onChange={onChangeDate} disabledDate={(current) => {return current < moment().subtract(1, 'day')}}/>
          <TimePicker onChange={onChangeTime} />
        </Flex>
      </Modal>
    </div>
  );
}
export default CarPages;