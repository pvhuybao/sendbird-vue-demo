<template>
    <div>
        this is chat page
        <div style="display: flex; margin: auto">
            <div class="side-bar">
                Open Channel
                <div @click="enterChannel('sendbird_open_channel_4391_62d88d427b64593eee593ec36dd849c21e756eaa')">
                    Join Channel 1
                    <span v-if="newMessage && channelUnreadUrl === 'sendbird_open_channel_4391_62d88d427b64593eee593ec36dd849c21e756eaa'" style="color: red"> New Message</span>
                </div>
                <div @click="enterChannel('sendbird_open_channel_4391_55f11ea183337909e05c02a7f944f82630b2b800')">
                    Join Channel 2
                    <span v-if="newMessage && channelUnreadUrl === 'sendbird_open_channel_4391_55f11ea183337909e05c02a7f944f82630b2b800'" style="color: red"> New Message</span>
                </div>
                <br/><br/><br/><br/>
                Group Channel
                <div @click="createGroupChannel(['123', 'qwe'])">
                    Chat with user 1
                    <span v-if="newMessage && channelUnreadUrl === 'sendbird_group_channel_321157497_c8a029c101e9b6296bf1f086ac86884abc26ee64'" style="color: red"> New Message</span>
                </div>
                <div @click="createGroupChannel(['123', 'qwe', 'asd'])">
                    Chat with user 2
                    <span v-if="newMessage && channelUnreadUrl === 'sendbird_group_channel_321157497_41bbb233d028472d27a86dd0f362d092c162d863'" style="color: red"> New Message</span>
                    <!-- <span v-if="newMessage" style="color: red"> New Message</span> -->
                </div>
                <!-- <button @click="loadMoreChatMessage">Load More Message</button> -->
                <!-- <button class="create-btn" @click="createChannel">Create Channel</button> -->
            </div>
            <div class="chatbox" ref="chatbox">
                <div v-if="previousMessage">
                    <div v-for="eachMessage in previousMessage" :key="eachMessage.messageId">
                        <span v-if="eachMessage.messageType !== 'file'">
                            <span style="font-weight: bold">{{ eachMessage._sender.nickname }}: </span>
                            <span>{{ eachMessage.message }}</span>
                        </span>
                        <span v-else>
                            <span style="font-weight: bold">{{ eachMessage._sender.nickname }}: </span>
                            <img :src="eachMessage.url" alt="" height="70px">
                        </span>
                        <!-- <button @click="replyMessage(eachMessage.messageId)">Reply</button>
                        <input type="text" v-model="replyText"> -->
                    </div>
                </div>
                <!-- <div>
                    <span style="font-weight: bold">Name: </span>
                    <span>asdas sad asda</span>
                </div> -->
            </div>
        </div>
        <br/>
        <div class="channel-field">
            <!-- <button @click="enterChannel('sendbird_open_channel_4391_62d88d427b64593eee593ec36dd849c21e756eaa')">Join Channel 1</button>
            <button @click="enterChannel('sendbird_open_channel_4391_55f11ea183337909e05c02a7f944f82630b2b800')">Join Channel 2</button>
            <button @click="createGroupChannel">Create Group Channel</button>
            <button @click="loadMoreChatMessage">Load More Message</button> -->
            <!-- <button class="create-btn" @click="createChannel">Create Channel</button> -->
            <input type="file" @change="uploadFile">
        </div>
        <br/>
        <div class="input-field">
            <span style="white-space: nowrap">User: {{ user.nickname }} </span>
            <input class="message" v-model="message" type="text" v-on:keyup.enter="sendMessage" /> 
            <input class="send-btn" type="button" @click="sendMessage" value="Send" />
        </div>
    </div>
</template>

<script>
import store from '@/store'
import { 
    createChannel,
    enterChannel,
    sendMessage,
    getPreviousMessage,
    channelHandler,
    replyMessage,
    createGroupChannel,
    sendFile
} from '@/sendbird.js'

