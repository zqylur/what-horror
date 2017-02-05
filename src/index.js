import 'babel-polyfill';
import fs from 'fs';
import path from 'path';
import TwitterClient from 'twitter-node-client/';

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../api-config/config.json'), { encoding: 'ascii' }));
const client = new TwitterClient.Twitter(config);
function error() {
    // console.error(errResponse);
}

function spewNonsense(response) {
    const tweets = JSON.parse(response);

    const now = new Date();
    const oneDay = 1000 * 60 * 60 * 24;
    const recentNonsense = tweets.filter((tw) => (now.getTime() - new Date(tw.created_at).getTime()) < oneDay);
    recentNonsense.map((tw) => console.log(tw.text));
}

client.getUserTimeline({ screen_name: 'realDonaldTrump', count: '100', trim_user: 'true' }, error, spewNonsense);
