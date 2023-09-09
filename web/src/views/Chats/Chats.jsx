/* eslint-disable camelcase */
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import { listChats } from "../redux/Chats/ChatsSlice";
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
  const [activeTab, setActiveTab] = React.useState("Inbox");
  const [activeTabChats, setActiveTabChats] = React.useState();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const chatId = searchParams.get("chatId");

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(listChats());
  }, []);

  useEffect(() => {
    const isArchived = activeTab === "Archived";
    setActiveTabChats(chats.filter((message) => message.archived === isArchived));
  }, [activeTab, chats]);

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
        className="pt-md-5"
      >
        <MesssageTabNavigation activeTab={activeTab} setActiveTab={setActiveTab} counts={[inboxCount, archivedCount]} />
        {activeTabChats && activeTabChats.map((chat) => <Chat chat={chat} key={chat.id} isOpenChat={chat.id.toString() === chatId} />)}
      </Container>

      <Footer />
    </>
  );
}

export default Chats;
