import React, { useEffect } from "react";
import { Row } from "react-bootstrap";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { listAdsByPagination } from "../redux/Search/SearchSlice";

const Pagination = () => {
  const dispatch = useDispatch();
  const { limit, currentPage, totalPages } = useSelector((state) => state.search.data.pagination);
  const {
    categories, subcategories, questions, commercialName,
  } = useSelector((state) => state.search.data.payload);
  const [buttonValue, setButtonValue] = React.useState([]);

  const handlePaginationButton = (newPage) => {
    dispatch(listAdsByPagination({
      data: {
        data: {
          categories, subcategories, questions, commercial_name: commercialName,
        },
        filter: false,
      },
      limit,
      offset: (newPage - 1) * limit,
    }));
  };

  useEffect(() => {
    setButtonValue([
      ((currentPage < 5 && totalPages > 7) || totalPages < 8) ? 3 : currentPage - 1,
      ((currentPage < 5 && totalPages > 7) || totalPages < 8) ? 4 : currentPage,
      totalPages > 7 ? currentPage + 1 : 6,
    ]);
  }, [currentPage, totalPages]);

  return (
    <Row className="w-100 d-md-flex justify-content-center">
      <div className="d-flex justify-content-between" style={{ width: "fit-content" }}>
        <button
          type="button"
          className={`pagination-button ${currentPage === 1 ? "disable-button" : ""}`}
          onClick={() => handlePaginationButton(currentPage - 1)}
        >
          <FontAwesomeIcon className="mx-auto my-auto" icon={faChevronLeft} />
        </button>
        <button type="button" className={`pagination-button ${currentPage === 1 ? "active" : ""}`} onClick={() => handlePaginationButton(1)}>
          <span className="mx-auto my-auto">1</span>
        </button>
        {
          totalPages > 1 && (
            <button
              type="button"
              className={`pagination-button ${currentPage === 2 ? "active" : ""} ${((currentPage < 5 && totalPages > 7) || totalPages < 8) ? "" : "disable-button"}`}
              onClick={() => handlePaginationButton(2)}
            >
              <span className="mx-auto my-auto">{((currentPage < 5 && totalPages > 7) || totalPages < 8) ? 2 : "..."}</span>
            </button>
          )
        }
        {
          totalPages > 2 && (
            <button type="button" className={`pagination-button ${currentPage === buttonValue[0] ? "active" : ""}`} onClick={() => handlePaginationButton(buttonValue[0])}>
              <span className="mx-auto my-auto">{buttonValue[0]}</span>
            </button>
          )
        }
        {
          totalPages > 3 && (totalPages > currentPage) && (
            <button type="button" className={`pagination-button ${currentPage === buttonValue[1] ? "active" : ""}`} onClick={() => handlePaginationButton(buttonValue[1])}>
              <span className="mx-auto my-auto">{buttonValue[1]}</span>
            </button>
          )
        }
        {
          currentPage >= 4 && totalPages - 1 > currentPage && (
            <button type="button" className={`pagination-button ${currentPage === buttonValue[2] ? "active" : ""}`} onClick={() => handlePaginationButton(buttonValue[2])}>
              <span className="mx-auto my-auto">{buttonValue[2]}</span>
            </button>
          )
        }
        {
          totalPages > 7 && totalPages - 1 > currentPage && (
            <button type="button" className="pagination-button disable-button">
              <span className="mx-auto my-auto">...</span>
            </button>
          )
        }
        {
          totalPages >= 5 && (
            <button type="button" className={`pagination-button ${currentPage === totalPages ? "active" : ""}`} disabled={currentPage === totalPages} onClick={() => handlePaginationButton(totalPages)}>
              <span className="mx-auto my-auto">{totalPages}</span>
            </button>
          )
        }
        <button type="button" className={`pagination-button ${currentPage === totalPages ? "disable-button" : ""}`} disabled={currentPage === totalPages} onClick={() => handlePaginationButton(currentPage + 1)}>
          <FontAwesomeIcon className="mx-auto my-auto" icon={faChevronRight} />
        </button>
      </div>
    </Row>
  );
};

export default Pagination;
