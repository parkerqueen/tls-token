require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-etherscan');

const ALCHEMY_API_KEY = 'KEY_HERE';
const KOVAN_PRIVATE_KEY = 'KEY_HERE';
const ETHERSCAN_API_KEY = 'KEY_HERE';

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: '0.8.0',
    networks: {
        kovan: {
            url: ALCHEMY_API_KEY,
            accounts: [`0x${KOVAN_PRIVATE_KEY}`],
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
};
