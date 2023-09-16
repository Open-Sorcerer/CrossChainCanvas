# CrossChainCanvas  

#### CrossChain Canvas is a platform that enables users to mint, showcase, and own NFTs across different blockchains seamlessly.  

|  |  |  
| :----------- | :----------- |  
| **Video Demo**      | [Watch the Video](https://youtu.be/xgMEX_mnHhw)       |  
| **Deployment Link** | [Live Deployment](https://crosschaincanvas-14d270.spheron.app) |  
| **GitHub Repo**     | [GitHub Repository](https://github.com/Open-Sorcerer/CrossChainCanvas) |  
|  |  |  


<div width="100%">
  <img src="https://github.com/Open-Sorcerer/CrossChainCanvas/assets/63473496/6ddcfaa3-8ad6-4734-8769-80a7c80c6236" width="50%" align="left"/>
  <img src="https://github.com/Open-Sorcerer/CrossChainCanvas/assets/63473496/d082dc49-6f5c-431c-a353-5a9a5813e327" width="45%" align="right"/>

</div>  

##   ..........  

With the rise of NFTs, creators, and collectors face the challenge of fragmentation - different NFTs on different blockchains. 
CrossChain Canvas solves this problem by providing a unified interface to mint NFTs on various blockchains, making it easier for creators to reach broader audiences and for collectors to manage their multi-chain NFT portfolio. It simplifies the NFT experience, promoting interoperability and accessibility in the NFT ecosystem.  

  
## Inspiration

The inspiration for Cross Chain Canvas came from the increasing popularity of NFTs (Non-Fungible Tokens) and the challenges faced by creators and collectors due to the fragmentation of NFTs across various blockchains. We recognized the need for a solution that would streamline the process of minting and managing NFTs across different blockchains, making it more accessible and user-friendly.

## What it does

Cross Chain Canvas is a platform that enables users to mint, own, and showcase NFTs seamlessly across different blockchains. It bridges the gap between various blockchains, allowing users to mint NFTs on one blockchain and deploy them on another. This involves features for generating prompt-based AI-driven NFTs, setting resolution preferences, uploading NFT metadata to IPFS and finally minting it in the same or a different chain (using Axelar Gateway for bridging)

## How we built it

We built Cross Chain Canvas using a combination of tools, technologies, and APIs. We integrated OpenJourney (ie, Stable Diffusion model trained on MidJourney images) for AI image generation and utilized the Replicate API for hosting. The platform connects to users' wallets, such as Metamask, to facilitate the minting and deployment of NFTs. Then, the image is hosted on Thirdweb Storage. We also implemented IPFS for secure storage of NFT metadata. Finally, smart contracts that facilitate same-chain minting, as well as cross-chain minting (bridged by Axelar Gateway), were integrated.

## Challenges we ran into

During the development of Cross Chain Canvas, we encountered several challenges. One significant challenge was ensuring seamless cross-chain functionality integrating different blockchains and ensuring compatibility required thorough research and testing. Additionally, optimizing gas fees for transactions across various chains proved to be a complex task.

## Accomplishments that we're proud of

One major achievement is successfully implementing cross-chain functionality, allowing users to mint NFTs on one blockchain and deploy them on another. We've also created a user-friendly interface for generating AI-based NFTs and managing preferences. Additionally, hosting images on Thirdweb storage & NFT metadata on IPFS ensures secure and decentralized storage.

## What we learned

Through the development of Cross Chain Canvas, we've gained valuable insights into the complexities of the NFT ecosystem and the challenges associated with multi-chain management. We've also deepened our understanding of AI image generation using OpenJourney and the utilization of blockchain technologies for minting NFTs across chains (esp. Axelar).

## What's next for Cross Chain Canvas

The future of Cross Chain Canvas holds exciting possibilities. We plan to expand our platform's support for more blockchain combinations, providing users with even greater flexibility. Additionally, we aim to enhance the user experience with additional features and optimizations, such as improving gas fee calculations and further streamlining the minting and deployment processes. Ultimately, we aspire to make Cross Chain Canvas a leading solution for simplifying NFT portfolio management across different blockchains.
