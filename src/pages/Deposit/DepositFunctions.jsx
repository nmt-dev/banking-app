import React from "react";
import { useState } from "react";
import DateToday from "../../components/General/Helpers/DateToday";
import {
  getBankAccountName,
  updateBankAccountBalance,
} from "../../components/LocalStorage/LocalStorage";
import "./Deposit.scss";
import { v4 as uuidv4 } from "uuid";

//add value on options
export let transactionDetail;
export let nameChecker;
const DepositFunc = () => {
  const [name, setName] = useState("");
  const [transactionDate, setTransactionDate] = useState(DateToday);
  const [accountNumber, setAccountNumber] = useState("");
  const [deposit, setDeposit] = useState("");
  const [transactionId, setTransactionId] = useState(uuidv4());

  const DepositThis = e => {
    e.preventDefault();

    //user already exists
    let nameChecker = getBankAccountName(name);
    console.log(nameChecker); //object

    if (!nameChecker) {
      alert("user does not exist");
    } else {
      if (nameChecker.accountNumber !== parseInt(accountNumber)) {
        alert("user does not exist");
      } else {
        transactionDetail = {
          accountName: name,
          accountNumber: accountNumber,
          transactionDate: transactionDate,
          transactionId: transactionId,
          action: "deposit",
          oldBalance: nameChecker.balance,
          newBalance: nameChecker.balance + parseInt(deposit),
        };

        updateBankAccountBalance(
          name,
          parseInt(accountNumber),
          parseInt(deposit),
          "deposit",
          transactionDetail
        );

        window.location.pathname = `/success/${transactionId}`;

        setName("");
        setTransactionDate(DateToday());
        setAccountNumber("");
        setDeposit("");
        setTransactionId(uuidv4());
      }
    }
  };

  return (
    <form className="formd" onSubmit={DepositThis}>
      <div className="divname">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          type="text"
          pattern="[a-zA-Z\s]+"
          className="form-fields"
          id="name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>

      <div className="acct">
        <label htmlFor="accountNumber" className="form-label">
          Account Number
        </label>
        <input
          type="text"
          pattern="[0-9.]+"
          className="form-fields"
          id="accountNumber"
          value={accountNumber}
          onChange={e => setAccountNumber(e.target.value)}
        />
      </div>

      <div className="divdate">
        <label htmlFor="transactionDate" className="form-label">
          Transaction Date
        </label>
        <input
          type="text"
          className="form-fields"
          id="transactionDate"
          value={transactionDate}
          disabled
          onChange={e => setTransactionDate(e.target.value)}
        />
      </div>

      <div className="divbal">
        <label htmlFor="deposit" className="form-label">
          Deposit Amount
        </label>
        <input
          type="text"
          pattern="[0-9.]+"
          className="form-fields"
          id="deposit"
          value={deposit}
          onChange={e => setDeposit(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="submit">
        Submit
      </button>
    </form>
  );
};

export default DepositFunc;
