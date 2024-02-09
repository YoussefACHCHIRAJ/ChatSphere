import { RootState } from "@/Redux/store";
import axios from "axios";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";

const useClearConversation = () => {
  const authUser = useSelector((state: RootState) => state.authUser.value);
  const receiver = useSelector((state: RootState) => state.receiver.value);
  const query = useMutation<boolean, Error,void>(
    async () => {
      try {
        const {data} = await axios.delete(`http://localhost:8080/messages/${authUser?._id}?receiver=${receiver?._id}`)
        return data.deleted;
      } catch (error) {
        throw new Error("Failed clear Conversation");
      }
    }
  );

  return query;

};

export default useClearConversation;
