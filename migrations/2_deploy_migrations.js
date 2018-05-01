var CANSign = artifacts.require("../contracts/CANSign.sol");

module.exports = function(deployer) {
  deployer.deploy(CANSign);
};
