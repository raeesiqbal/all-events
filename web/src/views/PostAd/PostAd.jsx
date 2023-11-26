import React, { useEffect, useState } from "react";
import * as formik from "formik";
import * as Yup from "yup";
import {
  Button, Col, Container, Form, Row, Spinner,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
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
import {
  handleCreateNewAd,
  handleUpdateAdPostErrorAlerting,
  handleUpdateAdPostSuccessAlerting,
  listVendorAds,
  resetSubmittedAdId,
  setImagesError,
  setMediaError,
  setMediaImages,
  uploadMediaFiles,
} from "../redux/Posts/AdsSlice";
import UnsavedChangesPrompt from "../../utilities/hooks/UnsavedChanged";
import { ScrollToError } from "../../utilities/ScrollToError";
import { secureInstance } from "../../axios/config";
import ServerFAQs from "./ServerFAQs";

function PostAd() {
  const { Formik } = formik;

  const [selectedCountries, setSelectedCountries] = useState([]);
  const [
    selectedCountriesforContactInformation,
    setSelectedCountriesforContactInformation,
  ] = useState([]);
  const [relatedSubCategoryId, setRelatedSubCategoryId] = useState(null);
  const [isMultipleCountries, setIsMultipleCountries] = useState(false);
  const [adminServicesSelected, setAdminServicesSelected] = useState([]);
  const [adminServices, setAdminServices] = useState([]);
  const [preDefinedFAQs, setPreDefinedFAQs] = useState([]);
  const [selectedValuesServerFAQ, setSelectedValuesServerFAQ] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const currentSubscription = useSelector(
    (state) => state.subscriptions.currentSubscriptionDetails,
  );
  const { media, submittedAdId } = useSelector((state) => state.Ads);
  const {
    AdPostErrorAlert,
    imagesError,
    isMediaUploading,
    mediaError,
    AdPostSuccessAlert,
    loading,
    vendorAds,
  } = useSelector((state) => state.Ads);

  const handleSubmitAllForms = (values) => {
    if (imagesError) {
      const el = document.querySelector(".images-container");
      (el?.parentElement ?? el)?.scrollIntoView();
      return;
    }

    const totalSiteFaqQuestionsLength = preDefinedFAQs.reduce(
      (accumulator, item) => accumulator + item.site_faq_questions.length,
      0,
    );

    const totalSelectedValuesLength = selectedValuesServerFAQ.reduce(
      (accumulator, innerArray) => accumulator + innerArray.length,
      0,
    );

    if (totalSelectedValuesLength !== totalSiteFaqQuestionsLength) {
      const el = document.querySelector(".server-faq-container");
      (el?.parentElement ?? el)?.scrollIntoView();
      return;
    }

    const flattenedServerFAQs = selectedValuesServerFAQ.flatMap(
      (sectionValues) => sectionValues.map((questionValues) => ({
        site_question: questionValues.id,
        answer: questionValues.value,
      })),
    );

    const FAQsMap = values.FAQ.faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    }));

    const objToSubmit = {
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
      others: values.SocialMedia.otherURL,
      offered_services: values.servicesOffered.services,
      site_services: adminServicesSelected,
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
      ad_faq_ad: flattenedServerFAQs,
      faqs: FAQsMap,
    };

    dispatch(handleCreateNewAd({ data: objToSubmit }));
  };

  const Schema = Yup.object().shape({
    companyInformation: Yup.object().shape({
      commercial_name: Yup.string()
        .required("Commercial Name is required")
        .matches(
          /^(?!\s*[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]*\s*$).{2,60}$/,
          "Commercial name should be 2 to 60 characters long and cannot be entirely signs",
        ),
      // MIXED TYPES ARE APPLIED BECAUSE THE FORM GETS AN OBJECT FROM API, WHILE SUBMITTING IT EXPECTS AN INTEGER
      category: Yup.mixed().when({
        is: (value) => value !== undefined, // Apply the validation when the field is present
        then: () => Yup.lazy((value) => {
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
      // MIXED TYPES ARE APPLIED BECAUSE THE FORM GETS AN OBJECT FROM API, WHILE SUBMITTING IT EXPECTS AN INTEGER
      sub_category: Yup.mixed().when({
        is: (value) => value !== undefined, // Apply the validation when the field is present
        then: () => Yup.lazy((value) => {
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
      description: Yup.string()
        .min(2, "Too short, minimum 5 characters")
        .max(6667, "Must be at most 6667 characters")
        .matches(
          /^(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/? ]{5,6666}$/,
          "Cannot be entirely signs",
        )
        .required("Description is required"),
      // .required("Required"),
      country: Yup.mixed().required("This field is required"),
    }),
    contactInformation: Yup.object().shape({
      websiteUrl: Yup.string()
        .matches(
          /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[A-Za-z0-9-]+\.[A-Za-z]{2,6}$/,
          "Must be a valid website url",
        ),
      county: Yup.array().min(1, "country is required"),
      city: Yup.string()
        .min(3, "Too short, minimum 3 characters")
        .max(25, "Must be at most 25 characters")
        .matches(
          /^(?=[a-zA-Z\s-]{3,25}$)(?!^[ -]*$)[a-zA-Z-]+$/,
          "Only - sign is allowed and cannot be entirely signs. Digits are not allowed",
        )
        .required("Required"),
      street: Yup.string()
        .required("Required")
        .min(3, "Too short, minimum 3 characters")
        .max(27, "Must be at most 27 characters")
        .matches(
          /^(?!^[ ,./-]*$)[a-zA-Z0-9 ,./-]{3,27}$/,
          "- . , / signs and letters, digits, spaces are allowed. Cann't be entirely sings.",
        ),
      contact_number: Yup.string()
        .required("Required")
        .min(2, "Must be at least 2 characters")
        .max(40, "Must be at most 40 characters")
        .matches(
          /^(?!.*--)[a-zA-Z][a-zA-Z -]*[a-zA-Z]$/,
          "Letters and - sign is allowed and cannot be entirely signs",
        ),
      fullAddress: Yup.string()
        .required("Required")
        .min(5, "Too short, minimum 5 characters")
        .max(80, "Must be at most 80 characters")
        .matches(
          /^(?!^[ ,./-]*$)[a-zA-Z0-9 ,./-]{5,80}$/,
          "- . , / signs and letters, digits, spaces are allowed. Can't be entirely signs.",
        ),
    }),
    SocialMedia: Yup.object().shape({
      facebookURL: Yup.string()
        .matches(
          /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[A-Za-z0-9-]+\.[A-Za-z]{2,6}$/,
          "Must be a valid website url",
        ),
      instagramURL: Yup.string()
        .matches(
          /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[A-Za-z0-9-]+\.[A-Za-z]{2,6}$/,
          "Must be a valid website url",
        ),
      youtubeURL: Yup.string()
        .matches(
          /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[A-Za-z0-9-]+\.[A-Za-z]{2,6}$/,
          "Must be a valid website url",
        ),
      tiktokURL: Yup.string()
        .matches(
          /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[A-Za-z0-9-]+\.[A-Za-z]{2,6}$/,
          "Must be a valid website url",
        ),
      twitterURL: Yup.string()
        .matches(
          /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[A-Za-z0-9-]+\.[A-Za-z]{2,6}$/,
          "Must be a valid website url",
        ),
      otherURL: Yup.string()
        .matches(
          /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[A-Za-z0-9-]+\.[A-Za-z]{2,6}$/,
          "Must be a valid website url",
        ),
    }),
    FAQ: Yup.object().shape({
      faqs: Yup.array().of(
        Yup.object().shape({
          question: Yup.string().max(150, "Must be at most 150 characters"),
          answer: Yup.string().max(500, "Must be at most 500 characters"), // You can add validation for answer here if needed
          type: Yup.string(), // You can add validation for type here if needed
          added: Yup.boolean(), // You can add validation for added here if needed
        }),
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
      faqs: preDefinedFAQs,
    },
    servicesOffered: {
      services: [],
    },
  };

  const validate = (values) => {
    const errors = {};

    if (media.images.length === 0 && !imagesError) {
      // setImagesError(true);
      dispatch(setImagesError(true));
    }

    if (
      !values.contactInformation.country
      || values.contactInformation.country.length === 0
    ) {
      errors.contactInformation = {
        ...errors.contactInformation,
        country: "Please select at least one country.",
      };
    }
    return errors;
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
      (_, index) => index !== indexToRemove,
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
            answer: "",
            type: "text_field",
            added: false,
          },
        ],
      },
    });
  };

  const handleIsSubCategoryChanged = async (id) => {
    try {
      const request = await secureInstance.request({
        url: `api/ads/service/${id}/get-services/`,
        method: "Get",
      });

      if (
        request.data.data[0] !== undefined
        && Object.prototype.hasOwnProperty.call(request.data.data[0], "service")
      ) {
        setAdminServices(request.data.data[0].service || []);
      } else {
        // alert("emptyyyyyyyyy");
        setAdminServices([]);
      }

      const responseSiteQuestions = await secureInstance.request({
        url: `api/ads/site/${id}/site-questions/`,
        method: "Get",
      });
      setPreDefinedFAQs(responseSiteQuestions.data.data);
      setSelectedValuesServerFAQ([]);
    } catch (err) {
      // Handle login error here if needed
      console.log(err);
    }
  };

  const handleCategoryClicked = () => {
    setPreDefinedFAQs([]);
    setAdminServices([]);
  };

  const hasUnsavedChanges = (values) => selectedCountries.length !== ""
    || media.images.length > 0
    || Object.keys(values).some((field) => values[field] !== initialValues[field]);

  useEffect(() => {
    if (AdPostSuccessAlert) {
      setTimeout(() => {
        dispatch(handleUpdateAdPostSuccessAlerting(false));
      }, 4000);
    }
  }, [AdPostSuccessAlert]);

  useEffect(() => {
    if (submittedAdId !== null) {
      const files = [...media.images, ...media.video, ...media.pdf];
      if (files.length > 0) dispatch(uploadMediaFiles({ id: submittedAdId, files, navigate }));
      dispatch(resetSubmittedAdId());
    }
  }, [submittedAdId]);

  useEffect(() => {
    if (AdPostErrorAlert || mediaError) {
      setTimeout(() => {
        dispatch(handleUpdateAdPostErrorAlerting(false));
        dispatch(setMediaError(null));
      }, 4000);
    }
  }, [AdPostErrorAlert, mediaError]);

  useEffect(() => {
    dispatch(setMediaImages([]));
    dispatch(listVendorAds());
  }, []);

  useEffect(() => {
    if (
      currentSubscription === null
      || (currentSubscription
        && (currentSubscription.status === "unpaid"
          || (vendorAds.length > 0
            && currentSubscription?.type?.allowed_ads <= vendorAds.length)))
      || !user.is_verified
    ) { navigate("/my-ads"); }
  }, [currentSubscription, vendorAds]);

  return (
    <div style={{ position: "relative", overflowX: "hidden" }}>
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
        {
          AdPostErrorAlert?.website?.length > 0 ? AdPostErrorAlert?.website : (
            mediaError !== null ? mediaError : "Something went wrong"
          )
        }
      </Alert>

      <div className="ad-banner d-flex align-items-center justify-content-between">
        <div style={{ marginLeft: "2rem" }}>
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
          className="banner-images"
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
      <Container
        fluid
        style={{ marginTop: "40px" }}
        className="post-ad-container"
      >
        <Row>
          <Formik
            initialValues={initialValues}
            validationSchema={Schema}
            validate={validate}
            onSubmit={handleSubmitAllForms}
            validateOnBlur={false}
            validateOnChange={false}
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
                  handleIsSubCategoryChanged={handleIsSubCategoryChanged}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  handleCategoryClicked={handleCategoryClicked}
                />

                <ImageUploader imagesError={imagesError} />

                <VideoUploader />

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
                  handleAddServices={(currentService) => handleAddServices(currentService, values, setValues)}
                  handleRemoveService={(index) => handleRemoveService(index, values, setValues)}
                  adminServices={adminServices}
                  adminServicesSelected={adminServicesSelected}
                  setAdminServicesSelected={setAdminServicesSelected}
                />

                {currentSubscription
                  && currentSubscription?.type?.pdf_upload && (
                    <PdfUploader />
                )}

                {currentSubscription && currentSubscription?.type?.faq && (
                  <FAQs
                    values={values}
                    errors={errors.FAQ ?? errors}
                    touched={touched.FAQ ?? touched}
                    handleChange={handleChange}
                    handleAddFieldsForFAQ={() => handleAddFAQsFields(values, setValues)}
                    handleAddFAQ={(index) => handleAddFAQ(index, values, setValues)}
                    handleRemoveFAQ={(index) => handleRemoveFAQ(index, values, setValues)}
                    handleEditFAQ={(index) => handleEditFAQ(index, values, setValues)}
                  />
                )}

                {preDefinedFAQs.length > 0 && (
                  <ServerFAQs
                    siteFaqQuestions={preDefinedFAQs}
                    selectedValues={selectedValuesServerFAQ}
                    setSelectedValues={setSelectedValuesServerFAQ}
                  />
                )}

                <div style={{ paddingBottom: "100px" }} />
                <Col
                  className="d-flex justify-content-end"
                  style={{ marginRight: "100px" }}
                >
                  <Button
                    type="submit"
                    disabled={loading || isMediaUploading}
                    onClick={() => handleClickSubmit(values)}
                    className="btn btn-success roboto-semi-bold-16px-information btn-lg"
                    style={{ padding: "0 100px", whiteSpace: "nowrap" }}
                  >
                    {loading ? (
                      // "Loading…"
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Submit Ad"
                    )}
                  </Button>
                </Col>

                <div style={{ paddingBottom: "100px" }} />
              </Form>
            )}
          </Formik>
        </Row>
      </Container>
    </div>
  );
}

export default PostAd;
