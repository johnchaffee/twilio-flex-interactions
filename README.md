# Twiliot Flex Interactions

This is a Twilio Function that is used to create a conversation and associate it with a Flex interaction. It has two parts:

1. create-conversation
   - Creates a conversation
   - Adds a mobile participant to the conversation
   - Adds a message to the conversation that is delivered to the mobile participant
   - Creates a conversation scoped webhook for the `messageAdded` event
2. create-interaction
   - If the mobile participant sends a reply that triggers the scoped webhook
   - creates an interaction that routes the conversation to a Flex agent
   - deletes the conversation scoped webhook
