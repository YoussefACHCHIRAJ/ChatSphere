import { useEffect, useRef, useState } from "react";
import { useClerk } from "@clerk/clerk-react";

import { MessageTypes, userType } from "@/types";
import {
  CurrentUserChat,
  SendBox,
  Message,
  BlockChat,
  ClearChat,
} from "@/components/models";

interface chatProps {
  chatId: string;
  messages: MessageTypes[];
  receiver: userType;
  setMessages: React.Dispatch<React.SetStateAction<MessageTypes[]>>;
  removeReceiver: React.Dispatch<React.SetStateAction<userType | null>>;
}

const chat = ({
  chatId,
  messages,
  setMessages,
  receiver,
  removeReceiver,
}: chatProps) => {
  const { user } = useClerk();
  const chatRef = useRef(null);
  const [openBlock, setOpenBlock] = useState(false);
  const [openClearChat, setOpenClearChat] = useState(false);

  useEffect(() => {
    if (chatRef.current) {
      const chatSpace = chatRef.current as any;
      chatSpace.scrollTop = chatSpace.scrollHeight - chatSpace.clientHeight;
    }
  }, [messages]);

  const separator = (
    <div className="flex items-center">
      <div className="flex-grow border-t-2 border-gray-300"></div>
      <div className="px-4 text-gray-500">New</div>
      <div className="flex-grow border-t-2 border-gray-300"></div>
    </div>
  );

  const AllMessages = (
    <div
      className="space-y-3 flex-1 relative py-4 px-4   overflow-y-auto scrollbar"
      ref={chatRef}
    >
      {messages.length > 0 ? (
        messages.map((message) => {
          const { sender, receiver: msgReceiver } = message;
          const [userId, receiverId] = [user?.id, receiver?.id].sort();
          
          if (
            (userId === msgReceiver && receiverId === sender) ||
            (sender === userId && msgReceiver === receiverId)
          ) {
            return (
              <>
                <Message key={`${message._id}`} message={message} />
              </>
            );
          }
        })
      ) : (
        <h1 className="text-center font-medium tracking-wider leading-9 text-3xl mt-10 text-lightGray px-4">
          There is no messages.
          <br /> Start chating now
        </h1>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-2 w-full flex-1 overflow-auto">
      <BlockChat
        receiver={receiver}
        openBlock={openBlock}
        setOpenBlock={setOpenBlock}
      />
      <ClearChat
        receiver={receiver}
        openClearChat={openClearChat}
        setOpenClearChat={setOpenClearChat}
      />
      <CurrentUserChat
        receiver={receiver}
        setOpenBlock={setOpenBlock}
        setOpenClearChat={setOpenClearChat}
        removeReceiver={removeReceiver}
      />
      {AllMessages}
      <SendBox
        setMessages={setMessages}
        chatId={chatId}
        receiver={receiver?.id}
      />
    </div>
  );
};

export default chat;
