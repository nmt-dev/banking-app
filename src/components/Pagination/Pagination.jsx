import React, { useState } from "react";
import "./pagination.scss";

//data - array of the data to be in paginated form
//Component - react component to show paginated data
//pageLimit - number of pages to be shown in pagination
//dataLimit - number of rows to be shown in each page

function Pagination({
  data,
  Component,
  pageLimit,
  dataLimit,
  componentFunction,
}) {
  const [pages] = useState(Math.round(data.length / dataLimit));
  const [currentPage, setCurrentPage] = useState(1);

  function toNextPage() {
    setCurrentPage(page => page + 1);
  }
  function toPrevPage() {
    setCurrentPage(page => page - 1);
  }
  function changePage(e) {
    setCurrentPage(parseInt(e.target.textContent));
  }

  const getPaginatedData = () => {
    const startIndex = currentPage * dataLimit - dataLimit;
    const endIndex = startIndex + dataLimit;
    return data.slice(startIndex, endIndex);
  };
  const getPaginationGroup = () => {
    let start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
    return new Array(pageLimit).fill().map((_, i) => start + i + 1);
  };

  return (
    <>
      <tbody>
        {getPaginatedData().map((data, i) => (
          <Component
            key={i}
            userInfo={data}
            deactivateAccount={componentFunction}
          />
        ))}
      </tbody>

      <div className="pagination">
        <button
          onClick={toPrevPage}
          className={`prev ${currentPage === 1 ? "disabled" : ""}`}
        >
          ←
        </button>

        {getPaginationGroup().map((element, index) => {
          if (element <= pages) {
            return (
              <button
                key={index}
                onClick={changePage}
                className={`paginationItem ${
                  currentPage === element ? "active" : null
                }`}
              >
                {element}
              </button>
            );
          }
        })}

        <button
          onClick={toNextPage}
          className={`next ${currentPage === pages ? "disabled" : ""}`}
        >
          →
        </button>
      </div>
    </>
  );
}

export default Pagination;