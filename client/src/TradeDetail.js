import React, { Component } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import uuid from "react-uuid";

import "./TradeDetail.css";

class TradeDetail extends Component {
  onTrade = async (amount, index) => {
    const web3 = require("web3");

    const { accounts, contract } = this.props.state;

    if (accounts[0] === this.props.trades[index].from) {
      alert("You cannot trade with yourself.");
    } else {
      await contract.methods
        .makeTrade(index)
        .send({ from: accounts[0], value: web3.utils.toWei(amount, "ether") })
        .on("transactionhash", () => {
          console.log("trade success");
        });
      window.location.reload();
    }
  };

  onCancel = async (index) => {
    const { accounts, contract } = this.props.state;

    await contract.methods.cancelTrade(index).send({
      from: accounts[0],
    });
    window.location.reload();
  };

  render() {
    return (
      <TableContainer component={Paper}>
        <Table className="tradeTable" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <b>From</b>
              </TableCell>
              <TableCell>
                <b>Offer</b>
              </TableCell>
              <TableCell>
                <b>Rate</b>
              </TableCell>
              <TableCell>
                <b>Total</b>
              </TableCell>
              <TableCell>
                <b>Status</b>
              </TableCell>
              <TableCell>
                <b>Status</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.trades.map((trade, index) => (
              <TableRow key={uuid()}>
                <TableCell component="th" scope="row">
                  {trade.from}
                </TableCell>
                <TableCell>{trade.offer}</TableCell>
                <TableCell>{trade.rate}</TableCell>
                <TableCell>{trade.total}</TableCell>
                <TableCell>
                  {!trade.isCompleted ? (
                    <button
                      onClick={() => {
                        this.onTrade(trade.total, index);
                      }}
                    >
                      Trade
                    </button>
                  ) : (
                    "Completed"
                  )}
                </TableCell>
                <TableCell>
                  {trade.from === this.props.state.accounts[0] &&
                    !trade.isCompleted && (
                      <button
                        type="button"
                        onClick={() => {
                          this.onCancel(index);
                        }}
                      >
                        Cancel
                      </button>
                    )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

export default TradeDetail;
