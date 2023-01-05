var current = "";
var wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#fffad6',
    progressColor: '#faa593',
    cursorWidth: 0,
    barWidth: 2.5,
    height: 96,
    responsive: 10
});

let load = (name) => {
  if (current !== name) {
    wavesurfer.load(`resources/audio/${name}.mp3`);
    $('.play-button').removeClass('playing');
    current = name;
  }
}
load("surround");

$('.slider').addEventListener('input', (evt) => {
  wavesurfer.setVolume($('.slider').value / 100);
});

$('.play-button').addEventListener('click', (evt) => {
  if ($('.play-button').has("playing")) {
    $('.play-button').removeClass('playing');
    wavesurfer.pause();
  } else {
    $('.play-button').addClass('playing');
    wavesurfer.play();
  }
});

wavesurfer.on('finish', () => {
  $('.play-button').removeClass('playing');
  wavesurfer.seekTo(0);
});

$each('.tracklist input', (i) => {
  i.addEventListener('click', (evt) => {
    load(i.id);
  });
})

