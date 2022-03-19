import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  updateBankAccountBalance,
  getBankAccountName,
} from "../../../services/LocalStorage";
import DateToday from "../../../components/General/Helpers/DateToday";
import "../Deposit/Deposit.scss";
import { v4 as uuidv4 } from "uuid";
import Popup from "../../../components/General/Helpers/ErrorPopup";
import {
  NameDataListGenerator,
  AccntNumDataListGenerator,
} from "../../../components/General/Helpers/Datalist";

export let nameChecker;
export let transactionObject;
const WithdrawFunc = () => {
  const [name, setName] = useState("");
  const [transactionDate, setTransactionDate] = useState(DateToday);
  const [accountNumber, setAccountNumber] = useState("");
  const [withdraw, setWithdraw] = useState("");
  const [transactionId, setTransactionId] = useState(uuidv4());
  const [isOpen, setIsOpen] = useState(false);
  const [errormessage, setErrorMessage] = useState("");
  let navigate = useNavigate();
  let nameChecker = getBankAccountName(name);

  function togglePopup() {
    setIsOpen(true);
  }
  function clearErrors() {
    setIsOpen(false);
    setErrorMessage([]);
  }

  function errorHandler() {
    if (
      !nameChecker ||
      nameChecker.accountNumber !== parseInt(accountNumber) ||
      nameChecker.balance < parseInt(withdraw) ||
      parseInt(withdraw) < 0
    ) {
      if (!nameChecker) {
        togglePopup();
        setErrorMessage(displayerror => [
          ...displayerror,
          "Account Name does not exist",
        ]);
      }
      if (nameChecker.accountNumber !== parseInt(accountNumber)) {
        togglePopup();
        setErrorMessage(displayerror => [
          ...displayerror,
          "Account Number does not match",
        ]);
      }
      if (nameChecker.balance < parseInt(withdraw)) {
        togglePopup();
        setErrorMessage(displayerror => [
          ...displayerror,
          "Insufficient Balance",
        ]);
      }
      if (parseInt(withdraw) < 0) {
        togglePopup();
        setErrorMessage(displayerror => [
          ...displayerror,
          "Invalid Withdraw Amount",
        ]);
      }
      return true;
    }
    return false;
  }
  function stateResetter() {
    setName("");
    setTransactionDate(DateToday);
    setAccountNumber("");
    setWithdraw("");
    setTransactionId(uuidv4());
  }

  const WithdrawThis = e => {
    e.preventDefault();
    if (!errorHandler()) {
      transactionObject = {
        accountName: name,
        accountNumber: accountNumber,
        transactionDate: transactionDate,
        transactionId: transactionId,
        action: "withdraw",
        oldBalance: nameChecker.balance,
        newBalance: nameChecker.balance - parseInt(withdraw),
      };

      updateBankAccountBalance(
        name,
        parseInt(accountNumber),
        parseInt(withdraw),
        "withdraw",
        transactionObject
      );
      stateResetter();
      navigate(`/complete/${transactionId}`);
    }
  };
  return (
    <div>
      {isOpen && (
        <Popup
          content={errormessage.map(displayed => {
            return <p>{displayed}</p>;
          })}
          handleClose={clearErrors}
        />
      )}
      <form className="formd" onSubmit={WithdrawThis}>
        <div className="divname">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            list="namelist"
            pattern="[a-zA-Z\s]+"
            className="form-fields"
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            autoComplete="off"
          />
          <datalist id="namelist">
            <NameDataListGenerator />
          </datalist>
        </div>

        <div className="acct">
          <label htmlFor="accountNumber" className="form-label">
            Account Number
          </label>
          <input
            type="number"
            list="listacct"
            className="form-fields"
            id="accountNumber"
            value={accountNumber}
            onChange={e => setAccountNumber(e.target.value)}
            autoComplete="off"
          />
          <datalist id="listacct">
            <AccntNumDataListGenerator />
          </datalist>
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
            required
          />
        </div>

        <div className="divbal">
          <label htmlFor="deposit" className="form-label">
            Withdraw Amount
          </label>
          <input
            type="number"
            pattern="[0-9.]+"
            className="form-fields"
            id="withdraw"
            value={withdraw}
            onChange={e => setWithdraw(e.target.value)}
            required
            autoComplete="off"
          />
        </div>

        <button type="submit" className="submitd">
          Submit
        </button>
      </form>
    </div>
  );
};

export default WithdrawFunc;