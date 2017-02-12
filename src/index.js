import fs from 'fs';
import path from 'path';
import alexa from 'alexa-app';
import TwitterClient from 'twitter-node-client/';

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '/config.json'), { encoding: 'ascii' }));
const client = new TwitterClient.Twitter(config);

// eslint-disable-next-line new-cap
const app = new alexa.app('what-horror');

function error(errResponse) {
    console.error('err', errResponse);
}

function getSpokenLine(tweet) {
    const tweetTime = new Date(tweet.created_at);
    const hour = tweetTime.getHours();
    let minutes = tweetTime.getMinutes();
    if (minutes < 10) {
        minutes = `0${JSON.stringify(minutes)}`;
    }
    const tweetText = tweet.text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
    return (
        `At ${hour % 12 === 0 ? 12 : hour}:${minutes} ${hour < 12 ? 'AM' : 'PM'} `
        + `he tweeted <break time='500ms' /> ${tweetText}`
    );
}

app.launch((req, res) => {
    client.getUserTimeline(
        { screen_name: 'realDonaldTrump', count: '100', trim_user: 'true' },
        error,
        (tweetsRes) => {
            const cheetoJesusTweets = JSON.parse(tweetsRes);
            const now = new Date();
            const oneDay = 1000 * 60 * 60 * 24;
            const recentCheetoJesusTweets = cheetoJesusTweets
                .filter((tw) => (now.getTime() - new Date(tw.created_at).getTime()) < oneDay)
                .reverse();

            const timesCheetoJesusTweeted = recentCheetoJesusTweets.length;
            let response = '';

            switch (timesCheetoJesusTweeted) {
                case 0:
                    response = `Thankfully, Trump hasn't tweeted today`;
                    break;
                case 1:
                    response = `Trump tweeted once today`;
                    break;
                default:
                    response = `Trump tweeted ${timesCheetoJesusTweeted} times today`;
                    break;
            }
            const session = req.getSession();
            session.set('tweets', JSON.stringify(recentCheetoJesusTweets));
            session.set('state', 'LAUNCH_COMPLETE');
            res.say(response);

            if (timesCheetoJesusTweeted > 0) {
                res.say(
                    `<break time="500ms" />Would you like to hear ${timesCheetoJesusTweeted === 1 ? 'it' : 'them'}?`,
                );
            }
            res.send();
        },
    );
    res.shouldEndSession(false);
    return false;
});

app.intent(
    'AMAZON.YesIntent',
    {
        slots: { },
        utterances: [],
    },
    (req, res) => {
        const session = req.getSession();
        const recentCheetoJesusTweets = JSON.parse(session.get('tweets'));
        const state = session.get('state');

        if (state === 'LAUNCH_COMPLETE') {
            const spokenNonsense = recentCheetoJesusTweets.map((tw) => getSpokenLine(tw));
            res.say(spokenNonsense.join('<break time="1s" />'));
        }
    },
);

app.intent(
    'AMAZON.NoIntent',
    {
        slots: { },
        utterances: [],
    },
    (req, res) => {
        const session = req.getSession();
        // eslint-disable-next-line no-unused-vars
        const cheetoJesusTweets = JSON.parse(session.get('tweets'));
        const state = session.get('state');

        if (state === 'LAUNCH_COMPLETE') {
            res.say(`That's understandable, it's scary enough out there!`);
        }
    },
);

app.intent(
    'ReadTweetIntent',
    {
        slots: { TWEETNUMBER: 'NUMBER' },
        utterances: [
            'Read tweet number {TWEETNUMBER}',
        ],
    },
    (req, res) => {
        const session = req.getSession();
        const cheetoJesusTweets = JSON.parse(session.get('tweets'));
        res.say(
            `Tweet number ${req.slot('TWEETNUMBER')}`
            + ` ${getSpokenLine(cheetoJesusTweets[parseInt(req.slot('TWEETNUMBER'), 10) - 1])}`,
        );
    },
);

// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;
module.exports = app;
