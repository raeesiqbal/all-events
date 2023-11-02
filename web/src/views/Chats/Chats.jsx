/* eslint-disable camelcase */
import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Button, Container, FormControl, Row } from "react-bootstrap";
import { chatsSuggestionList, listChats } from "../redux/Chats/ChatsSlice";
import { listChatMessages } from "../redux/Messages/MessagesSlice";
import MesssageTabNavigation from "../../components/TabNavigation/MessageTabNavigation";
import Chat from "./Chat";
import "../Ads/Ads.css";
import "./Chats.css";
import ProfilePic from "../../components/ProfilePic/ProfilePic";

function Chats() {
  const dispatch = useDispatch();
  const { chats, inboxCount, archivedCount, suggestionsList, loading } =
    useSelector((state) => state.chats);

  const limit = 10;
  const [offset, setOffset] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState("Inbox");
  const [adName, setAdName] = React.useState("");
  const [senderName, setSenderName] = React.useState("");
  const [showAdSuggestions, setShowAdSuggestions] = React.useState(false);
  const [showSenderList, setShowSenderList] = React.useState(false);
  const [isDisabled, setIsDisabled] = React.useState(true);

  const location = useLocation();
  const suggestionDropdown = useRef();
  const searchParams = new URLSearchParams(location.search);
  const chatId = searchParams.get("chatId");

  const tabs = [
    {
      label: "Inbox",
      count: inboxCount,
    },
    {
      label: "Archived",
      count: archivedCount,
    },
  ];

  const handleSuggestions = (e, keywordType) => {
    e.preventDefault();

    dispatch(chatsSuggestionList({ keyword: e.target.value, keywordType }));

    if (keywordType === "ad_name") {
      setAdName(e.target.value);
      setShowAdSuggestions(e.target.value !== "");
    } else {
      setSenderName(e.target.value);
      setShowSenderList(e.target.value !== "");
    }
  };

  const handleSuggestionClick = (suggestion, type) => {
    type === "ad_name" ? setAdName(suggestion) : setSenderName(suggestion);
    setShowAdSuggestions(false);
    setShowSenderList(false);
    setIsDisabled(suggestion === "");
  };

  const handleSearchButton = () => {
    dispatch(
      listChats({
        archive: activeTab === "Archived" ? "True" : "False",
        limit,
        offset: 0,
        adName,
        senderName,
      })
    );
  };

  const handleScroll = (e) => {
    e.preventDefault();
    const { scrollTop, clientHeight, scrollHeight } = e.target;

    if (scrollTop >= scrollHeight - clientHeight && !loading) {
      const count = activeTab === "Archived" ? archivedCount : inboxCount;
      if (count > offset) {
        setOffset(limit + offset);
        dispatch(
          listChats({
            archive: activeTab === "Archived" ? "True" : "False",
            limit,
            offset,
            adName,
            senderName,
          })
        );
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(
      listChats({
        archive: activeTab === "Archived" ? "True" : "False",
        limit,
        offset,
        adName,
        senderName,
      })
    );
  }, [activeTab]);

  useEffect(() => {
    if (chatId) {
      dispatch(listChatMessages({ id: chatId, limit: 20, offset: 0 }));
      dispatch(
        listChats({
          archive: activeTab === "Archived" ? "True" : "False",
          limit,
          offset,
        })
      );
    }
  }, [chatId]);

  useEffect(() => {
    if (suggestionDropdown.current) {
      suggestionDropdown.current.style.overflowY =
        suggestionDropdown.current.clientHeight > 400 ? "scroll" : "auto";
    }
  }, [suggestionsList]);

  return (
    <>
      <div className="my-ad-banner p-md-5 mb-5">
        <div className="roboto-bold-36px-h1 mb-2">Chats</div>
        <div className="roboto-regular-18px-body3">
          Keep track of potential client queries and reply timely
        </div>
        <ProfilePic />
      </div>

      <Container style={{ paddingBottom: "100px" }} className="pt-md-3">
        <div className="w-100 d-md-flex justify-content-between">
          <div className="d-flex">
            <div className="position-relative me-3">
              <FormControl
                className="shadow-none roboto-regular-16px-information border border-success"
                placeholder="Select Ad"
                value={adName}
                onChange={(e) => handleSuggestions(e, "ad_name")}
              />
              {showAdSuggestions && (
                <div className="suggestion-dropdown" ref={suggestionDropdown}>
                  {suggestionsList.map((suggestion) => (
                    <div
                      className="w-100 px-3 py-2"
                      onClick={() =>
                        handleSuggestionClick(suggestion, "ad_name")
                      }
                    >
                      <span className="my-auto px-2">{suggestion}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="position-relative">
              <FormControl
                className="shadow-none roboto-regular-16px-information border border-success"
                placeholder="Select Sender Name"
                value={senderName}
                onChange={(e) => handleSuggestions(e, "sender_name")}
              />
              {showSenderList && (
                <div className="suggestion-dropdown" ref={suggestionDropdown}>
                  {suggestionsList.map((suggestion) => (
                    <div
                      className="w-100 px-3 py-2"
                      onClick={() =>
                        handleSuggestionClick(suggestion, "sender_name")
                      }
                    >
                      <span className="my-auto px-2">{suggestion}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <Button
            variant="success"
            size="lg"
            className="roboto-semi-bold-16px-information py-2 px-5 h-100"
            disabled={isDisabled}
            onClick={() => handleSearchButton()}
          >
            Search
          </Button>
        </div>
        <MesssageTabNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={tabs}
        />
        <Row className="chats-body" onScroll={handleScroll}>
          {chats &&
            !loading &&
            chats.map((chat) => (
              <Chat
                chat={chat}
                key={chat.id}
                isOpenChat={chat.id.toString() === chatId}
              />
            ))}
          {loading && (
            <div className="loading-icon">
              <FontAwesomeIcon icon={faSpinner} spin />
            </div>
          )}
        </Row>
      </Container>
    </>
  );
}

export default Chats;