export default {
    data() {
        return {
            message: '',
            replyText: '',
            newMessage: false,
            user: null,
            fileUpload: null,
            channelUrl: "sendbird_open_channel_4391_62d88d427b64593eee593ec36dd849c21e756eaa",
            // channelUrl: "sendbird_open_channel_4391_55f11ea183337909e05c02a7f944f82630b2b800",
            previousMessage: null,
            channel: {
                url: ''
            },
            channelUnreadUrl: null,
        }
    },

    mounted() {
        this.user = store.getters.getUser;
        console.log('get User', this.user);

        // this.enterChannel();

        let othis = this;
        channelHandler.onMessageReceived = function (channel, message) {
            console.log('onMessageReceived channel', channel);
            console.log('onMessageReceived message', message);
            if(channel.url === othis.channel.url) {
                othis.previousMessage.push(message);
                othis.scrollToBottom();
            } else {
                othis.newMessage = true;
                othis.channelUnreadUrl = channel.url;
            }
        }

        channelHandler.onChannelChanged = function (channel) {
            console.log('onChannelChanged', channel);
        }
    },

    methods: {
        async sendMessage() {
            // console.log('message', this.message);
            let messageSent = await sendMessage(this.channel, this.message);
            this.message = "";
            console.log('messageSent', messageSent);
            this.previousMessage.push(messageSent);
            this.scrollToBottom();
        },

        async createGroupChannel(userArr) {
            let groupChannel = await createGroupChannel(userArr);
            console.log('groupChannel', groupChannel);
            this.channel = groupChannel;
            this.loadPreviousMessage();
            this.markAsRead(groupChannel.url);
        },

        async createChannel() {
            let channel = await createChannel('New Channel Demo');
            console.log('channel created', channel);
        },

        async enterChannel(channelUrl) {
            // let enterResult = await enterChannel(this.channelUrl);
            let enterResult = await enterChannel(channelUrl);
            this.channel = enterResult;
            console.log('enterChannel result', enterResult);
            this.loadPreviousMessage();
            this.markAsRead(channelUrl);
        },

        async loadPreviousMessage() {
            let messages = await getPreviousMessage(this.channel);
            console.log('previous message', messages);
            this.previousMessage = messages;
        },

        scrollToBottom() {
            let element = this.$refs.chatbox;
            element.scrollTop = element.scrollHeight;
        },

        async replyMessage(parentMessageId) {
            let message = await replyMessage(this.channelUrl, parentMessageId, this.replyText);
            console.log('reply message', message);
        },

        async loadMoreChatMessage() {
            await this.loadPreviousMessage();
        },

        async uploadFile(e) {
            let file = e.target.files[0]
            console.log('fileUpload', file);
            let fileMessage = await sendFile(this.channel, file);
            this.previousMessage.push(fileMessage);
            console.log('fileMessage', fileMessage);
        },

        markAsRead(url) {
            console.log('channelUnreadUrl', this.channelUnreadUrl);
            console.log('channelUnreadUrl url', url);
            if(this.channelUnreadUrl === url) {
                this.newMessage = false;
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.chatbox {
    width: 60%;
    height: 300px;
    overflow-y: auto;
    border: 1px solid black;
    text-align: left;
    padding: 10px;
    font-size: 14px;
    margin-right: auto;
}

.side-bar {
    margin-left: auto;
    width: 20%;
    font-size: 14px;

    > div {
        border: 1px solid black;
        width: 90%;
        padding: 5px;
        cursor: pointer;
        margin-bottom: 10px;
    }
}

.input-field {
    display: flex;
    width: 50%;
    margin: auto;
    .message {
        width: 100%;
        margin-left: 10px;
    }
    .send-btn {
        margin-left: 10px;
    }
}
.create-btn {
    margin-left: 10px;
}
</style>
