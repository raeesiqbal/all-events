/* eslint-disable camelcase */
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container, FormControl, InputGroup } from "react-bootstrap";
import { chatsSuggestionList, listChats } from "../redux/Chats/ChatsSlice";
import { listChatMessages } from "../redux/Messages/MessagesSlice";
import Header from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import TabNavigation from "../../components/TabNavigation/TabNavigation";
import MesssageTabNavigation from "../../components/TabNavigation/MessageTabNavigation";
import Chat from "./Chat";
import "../Ads/Ads.css";
import "./Chats.css";

function Chats() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const chats = useSelector((state) => state.chats.chats);
  const inboxCount = useSelector((state) => state.chats.inboxCount);
  const archivedCount = useSelector((state) => state.chats.archivedCount);
  const suggestionsList = useSelector((state) => state.chats.suggestionsList);

  const limit = 3;
  const [activeTab, setActiveTab] = React.useState("Inbox");
  const [offset, setOffset] = React.useState(0);
  const [adName, setAdName] = React.useState("");
  const [senderName, setSenderName] = React.useState("");
  const [showSuggestions, setShowSuggestions] = React.useState("");

  const location = useLocation();
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

  const handleAdNameSuggestions = (e) => {
    e.preventDefault();

    setAdName({ name: e.target.value });

    dispatch(chatsSuggestionList({ keyword: e.target.value, keywordType: "ad_name" }));
    setShowSuggestions(e.target.value !== "");
  };

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setOffset(limit + offset);
      dispatch(listChats({
        archive: activeTab === "Archived" ? "True" : "False", limit, offset,
      }));
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(listChats({
      archive: activeTab === "Archived" ? "True" : "False", limit, offset,
    }));
  }, [activeTab]);

  useEffect(() => {
    if (chatId) {
      dispatch(listChatMessages({ id: chatId, limit: 20, offset: 0 }));
      dispatch(listChats({ archive: activeTab === "Archived" ? "True" : "False", limit, offset }));
    }
  }, [chatId]);

  return (
    <>
      <Header />
      <TabNavigation role={user.role} />

      <div className="my-ad-banner p-md-5 mb-5">
        <div className="roboto-bold-36px-h1 mb-2">Chats</div>
        <div className="roboto-regular-18px-body3">
          Keep track of potential client queries and reply timely
        </div>
      </div>

      <Container
        style={{ paddingBottom: "200px" }}
        className="pt-md-3"
        onScroll={handleScroll}
      >
        {/* <div className="w-100 pb-4 d-md-flex justify-content-between">
          <div>
            <div className="position-relative">
              <FormControl
                className="shadow-none roboto-regular-16px-information form-control"
                placeholder="Select Ad"
                style={{
                  outline: 0,
                  border: "none",
                  paddingLeft: "60px",
                  borderRadius: "0",
                  borderRight: "1px solid #D9D9D9",
                }}
                value={adName}
                onChange={handleAdNameSuggestions}
              />
              {
                showSuggestions && (
                  <div className="suggestion-dropdown" ref={suggestionDropdown}>
                    {
                      suggestionsList.map((suggestion) => (
                        <div className="w-100 px-3 py-2" onClick={(e) => handleSuggestionClick(suggestion)}>
                          <span className="my-auto px-2">{suggestion.name}</span>
                          <div className="px-3 py-1 bg-secondary text-white my-auto">{suggestion.type}</div>
                        </div>
                      ))
                    }
                  </div>
                )
              }
            </div>
          </div>
          <Button
            variant="success"
            size="lg"
            className="roboto-semi-bold-16px-information"
            style={{ height: "56px" }}
            disabled={isDisabled}
            onClick={() => handleSearchButton()}
          >
            Search
          </Button>
        </div> */}
        <MesssageTabNavigation activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
        {chats && chats.map((chat) => <Chat chat={chat} key={chat.id} isOpenChat={chat.id.toString() === chatId} />)}
      </Container>

      <Footer />
    </>
  );
}

export default Chats;
