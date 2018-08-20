/**
 * A Bot for Slack!
 */


/**
 * Define a function for initiating a conversation on installation
 * With custom integrations, we don't have a way to find out who installed us, so we can't message them :(
 */

function onInstallation(bot, installer) {
    if (installer) {
        bot.startPrivateConversation({user: installer}, function (err, convo) {
            if (err) {
                console.log(err);
            } else {
                convo.say('I am a bot that has just joined your team');
                convo.say('You must now /invite me to a channel so that I can be of use!');
            }
        });
    }
}


/**
 * Configure the persistence options
 */

var config = {};
if (process.env.MONGOLAB_URI) {
    var BotkitStorage = require('botkit-storage-mongo');
    config = {
        storage: BotkitStorage({mongoUri: process.env.MONGOLAB_URI}),
    };
} else {
    config = {
        json_file_store: ((process.env.TOKEN)?'./db_slack_bot_ci/':'./db_slack_bot_a/'), //use a different name if an app or CI
    };
}

/**
 * Are being run as an app or a custom integration? The initialization will differ, depending
 */

if (process.env.TOKEN || process.env.SLACK_TOKEN) {
    //Treat this as a custom integration
    var customIntegration = require('./lib/custom_integrations');
    var token = (process.env.TOKEN) ? process.env.TOKEN : process.env.SLACK_TOKEN;
    var controller = customIntegration.configure(token, config, onInstallation);
} else if (process.env.CLIENT_ID && process.env.CLIENT_SECRET && process.env.PORT) {
    //Treat this as an app
    var app = require('./lib/apps');
    var controller = app.configure(process.env.PORT, process.env.CLIENT_ID, process.env.CLIENT_SECRET, config, onInstallation);
} else {
    console.log('Error: If this is a custom integration, please specify TOKEN in the environment. If this is an app, please specify CLIENTID, CLIENTSECRET, and PORT in the environment');
    process.exit(1);
}


/**
 * A demonstration for how to handle websocket events. In this case, just log when we have and have not
 * been disconnected from the websocket. In the future, it would be super awesome to be able to specify
 * a reconnect policy, and do reconnections automatically. In the meantime, we aren't going to attempt reconnects,
 * WHICH IS A B0RKED WAY TO HANDLE BEING DISCONNECTED. So we need to fix this.
 *
 * TODO: fixed b0rked reconnect behavior
 */
// Handle events related to the websocket connection to Slack
controller.on('rtm_open', function (bot) {
    console.log('** The RTM api just connected!');
});

controller.on('rtm_close', function (bot) {
    console.log('** The RTM api just closed');
    // you may want to attempt to re-open
});


/**
 * Core bot logic goes here!
 */
// BEGIN EDITING HERE!

var defaults = [];

controller.on('bot_channel_join', function (bot, message) {
    bot.reply(message, "Hiya, let me know when you want to book a room!")
});


//hello method
controller.hears(['hi', 'hello'], ['direct_mention', 'mention', 'direct_message'],
    function(bot,message) {
        bot.reply(message,'Hello!');
    }
);


// find method
controller.hears(['find', 'available', 'list'],
    ['direct_mention', 'mention', 'direct_message'],
    function(bot,message) {
        bot.createConversation()
        bot.reply(message,'The following rooms are available: ');
    }
);

// set defaults method
controller.hears(['set defaults', 'reset defaults'],
    ['direct_mention', 'mention', 'direct_message'],
    function(bot,message) {
        bot.startConversation(message, function(err, convo) {

        // create a path for when a user says Boston
        convo.addMessage('Great, I\'ve now set your default location to {{vars.default_location}} - aka the best office around!', 'bos_thread');

        // create a path for when a user says Waltham
        convo.addMessage('Great, I\'ve now set your default location to {{vars.default_location}}!', 'wal_thread');

        // create a path where neither option was matched
        // this message has an action field, which directs botkit to go back to the `default` thread after sending this message.
        convo.addMessage({
            text: 'Sorry I did not understand.',
            action: 'default',
        },'bad_response');

        convo.addMessage('Sounds good to me! Your default meeting duration has now been set to {{vars.default_duration}} minutes.', 'duration_thread');

        convo.addMessage('Congratulations, your defaults are all set! To reset them, just type "set defaults" again and we\'ll go through this whole process again', 'duration_thread');
 

        // Asking for a default location in the default thread...
        convo.addQuestion('What is your default office location?', [
            {
                pattern: 'Boston',
                callback: function(response, convo) {
                    convo.setVar('default_location', response.text);
                    convo.gotoThread('bos_thread');
                    convo.next();
                },
            },
            {
                pattern: 'Waltham',
                callback: function(response, convo) {
                    convo.setVar('default_location', response.text);
                    convo.gotoThread('wal_thread');
                    convo.next();
                },
            },
            {
                default: true,
                callback: function(response, convo) {
                    convo.gotoThread('bad_response');
                    convo.next();
                },
            }
        ],{},'default');

        // Asking for a default duration in the Boston thread...
        convo.addQuestion('How long do your meetings usually last in minutes? (e.g. you can say "30")', function(response, convo) {
            convo.setVar('default_duration', response.text);
            convo.gotoThread('duration_thread')
        }, {}, 'bos_thread');


        // Asking for a default duration in the Waltham thread...
        convo.addQuestion('How long do your meetings usually last in minutes? (e.g. you can say "30")', function(response, convo) {
            convo.setVar('default_duration', response.text);
            convo.gotoThread('duration_thread')
        }, {}, 'wal_thread')
       
       });

    }
);

/**
 * AN example of what could be:
 * Any un-handled direct mention gets a reaction and a pat response!
 */
controller.on('direct_message,mention,direct_mention', function (bot, message) {
   bot.api.reactions.add({
       timestamp: message.ts,
       channel: message.channel,
       name: 'robot_face',
   }, function (err) {
       if (err) {
           console.log(err)
       }
       bot.reply(message, 'I heard you loud and clear boss.');
   });
});
