import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./components/mintBox";
import React from "react";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      provider: {},
      web3: {},
      account: {},
      count: 1,
      mintType: "",
      mintTransaction: "",
      pendingRequest: false,
      connected: false,
      txn: "",
      finish: false,
      mintedNum: 0,
      mintableNum: -1,
      tier: 0,
      address: "",
      containedModalShow: "",
      modalDialogTitle: "",
      modalDialogBodyText: "",
      modalDialogBodyHref: "",
      mintErrorMsg: "",
    };
    this.web3Modal = {};
  }
  render() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Home data={this} />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
