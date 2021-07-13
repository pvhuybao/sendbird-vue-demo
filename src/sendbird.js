import Sendbird from 'sendbird';

const APP_ID = '43CB63FC-01F0-4108-8023-23F2BFA63769';

const sendbird = new Sendbird({
    appId: APP_ID
})

const channelHandler = new sendbird.ChannelHandler();
sendbird.addChannelHandler('channel_event', channelHandler);

const connect = function(USER_ID) {
    return new Promise((resolve, reject) => {
        sendbird.connect(USER_ID, function(user, error) {
            if (error) {
                console.log('Connect Error!', error);
                reject(false);
            }

            sendbird.updateCurrentUserInfo(USER_ID, '', function (response, error) {
                if (error) {
                    console.log('Update UserInfo Error!', error);
                    reject(false);
                }
                console.log('Update UserInfo response', response);
            });

            console.log('connect user', user);
            resolve(user);
        });
    })
}

const createChannel = function(channelName) {
    return new Promise((resolve, reject) => {
        sendbird.OpenChannel.createChannel(channelName, '', '', function (channel, error) {
            if (error) {
                console.log('Create Channel Error!', error);
                reject(false);
            }
            resolve(channel);
        });
    })
}

const createGroupChannel = function(userId) {
    return new Promise((resolve, reject) => {
        let params = new sendbird.GroupChannelParams();
        params.isDistinct = true;
        params.addUserIds(userId);
        params.name = "Group Channel Demo";

        sendbird.GroupChannel.createChannel(params, function(groupChannel, error) {
            if (error) {
                reject(error);
            }
            resolve(groupChannel);
        });
    })
}

const enterChannel = function(channelUrl) {
    return new Promise((resolve, reject) => {
        sendbird.OpenChannel.getChannel(channelUrl, function(openChannel, error) {
            if (error) {
                console.log('Get Channel Error!', error);
                reject(false);
            }
        
            // Call the instance method of the result object in the "openChannel" parameter of the callback function.
            openChannel.enter(function(response, error) {
                if (error) {
                    console.log('Enter Channel Error!', error);
                    reject(false);
                }
                console.log('enter channel response', response);
                resolve(openChannel);
            });
        });
    })
}

const sendMessage = function(channel, message) {
    const params = new sendbird.UserMessageParams();
    params.message = message;

    return new Promise((resolve, reject) => {
        // sendbird.OpenChannel.getChannel(channelUrl, function(openChannel, error) {
        //     if (error) {
        //         console.log('Get Channel Error!', error);
        //         reject(false);
        //     }
        
            // Call the instance method of the result object in the "openChannel" parameter of the callback function.
            channel.sendUserMessage(params, function(message, error) {
                if (error) {
                    console.log('Send Message Error!', error);
                    reject(error);
                }
                resolve(message);
            });
        // });
    })
}

const sendFile = function(channel, file) {
    return new Promise((resolve, reject) => {
        const params = new sendbird.FileMessageParams();
        params.file = file;
        params.pushNotificationDeliveryOption = 'default';  // Either 'default' or 'suppress'

        channel.sendFileMessage(params, function(fileMessage, error) {
            if (error) {
                reject(error);
            }
            resolve(fileMessage);
        });
    })
}


let listQuery = null;
const getPreviousMessage = function(channel) {
    return new Promise((resolve, reject) => {
        // sendbird.OpenChannel.getChannel(channelUrl, function(openChannel, error) {
        //     if (error) {
        //         console.log('Get Channel Error!', error);
        //         reject(false);
        //     }
            // if(!listQuery) {
                listQuery = channel.createPreviousMessageListQuery();
                listQuery.includeReplies = true;
                listQuery.includeThreadInfo = true;
                listQuery.includeParentMessageText = true;
            // }
            // Retrieving previous messages.
            listQuery.load(10, false, (messages, error) => {
                if (error) {
                    console.log('Get Previous Message Error!', error);
                    reject(error);
                }

                resolve(messages);
            });
        // });
    })
}

const replyMessage = function(channelUrl, parentMessageId, message) {
    return new Promise((resolve, reject) => {
        sendbird.OpenChannel.getChannel(channelUrl, function(openChannel, error) {
            if (error) {
                console.log('Get Channel Error!', error);
                reject(false);
            }
        
            const params = new sendbird.UserMessageParams();
            params.parentMessageId = parentMessageId;
            params.message = message;

            openChannel.sendUserMessage(params, (message, error) => {
                if (error) {
                    reject(error);
                }
                resolve(message);
            });
        });
    })
}

export {
    channelHandler, 
    connect, 
    createChannel, 
    enterChannel, 
    sendMessage, 
    getPreviousMessage, 
    replyMessage, 
    createGroupChannel, 
    sendFile
}