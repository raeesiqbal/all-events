/* eslint-disable camelcase */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import { listChats } from "../redux/Chats/ChatsSlice";
import Header from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import TabNavigation from "../../components/TabNavigation/TabNavigation";
import MesssageTabNavigation from "../../components/TabNavigation/MessageTabNavigation";
import Message from "./Message";
import "../Ads/Ads.css";
import "./Messages.css";

function Messages() {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chats.chats);
  const [activeTab, setActiveTab] = React.useState("Inbox");
  const [activeTabMessages, setActiveTabMessages] = React.useState();

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(listChats());
  }, []);

  useEffect(() => {
    const isArchived = activeTab === "Archived";
    setActiveTabMessages(messages.filter((message) => message.is_archived_vendor === isArchived));
  }, [activeTab, messages]);

  return (
    <>
      <Header />
      <TabNavigation />

      <div className="my-ad-banner d-flex align-items-center justify-content-between">
        <div style={{ marginLeft: "100px" }}>
          <div className="roboto-bold-36px-h1">Messages</div>
          <div className="roboto-regular-18px-body3">
            Keep track of potential client queries and reply timely
          </div>
        </div>
      </div>

      <Container
        style={{ paddingTop: "160px", paddingBottom: "200px" }}
        className=""
      >
        <MesssageTabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTabMessages && activeTabMessages.map((message) => <Message message={message} />)}
      </Container>

      <Footer />
    </>
  );
}

export default Messages;
