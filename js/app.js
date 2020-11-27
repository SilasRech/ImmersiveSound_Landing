// Setup AMBISONICs
var AudioContext = window.AudioContext // Default
    || window.webkitAudioContext; // Safari and old versions of Chrome
var context = new AudioContext; // Create and Initialize the Audio Context

// added resume context to handle Firefox suspension of it when new IR loaded
// see: http://stackoverflow.com/questions/32955594/web-audio-scriptnode-not-called-after-button-onclick
context.onstatechange = function() {
    if (context.state === "suspended") { context.resume(); }
}

var soundUrl = "/src/Sample_8.mp3";
var irUrl_0 = "IRs/ambisonic2binaural_filters/HOA3_IRC_1008_virtual.wav";

//Not used
var irUrl_1 = "IRs/ambisonic2binaural_filters/aalto2016_N3.wav";
var irUrl_2 = "IRs/ambisonic2binaural_filters/HOA3_BRIRs-medium.wav";

var maxOrder = 3;
var orderOut = 3;
var soundBuffer, sound;

// define HOA order limiter (to show the effect of order)
var limiter = new ambisonics.orderLimiter(context, maxOrder, orderOut);
console.log(limiter);
// define HOA rotator
var rotator = new ambisonics.sceneRotator(context, maxOrder);
console.log(rotator);
// binaural HOA decoder
var decoder = new ambisonics.binDecoder(context, maxOrder);
console.log(decoder);
// output gain
var gainOut = context.createGain();

// connect HOA blocks
rotator.out.connect(limiter.in);
limiter.out.connect(decoder.in);
decoder.out.connect(gainOut);
gainOut.connect(context.destination);

// function to assign sample to the sound buffer for playback (and enable playbutton)
var assignSample2SoundBuffer = function(decodedBuffer) {
    soundBuffer = decodedBuffer;
    //document.getElementById('play').style.display = "none";
    document.getElementById("loading_info").innerHTML = "Loading complete, you can press play now";
    document.getElementById('play').disabled = false;
}

// load samples and assign to buffers
var assignSoundBufferOnLoad = function(buffer) {
    soundBuffer = buffer;
    document.getElementById("loading_info").innerHTML = "Loading complete, you can press play now";
    document.getElementById('play').disabled = false;

}
var loader_sound = new ambisonics.HOAloader(context, maxOrder, soundUrl, assignSoundBufferOnLoad);
loader_sound.load();

// load filters and assign to buffers
var assignFiltersOnLoad = function(buffer) {
    decoder.updateFilters(buffer);
}
var loader_filters = new ambisonics.HOAloader(context, maxOrder, irUrl_0, assignFiltersOnLoad);
loader_filters.load();

$(document).ready(function() {
    // update sample list for selection
    var sampleList = {  "Hyva Elamaa": "/src/Sample_8.mp3",
    };
    var $el = $("#sample_no");
    $el.empty(); // remove old options
    $.each(sampleList, function(key,value) {
         $el.append($("<option></option>")
                    .attr("value", value).text(key));
         });
    // Init event listeners
    document.getElementById('play').addEventListener('click', function() {
        sound = context.createBufferSource();
        sound.buffer = soundBuffer;
        sound.loop = true;
        sound.connect(rotator.in);
        sound.start(0);
        sound.isPlaying = true;
        document.getElementById('play').disabled = true;
        document.getElementById('stop').disabled = false;
    });
    document.getElementById('stop').addEventListener('click', function() {
        sound.stop(0);
        sound.isPlaying = false;
        document.getElementById('play').disabled = false;
        document.getElementById('stop').disabled = true;
    });

    document.getElementById('reset').addEventListener('click', function() {
      camera.position.set(camToSave.position.x, camToSave.position.y, camToSave.position.z);
      camera.rotation.set(camToSave.rotation.x, camToSave.rotation.y, camToSave.rotation.z);

      controls.target.set(camToSave.controlCenter.x, camToSave.controlCenter.y, camToSave.controlCenter.z);
      controls.update();
    });

});
