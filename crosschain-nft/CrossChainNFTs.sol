// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
// Axelar imports
import { AxelarExecutable } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol';
import { IAxelarGateway } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol';
import { IAxelarGasService } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol';
import { IERC20 } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IERC20.sol';
// OpenZeppelin imports
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract CrossChainNFTs is AxelarExecutable, ERC721, ERC721URIStorage, Ownable {
    string public value;
    string public remoteChain;
    string public remoteAddress;
    IAxelarGasService public immutable gasService;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor(address gateway_, address gasReceiver_) AxelarExecutable(gateway_) ERC721('CrossChainCanvas', 'CCC') {
        gasService = IAxelarGasService(gasReceiver_);
    }

    function safeMint(address to, string memory uri) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function safeMintFromOtherChain(string calldata destinationChain, string calldata destinationAddress, address to, string memory uri) external payable {
        remoteChain = destinationChain;
        remoteAddress = destinationAddress;
        bytes memory payload = abi.encode(3, uri, to);
        send(payload);
    }

    function send(bytes memory payload) internal {
        if (msg.value > 0) {
            gasService.payNativeGasForContractCall{ value: msg.value }(address(this), remoteChain, remoteAddress, payload, msg.sender);
        }
        gateway.callContract(remoteChain, remoteAddress, payload);
    }

    function connectNFTs(string calldata destinationChain, string calldata destinationAddress) external payable {
        remoteChain = destinationChain;
        remoteAddress = destinationAddress;
        bytes memory payload = abi.encode(1);
        send(payload);
    }


     function update(string calldata newURI, uint token) external payable {
        _setTokenURI(token,newURI);
        if (bytes(remoteChain).length <= 0 || bytes(remoteAddress).length <= 0) {
            return;
        }
        bytes memory payload = abi.encode(2, newURI, token);
        send(payload);
    }

    // Handles calls 
    function _execute(string calldata sourceChain_, string calldata sourceAddress_, bytes calldata payload_) internal override {
        uint method;
        (method) = abi.decode(payload_, (uint8));
        // Connect
        if (method == 1) {
            remoteChain = sourceChain_;
            remoteAddress = sourceAddress_;

            // Update
        } else if (method == 2) {
            uint tokenId;
            string memory newURI;

            (, newURI, tokenId) = abi.decode(payload_, (uint8, string, uint));
            _setTokenURI(tokenId,newURI);
        } else if (method == 3) {
            // Mint
            address to;
            string memory newURI;

            (, newURI, to) = abi.decode(payload_, (uint8, string, address));
            safeMint(to, newURI);
        }
    }
   

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
