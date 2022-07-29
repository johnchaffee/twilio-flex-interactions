require("dotenv").config()
const accountSid = process.env.ACCOUNT_SID
const authToken = process.env.AUTH_TOKEN
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER
const author = process.env.AUTHOR
const webhookUrl = process.env.WEBHOOK_URL
const client = require("twilio")(accountSid, authToken)
let conversationSid

exports.handler = function (context, event, callback) {
  console.log("\x1b[32m context ==>\n", context, "\x1b[0m")
  console.log("\x1b[32m event ==>\n", event, "\x1b[0m")

  const mobileNumber = event.mobileNumber
  console.log(`\x1b[32m mobileNumber ==> ${mobileNumber} \x1b[0m`)

  const body = event.body
  console.log(`\x1b[32m body ==> ${body} \x1b[0m`)

  async function createConvversation() {
    await client.conversations.v1.conversations
      .create({ friendlyName: "Follow up conversation" })
      .then((conversation) => {
        conversationSid = conversation.sid
        console.log(`\x1b[32m conversationSid ==> ${conversationSid} \x1b[0m`)
      })
      .catch((error) => console.log(error))
  }

  async function createParticipant() {
    await client.conversations.v1
      .conversations(conversationSid)
      .participants.create({
        "messagingBinding.address": mobileNumber,
        "messagingBinding.proxyAddress": twilioPhoneNumber,
      })
      .then((participant) =>
        console.log(`\x1b[32m participant.sid ==> ${participant.sid} \x1b[0m`)
      )
      .catch((error) => console.log(error))
  }

  async function createMessage() {
    await client.conversations.v1
      .conversations(conversationSid)
      .messages.create({
        author,
        body,
      })
      .then((message) =>
        console.log(`\x1b[32m message.sid ==> ${message.sid} \x1b[0m`)
      )
      .catch((error) => console.log(error))
  }

  async function createWebhook() {
    await client.conversations.v1
      .conversations(conversationSid)
      .webhooks.create({
        "configuration.method": "POST",
        "configuration.filters": ["onMessageAdded"],
        "configuration.url": webhookUrl,
        target: "webhook",
      })
      .then((webhook) =>
        console.log(`\x1b[32m webhook.sid ==> ${webhook.sid} \x1b[0m`)
      )
      .catch((error) => console.log(error))
  }

  // Run all the functions
  createConvversation().then(() => {
    createParticipant().then(() => {
      createMessage().then(() => {
        createWebhook().then(() => {
          callback(null)
        })
      })
    })
  })
}
