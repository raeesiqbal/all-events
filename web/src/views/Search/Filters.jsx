import React, { useEffect, useRef } from "react";
import { Col, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/fontawesome-free-solid";
import {
  listAdsByFilter, setCategories, setSubcategories, setQuestions, setCommercialName, setShowFilters,
} from "../redux/Search/SearchSlice";

const Filters = () => {
  const dispatch = useDispatch();
  const colRef = useRef(null);

  const { isLoggedInState } = useSelector((state) => state.auth);
  const { filters, keyword, showFilters } = useSelector((state) => state.search.data);
  const { limit, offset } = useSelector((state) => state.search.data.pagination);
  const {
    categories, subcategories, questions, commercialName, country,
  } = useSelector((state) => state.search.data.payload);

  const toggleChildDiv = (e) => {
    e.currentTarget.parentNode.children[1].classList.toggle("d-none");
    e.currentTarget.children[1].classList.toggle("d-none");
    e.currentTarget.children[2].classList.toggle("d-none");
  };

  const handleCategory = (e, categoryName) => {
    const data = e.currentTarget.checked ? [...categories, categoryName] : categories.filter((category) => category !== categoryName);
    dispatch(setCategories({ categories: data }));
  };

  const handleSubcategory = (e, subcategoryName) => {
    let data = [];
    if (e.currentTarget.checked) {
      data = [...subcategories, subcategoryName];
    } else {
      data = subcategories.filter((subcategory) => subcategory !== subcategoryName);
    }
    dispatch(setSubcategories({ subcategories: data }));
  };

  function areEqualObjects(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
      if (obj1[key] !== obj2[key]) return false;
    }

    return true;
  }

  const handleQuestion = (e, question) => {
    const data = e.currentTarget.checked ? [...questions, question] : questions.filter((q) => !areEqualObjects(q, question));
    dispatch(setQuestions({ questions: data }));
  };

  const clearFilters = (e) => {
    e.preventDefault();
    dispatch(setCategories({ categories: [] }));
    dispatch(setSubcategories({ subcategories: [] }));
    dispatch(setQuestions({ questions: [] }));
  };

  useEffect(() => {
    dispatch(listAdsByFilter({
      data: {
        data: {
          categories, subcategories, questions, commercial_name: commercialName, country,
        },
        filter: true,
      },
      limit,
      offset,
      isLoggedIn: isLoggedInState,
    }));
  }, [categories, subcategories, questions, commercialName, country, isLoggedInState]);

  useEffect(() => {
    if (keyword.type === "commercial_name") dispatch(setCommercialName({ commercialName: keyword.name }));
    if (keyword.type === "category") dispatch(setCategories({ categories: [keyword.name] }));
    if (keyword.type === "sub_categories") dispatch(setSubcategories({ subcategories: [keyword.name] }));
  }, [keyword]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFilters && colRef.current && !colRef.current.contains(event.target)) {
        if (!(
          event.target.classList.contains("filter-btn")
            || event.target.parentNode.classList.contains("filter-btn")
            || event.target.parentNode.parentNode.classList.contains("filter-btn")
        )) {
          dispatch(setShowFilters(false));
        }
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showFilters]);

  return (
    <Col
      ref={colRef}
      className={` filters`}
      style={{
        left: showFilters ? "0px" : "-100%",
        transition: "ease 400ms",
        // opacity: showFilters ? 1 : 0,
      }}
    >
      <div className="box d-lg-none" style={{ position: "absolute", right: "3.5px", top: "3px" }} />
      <div
        style={{
          position: "absolute",
          right: "11px",
          top: "6px",
          zIndex: "20",
        }}
        className="d-lg-none"
      >
        <div
          role="presentation"
          onClick={() => dispatch(setShowFilters(false))}
          className="close-icon"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            style={{ cursor: "pointer" }}
          >
            <path
              d="M17 1L1 17M1 1L17 17"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <div className="w-100 d-flex justify-content-between mb-5 mt-4 mt-lg-0">
        <span style={{ fontSize: "24px", lineHeight: "28.2px", fontWeight: "700" }}>Filters</span>
        <span
          className="text-secondary my-auto me-5 me-lg-0"
          style={{ fontSize: "14px", textDecoration: "underline", cursor: "pointer" }}
          onClick={clearFilters}
        >
          Clear Filters
        </span>
      </div>
      <div className="w-100 overflow-auto">
        <div className="w-100 pb-2 mb-3 border-bottom">
          <div
            className="w-100 d-flex justify-content-between mb-2"
            style={{ cursor: "pointer" }}
            onClick={toggleChildDiv}
          >
            <span style={{ fontSize: "18px", fontWeight: "700" }}>Categories</span>
            <FontAwesomeIcon icon={faChevronDown} className="d-none" />
            <FontAwesomeIcon icon={faChevronUp} />
          </div>
          <div className="ps-4">
            {
              filters?.map((category) => (
                <Form.Group className="mb-2">
                  <Form.Check
                    type="checkbox"
                    label={category.name}
                    value={category.name}
                    checked={categories.includes(category.name)}
                    onChange={(e) => handleCategory(e, category.name)}
                  />
                </Form.Group>
              ))
            }
          </div>
        </div>
        <div className="w-100 pb-2 mb-3 border-bottom">
          <div
            className="w-100 d-flex justify-content-between mb-2"
            style={{ cursor: "pointer" }}
            onClick={toggleChildDiv}
          >
            <span style={{ fontSize: "18px", fontWeight: "700" }}>Subcategories</span>
            <FontAwesomeIcon icon={faChevronDown} className="d-none" />
            <FontAwesomeIcon icon={faChevronUp} />
          </div>
          <div className="ps-4">
            {
              filters?.map((category) => category.subcategories?.map((subcategory) => (
                <Form.Group className="mb-2">
                  <Form.Check
                    type="checkbox"
                    label={subcategory.name}
                    value={subcategory.name}
                    checked={subcategories.includes(subcategory.name)}
                    onChange={(e) => handleSubcategory(e, subcategory.name)}
                  />
                </Form.Group>
              )))
            }
          </div>
        </div>
        {
          filters?.map((category) => category.subcategories?.map((subcategory) => subcategory.site_faq_sub_category?.map((siteFaq) => (
            <div className="w-100 pb-2 mb-3 border-bottom">
              <div
                className="w-100 d-flex justify-content-between mb-2"
                style={{ cursor: "pointer" }}
                onClick={toggleChildDiv}
              >
                <div>
                  <span style={{ fontSize: "18px", fontWeight: "700" }}>{siteFaq.section}</span>
                  {/* <span> (Questions)</span> */}
                </div>
                <FontAwesomeIcon icon={faChevronDown} className="d-none" />
                <FontAwesomeIcon icon={faChevronUp} />
              </div>
              <div>
                <ol className="ps-4">
                  {
                    siteFaq.site_faq_questions.map((faq) => (
                      <li>
                        <div className="mb-2" style={{ fontSize: "14px", fontWeight: "500" }}>{faq.question}</div>
                        <div className="ps-1 mb-2">
                          {
                            faq.suggestion && (
                              faq.suggestion.length === 0 ? (
                                ["Yes", "No"].map((answer) => (
                                  <Form.Group className="mb-1">
                                    <Form.Check
                                      type="checkbox"
                                      label={answer}
                                      value={answer}
                                      name={faq.question}
                                      checked={questions.filter((q) => areEqualObjects(q, { [faq.id]: answer })).length !== 0}
                                      onChange={(e) => handleQuestion(e, { [faq.id]: answer })}
                                    />
                                  </Form.Group>
                                ))
                              ) : (
                                faq.suggestion.map((answer) => (
                                  <Form.Group className="mb-1">
                                    <Form.Check
                                      type="checkbox"
                                      label={answer}
                                      value={answer}
                                      name={faq.question}
                                      checked={questions.filter((q) => areEqualObjects(q, { [faq.id]: answer })).length !== 0}
                                      onChange={(e) => handleQuestion(e, { [faq.id]: answer })}
                                    />
                                  </Form.Group>
                                ))
                              )
                            )
                          }
                        </div>
                      </li>
                    ))
                  }
                </ol>
              </div>
            </div>
          ))))
        }
      </div>
    </Col>
  );
};

export default Filters;
