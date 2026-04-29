import { ethers } from "ethers";
const sig = "deployWizard(string,string,uint256,address[],uint256[],uint64,uint64)";
const selector = ethers.id(sig).slice(0, 10);
console.log(selector);
