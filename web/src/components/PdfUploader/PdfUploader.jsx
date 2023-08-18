/* eslint-disable jsx-a11y/label-has-associated-control */
import { faHeart, faPlus } from "@fortawesome/fontawesome-free-solid";
import { faAdd, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import InfoIcon from "../../assets/images/gg_info.svg";
import "../ImageUploader/ImageUploader.css";
import { secure_instance } from "../../axios/axios-config";

function PdfUploader({
  setparentImagesUploadedImages,
  imagesError,
  setImagesError,
  pdfsToUpload,
}) {
  const [pdfs, setPdfs] = useState([]);

  const uploadFileToCloud = async (uploadedPdf) => {
    const formData = new FormData(); // pass in the form
    formData.append("file", uploadedPdf);
    formData.append("content_type", uploadedPdf.type);

    try {
      const request = await secure_instance.request({
        url: "/api/ads/upload-url/",
        method: "Post",
        data: formData,
      });
      setparentImagesUploadedImages([
        ...pdfsToUpload,
        request.data.data.file_url,
      ]);
    } catch (e) {
      // setImageUrlToUpload(response.data.data);
      // --------- WILL ROUTE ON SOME PAGE ON FAILURE ---------
      console.log("error", e);
    }
  };

  const handleImageUpload = (event, index) => {
    event.preventDefault();
    const uploadedPdf = event.target.files[0];
    const updatedPdfs = [...pdfs];

    const reader = new FileReader();

    reader.onload = () => {
      updatedPdfs[index] = {
        file: uploadedPdf,
        previewURL: reader.result,
      };
      setPdfs(updatedPdfs);
    };
    console.log("updatedPdfs inside image component", updatedPdfs);
    setImagesError(false);
    uploadFileToCloud(uploadedPdf);
    setparentImagesUploadedImages(updatedPdfs);
    reader.readAsDataURL(uploadedPdf);
  };

  const removeImage = (index) => {
    const updatedImages = [...pdfs];
    updatedImages[index] = null;
    setPdfs(updatedImages);
    setparentImagesUploadedImages(updatedImages);
  };

  const handlePDFView = (pdf) => {
    console.log("pdfpdf", pdf);
    return (
      <a href={pdf} target="_blank" rel="noreferrer">
        Download Pdf
      </a>
    );
  };

  useEffect(() => {
    if (pdfsToUpload.length > 0) {
      setPdfs(pdfsToUpload);
    }
  }, [pdfsToUpload]);

  return (
    <Container fluid style={{ marginTop: "30px" }}>
      <div
        className="roboto-medium-20px-body1"
        style={{ marginBottom: "25px" }}
      >
        Upload PDF
      </div>

      {imagesError && (
        <span className="text-danger">Atleast 1 photo is Required</span>
      )}
      <div
        style={{
          maxWidth: "900px",
          border: "2px dashed #E3E3E4",
          padding: "16px",
        }}
      >
        <ul style={{ paddingLeft: "20px" }}>
          <li
            className="roboto-regular-16px-information"
            style={{ color: "#A9A8AA", lineHeight: "22px" }}
          >
            Upload 5 of the best images that describe your service
          </li>
          <li
            className="roboto-regular-16px-information"
            style={{ color: "#A9A8AA", lineHeight: "22px" }}
          >
            Images can be upload in JPEG or PNG format
          </li>
          <li
            className="roboto-regular-16px-information"
            style={{ color: "#A9A8AA", lineHeight: "22px" }}
          >
            Size of images cannot exceed 5 Mb
          </li>
        </ul>

        <div className="d-flex align-items-center">
          <img src={InfoIcon} alt={InfoIcon} />
          <span
            className="mx-1 roboto-regular-14px-information"
            style={{ color: "#A9A8AA", margin: "15px 0" }}
          >
            Double click to set main image
          </span>
        </div>

        <Row className="h-100 col-12 g-0 flex-column-reverse flex-md-row">
          <div className="d-flex" style={{ flexWrap: "wrap" }}>
            {pdfs.map((pdf, index) => (
              <Col md={3} lg={3} key={index}>
                <div className="mb-5">
                  {pdf !== null && (
                    <div
                      style={{
                        position: "relative",
                        border: "2px dotted #386C34",
                        width: "145px",
                        height: "126px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <a
                          href={pdf}
                          target="_blank"
                          rel="noreferrer"
                          style={{ textDecoration: "none", color: "#76af71 " }}
                        >
                          <span>Preview PDF</span>
                        </a>
                      </div>
                      <button
                        type="button"
                        style={{ position: "absolute", top: "0", right: "0" }}
                        className="upload-img-close-btn"
                        onClick={() => removeImage(index)}
                      >
                        <FontAwesomeIcon
                          icon={faClose}
                          style={{
                            position: "absolute",
                            top: "2px",
                            right: "5px",
                            color: "#FFF",
                          }}
                        />
                      </button>
                    </div>
                  )}
                </div>
              </Col>
            ))}
            <div
              style={{
                border: "2px dashed #A0C49D",
                width: "141px",
                height: "122px",
              }}
            >
              <label
                htmlFor="pdf-input"
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: "141px",
                  height: "122px",
                  cursor: "pointer",
                }}
              >
                <FontAwesomeIcon
                  icon={faAdd}
                  style={{
                    color: "#A0C49D",
                    width: "40px",
                    height: "40px",
                    marginRight: "10px",
                    marginBottom: "8px",
                  }}
                />
              </label>
              <input
                id="pdf-input"
                type="file"
                accept="application/pdf"
                onChange={(event) => handleImageUpload(event)}
                style={{ display: "none" }}
              />
            </div>
          </div>
        </Row>
      </div>
    </Container>
  );
}

export default PdfUploader;
