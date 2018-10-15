const Discord = require("discord.js");
const client = new Discord.Client();
const ydtl = repuire("ytdl-core");
const request = require("request");
const fs =require("fs");
const getYouTubeID = require("get-youtube-id");
const fetchVideoInfo = require("yourtube-info");

var queue = [];
var isPlaying = false;
var dispatcher = null;
var voiceChannel = null;
var skipReq = 0;
varskippers = [];

client.on('ready', function () {
    console.log("I am Reydi!");
});

client.on('message', function(message) {
    const member = message.member;
    const mess = message.content.toLowerCase();
    const args = message.content.split(' ').slice(1).join(" ");

    if (mess.startsWith(prefix + "play")) {
        if (queue.length > 0 || isPlaying) {
            getID(args, function (id) {
                add_to_queue(id)
                fetchVideoInfo(id, function (err, videoInfo) {
                    if (err) throw new Error(err);
                    message.reply(" added to queue: **" + videoInfo.title + "**");
                });
            });
        } else {
            isPlaying = true;
            getID(args, function (id) {
                queue.push("placeholder");
                playMusic(id, message);
                fetchVideoInfo(id, function (err, videoInfo) {
                    if (err) throw new Error(err);
                    message.reply("now playing **" + videoInfo.title + "**");
                });
            });
        }
    }



function playMusic(id, message) {
    voiceChannel = message.member.voiceChannel;

    voiceChannel.join().then(function (connection) {
        stream = ydtl("https://www.youtube.com/watch?v=" + id, {
            filter: 'audioonly'
        });
        skipReq = 0;
        skippers = [];

        dispatcher = connection.playStream(stream);
    });
}


function getID(str, cb) {
    if (isYoutube(str)) {
        cb(getYouTubeID(str)); 
    } else {
        search_video(str, function(id) {
            cb(id);
        });    
    }    
}

function add_to_queue(strID) {
    if (isYoutube(strID)) {
        queue.push(getYouTubeID(strID));
    } else {
        queue.push(strID);
    }
}

function isYoutube(str) {
    return str.toLowerCase().indexOf("youtube.com") > -1;
}

function search_video(query, callback) {
    request("https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=" + encodeURIComponent(query) + "&key=" + yt_api_key, function(error, response, body) {
        var json = JSON.parse(body);
        callback(json.items[0].id.videoId);
    });
}

function isYoutube(str) {
    return str.toLowerCase().indexOf("youtube.com") > -1;
}  

client.login(process.env.BOT_TOKEN);
yt_api_key.login(process.env.YT_API_KEY)
