import React, { useEffect, useState } from "react";
import * as formik from "formik";
import * as Yup from "yup";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Alert } from "@mui/material";
import Header from "../../components/Navbar/Navbar";
import TopBanner from "../../components/TopBanner";
import postAdBanner1 from "../../assets/images/post-ad-banner-1.svg";
import postAdBanner2 from "../../assets/images/post-ad-banner-2.svg";
import postAdBanner3 from "../../assets/images/post-ad-banner-3.svg";
import "../PostAd/PostAd.css";
import ImageUploader from "../../components/ImageUploader/ImageUploader";
import VideoUploader from "../../components/VideoUploader/VideoUploader";
import ContactInformationForm from "../PostAd/ContactInformationForm";
import SocialMediaForm from "../PostAd/SocialMediaForm";
import ServicesOffered from "../PostAd/ServicesOffered";
import CompanyInformation from "../PostAd/CompanyInformation";
import FAQs from "../PostAd/FAQs";
import PdfUploader from "../../components/PdfUploader/PdfUploader";
import TabNavigation from "../../components/TabNavigation/TabNavigation";
import {
  handleEditAd,
  handleUpdateAdPostErrorAlerting,
  handleUpdateAdPostSuccessAlerting,
  setImagesError,
  setImagesToUpload,
  setMediaError,
} from "../redux/Posts/AdsSlice";
import { secureInstance } from "../../axios/config";
import UnsavedChangesPrompt from "../../utilities/hooks/UnsavedChanged";
import ServerFAQs from "../PostAd/ServerFAQs";
import { ScrollToError } from "../../utilities/ScrollToError";

