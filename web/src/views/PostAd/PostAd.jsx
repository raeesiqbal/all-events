import React, { useEffect, useState } from "react";
import * as formik from "formik";
import * as Yup from "yup";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Navbar/Navbar";
import TopBanner from "../../components/TopBanner";
import postAdBanner1 from "../../assets/images/post-ad-banner-1.svg";
import postAdBanner2 from "../../assets/images/post-ad-banner-2.svg";
import postAdBanner3 from "../../assets/images/post-ad-banner-3.svg";
import "./PostAd.css";
import ImageUploader from "../../components/ImageUploader/ImageUploader";
import VideoUploader from "../../components/VideoUploader/VideoUploader";
import ContactInformationForm from "./ContactInformationForm";
import SocialMediaForm from "./SocialMediaForm";
import ServicesOffered from "./ServicesOffered";
import CompanyInformation from "./CompanyInformation";
import FAQs from "./FAQs";
import PdfUploader from "../../components/PdfUploader/PdfUploader";
import TabNavigation from "../../components/TabNavigation/TabNavigation";
import {
  handleCreateNewAd,
  handleUpdateAdPostErrorAlerting,
  handleUpdateAdPostSuccessAlerting,
  setImagesError,
  setMediaError,
} from "../redux/Posts/AdsSlice";
import UnsavedChangesPrompt from "../../utilities/hooks/UnsavedChanged";
import { ScrollToError } from "../../utilities/ScrollToError";

