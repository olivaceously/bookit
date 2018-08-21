# bookit

## And book it good!

This is a slack bot whose sole purpose is to help you book a meeting room in your office. Hopefully one day bookit will be able to integrate with Microsoft Outlook/Exchange.

## Interacting with bookit

To interact with bookit, simply mention bookit in a channel or start a conversation with the bot!

Here are some of the things that bookit knows how to respond to:

- hi OR hello: say hello to bookit!

- set defaults OR reset defaults: use this command to set default office location (Boston or Waltham) and default meeting duration in minutes (e.g. 15, 30, 90)

- find OR find available OR list OR available rooms OR find room: use this command to see a list of currently available rooms based on your defaults. You must have your defaults set to use these phrases, and bookit will prompt you if you don't.


## Planned Methods

- book OR book room: book an available room based on your default meeting duration

- my reservations OR reservations: list current room reservations

- cancel OR cancel room: cancels a current reservation

- change: change a current reservation





## Intructions from Forked Repo: Using Botkit for Custom Bots
1. Fork this project.
2. Open up your favorite terminal app, and clone your new repository to your local computer.
3. This is a Node.js project, so you’ll need to install the various dependencies by running:
    npm install
4. Edit `package.json` to give your bot a name and update the GitHub URLs to reflect the location of your fork in GitHub.
5. Go to https://my.slack.com/apps/new/A0F7YS25R-bots and pick a name for your new bot.
6. Once you’ve clicked “Add integration,” you’ll be taken to a page where you can further customize your bot. Of importance is the bot token—take note of it now.
7. Once you have the token, you can run your bot easily:

    ```bash
    TOKEN=xoxb-your-token-here npm start
    ```

    Your bot will now attempt to log into your team, and you should be able talk to it. Try telling your new bot “hello”. It should say “Hello!” back!

8. Botkit is structured around event listeners. The most important is the “hear” listener, which kicks off an action when your bot hears something. `index.js` contains the core logic, and has this event listener:

    ```javascript
    controller.hears('hello','direct_message', function(bot,message) {
        bot.reply(message, 'Hello!');
    });
    ```

    This event handler is triggered when the bot receives a direct message from a user that contains the word “hello.”

    The bot responds in the direct message with, “Hello!”

9. You can listen to any kind of message or you can configure your bot to only listen to direct messages or specific @-mentions of your bot. It’s up to you! To start let’s re-write the event listener to be more  flexible about the greetings it is listening for:
    ```javascript
    controller.hears(['hello', 'hi', 'greetings'], ['direct_mention', 'mention', 'direct_message'], function(bot,message) {
         bot.reply(message, 'Hello!');
     });
    ```

    Now our bot will respond any time it sees “hello,” “hi,” or “greetings” in either a DM or a message that @-mentions the bot. (Don’t forget to restart your bot after each edit!)

## Hurrah! Welcome to Level 2

You’ve built your first bot in Slack, and it’s not just a Hello World bot—it’s a Hi World and Greetings World bot too!

At this point you will probably want to start doing more sophisticated things, like making requests to external services, so your bot can respond with timely and useful information (depending on what your bot does, of course). There’s a lot more to Botkit than this! You can learn more about Botkit’s awesome features by simply perusing the [Botkit documentation](http://howdy.ai/botkit/docs/).

Once you’ve got your bot developed to your liking, it is ready to be deployed to your own hosting framework. No other configuration is necessary, except storing the token and desired port in environment variables.

# Using Botkit for Bot Apps

You can find full instructions for building a bot app with this repository at https://medium.com/slack-developer-blog/easy-peasy-bots-getting-started-96b65e6049bf#.4ay2fjf32
