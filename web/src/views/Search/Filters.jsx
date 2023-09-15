import React, { useEffect } from "react";
import { Col, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/fontawesome-free-solid";
import { listAdsByFilter } from "../redux/Search/SearchSlice";

const Filters = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.search.data.filters);
  const keyword = useSelector((state) => state.search.data.keyword);
  const [categories, setCategories] = React.useState([]);
  const [subcategories, setSubcategories] = React.useState([]);
  const [questions, setQuestions] = React.useState([]);
  const [commercialName, setCommercialName] = React.useState("");

  const toggleChildDiv = (e) => {
    e.currentTarget.parentNode.children[1].classList.toggle("d-none");
    e.currentTarget.children[1].classList.toggle("d-none");
    e.currentTarget.children[2].classList.toggle("d-none");
  };

  const handleCategory = (e, categoryName) => {
    // e.preventDefault();
    if (e.currentTarget.checked) {
      setCategories([...categories, categoryName]);
    } else {
      setCategories(categories.filter((category) => category !== categoryName));
    }
  };

  const handleSubcategory = (e, subcategoryName) => {
    if (e.currentTarget.checked) {
      setSubcategories([...subcategories, subcategoryName]);
    } else {
      setSubcategories(subcategories.filter((subcategory) => subcategory !== subcategoryName));
    }
  };

  function areEqualObjects(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }

    return true;
  }

  const handleQuestion = (e, question) => {
    if (e.currentTarget.checked) {
      setQuestions([...questions, question]);
    } else {
      setQuestions(questions.filter((q) => !areEqualObjects(q, question)));
    }
  };

  const clearFilters = (e) => {
    e.preventDefault();
    setCategories([]);
    setSubcategories([]);
    setQuestions([]);
  };

  useEffect(() => {
    if (categories !== [] || subcategories !== [] || questions !== []) {
      dispatch(listAdsByFilter({
        data: {
          data: {
            categories, subcategories, questions, commercial_name: commercialName,
          },
          filter: false,
        },
        limit: 10,
        offset: 0,
      }));
    }
  }, [categories, subcategories, questions]);

  useEffect(() => {
    if (keyword.type === "commercial_name") setCommercialName(keyword.name);
  }, [keyword]);

  return (
    <Col className="d-none d-md-block" md={3}>
      <div className="w-100 d-flex justify-content-between mb-5">
        <span style={{ fontSize: "24px", lineHeight: "28.2px", fontWeight: "700" }}>Filter</span>
        <span
          className="text-secondary my-auto"
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
            <FontAwesomeIcon icon={faChevronDown} />
            <FontAwesomeIcon icon={faChevronUp} className="d-none" />
          </div>
          <div className="ps-4 d-none">
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
            <FontAwesomeIcon icon={faChevronDown} />
            <FontAwesomeIcon icon={faChevronUp} className="d-none" />
          </div>
          <div className="ps-4 d-none">
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
        <div className="w-100 pb-2 mb-3 border-bottom">
          <div
            className="w-100 d-flex justify-content-between mb-2"
            style={{ cursor: "pointer" }}
            onClick={toggleChildDiv}
          >
            <span style={{ fontSize: "18px", fontWeight: "700" }}>Questions</span>
            <FontAwesomeIcon icon={faChevronDown} />
            <FontAwesomeIcon icon={faChevronUp} className="d-none" />
          </div>
          <div className="ps-4 d-none">
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
                    <FontAwesomeIcon icon={faChevronDown} />
                    <FontAwesomeIcon icon={faChevronUp} className="d-none" />
                  </div>
                  <div className="ps-4 d-none">
                    <ol>
                      {
                        siteFaq.site_faq_questions.map((faq) => (
                          <li>
                            <div className="mb-2" style={{ fontWeight: "700" }}>{faq.question}</div>
                            <div className="ps-4 mb-2">
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
        </div>
      </div>
    </Col>
  );
};

export default Filters;
