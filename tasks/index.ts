import { readAddressList } from "../scripts/helper";
import { task, types } from 'hardhat/config';
import { StakingPool__factory } from '../typechain-types';

task('addPool', 'Add a new staking pool').setAction(async (_, hre) => {
    const { network } = hre;
    const [ develop ] = await hre.ethers.getSigners();
    const addressList = readAddressList();

    const stakingPoolContract = new StakingPool__factory(develop).attach(addressList[network.name].proxyContract);
    
    const tx = await stakingPoolContract.add(addressList[network.name].lpSusuToken);
    console.log(await tx.wait(1));
    console.log(await stakingPoolContract.poolInfo[0]);
});

task('deposit', 'Deposit liquidity to staking pool').setAction(async (_, hre) => {

    const { network } = hre;
    const [ develop ] = await hre.ethers.getSigners();
    const addressList = readAddressList();

    const stakingPoolContract = new StakingPool__factory(develop).attach(addressList[network.name].implementContract);
    await stakingPoolContract.deposit(0, 10000);
});

task('withdraw', 'Withdraw liquidity from staking pool').setAction(async (_, hre) => {

    const { network } = hre;
    const [ develop ] = await hre.ethers.getSigners();
    const addressList = readAddressList();

    const stakingPoolContract = new StakingPool__factory(develop).attach(addressList[network.name].implementContract);
    await stakingPoolContract.withdraw(0, 1000);
    // const amount = await stakingPoolContract.userInfo[0][develop.address].amount;
    console.log(await stakingPoolContract.poolInfo[0]);
});