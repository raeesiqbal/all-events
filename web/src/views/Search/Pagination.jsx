import React, { useEffect } from "react";
import { Row } from "react-bootstrap";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { listAdsByPagination } from "../redux/Search/SearchSlice";

const Pagination = () => {
  const dispatch = useDispatch();
  const offset = useSelector((state) => state.search.data.pagination.offset);
  const limit = useSelector((state) => state.search.data.pagination.limit);
  const page = useSelector((state) => state.search.data.pagination.page);
  const total = useSelector((state) => state.search.data.pagination.count);
  const categories = useSelector((state) => state.search.data.payload.categories);
  const subcategories = useSelector((state) => state.search.data.payload.subcategories);
  const questions = useSelector((state) => state.search.data.payload.questions);
  const commercialName = useSelector((state) => state.search.data.payload.commercialName);
  const [buttonValue, setButtonValue] = React.useState([]);
  const [count, setCount] = React.useState(0);

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
    setCount(parseInt(total / limit, 10));
  }, [total, limit]);

  useEffect(() => {
    setButtonValue([
      ((page < 5 && count > 7) || count < 8) ? 3 : page - 1,
      ((page < 5 && count > 7) || count < 8) ? 4 : page,
      count > 7 ? page + 1 : 6,
    ]);
  }, [page, count]);

  return (
    <Row className="w-100 d-md-flex justify-content-center">
      <div className="d-flex justify-content-between" style={{ width: "fit-content" }}>
        <button type="button" className={`pagination-button ${page === 1 ? "disable-button" : ""}`} onClick={() => handlePaginationButton(page - 1)}>
          <FontAwesomeIcon className="mx-auto my-auto" icon={faChevronLeft} />
        </button>
        <button type="button" className={`pagination-button ${page === 1 ? "active" : ""}`} onClick={() => handlePaginationButton(1)}>
          <span className="mx-auto my-auto">1</span>
        </button>
        {
          count > 1 && (
            <button type="button" className={`pagination-button ${page === 2 ? "active" : ""} ${((page < 5 && count > 7) || count < 8) ? "" : "disable-button"}`} onClick={() => handlePaginationButton(2)}>
              <span className="mx-auto my-auto">{((page < 5 && count > 7) || count < 8) ? 2 : "..."}</span>
            </button>
          )
        }
        {
          count > 2 && (
            <button type="button" className={`pagination-button ${page === buttonValue[0] ? "active" : ""}`} onClick={() => handlePaginationButton(buttonValue[0])}>
              <span className="mx-auto my-auto">{buttonValue[0]}</span>
            </button>
          )
        }
        {
          count > 3 && (count > page) && (
            <button type="button" className={`pagination-button ${page === buttonValue[1] ? "active" : ""}`} onClick={() => handlePaginationButton(buttonValue[1])}>
              <span className="mx-auto my-auto">{buttonValue[1]}</span>
            </button>
          )
        }
        {
          page >= 4 && count - 1 > page && (
            <button type="button" className={`pagination-button ${page === buttonValue[2] ? "active" : ""}`} onClick={() => handlePaginationButton(buttonValue[2])}>
              <span className="mx-auto my-auto">{buttonValue[2]}</span>
            </button>
          )
        }
        {
          count > 7 && count - 1 > page && (
            <button type="button" className="pagination-button disable-button">
              <span className="mx-auto my-auto">...</span>
            </button>
          )
        }
        {
          count >= 5 && (
            <button type="button" className={`pagination-button ${page === count ? "active" : ""}`} disabled={page === count} onClick={() => handlePaginationButton(count)}>
              <span className="mx-auto my-auto">{count}</span>
            </button>
          )
        }
        <button type="button" className={`pagination-button ${page === count ? "disable-button" : ""}`} disabled={page === count} onClick={() => handlePaginationButton(page + 1)}>
          <FontAwesomeIcon className="mx-auto my-auto" icon={faChevronRight} />
        </button>
      </div>
    </Row>
  );
};

export default Pagination;
