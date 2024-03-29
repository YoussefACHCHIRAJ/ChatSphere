const { default: mongoose } = require("mongoose");
const Message = require("../../models/Message");
const Chat = require("../../models/Chat");

const destroyAll = async (req, res) => {
    try {

        const authUser = req.params.authUser;

        const receiver = req.query.receiver;

        const authUser_id = new mongoose.Types.ObjectId(authUser);

        const chatId = [authUser, receiver].sort().join("");

        const { _id: chat } = await Chat.findOne({ chatId }).select("_id");


        // await Message.updateMany({ sender: authUser_id, chat }, { isDeletedBySender: true });

        // await Message.updateMany({ receiver: authUser_id, chat }, { isDeletedByReceiver: true });

        const authUserIsSender = { sender: authUser_id };
        const authUserIsReceiver = { receiver: authUser_id };

        await Message.updateMany(
            {
                chat,
                $or: [
                    { sender: authUser_id },
                    { receiver: authUser_id },
                ],
            },
            [
                {
                    $set: {
                        isDeletedBySender: {
                            $cond: {
                                if: { $eq: ["$sender", authUser_id] },
                                then: true,
                                else: "$isDeletedBySender",
                            },
                        },
                        isDeletedByReceiver: {
                            $cond: {
                                if: { $eq: ["$receiver", authUser_id] },
                                then: true,
                                else: "$isDeletedByReceiver",
                            },
                        },
                    },
                },
            ]
        );

        await Message.deleteMany({ isDeletedBySender: { $ne: false }, isDeletedByReceiver: { $ne: false } });

        res.status(200).json({ data: "chat has been cleared" });

    } catch (error) {
        console.log('[clearChat]: ', error);
        res.json({ error });
    }
}

module.exports = { destroyAll };