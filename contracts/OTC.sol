// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.8.0;

contract OTC {

    struct Trade {
        uint256 give;
        uint256 take;
        uint256 rate;
        address payable offerer;
        address payable taker;
        bool isCompleted;
    }

    Trade[] public trades;

    // constructor () public {

    // }

    function createTrade(uint256 _rate) public payable {
        require(msg.value > 0 && _rate > 0);
        Trade memory t;
        t.give = msg.value;
        t.rate = _rate;
        t.take = msg.value * _rate;
        t.offerer = msg.sender;
        t.isCompleted = false;
        trades.push(t);

    }

    function cancelTrade(uint256 index) public payable {
        require(trades[index].isCompleted == false);
        require(msg.sender == trades[index].offerer);
        Trade storage trade = trades[index];
        
        trade.isCompleted = true;
        msg.sender.transfer(trade.give);

    }

    function makeTrade(uint index) public payable {
        require(trades[index].isCompleted == false && trades[index].take == msg.value);

        Trade storage trade = trades[index];
        trade.offerer.transfer(trade.take);
        msg.sender.transfer(trade.give);

        trade.isCompleted = true;

    }

    function getTradeNum() public view returns (uint) {
        return trades.length;
    }

    function getTradeDetail(uint index) public view returns (address, uint256, uint256, uint256, bool) {
        Trade storage trade = trades[index];

        return (trade.offerer, trade.give, trade.rate, trade.take, trade.isCompleted);
    }


}