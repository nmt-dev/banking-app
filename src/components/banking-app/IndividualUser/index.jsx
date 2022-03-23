import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getBankAccountNumber,
  getBankAccounts,
  getAdminAccounts,
} from "../../../services/LocalStorage";
import capitalizeFirstLetter from "../../General/Helpers/CapitalizeFirstLetter";
import styles from "./IndividualUser.module.scss";
import Popup from "../../pop-up/ConfirmDelete";
import TablePagination from "../../Pagination/Pagination";

const BANK_ACCOUNTS = getBankAccounts();

function IndividualUser() {
  const bankAccount = getBankAccountNumber(+useParams().accountNumber);
  const [isOpen, setIsOpen] = useState(false);
  const [inputAdminPassword, setInputAdminPassword] = useState("");
  const [displayError, setDisplayError] = useState();
  const [num, setNum] = useState(3);
  const navigate = useNavigate();

  const deactivateAccount = accountNumber => {
    const newAccountList = BANK_ACCOUNTS.filter(
      account => account.accountNumber !== accountNumber
    );

    localStorage.setItem("bankAccounts", JSON.stringify(newAccountList));
    window.location.pathname = "/banking/users";
  };

  function togglePopup(e) {
    e.preventDefault();
    setIsOpen(!isOpen);
  }

  const confirmDelete = e => {
    e.preventDefault();
    const adminAccounts = getAdminAccounts().find(
      adminAccount =>
        adminAccount.isLoggedIn === true &&
        adminAccount.password === inputAdminPassword
    );

    if (!adminAccounts) {
      if (+num > 0) {
        setNum(+num - 1);
      } else {
        localStorage.setItem("isAuthenticated", "");
        navigate("/banking/login");
      }
      setDisplayError(`Incorrect password. Retries left:${num}`);
      return;
    }

    deactivateAccount(bankAccount.accountNumber);
  };

  return (
    <>
      {isOpen && (
        <Popup
          content={
            <div className={styles.popupContainer}>
              <span className={styles.closeIcon} onClick={togglePopup}>
                X
              </span>
              <p className={styles.popupHeader}>
                <h1>Please confirm delete account request.</h1>
              </p>
              <div className={styles.inputContainer}>
                <input
                  className={styles.inputPassword}
                  type="password"
                  placeholder="Enter admin password"
                  onChange={e => setInputAdminPassword(e.target.value)}
                  value={inputAdminPassword}
                />
                <span>{displayError}</span>
              </div>
              <button className={styles.confirmBtn} onClick={confirmDelete}>
                Confirm Delete
              </button>
            </div>
          }
        />
      )}
      <div className="page-main-content">
        <div className={styles.detailsContainer}>
          <button onClick={togglePopup}>
            <i className="las la-user-slash" />
            Remove Account
          </button>
          <h1 className={styles.title}>Account Details</h1>
          <p>
            <span>Name: </span> <span>{bankAccount.name}</span>
          </p>
          <p>
            <span>E-mail: </span> <span>{bankAccount.email}</span>
          </p>
          <p>
            <span>Birthday: </span> <span>{bankAccount.bday}</span>
          </p>
          <p>
            <span>Address: </span> <span>{bankAccount.address}</span>
          </p>
          <p>
            <span>Creation Date: </span> <span>{bankAccount.creationDate}</span>
          </p>
          <p>
            <span>Account Number: </span>
            <span>{bankAccount.accountNumber}</span>
          </p>
          <p>
            <span>Balance: </span> <span>₱{bankAccount.balance}</span>
          </p>
        </div>
        <h1 className={`${styles.title} ${styles.margin}`}>
          Transaction History
        </h1>
        <TablePagination
          classNames={{
            table: styles.statement,
            pageNumbers: {
              container: styles.pageNumbers,
              activeElement: styles.active,
            },
          }}
          headers={[
            "Date",
            "Mode",
            "Type",
            "Amount",
            "Transaction ID",
            "Old Balance",
            "New Balance",
          ]}
          data={bankAccount.transactionHistory}
          Component={TransactionTable}
          pageLimit={5}
          dataLimit={10}
        />
      </div>
    </>
  );
}

function TransactionTable({ userInfo }) {
  return (
    <tr>
      <td>{userInfo.transactionDate}</td>
      <td>{userInfo.mode}</td>
      <td>{capitalizeFirstLetter(userInfo.action)}</td>
      <td>{`₱${Math.abs(userInfo.newBalance - userInfo.oldBalance)}`}</td>
      <td>{userInfo.transactionId}</td>
      <td>₱{userInfo.oldBalance}</td>
      <td>₱{userInfo.newBalance}</td>
    </tr>
  );
}

export default IndividualUser;
