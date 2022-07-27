require("dotenv").config()
const accountSid = process.env.ACCOUNT_SID
const authToken = process.env.AUTH_TOKEN
const workspaceSid = process.env.WORKSPACE_SID
const workflowSid = process.env.WORKFLOW_SID
const mobilePhoneNumber = process.env.MOBILE_PHONE_NUMBER
const client = require("twilio")(accountSid, authToken)

exports.handler = function (context, event, callback) {
  async function createInteraction() {
    await client.flexApi.v1.interaction
      .create({
        channel: {
          type: "sms",
          initiated_by: "customer",
          properties: {
            media_channel_sid: event.conversationSid,
          },
        },
        routing: {
          properties: {
            workspace_sid: workspaceSid,
            workflow_sid: workflowSid,
            task_channel_unique_name: "sms",
            attributes: {
              from: mobilePhoneNumber,
            },
          },
        },
      })
      .then((interaction) =>
        console.log("INTERACTION CREATED:", interaction.channel)
      )
      .catch(function (error) {
        console.log("CATCH:", error)
      })
  }

  createInteraction().then(() => {
    callback(null)
  })
}
