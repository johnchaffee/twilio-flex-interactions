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

## CLI Commands

```shell
# Install the Serverless plugin
$ twilio plugins:install @twilio-labs/plugin-serverless

# List all available commands
twilio serverless --help

# Intialize a new project with the name twilio-serverless-test
$ twilio serverless:init twilio-serverless-test

# Start the local development environment with live reloading of Functions
$ twilio serverless:start

# Run a basic deployment with default settings
$ twilio serverless:deploy

# List the services
$ twilio serverless:list
...

# Delete a service
$ twilio api:serverless:v1:services:remove --sid ZS0179d2a14dd561cb85c5bcb3ae57c21e
```