function EditAd() {
  const { Formik } = formik;

  const [selectedCountries, setSelectedCountries] = useState([]);
  const [
    selectedCountriesforContactInformation,
    setSelectedCountriesforContactInformation,
  ] = useState([]);
  const [currentAd, setCurrentAd] = useState(null);
  const [pdfsToUpload, setPdfsToUpload] = useState([]);
  const [pdfsError, setPdfsError] = useState(false);
  const [videoToUpload, setVideoToUpload] = useState([]);
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [relatedSubCategoryId, setRelatedSubCategoryId] = useState(null);
  const [isMultipleCountries, setIsMultipleCountries] = useState(false);
  const [localInitialValues, setLocalInitialValues] = useState(null);
  const [preDefinedFAQs, setPreDefinedFAQs] = useState([]);
  const [selectedValuesServerFAQ, setSelectedValuesServerFAQ] = useState([]);

  const [adminServicesSelected, setAdminServicesSelected] = useState([]);
  const [adminServices, setAdminServices] = useState([]);

  const loading = useSelector((state) => state.Ads.loading);
  const user = useSelector((state) => state.auth.user);
  const AdPostSuccessAlert = useSelector(
    (state) => state.Ads.AdPostSuccessAlert
  );

  const AdPostErrorAlert = useSelector((state) => state.Ads.AdPostErrorAlert);
  const imagesToUpload = useSelector((state) => state.Ads.media_urls.images);
  const imagesError = useSelector((state) => state.Ads.imagesError);
  const isMediaUploading = useSelector((state) => state.Ads.isMediaUploading);
  const mediaError = useSelector((state) => state.Ads.mediaError);

  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const handleSubmitAllForms = (values) => {
    if (imagesError) {
      return;
    }

    const extractSubCatId = values.companyInformation.sub_category.id
      ? parseInt(values.companyInformation.sub_category.id, 10)
      : parseInt(values.companyInformation.sub_category, 10);

    const FAQsMap = values.FAQ.faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    }));
    const flattenedServerFAQs = selectedValuesServerFAQ.flatMap(
      (sectionValues) =>
        sectionValues.map((questionValues) => ({
          site_question: questionValues.id,
          answer: questionValues.value,
        }))
    );

    // const adminServicesMap = adminServicesSelected.map(
    //   (service) => service.label
    // );

    const objToSubmit = {
      media_urls: {
        images: imagesToUpload,
        video: videoToUpload,
        pdf: pdfsToUpload,
      },
      company: currentAd.company.id,
      description: values.companyInformation.description,
      name: values.companyInformation.commercial_name,
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
      site_services: adminServicesSelected,
      sub_category: extractSubCatId,
      related_sub_categories: relatedSubCategoryId,
      country: parseInt(values.contactInformation.country, 10),
      activation_countries: values.companyInformation.country,
      ad_faq_ad: flattenedServerFAQs,
      faqs: FAQsMap,
    };
    dispatch(handleEditAd({ data: objToSubmit, navigate, adID: currentAd.id }));
  };
  const Schema = Yup.object().shape({
    companyInformation: Yup.object().shape({
      commercial_name: Yup.string().required("Commercial Name is required"),
      // MIXED TYPES ARE APPLIED BECAUSE THE FORM GETS AN OBJECT FROM API, WHILE SUBMITTING IT EXPECTS AN INTEGER
      category: Yup.mixed().when({
        is: (value) => value !== undefined, // Apply the validation when the field is present
        then: () =>
          Yup.lazy((value) => {
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
        then: () =>
          Yup.lazy((value) => {
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
        .max(2000, "Must be at most 2000 characters")
        .matches(
          /^[a-zA-Z0-9.,;:'"/?!@&*()^+\-|\s]+$/,
          'Only letters, digits, ".,;:\'/?!@&*()^+-|" signs, and spaces are allowed'
        ),
      // .required("Required"),
      country: Yup.mixed().required("This field is required"),
    }),
    contactInformation: Yup.object().shape({
      websiteUrl: Yup.string()
        .max(30, "Must be at most 30 characters")
        .matches(
          /^[a-zA-Z0-9.\-+_]+$/,
          'Only letters, digits, ".", "-", "+", and "_" signs are allowed'
        ),
      county: Yup.array().min(1, "country is required"),
      city: Yup.string()
        .max(25, "Must be at most 25 characters")
        .matches(
          /^[a-zA-Z\s-]+$/,
          'Only letters, spaces, and "-" sign are allowed'
        )
        .required("Required"),
      street: Yup.string()
        .max(35, "Must be at most 25 characters")
        .matches(
          /^[a-zA-Z\s-]+$/,
          'Only letters, spaces, and "-" sign are allowed'
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
          /^[a-zA-Z0-9",\-./\s]+$/,
          'Only letters, ",-./" signs, spaces, and digits are allowed'
        ),
    }),
    SocialMedia: Yup.object().shape({
      facebookURL: Yup.string()
        .max(40, "Must be 40 characters or less")
        .matches(
          /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm,
          "Invalid characters"
        ),
      instagramURL: Yup.string()
        .max(40, "Must be 40 characters or less")
        .matches(
          /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm,
          "Invalid characters"
        ),
      youtubeURL: Yup.string()
        .max(40, "Must be 40 characters or less")
        .matches(
          /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm,
          "Invalid characters"
        ),
      tiktokURL: Yup.string()
        .max(40, "Must be 40 characters or less")
        .matches(
          /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm,
          "Invalid characters"
        ),
      twitterURL: Yup.string()
        .max(40, "Must be 40 characters or less")
        .matches(
          /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm,
          "Invalid characters"
        ),
      otherURL: Yup.string()
        .max(40, "Must be 40 characters or less")
        .matches(
          /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm,
          "Invalid characters"
        ),
    }),
  });

  const validate = (values) => {
    const errors = {};

    // const isAnyValueNotNull = imagesToUpload.some((value) => value !== null);

    if (imagesToUpload.length === 0 && !imagesError) {
      dispatch(setImagesError(true));
    }
    if (imagesError) {
      dispatch(setImagesError(false));
    }
    if (
      !values.companyInformation.country ||
      values.companyInformation.country.length === 0
    ) {
      errors.companyInformation = {
        ...errors.companyInformation,
        country: "Please select at least one country.",
      };
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

    // Add more validation rules as needed

    return errors;
  };

  const handlePdfsUpdates = (images) => {
    setPdfsToUpload(images);
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

      const responseSiteQuestions = await secureInstance.request({
        url: `api/ads/site/${id}/site-questions/`,
        method: "Get",
      });

      setPreDefinedFAQs(responseSiteQuestions.data.data);
      if (
        request.data.data[0] !== undefined &&
        Object.prototype.hasOwnProperty.call(request.data.data[0], "service")
      ) {
        setAdminServices(request.data.data[0].service);
      } else {
        // alert("emptyyyyyyyyy");
        setAdminServices([]);
      }
    } catch (err) {
      // Handle login error here if needed
      console.log(err);
    }
  };

  const getAdInfo = async () => {
    try {
      // setLoading(true);
      const request = await secureInstance.request({
        url: `/api/ads/${params.id}/`,
        method: "Get",
      });
      setSelectedCountries(
        request.data.data.activation_countries.map((country) => country.id)
      );
      const faqsWithAddedProperty = request.data.data?.ad_faqs.map((item) => ({
        ...item,
        added: true,
      }));
      setAdminServices(request.data.data?.site_services[0]?.service);

      const serverFaqsMap = request.data.data.ad_faq_ad.map((serverFAQ) => ({
        site_faq_questions: [
          {
            question: serverFAQ.site_question.question,
            suggestion: serverFAQ.site_question.suggestion,
            answer: serverFAQ.answer,
            id: serverFAQ.site_question.id,
          },
        ],
      }));

      const initialSelectedValues = request.data.data.ad_faq_ad.map((item) => [
        {
          value: item.answer,
          question: item.site_question.question,
          id: item.site_question.id,
        },
      ]);

      setSelectedValuesServerFAQ(initialSelectedValues);

      // setSelectedValuesServerFAQ

      setPreDefinedFAQs(serverFaqsMap);

      setAdminServices(request.data.data.site_services_list[0].service);
      setAdminServicesSelected(request.data.data.site_services);

      setLocalInitialValues({
        companyInformation: {
          commercial_name: request.data.data?.name,
          category: request.data.data?.sub_category.category,
          sub_category: request.data.data?.sub_category,
          related_sub_categories: request.data.data?.related_sub_categories,
          description: request.data.data?.description,
          // country: request.data.data?.activation_countries[0].id, // Initialize without any selected countries
          ...(request.data.data?.activation_countries.length > 0 && {
            country: request.data.data?.activation_countries.map(
              (country) => country.id
            ),
          }),
        },
        contactInformation: {
          contact_number: request.data.data?.number,
          websiteUrl: request.data.data?.website,
          country: request.data.data?.country.id,
          city: request.data.data?.city,
          street: request.data.data?.street,
          fullAddress: request.data.data?.full_address,
        },
        SocialMedia: {
          facebookURL: request.data.data?.facebook,
          instagramURL: request.data.data?.instagram,
          youtubeURL: request.data.data?.youtube,
          tiktokURL: request.data.data?.tiktok,
          twitterURL: request.data.data?.twitter,
          otherURL:
            request.data.data?.others === null ? "" : request.data.data?.others,
        },
        // request.data.data?.
        FAQ: {
          faqs: faqsWithAddedProperty,
        },
        servicesOffered: {
          services: request.data.data?.offered_services,
        },
      });

      setCurrentAd(request.data.data);
    } catch (error) {
      // handleFailedAlert();
      // setLoading(false);
    }
  };

  const hasUnsavedChanges = (values) =>
    selectedCountries.length !== "" ||
    imagesToUpload.length > 0 ||
    Object.keys(values).some(
      (field) => values[field] !== localInitialValues[field]
    );

  useEffect(() => {
    getAdInfo();
  }, []);

  useEffect(() => {
    if (currentAd?.ad_media[0].media_urls?.images?.length > 0) {
      dispatch(setImagesToUpload(currentAd?.ad_media[0]?.media_urls?.images));
    }
    if (currentAd?.ad_media[0].media_urls?.video?.length > 0) {
      setVideoToUpload(currentAd?.ad_media[0]?.media_urls?.video);
    }
    if (currentAd?.ad_media[0].media_urls?.pdf?.length > 0) {
      setPdfsToUpload(currentAd?.ad_media[0]?.media_urls?.pdf);
    }
    if (currentAd?.related_sub_categories?.id) {
      setRelatedSubCategoryId(currentAd?.related_sub_categories.id);
    }
  }, [currentAd]);

  useEffect(() => {
    if (AdPostSuccessAlert) {
      setTimeout(() => {
        dispatch(handleUpdateAdPostSuccessAlerting(false));
      }, 4000);
    }
  }, [AdPostSuccessAlert]);

  useEffect(() => {
    if (AdPostErrorAlert || mediaError) {
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
      <TabNavigation role={user.role} />

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
        <div style={{ marginLeft: "2rem" }}>
          <div className="roboto-bold-36px-h1">Edit Ad</div>
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
          {currentAd !== null && localInitialValues !== null && (
            <Formik
              initialValues={localInitialValues}
              validationSchema={Schema}
              validate={validate}
              onSubmit={handleSubmitAllForms}
              enableReinitialize
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
                    isEditView
                  />

                  <ImageUploader
                    setShowImagesModal={setShowImagesModal}
                    imagesError={imagesError}
                    imagesToUpload={imagesToUpload}
                    editAd
                  />

                  <VideoUploader
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
                    adminServices={adminServices}
                    adminServicesSelected={adminServicesSelected}
                    setAdminServicesSelected={setAdminServicesSelected}
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

                  {preDefinedFAQs.length > 0 && (
                    <ServerFAQs
                      // values={values}
                      // errors={errors.FAQ ?? errors}
                      // touched={touched.FAQ ?? touched}
                      // handleChange={handleChange}
                      // handleAddFieldsForFAQ={() =>
                      //   handleAddFAQsFields(values, setValues)
                      // }
                      // handleAddFAQ={(index) =>
                      //   handleAddFAQ(index, values, setValues)
                      // }
                      // handleRemoveFAQ={(index) =>
                      //   handleRemoveFAQ(index, values, setValues)
                      // }
                      // handleEditFAQ={(index) =>
                      //   handleEditFAQ(index, values, setValues)
                      // }
                      siteFaqQuestions={preDefinedFAQs}
                      selectedValues={selectedValuesServerFAQ}
                      setSelectedValues={setSelectedValuesServerFAQ}
                    />
                  )}

                  <div style={{ paddingBottom: "300px" }} />
                  <Col
                    className="d-flex justify-content-end"
                    style={{ marginRight: "150px" }}
                  >
                    <Button
                      type="submit"
                      disabled={loading || isMediaUploading}
                      onClick={() => handleClickSubmit(values)}
                      className="btn btn-success roboto-semi-bold-16px-information btn-height btn-lg"
                      style={{ padding: "0 100px" }}
                    >
                      {loading ? (
                        // "Loading…"
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </Col>

                  <div style={{ paddingBottom: "200px" }} />
                </Form>
              )}
            </Formik>
          )}
        </Row>
      </Container>
    </div>
  );
}

export default EditAd;
