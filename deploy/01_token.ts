
import { DeployFunction, ProxyOptions } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { readAddressList, storeAddressList } from "../scripts/helper";

const deployStakingPool: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const {deployments, getNamedAccounts, network} = hre;
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();

    const addressList = readAddressList();
    const susuToken = await deploy('SusuToken', {
        contract: 'SusuToken',
        from: deployer,
        args: [],
        log: true,
    });
    console.log(`Deploy SusuToken at ${susuToken.address}`);

    const lpSusuToken = await deploy('lpSusuToken', {
        contract: 'lpSusuToken',
        from: deployer,
        args: [],
        log: true,
    });
    console.log(`Deploy lpSusuToken at ${lpSusuToken.address}`);

    const proxyOption: ProxyOptions = {
        proxyContract: 'TransparentUpgradeableProxy',
        viaAdminContract: 'MyProxyAdmin',
        execute: {
            init: {
                methodName: 'initialize',
                args: [susuToken.address]
            }
        }
    };

    const myContract = await deploy('StakingPool', {
        contract: 'StakingPool',
        from: deployer,
        proxy: proxyOption,
        args: [],
        log: true
    });
    console.log(`Deploy staking pool proxy at ${myContract.address}`);
    console.log(`Deploy staking pool implement at ${myContract.implementation}`)

    addressList[network.name].susuToken = susuToken.address;
    addressList[network.name].lpSusuToken = lpSusuToken.address;
    addressList[network.name].proxyContract = myContract.address;
    addressList[network.name].implementContract = myContract.implementation;

    storeAddressList(addressList);
}

deployStakingPool.tags = ['stakingPool'];
export default deployStakingPool;