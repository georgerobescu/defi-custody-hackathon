import React, { useEffect, useState } from "react";
import { compose } from "recompose";
import { inject, observer } from "mobx-react";
import { MetaMaskButton } from "rimble-ui";
import { EthAddress, FlexCenteredItem } from "../../styled";
import Web3 from "web3";
import { toast } from "react-toastify";

const USER_DENIED_ACCESS = -32603;

const MetamaskConnection = ({ Web3Store }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [defaultAddress, setDefaultAddress] = useState();
  useEffect(() => {
    const fetchAccount = async () => {
      const { ethereum } = window;
      const web3 = new Web3(ethereum);
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        Web3Store.setWeb3(web3, accounts);
        setDefaultAddress(accounts[0]);
      }
      setIsLoading(false);
    };
    fetchAccount();
  }, [Web3Store]);
  const connect = async () => {
    setIsLoading(true);
    if (window.ethereum) {
      const { ethereum } = window;
      const web3 = new Web3(ethereum);
      try {
        const accounts = await ethereum.enable();
        Web3Store.setWeb3(web3, accounts);
        setDefaultAddress(accounts[0]);
      } catch (error) {
        if (error.code === USER_DENIED_ACCESS) {
          toast.warn("Please allow to us work with you!");
        } else {
          toast.error("Ooops. Something went wrong");
          console.log(error);
        }
      }
      toast.success("Success! Metamask connected");
    } else {
      console.log();
      toast.warn("Please, Install metamask extension!");
    }
    setIsLoading(false);
  };
  return (
    <FlexCenteredItem>
      {defaultAddress ? (
        <EthAddress address={defaultAddress} textLabels />
      ) : (
        <MetaMaskButton.Outline onClick={connect} disabled={isLoading}>
          Connect with MetaMask
        </MetaMaskButton.Outline>
      )}
    </FlexCenteredItem>
  );
};

export default compose(
  inject("Web3Store"),
  observer
)(MetamaskConnection);
