import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAdminAccounts } from "../../../services/LocalStorage";
import capitalizeFirstLetter from "../../../utils/capitalizeFirstLetter";
import styles from "./IndividualUser.module.scss";
import styles1 from "../../../pages/banking-app/MainPage/MainPage.module.scss";
import Popup from "../../pop-up/ConfirmDelete";
import TablePagination from "../../Pagination";
import { getBankAccountNumber } from "../../../utils/bankAccounts";

function IndividualUser({ bankAccounts, setBankAccounts }) {
  const bankAccount = getBankAccountNumber(
    bankAccounts,
    +useParams().accountNumber
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [inputAdminPassword, setInputAdminPassword] = useState("");
  const [displayError, setDisplayError] = useState();
  const [num, setNum] = useState(3);
  const navigate = useNavigate();

  const deactivateAccount = accountNumber => {
    const newAccountList = bankAccounts.filter(
      account => account.accountNumber !== accountNumber
    );

    setBankAccounts(newAccountList);
    navigate(-1);
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

    setIsVisible(false);
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
              <h1 className={styles.popupHeader}>
                Please confirm delete account request.
              </h1>
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
      <div className={styles1.pageMainContent}>
        <button onClick={togglePopup} className={styles.removeAccountBtn}>
          <i className="las la-user-slash" />
          Remove Account
        </button>
        {isVisible && (
          <>
            <div className={styles.detailsContainer}>
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
                <span>Creation Date: </span>{" "}
                <span>{bankAccount.creationDate}</span>
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
          </>
        )}
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
