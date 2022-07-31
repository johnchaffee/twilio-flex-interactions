/*

  contact.js

  Retrieves a single record using a unique attribute value from a table column. 
  If there are more than one matching record, then the first record is returned!

  Pulls AIRTABLE_API_KEY and AIRTABLE_BASE_ID from context

  Required Paramaters: 
    * event[0].data.payload.task_attributes

  */

const airtable = require("airtable")

exports.handler = function (context, event, callback) {
  // Instantiate airtable object
  const base = new airtable({ apiKey: context["AIRTABLE_API_KEY"] }).base(
    context["AIRTABLE_BASE_ID"]
  )

  console.log("event is ==> ", event)

  console.log("task_attributes is ==> ", event[0].data.payload.task_attributes)
  const task = JSON.parse(event[0].data.payload.task_attributes)
  console.log("JSON.parse is ==> ", task)
  // sms: channelType == sms, phone = from
  // chat: channelType == web, phone = hard code to john
  // voice: type = inbound, phone = caller
  const channelType = task.channelType
  console.log("channelType is ==> ", channelType)
  const customerAddress = task.customerAddress
  console.log("customerAddress is ==> ", customerAddress)
  const from = task.from
  console.log("from is ==> ", from)
  const caller = task.caller
  console.log("caller is ==> ", caller)
  const direction = task.direction
  console.log("direction is ==> ", direction)
  let phone
  let activity

  // Set today's date on Date picker
  let rightNow = new Date()
  let year = rightNow.getFullYear()
  let month = rightNow.getMonth() + 1
  let day = rightNow.getDate()
  let hour = rightNow.getHours()
  let minute = rightNow.getMinutes()
  // Convert UTC Time to Pacific Time
  hour = hour - 7
  if (hour > 16) {
    day = rightNow.getDate() -1
  }
  // Format month, day, hour, minute as 2-digits
  month = ("0" + month).slice(-2)
  day = ("0" + day).slice(-2)
  hour = ("0" + hour).slice(-2)
  minute = ("0" + minute).slice(-2)
  let myDate = `${year}-${month}-${day}`
  console.log("myDate: " + myDate)
  let myTime = `${myDate} ${hour}:${minute}`
  console.log("myTime: " + myTime)

  if (channelType) {
    if (channelType === "sms") {
      activity = `${myTime}: Completed SMS conversation`
      console.log("SMS TASK COMPLETED")
      phone = from
      console.log("PHONE:", phone)
    } else if (channelType === "web") {
      console.log("CHAT TASK COMPLETED")
      activity = `${myTime}: Completed Web Chat`
      phone = "+12063996576"
      console.log("PHONE:", phone)
    }
  } else if (direction && direction === "inbound") {
    console.log("VOICE TASK COMPLETED")
    phone = caller
    console.log("PHONE:", phone)
    activity = `${myTime}: Completed Phone Call`
  }
  console.log("encodeURIComponent PHONE:", encodeURIComponent(phone))

  base("contacts")
    .select({
      maxRecords: 1,
      filterByFormula: `(phone = "${phone}")`,
    })
    .firstPage(function (err, records) {
      if (err) {
        console.log(err)
        callback("error retrieving record", null)
      }
      // Take only the first record returned
      console.log("RECORDS:", records)
      console.log("RECORDS.LENGTH:", records.length)
      if (records.length > 0) {
        console.log("RECORDS[0].id", records[0].id)
        // let r = records[0].fields;
        // r.id = records[0].id; // ADD Airtable ID

        const id = records[0].id
        let activities = records[0].fields.activities
        const fields = {}
        console.log("id:", id)
        console.log("activities:", activities)
        console.log("fields:", fields)
        if (activities) {
          // append to existing activities
          fields.activities = `${activities}\n${activity}`
        } else {
          fields.activities = `${activity}`
        }

        // Update field
        base("contacts").update(
          [
            {
              id,
              fields,
            },
          ],
          function (err, records) {
            if (err) {
              console.error(err)
              callback("error retrieving record", null)
            }
            records.forEach(function (record) {
              // console.log(record.getId())
              // console.log(record.get("phone"))
              console.log("UPDATE record is ==> ", record)
              callback(null, { record })
            })
          }
        )
      } else {
        console.log("RECORDS !> 0")
        callback(null, "")
      }
    })
}
