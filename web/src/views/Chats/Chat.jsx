import React, { useEffect, useRef } from "react";
import {
  Button,
  Card,
  Col,
  Modal,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
// import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import deleteIcon from "../../assets/images/post-ad/delete.svg";
import timeIcon from "../../assets/images/post-ad/carbon_time.svg";
import archiveIcon from "../../assets/images/ph_archive-box-light.svg";
import gotoIcon from "../../assets/images/post-ad/goto.svg";
import phoneIcon from "../../assets/images/fluent_call.svg";
import defaultProfilePhoto from "../../assets/images/profile-settings/person.svg";
import { archiveChat, deleteChat, listChats } from "../redux/Chats/ChatsSlice";
import { listChatMessages, sendMessage } from "../redux/Messages/MessagesSlice";
import "./Chats.css";
import { secureInstance } from "../../axios/config";

const Chat = ({ chat, isOpenChat }) => {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const messageBody = useRef(null);

  const { messages, additionalInfo, count } = useSelector(
    (state) => state.messages
  );
  const currentUser = useSelector((state) => state.auth.user);

  const [modalShow, setModalShow] = React.useState(isOpenChat);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [isRead, setIsRead] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [messageText, setMessageText] = React.useState("");
  const [attachment, setAttachment] = React.useState(null);
  const [offset, setOffset] = React.useState(0);
  const limit = 20;

  let dates = [];

  const openMessages = () => {
    dates = [];
    setModalShow(true);
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight } = e.target;
    if (scrollTop === 0 && count > offset) {
      setOffset(offset + limit);
      dispatch(listChatMessages({ id: chat.id, limit, offset }));
      setTimeout(() => {
        if (messageBody.current)
          messageBody.current.scrollTop =
            messageBody.current.scrollHeight - scrollHeight;
      }, 500);
    }
  };

  const sendChatMessage = () => {
    if (messageText !== "" || attachment !== null) {
      dispatch(
        sendMessage({
          id: chat.id,
          data: { text: messageText, attachments: attachment },
        })
      );
    }
    setMessageText("");
    setAttachment(null);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") sendChatMessage();
  };

  const uploadFileToCloud = async (uploadedVideo) => {
    setLoading(true);
    const formData = new FormData(); // pass in the form
    formData.append("file", uploadedVideo);
    formData.append("content_type", uploadedVideo.type);

    try {
      const request = await secureInstance.request({
        url: "/api/ads/upload-url/",
        method: "Post",
        data: formData,
      });
      setAttachment([request.data.data.file_url]);
    } catch (e) {
      // --------- WILL ROUTE ON SOME PAGE ON FAILURE ---------
      console.log("error", e);
    }
    setLoading(false);
  };

  const handleAttachment = (event) => {
    event.preventDefault();
    const uploadedVideo = event.target.files[0];

    if (uploadedVideo && uploadedVideo.size <= 25000000) {
      uploadFileToCloud(uploadedVideo);
    } else {
      // Handle video size error
      console.log("File size should be less than or equal to 25MB");
    }
  };

  const removeImage = async () => {
    setLoading(true);
    try {
      const response = await secureInstance.request({
        url: "/api/ads/delete-url/",
        method: "Post",
        data: {
          url: attachment[0],
        },
      });

      if (response.status === 200) {
        setAttachment(null);
      }
    } catch (e) {
      // Image is not deleted
    }
    setLoading(false);
  };

  const date = (d) => new Date(d);
  // const getTime = (d) => date(d).toLocaleTimeString("en-US", { hour12: true });
  const getTime = (d) => {
    const date = new Date(d);
    return `${date.getHours() % 12 || 12}:${date.getMinutes()} ${
      date.getHours() >= 12 ? "PM" : "AM"
    }`;
  };

  // Function to get the ordinal suffix for a day
  const getOrdinalSuffix = (day) => {
    if (day >= 11 && day <= 13) {
      return "th";
    }
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  // Get the formatted date with ordinal day
  const formattedDate = (d) =>
    `${`${date(d).getDate() + getOrdinalSuffix(date(d).getDate())} ${date(
      d
    ).toLocaleString("en-US", { month: "long" })}, ${date(d).getFullYear()}`}`;

  useEffect(() => {
    if (modalShow) {
      dispatch(listChatMessages({ id: chat.id, limit, offset }));
      setTimeout(() => {
        if (messageBody.current)
          messageBody.current.scrollTop = messageBody.current.scrollHeight;
      }, 500);
      setIsRead(true);
    }
  }, [modalShow]);

  return (
    <>
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="md"
        className="chat-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered={false} // Remove the centered prop
      >
        <Modal.Body className="d-grid" style={{ alignContent: "end" }}>
          <div
            className="d-flex justify-content-between align-items-center pb-3 mb-3 border-1 border-bottom border-grey"
            style={{ height: "fit-content" }}
          >
            <div className="d-flex">
              <img
                src={chat?.ad_image || defaultProfilePhoto}
                className="mr-3 profile-img"
                alt="Profile Picture"
                style={{ width: "80px", height: "80px", borderRadius: "50%" }}
              />
              <h3 className="ms-2 ms-md-3 my-auto" style={{ color: "#797979" }}>
                {additionalInfo?.name}
              </h3>
            </div>
            <div className="me-md-5 text-center">
              <Link
                className="text-decoration-none"
                style={{ color: "#A0C49D", fontSize: "19px" }}
                to={`/view-ad/${additionalInfo?.ad}`}
              >
                Ad Details
              </Link>
            </div>
          </div>
          <div
            className="mb-3 message-body"
            ref={messageBody}
            onScroll={handleScroll}
          >
            <div
              className="mx-auto text-white px-2 py-1 mb-4"
              style={{
                width: "fit-content",
                borderRadius: "8px",
                background: "#A0C49D",
                fontSize: "14px",
              }}
            >
              {`Event Date: ${dayjs(chat.event_date)
                .format("MMM D[th], YYYY")
                .toString()}`}
            </div>
            {messages
              .slice()
              .reverse()
              .map((message) => {
                const dateContent = !dates.includes(
                  formattedDate(message.created_at)
                ) ? (
                  <div
                    className="mx-auto text-white px-2 py-1 mb-4"
                    style={{
                      width: "fit-content",
                      borderRadius: "8px",
                      background: "#A0C49D",
                      fontSize: "14px",
                    }}
                  >
                    {formattedDate(message.created_at)}
                  </div>
                ) : (
                  ""
                );

                dates.push(formattedDate(message.created_at));

                return (
                  <>
                    {dateContent}
                    {currentUser.userId === message.sender ? (
                      <div
                        className="d-flex justify-content-end mb-5"
                        key={message.id}
                      >
                        <div
                          className="p-3 pb-2 mt-3"
                          style={{
                            maxWidth: "350px",
                            minWidth: "200px",
                            background: "#A0C49D33",
                            borderRadius: "8px",
                            borderTopRightRadius: "0px",
                          }}
                        >
                          <p
                            className={message.text ? "" : "text-secondary"}
                            style={{
                              fontSize: `${message.text ? "14px" : "12px"}`,
                              overflowWrap: "break-word",
                              wordWrap: "break-word",
                            }}
                          >
                            {message.text || "Attachment sent"}
                          </p>
                          <div
                            className="d-flex w-100 justify-content-between"
                            style={{ fontSize: "10px" }}
                          >
                            {message.attachments !== null ? (
                              <a
                                href={message.attachments}
                                style={{
                                  color: "#A0C49D",
                                  textDecoration: "none",
                                }}
                                target="_blank"
                                rel="noreferrer"
                              >
                                View Attachment
                              </a>
                            ) : (
                              <div />
                            )}
                            <div>{getTime(message.created_at)}</div>
                          </div>
                        </div>
                        <img
                          alt={currentUser.first_name}
                          className="mx-2 mb-auto"
                          src={currentUser.userImage || defaultProfilePhoto}
                          style={{
                            borderRadius: "50%",
                            width: "31px",
                            height: "31px",
                          }}
                        />
                      </div>
                    ) : (
                      <div className="d-flex me-auto mb-5" key={message.id}>
                        <img
                          alt={currentUser.first_name}
                          className="me-2 mb-auto"
                          // I created the below logic but then came to know that on
                          //Vendor side we have no access to client's photo.
                          // Either I am missing something or we will have to add it in additional info from getting it from backend.
                          // src={
                          //   currentUser.role === "client"
                          //     ? chat?.ad_image
                          //     : additionalInfo.image || defaultProfilePhoto
                          // }
                          src={
                            currentUser.role === "client"
                              ? chat?.ad_image
                              : defaultProfilePhoto || defaultProfilePhoto
                          }
                          style={{
                            borderRadius: "50%",
                            width: "31px",
                            height: "31px",
                          }}
                        />
                        <div
                          className="p-3 pb-2 mt-3"
                          style={{
                            maxWidth: "350px",
                            minWidth: "200px",
                            background: "#F2F2F7",
                            borderRadius: "8px",
                            borderTopLeftRadius: "0px",
                          }}
                        >
                          <p
                            className={message.text ? "" : "text-secondary"}
                            style={{
                              fontSize: `${message.text ? "14px" : "12px"}`,
                              overflowWrap: "break-word",
                              wordWrap: "break-word",
                            }}
                          >
                            {message.text || "Attachment received"}
                          </p>
                          <div
                            className="d-flex w-100 justify-content-between"
                            style={{ fontSize: "10px" }}
                          >
                            {message.attachments !== null ? (
                              <a
                                href={message.attachments}
                                style={{
                                  color: "#A0C49D",
                                  textDecoration: "none",
                                }}
                                target="_blank"
                                rel="noreferrer"
                              >
                                View Attachment
                              </a>
                            ) : (
                              <div />
                            )}
                            <div>{getTime(message.created_at)}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                );
              })}
          </div>
          <div
            className="w-100 pt-3 border-top border-grey"
            style={{ height: "fit-content", display: "flex" }}
          >
            <div className="d-flex" style={{ width: "86%", height: "44px" }}>
              <input
                type="text"
                className="send-message-input"
                placeholder="Type a message"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyUp={handleKeyPress}
                style={{ color: "black" }}
              />
              <button
                type="button"
                className="send-message-button"
                disabled={loading}
                onClick={sendChatMessage}
              >
                Send
              </button>
            </div>
            <div
              className="d-flex justify-content-center"
              style={{ width: "14%" }}
            >
              <div className="upload-message-img">
                {!loading &&
                  (attachment === null ? (
                    <>
                      <span>+</span>
                      <input
                        type="file"
                        accept="image/*,video/*,.pdf"
                        onChange={handleAttachment}
                      />
                    </>
                  ) : (
                    <>
                      <div onClick={removeImage}>-</div>
                      <a
                        href={attachment}
                        style={{ textDecoration: "none" }}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FontAwesomeIcon
                          icon="fa-solid fa-paperclip"
                          beatFade
                        />
                      </a>
                    </>
                  ))}
                {loading && (
                  <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                    color="#A0C49D"
                    className="mx-auto my-auto"
                    size="lg"
                  />
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={deleteModal}
        onHide={() => {
          setDeleteModal(false);
        }}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton style={{ border: "none" }} />
        <Modal.Body>
          <h4>Do you really want to delete this chat?</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              setDeleteModal(false);
            }}
            variant="danger"
            className="btn-md roboto-regular-16px-information text-white"
            style={{
              height: "44px",
              fontWeight: "500",
              paddingLeft: "32px",
              paddingRight: "32px",
            }}
            // style={{ backgroundColor: "red" }}
          >
            No
          </Button>
          <Button
            variant="success"
            onClick={() => {
              setDeleteModal(false);
              dispatch(deleteChat(chat.id));
              setTimeout(() => {
                dispatch(listChats({ archive: "False", limit: 10, offset: 0 }));
              }, 2000);
            }}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      <Col lg={12} className="py-md-4 border-bottom border-2">
        <Card className="shadow-none bg-transparent">
          <Row>
            <Col lg={2} md={3} className="d-flex">
              <Card.Img
                src={chat.ad_image}
                alt="AdImage"
                className="img-fluid h-100 object-fit-cover mx-auto"
                style={{ maxHeight: "140px", maxWidth: "140px" }}
              />
            </Col>
            <Col
              lg={10}
              md={9}
              className="d-flex justify-content-center align-items-center py-0"
            >
              <Card.Body className="ps-0" style={{ height: "100%" }}>
                <div className="d-md-flex flex-column justify-content-between h-100">
                  <Card.Title>
                    <div className="d-md-flex justify-content-between">
                      <div className="roboto-semi-bold-32px-h2 col-md-6">
                        {chat.ad_name}
                      </div>
                      <div className="roboto-regular-14px-information d-flex align-items-center mt-2 pe-4">
                        <img
                          src={timeIcon}
                          alt="timeIcon"
                          className="me-2 my-auto"
                        />
                        {dayjs(chat.latest_message.created_at).format(
                          "MMM D[th], YYYY"
                        )}
                      </div>
                    </div>

                    <div className="roboto-light-16px-information">
                      {`Client: ${chat.person.name}`}
                    </div>

                    <div className="row mx-0">
                      {currentUser?.role === "vendor" && (
                        <div
                          className="roboto-regular-14px-information text-white mt-2 me-4"
                          style={{
                            borderRadius: "6px",
                            background: "#A0C49D",
                            padding: "2px 10px",
                            fontWeight: "500",
                            width: "fit-content",
                          }}
                        >
                          {`Event Date: ${dayjs(chat.event_date)
                            .format("MMM D[th], YYYY")
                            .toString()}`}
                        </div>
                      )}

                      {![undefined, null, ""].includes(chat.person.phone) && (
                        <div
                          className="roboto-regular-14px-information d-flex align-items-end mt-2 ps-0 me-3"
                          style={{ width: "fit-content" }}
                        >
                          <img
                            src={phoneIcon}
                            alt="phoneIcon"
                            className="me-2 my-auto"
                          />
                          {chat.person.phone}
                        </div>
                      )}
                    </div>
                  </Card.Title>
                  <div className="d-md-flex justify-content-between">
                    <div className="roboto-regular-14px-information col-md-6 align-items-center">
                      <Card.Text
                        className="roboto-regular-16px-information"
                        style={{
                          maxWidth: "500px",
                        }}
                      >
                        {chat.latest_message.text.slice(0, 100)}
                        {chat.latest_message.text.length >= 100 && "..."}
                      </Card.Text>
                      {!(chat.read || isRead) && (
                        <div
                          className="roboto-regular-14px-information text-white mt-2 me-3"
                          style={{
                            borderRadius: "6px",
                            background: "#a0c49d90",
                            padding: "2px 10px",
                            fontWeight: "500",
                            width: "fit-content",
                          }}
                        >
                          Unread
                        </div>
                      )}
                    </div>
                    <div className="d-flex align-items-end ">
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Archive</Tooltip>}
                      >
                        <div
                          className="me-3"
                          style={{ width: "30px", cursor: "pointer" }}
                          onClick={() => {
                            dispatch(
                              archiveChat({
                                id: chat.id,
                                is_archived: !chat.archived,
                              })
                            );
                            window.location.reload();
                          }}
                        >
                          <img
                            src={archiveIcon}
                            alt="archiveIcon"
                            className="img-fluid"
                          />
                        </div>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Delete</Tooltip>}
                      >
                        <div
                          className="me-3"
                          style={{ width: "30px", cursor: "pointer" }}
                          onClick={() => {
                            setDeleteModal(true);
                          }}
                        >
                          <img
                            src={deleteIcon}
                            alt="deleteIcon"
                            className="img-fluid"
                          />
                        </div>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Open</Tooltip>}
                      >
                        <div
                          className="me-3"
                          style={{ width: "30px", cursor: "pointer" }}
                          onClick={openMessages}
                        >
                          <img
                            src={gotoIcon}
                            alt="gotoIcon"
                            className="img-fluid"
                          />
                        </div>
                      </OverlayTrigger>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </Col>
    </>
  );
};

export default Chat;
