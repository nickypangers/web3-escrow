import React, { Component } from "react";
import OTCContract from "./contracts/OTC.json";
import getWeb3 from "./getWeb3";

import "./App.css";
import TradeDetail from "./TradeDetail";

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    balance: 0,
    rate: 0,
    offer: 0,
    trades: [],
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      var balance = await web3.eth.getBalance(accounts[0]);
      var ether = await web3.utils.fromWei(balance, "ether");

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = OTCContract.networks[networkId];
      const instance = new web3.eth.Contract(
        OTCContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState(
        { web3, accounts, contract: instance, balance: ether },
        this.getTrades
      );
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  getTrades = async () => {
    // console.log("await web3")

    try {
      const web3 = require("web3");

      const { contract } = this.state;

      const response = await contract.methods.getTradeNum().call();

      if (response > 0) {
        let trades = [...this.state.trades];
        for (var i = 0; i < response; i++) {
          const tradeDetail = await contract.methods.getTradeDetail(i).call();
          var detail = {};
          tradeDetail[1] = await web3.utils.fromWei(tradeDetail[1], "ether");
          tradeDetail[3] = await web3.utils.fromWei(tradeDetail[3], "ether");
          detail = {
            from: tradeDetail[0],
            offer: tradeDetail[1],
            rate: tradeDetail[2],
            total: tradeDetail[3],
            isCompleted: tradeDetail[4],
          };
          trades.push(detail);
        }
        this.setState({ trades: trades });
      }
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  onChangeOffer(event) {
    event.preventDefault();
    this.setState({
      offer: event.target.value,
    });
  }

  onChangeRate(event) {
    event.preventDefault();
    this.setState({
      rate: event.target.value,
    });
  }

  onSubmit = async (event) => {
    event.preventDefault();
    console.log("submit");

    const web3 = require("web3");

    const { contract, accounts, offer, rate } = this.state;

    await contract.methods
      .createTrade(rate)
      .send({ from: accounts[0], value: web3.utils.toWei(offer, "ether") });
    window.location.reload();
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
      <div className="App">
        <h1>dOTC Trades</h1>
        <p>Connected account: {this.state.accounts}</p>

        <div>
          <form onSubmit={this.onSubmit}>
            <label>
              Offer:
              <input
                type="number"
                step="any"
                onChange={this.onChangeOffer.bind(this)}
              />
            </label>
            <label>
              Rate:
              <input
                type="number"
                step="any"
                onChange={this.onChangeRate.bind(this)}
              />
            </label>
            <label>
              Receive:<p>{this.state.offer * this.state.rate}</p>
            </label>
            <input type="submit" value="Create Trade" />
          </form>
        </div>

        <p>Number of Trades: {this.state.trades.length} </p>
        <div>
          <TradeDetail trades={this.state.trades} state={this.state} />
        </div>
      </div>
    );
  }
}

export default App;
