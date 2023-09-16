'use strict';

const {
    utils: { deployContract },
} = require('@axelar-network/axelar-local-dev');

const CrossChainNFTs = rootRequire('./artifacts/examples/evm/interchain-nft/CrossChainNFTs.sol/CrossChainNFTs.json');

async function deploy(chain, wallet) {
    console.log(`Deploying CrossChainNFTs for ${chain.name}.`);
    chain.contract = await deployContract(wallet, CrossChainNFTs, [chain.gateway, chain.gasService]);
    chain.wallet = wallet;
    console.log(`Deployed CrossChainNFTs for ${chain.name} at ${chain.contract.address}.`);
}

async function execute(chains, wallet, options) {
    // const args = options.args || [];
    const { source, destination, calculateBridgeFee } = options;
    // const message = args[2] || `Hello ${destination.name} from ${source.name}, it is ${new Date().toLocaleTimeString()}.`;

    const fee = await calculateBridgeFee(source, destination);

    console.log('Minting NFT from other chain...');
    console.log('Source chain is:', source.name);
    console.log('Destination chain:', destination.name);

    const tx3 = await source.contract.safeMintFromOtherChain(
        destination.name,
        destination.contract.address,
        '0x9db6246f235b5cf531db075c45239d2aa42f1204',
        'https://ipfs.moralis.io:2053/ipfs/Qma4X1NYjE5sA8Z6gYEQwentwAc11t2jXt9g3Lmh3b5P2r',
        {
            value: fee,
        },
    );

    await tx3.wait();

    console.log('Transaction hash:', tx3);

    console.log('Minted NFT from other chain successfully!');

    console.log('Total NFTs on Source Chain:', (await source.contract.totalSupply()).toString());
    console.log('Total NFTs on Destination Chain:', (await destination.contract.totalSupply()).toString());

    console.log();

    console.log('-');
}

module.exports = {
    deploy,
    execute,
};
