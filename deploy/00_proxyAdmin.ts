
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { readAddressList, storeAddressList } from "../scripts/helper";

const deployProxyAdmin: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const {deployments, getNamedAccounts, network} = hre;
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();

    const addressList = {};
    addressList[network.name] = {};
    console.log(addressList);
    const proxyAdmin = await deploy('MyProxyAdmin', {
        contract: 'MyProxyAdmin',
        from: deployer,
        args: [],
        log: true,
    });
    console.log(`Deploy proxyAdmin at ${proxyAdmin.address}`);
    addressList[network.name].proxyAdmin = proxyAdmin.address;
    storeAddressList(addressList);
}

deployProxyAdmin.tags = ['admin'];
export default deployProxyAdmin;