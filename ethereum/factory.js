import web3 from "./web3";
import campaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(campaignFactory.interface),
  "0xd261C35273a922019F6b5e477Be5CaDfd53Cd058"
);

export default instance;
