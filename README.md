# Borrow Your Car

作者：郑俊杰     学号：3210105259

## 如何运行

补充如何完整运行你的应用。

1. 在本地启动ganache应用。

2. 在 `./contracts` 中安装需要的依赖，运行如下的命令：
    ```bash
    npm install
    ```

3. 将本地ganache的账户及url复制到`contracts/hardhat.config.ts`中

4. 在 `./contracts` 中编译合约，运行如下的命令：

    ```bash
    npx hardhat compile
    ```

5. 将编译得到的`./contracts/artifacts`中的

    `contracts/BorrowYourCar.sol/BorrowYourCar.json`

    `contracts/MyERC20.sol/MyERC20.json`两个文件复制到

    `frontend/src/utils/abis`文件夹中。

6. 将合约部署到ganache本地链上，在 `./contracts` 中运行如下的命令：

    ```
    npx hardhat run ./scripts/deploy.ts --network ganache
    ```

7. 将得到的合约地址复制到 `frontend/src/utils/contract-address.json` 中。

8. 在 `./frontend` 中安装需要的依赖，运行如下的命令：

    ```bash
    npm install
    ```

9. 在 `./frontend` 中启动前端程序，运行如下的命令：

    ```bash
    npm run start
    ```

10. 在MetaMask插件中连接到Ganache Test Chain，并访问http://localhost:3000以使用本系统。 

    ```bash
    npm run start
    ```

## 功能实现分析

1. **查看自己拥有的汽车列表, 查看当前还没被借用汽车列表**

   在合约`BorrowYourCar`分别维护了两个`mapping`，一个为`cars`即汽车的Token Id到汽车信息的映射，一个为`myCars`，即用户地址到其所拥有车的Token Id数组的映射。在前端调用`seeMyCars`函数即可获得自己拥有的汽车列表的信息，通过`showAllCars`函数即可获得所有车辆的信息，在前端经过筛选后即可获得未被借用的汽车列表。

2. **查询一辆汽车的主人，以及该汽车当前的借用者(如果有)。**

   前端通过`showAllCars`获得所有车辆的信息，在前端筛选后即可实现查询某辆汽车信息的功能，包括汽车的主人，一起该汽车的借用者，借用时间等。

3. **选择并借用某辆还没有被租借的汽车一定时间。**

   前端调用`borrow`函数并传入要借用的车辆的Token Id及借用的时间即可借用车辆，在借用前会检查余额。此后更新车辆的信息，包括借用时间于借用人。

4. **使用自己发行的基于ERC20的货币JJCoin付费租赁汽车。**

   基于ERC20发行自己的货币JJCoin，在用户租用他人车辆时会消耗一定的JJC用于支付租赁费用。在支付前向合约`BorrowYourCar`授权费用，并由合约发送至车辆的主人。

## 项目运行截图

首次进入界面如下：

![first_start](.\assets\first_start.png)

点击右上角Connect Wallet连接小狐狸，连接后如下：

![connect_wallet](.\assets\connect_wallet.png)

右上角显示当前登录账号的地址，点击右上角Get JJC Airdrop即可领取JJCoin空投，点击后支付Gas即可领取1000000JJC，领取后如下：

![get_JJC](.\assets\get_JJC.png)

此时将鼠标移至右上角用户地址处，在弹出框中点击rent my car即可发布一辆汽车：

![rent_my_car](.\assets\rent_my_car.png)

发布汽车后点击see my cars即可在弹窗中查看自己拥有的车辆的信息。

![see_my_cars](.\assets\see_my_cars.png)

此时在小狐狸上切换账号并刷新页面，即可看到由其他账号发布的车辆：

![see_all_cars](.\assets\see_all_cars.png)

在领取完JJC空投后即可点击Borrow按钮选择想要租用的车，在弹出的弹窗中选择时间：

![borrow_select_time](.\assets\borrow_select_time.png)

选好时间后点击确定即可成功租借，同时会扣取一定数量的JJC（取决于租借时间），同时首页中刚被租借的车辆将消失：

![borrow_success](D:\Program\区块链与数字货币\BlockChain_Lab\assets\borrow_success.png)

在上方搜索框搜索刚才租界车辆的Token Id即可看见被租借车辆的信息，包括租借人以及到期时间：

![search](.\assets\search.png)

此时切换会被租借车辆主人的账号，可以看见JJC增加了：

![check_increace_JJC](.\assets\check_increace_JJC.png)

同时再次查看自己拥有的车，可以看到被租借车辆的相关信息：

![check_borrow_info](.\assets\check_borrow_info.png)

在租用时间结束后，车辆将可再次被租用：

![can_borrow_again](.\assets\can_borrow_again.png)

## 参考内容

- 课程的参考Demo见：[DEMOs](https://github.com/LBruyne/blockchain-course-demos)。

- ERC-4907 [参考实现](https://eips.ethereum.org/EIPS/eip-4907)
