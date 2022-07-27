require("dotenv").config()
const accountSid = process.env.ACCOUNT_SID
const authToken = process.env.AUTH_TOKEN
const workflowSid = process.env.WORKFLOW_SID
const workspaceSid = process.env.WORKSPACE_SID
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER
const mobilePhoneNumber = process.env.MOBILE_PHONE_NUMBER
const author = process.env.AUTHOR
const client = require("twilio")(accountSid, authToken)
let conversationSid

exports.handler = function (context, event, callback) {
  async function createConvversation() {
    await client.conversations.v1.conversations
      .create({ friendlyName: "Follow up conversation" })
      .then((conversation) => {
        console.log("CONVERSATION CREATED:", conversation.sid)
        conversationSid = conversation.sid
      })
      .catch(function (error) {
        console.log("CATCH:", error)
      })
  }

  async function createParticipant() {
    await client.conversations.v1
      .conversations(conversationSid)
      .participants.create({
        "messagingBinding.address": mobilePhoneNumber,
        "messagingBinding.proxyAddress": twilioPhoneNumber,
      })
      .then((participant) =>
        console.log("PARTICIPANT CREATED:", participant.sid)
      )
      .catch(function (error) {
        console.log("CATCH:", error)
      })
  }

  async function createMessage() {
    await client.conversations.v1
      .conversations(conversationSid)
      .messages.create({ author: author, body: "Ahoy there!" })
      .then((message) => console.log("MESSAGE CREATED:", message.sid))
      .catch(function (error) {
        console.log("CATCH:", error)
      })
  }

  // Run all the functions
  createConvversation().then(() => {
    createParticipant().then(() => {
      createMessage().then(() => {
        callback(null)
      })
    })
  })
}
