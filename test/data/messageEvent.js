const testMessageEvent = {
    sender: {
        id: process.env.TEST_USER_ID
    },
    recipient: {
        id: 'yoself'
    },
    message: {
        text: 'hello, bitcoinbot!',
        attachments: []
    }
};

module.exports = {t_messageEvent: testMessageEvent};