function PostAd() {
  const { Formik } = formik;

  const [selectedCountries, setSelectedCountries] = useState([]);
  const [
    selectedCountriesforContactInformation,
    setSelectedCountriesforContactInformation,
  ] = useState([]);
  const [imagesToPreview, setImagesToPreview] = useState(Array(5).fill(null));
  const [pdfsToUpload, setPdfsToUpload] = useState([]);
  const [pdfsError, setPdfsError] = useState(false);
  const [videoToPreview, setVideoToPreview] = useState([]);
  const [videoToUpload, setVideoToUpload] = useState([]);
  const [uploadingData, setUploadingData] = useState(false);
  const [relatedSubCategoryId, setRelatedSubCategoryId] = useState(null);
  const [isMultipleCountries, setIsMultipleCountries] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector((state) => state.Ads.loading);
  const AdPostSuccessAlert = useSelector(
    (state) => state.Ads.AdPostSuccessAlert
  );
  const AdPostErrorAlert = useSelector((state) => state.Ads.AdPostErrorAlert);
  const imagesToUpload = useSelector((state) => state.Ads.media_urls.images);
  const imagesError = useSelector((state) => state.Ads.imagesError);
  const isMediaUploading = useSelector((state) => state.Ads.isMediaUploading);
  const mediaError = useSelector((state) => state.Ads.mediaError);

  const handleSubmitAllForms = (values) => {
    if (imagesError) {
      const el = document.querySelector(".images-container");
      (el?.parentElement ?? el)?.scrollIntoView();
      return;
    }

    // const addSubCategoryToFaqs = values.FAQ.faqs.map((faq) => {
    //   faq,
    //     (faq.sub_category = parseInt(
    //       values.companyInformation.sub_category,
    //       10
    //     ));
    // });
    const addSubCategoryToFaqs = values.FAQ.faqs.map((faq) => ({
      sub_category: parseInt(values.companyInformation.sub_category, 10),
      question: faq.question,
      answer_input: faq.answer_input,
      answer_checkbox: faq.answer_checkbox,
      type: faq.type,
    }));

    const objToSubmit = {
      media_urls: {
        images: imagesToUpload,
        video: videoToUpload,
        pdf: pdfsToUpload,
      },
      name: values.companyInformation.commercial_name,
      description: values.companyInformation.description,
      website: values.contactInformation.websiteUrl,
      city: values.contactInformation.city,
      street: values.contactInformation.street,
      number: values.contactInformation.contact_number,
      full_address: values.contactInformation.fullAddress,
      facebook: values.SocialMedia.facebookURL,
      instagram: values.SocialMedia.instagramURL,
      youtube: values.SocialMedia.youtubeURL,
      tiktok: values.SocialMedia.tiktokURL,
      twitter: values.SocialMedia.twitterURL,
      // others: values.SocialMedia.othersURL,
      offered_services: values.servicesOffered.services,
      sub_category: parseInt(values.companyInformation.sub_category, 10),
      ...(relatedSubCategoryId !== null && {
        related_sub_categories: relatedSubCategoryId,
      }),
      country: parseInt(values.contactInformation.country, 10),
      ...(values.companyInformation.country.length > 0
        ? { activation_countries: values.companyInformation.country }
        : {
            activation_countries: [
              parseInt(values.contactInformation.country, 10),
            ],
          }),
      faqs: addSubCategoryToFaqs,
    };

    dispatch(handleCreateNewAd({ data: objToSubmit, navigate }));
  };

  const Schema = Yup.object().shape({
    companyInformation: Yup.object().shape({
      commercial_name: Yup.string()
        .min(2, "Too short, minimum 2 characters")
        .max(60, "Too long, maximum 60 characters")
        .required("Commercial Name is required"),
      category: Yup.string().required("Category is required"),
      sub_category: Yup.string().required("Sub-category is required"),
      description: Yup.string()
        .min(2, "Too short, minimum 5 characters")
        .max(2000, "Must be at most 6667 characters")
        .matches(
          /^[a-zA-Z0-9.,;:'"/?!@&*()^+\-|\s]+$/,
          'Only letters, digits, ".,;:\'/?!@&*()^+-|" signs, and spaces are allowed'
        )
        .required("Description is required"),
      // MIXED TYPES ARE APPLIED BECAUSE THE FORM GETS AN OBJECT FROM API, WHILE SUBMITTING IT EXPECTS AN INTEGER
      country: Yup.mixed().when({
        is: (value) => value !== undefined,
        then: () =>
          Yup.lazy((value) => {
            if (Array.isArray(value)) {
              // If it's an array, apply array validation and validate the array elements
              return Yup.array().of(
                Yup.lazy((element) => {
                  // Define validation for each array element based on its type
                  if (typeof element === "string") {
                    return Yup.string();
                  }
                  if (typeof element === "number") {
                    return Yup.number().integer();
                  }
                  if (typeof element === "object") {
                    return Yup.object({
                      // Add your object schema here for array elements that are objects...
                    });
                  }
                  // Return null or throw an error if none of the types match
                  throw new Error("Invalid array element");
                })
              );
            }
            if (typeof value === "object") {
              // If it's an object, define the object shape
              return Yup.object({
                // Add your object schema here...
              });
            }
            if (typeof value === "number") {
              // If it's a number, apply integer validation
              return Yup.number().integer();
            }
            if (typeof value === "string") {
              // If it's a string, apply string validation
              return Yup.string();
            }

            // Return null or throw an error if none of the types match
            throw new Error("Invalid field type");
          }),
      }),
    }),
    contactInformation: Yup.object().shape({
      websiteUrl: Yup.string()
        .max(30, "Must be at most 30 characters")
        .matches(
          // eslint-disable-next-line max-len
          /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm,
          "Invalid characters"
        ),
      county: Yup.array().min(1, "country is required"),
      city: Yup.string()
        .min(3, "Too short, minimum 3 characters")
        .max(25, "Must be at most 25 characters")
        .matches(
          /^[a-zA-Z\s-]+$/,
          'Only letters, spaces, and "-" sign are allowed'
        )
        .required("Required"),
      street: Yup.string()
        .min(3, "Too short, minimum 3 characters")
        .max(27, "Must be at most 27 characters")
        .matches(
          /^[A-Za-z0-9\-,.\/\s]+$/,
          'Only letters, digits, spaces, "-,./" signs are allowed'
        )
        .required("Required"),
      contact_number: Yup.string()
        .max(10, "Must be at most 10 characters")
        .matches(
          /^[a-zA-Z0-9\-/]+$/,
          'Only digits, letters, "-" and "/" signs are allowed'
        )
        .required("Required"),
      fullAddress: Yup.string()
        .max(70, "Must be at most 70 characters")
        .matches(
          /^[A-Za-z0-9\s,.\-\/]+$/,
          'Only letters, digits, spaces, ", .", "-", and "/" characters are allowed'
        )
        .required("Full Address is required"),
    }),
    SocialMedia: Yup.object().shape({
      facebookURL: Yup.string().matches(
        /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm,
        "Invalid characters"
      ),
      instagramURL: Yup.string().matches(
        /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm,
        "Invalid characters"
      ),
      youtubeURL: Yup.string().matches(
        /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm,
        "Invalid characters"
      ),
      tiktokURL: Yup.string().matches(
        /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm,
        "Invalid characters"
      ),
      twitterURL: Yup.string().matches(
        /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm,
        "Invalid characters"
      ),
      otherURL: Yup.string().matches(
        /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm,
        "Invalid characters"
      ),
    }),
  });

  const initialValues = {
    companyInformation: {
      commercial_name: "",
      category: "",
      sub_category: "",
      description: "",
      country: [], // Initialize without any selected countries
    },
    contactInformation: {
      contact_number: "",
      websiteUrl: "",
      country: [],
      city: "",
      street: "",
      fullAddress: "",
    },
    SocialMedia: {
      facebookURL: "",
      instagramURL: "",
      youtubeURL: "",
      tiktokURL: "",
      twitterURL: "",
      otherURL: "",
    },
    FAQ: {
      faqs: [],
    },
    servicesOffered: {
      services: [],
    },
  };

  const validate = (values) => {
    const errors = {};

    // const isAnyValueNotNull = imagesToUpload.some((value) => value !== null);

    if (imagesToUpload.length === 0 && !imagesError) {
      // setImagesError(true);
      dispatch(setImagesError(true));
      // console.log("ScrollCustom");
    }

    if (
      !values.contactInformation.country ||
      values.contactInformation.country.length === 0
    ) {
      errors.contactInformation = {
        ...errors.contactInformation,
        country: "Please select at least one country.",
      };
    }
    return errors;
  };

  const handleImageUpdates = (images) => {
    setImagesToPreview(images);
  };

  const handlePdfsUpdates = (images) => {
    setPdfsToUpload(images);
  };

  const handleClickSubmit = (values) => {
    if (values.companyInformation.country.length === 0) {
      const el = document.querySelector(".border-danger");
      (el?.parentElement ?? el)?.scrollIntoView();
    }
  };

  const handleAddFAQ = (index, values, setValues) => {
    const currentFAQ = values.FAQ.faqs[index];
    currentFAQ.added = true;
    const updatedFAQs = [...values.FAQ.faqs];
    updatedFAQs[index] = currentFAQ;

    setValues({
      ...values,
      FAQ: {
        faqs: updatedFAQs,
      },
    });
  };

  const handleRemoveFAQ = (index, values, setValues) => {
    const updatedFAQs = [...values.FAQ.faqs];
    updatedFAQs.splice(index, 1);

    setValues({
      ...values,
      FAQ: {
        faqs: updatedFAQs,
      },
    });
  };

  const handleEditFAQ = (index, values, setValues) => {
    const currentFAQ = values.FAQ.faqs[index];
    currentFAQ.added = false;
    const updatedFAQs = [...values.FAQ.faqs];
    updatedFAQs[index] = currentFAQ;

    setValues({
      ...values,
      FAQ: {
        faqs: updatedFAQs,
      },
    });
  };

  const handleAddServices = (currentService, values, setValues) => {
    setValues({
      ...values,
      servicesOffered: {
        services: [...values.servicesOffered.services, currentService],
      },
    });
  };

  const handleRemoveService = (indexToRemove, values, setValues) => {
    const clonedServices = [...values.servicesOffered.services];
    const deletedService = clonedServices.filter(
      (_, index) => index !== indexToRemove
    );
    setValues({
      ...values,
      servicesOffered: {
        services: deletedService,
      },
    });
  };

  const handleAddFAQsFields = (values, setValues) => {
    const updatedFAQs = values.FAQ.faqs.map((faq) => ({
      ...faq,
      added: true,
    }));

    setValues({
      ...values,
      FAQ: {
        faqs: [
          ...updatedFAQs,
          {
            question: "",
            answer_input: "",
            type: "text_field",
            added: false,
          },
        ],
      },
    });
    // setValues({
    //   ...values,
    //   FAQ: {
    //     faqs: [
    //       ...values.FAQ.faqs,
    //       {
    //         question: "",
    //         answer_input: "",
    //         type: "text_field",
    //         added: false,
    //       },
    //     ],
    //   },
    // });
  };

  const hasUnsavedChanges = (values) =>
    selectedCountries.length !== "" ||
    imagesToUpload.length > 0 ||
    Object.keys(values).some((field) => values[field] !== initialValues[field]);

  useEffect(() => {
    if (AdPostSuccessAlert) {
      setTimeout(() => {
        dispatch(handleUpdateAdPostSuccessAlerting(false));
      }, 4000);
    }
  }, [AdPostSuccessAlert]);

  useEffect(() => {
    if ((AdPostErrorAlert, mediaError)) {
      setTimeout(() => {
        dispatch(handleUpdateAdPostErrorAlerting(false));
        dispatch(setMediaError(null));
      }, 4000);
    }
  }, [AdPostErrorAlert, mediaError]);

  return (
    <div style={{ position: "relative" }}>
      <TopBanner />
      <Header />
      <TabNavigation />
      <Alert
        severity="success"
        variant="filled"
        style={{
          position: "fixed",
          top: AdPostSuccessAlert ? "80px" : "-80px",
          left: "50%",
          transform: "translateX(-50%)",
          transition: "ease 200ms",
          opacity: AdPostSuccessAlert ? 1 : 0,
          // width: "150px",
        }}
      >
        Submitted successfully
      </Alert>
      <Alert
        severity="error"
        variant="filled"
        style={{
          position: "fixed",
          top: AdPostErrorAlert || mediaError ? "80px" : "-80px",
          left: "50%",
          transform: "translateX(-50%)",
          transition: "ease 200ms",
          opacity: AdPostErrorAlert || mediaError ? 1 : 0,
          // width: "150px",
        }}
      >
        {AdPostErrorAlert?.website?.length > 0
          ? AdPostErrorAlert?.website
          : mediaError !== null
          ? mediaError
          : "Something went wrong"}
      </Alert>

      <div className="ad-banner d-flex align-items-center justify-content-between">
        <div style={{ marginLeft: "100px" }}>
          <div className="roboto-bold-36px-h1">Post an Ad</div>
          <div className="roboto-regular-18px-body3">
            Reach thousands of buyers on our platform
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            right: "-50px",
            top: "-32px",
            display: "flex",
          }}
        >
          <div style={{ marginTop: "30px" }} className="postAdBanner1">
            <img src={postAdBanner1} alt="postAdBanner1" />
          </div>
          <div style={{ margin: "0 -65px" }}>
            <img
              src={postAdBanner3}
              alt="postAdBanner3"
              className="postAdBanner3"
            />
          </div>
          <div style={{ marginTop: "30px" }}>
            <img
              src={postAdBanner2}
              alt="postAdBanner2"
              className="postAdBanner2"
            />
          </div>
        </div>
      </div>
      <Container fluid style={{ marginTop: "40px", paddingLeft: "150px" }}>
        <Row>
          <Formik
            initialValues={initialValues}
            validationSchema={Schema}
            validate={validate}
            onSubmit={handleSubmitAllForms}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              setValues,
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <ScrollToError />
                <UnsavedChangesPrompt
                  hasUnsavedChanges={() => hasUnsavedChanges(values)}
                />
                <CompanyInformation
                  values={values.companyInformation}
                  errors={errors.companyInformation ?? errors}
                  touched={touched.companyInformation ?? touched}
                  selectedCountries={selectedCountries}
                  setSelectedCountries={setSelectedCountries}
                  relatedSubCategoryId={relatedSubCategoryId}
                  setRelatedSubCategoryId={setRelatedSubCategoryId}
                  isMultipleCountries={isMultipleCountries}
                  setIsMultipleCountries={setIsMultipleCountries}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />

                <ImageUploader
                  setparentImagesUploadedImages={handleImageUpdates}
                  uploadedImages={imagesToPreview}
                  imagesError={imagesError}
                  setUploadingData={setUploadingData}
                  imagesToUpload={imagesToUpload}
                />

                <VideoUploader
                  videoToPreview={videoToPreview}
                  videoToUpload={videoToUpload}
                  setVideoToUpload={setVideoToUpload}
                />

                <ContactInformationForm
                  values={values.contactInformation}
                  errors={errors.contactInformation ?? errors}
                  touched={touched.contactInformation ?? touched}
                  selectedCountries={selectedCountriesforContactInformation}
                  setSelectedCountries={
                    setSelectedCountriesforContactInformation
                  }
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />

                <SocialMediaForm
                  values={values.SocialMedia}
                  errors={errors.SocialMedia ?? errors}
                  touched={touched.SocialMedia ?? touched}
                  handleChange={handleChange}
                />

                <ServicesOffered
                  values={values}
                  handleChange={handleChange}
                  handleAddServices={(currentService) =>
                    handleAddServices(currentService, values, setValues)
                  }
                  handleRemoveService={(index) =>
                    handleRemoveService(index, values, setValues)
                  }
                />

                <PdfUploader
                  setparentImagesUploadedImages={handlePdfsUpdates}
                  pdfsToUpload={pdfsToUpload}
                  imagesError={pdfsError}
                  setImagesError={setPdfsError}
                />

                <FAQs
                  values={values}
                  errors={errors.FAQ ?? errors}
                  touched={touched.FAQ ?? touched}
                  handleChange={handleChange}
                  handleAddFieldsForFAQ={() =>
                    handleAddFAQsFields(values, setValues)
                  }
                  handleAddFAQ={(index) =>
                    handleAddFAQ(index, values, setValues)
                  }
                  handleRemoveFAQ={(index) =>
                    handleRemoveFAQ(index, values, setValues)
                  }
                  handleEditFAQ={(index) =>
                    handleEditFAQ(index, values, setValues)
                  }
                />

                <div style={{ paddingBottom: "300px" }} />
                <Col
                  className="d-flex justify-content-end"
                  style={{ marginRight: "150px" }}
                >
                  <Button
                    type="submit"
                    disabled={loading || isMediaUploading}
                    onClick={() => handleClickSubmit(values)}
                    className="btn btn-success roboto-semi-bold-16px-information btn-lg"
                    style={{ padding: "0 100px" }}
                  >
                    {loading ? (
                      // "Loading…"
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Submit Ad"
                    )}
                  </Button>
                </Col>

                <div style={{ paddingBottom: "200px" }} />
              </Form>
            )}
          </Formik>
        </Row>
      </Container>
    </div>
  );
}

export default PostAd;
