'use strict';
// replace username and password with speech to text credentials
// audio.wav can be found here: https://github.com/watson-developer-cloud/nodejs-wrapper/blob/master/test/resources/audio.wav?raw=true

var fs = require('fs');
var opus = require('node-opus');
var ogg = require('ogg');
var cp = require('child_process');

var oggDecoder = new ogg.Decoder();

oggDecoder.on('stream', function (stream) {

    var opusDecoder = new opus.Decoder();

    // the "format" event contains the raw PCM format
    opusDecoder.on('format', function (format) {

        // format example:
        //{
        //    channels: 1,
        //    sampleRate: 24000,
        //    bitDepth: 16,
        //    float: false,
        //    signed: true,
        //    gain: 0,
        //    preSkip: 156,
        //    version: 1
        //}
