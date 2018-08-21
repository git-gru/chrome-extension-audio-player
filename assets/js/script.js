
var playSong = null,	// song to play
	repeat = 0,			// Repeat flag
	timer = 0;			// An interval for the track's current time.

startPlayerWhenReady();


/*---------------------
	Dropping files
----------------------*/

var dropZone = $('#drop-zone'),
	searchInput = $('#searchBox');

$(document).on('dragover', (e) => {
	e.stopPropagation();
	e.preventDefault();

	dropZone.removeClass('hidden');
});

dropZone.on('dragleave', (e) => {
	e.stopPropagation();
	e.preventDefault();

	dropZone.addClass('hidden');
});

dropZone.on('dragover', (e) => {
	e.stopPropagation();
	e.preventDefault();

	e.originalEvent.dataTransfer.dropEffect = 'copy';
});

// Get file data on drop
dropZone.on('drop', (e) => {
	e.stopPropagation();
	e.preventDefault();

	// users have to upload files directly
	var files = e.originalEvent.dataTransfer.files;
	var file = files[0]

	if (file.type.match(/audio\/(mp3|mpeg)/)) {
		getID3Data(file, (song) => {
			playSong = song
			startPlayerWhenReady();
		});
	}

	dropZone.addClass('hidden');
});

// Generate an object with all the needed information about a track.
function getID3Data(file, callback) {
	getTags(file, (result) => {
		result.audioTrack = file;
		result.playing = false;
		callback(result);
	});
}

// Get ID3 data tags from file.
function getTags(file, callback) {
	var result = {};

	ID3.loadTags(file.name, () => {

		var tags = ID3.getAllTags(file.name);

		result.artist = tags.artist || "Unknown Artist";
		result.title = tags.title || "Unknown";
		result.album = tags.album || "";
		if (tags.picture && tags.picture.data && tags.picture.data.length) {
			result.picture = tags.picture;
			getImageSource(result.picture, (imageSource) => {
				result.picture = imageSource;
				callback(result);
			});
		} else {
			result.picture = 'assets/img/default.png';
			callback(result);
		}
	}, {
			tags: ["artist", "title", "album", "picture"],
			dataReader: FileAPIReader(file)
		});
}

function getImageSource(image, callback) {
	var base64String = "";

	for (var j = 0; j < image.data.length; j++) {
		base64String += String.fromCharCode(image.data[j]);
	}

	callback("data:" + image.format + ";base64," + window.btoa(base64String));
}


function readFile(file, callback) {
	var reader = new FileReader();

	reader.onload = (data) => {
		callback(data);
	};

	reader.readAsDataURL(file);
}


/*-------------------
	Audio player.
 ------------------*/


var wavesurfer = Object.create(WaveSurfer);

wavesurfer.init({
	container: document.querySelector('#wave'),
	cursorColor: '#aaa',
	cursorWidth: 1,
	height: 80,
	waveColor: '#588efb',
	progressColor: '#f043a4'
});


// Read file and play it.

function playTrack() {
	if (playSong) {
		var file = playSong.audioTrack,
			result = {};

		readFile(file, (result) => {
			result = file;
			wavesurfer.loadBlob(result);
		});
	} else {
		// if something went wrong stop playback.
		wavesurfer.stop();
	}
}


// An event handler for when a track is loaded and ready to play.

wavesurfer.on('ready', () => {
	// Play the track.
	wavesurfer.play();

	var duration = wavesurfer.getDuration();

	if (playSong) {
		document.title = playSong.artist + ' - ' + playSong.title;

		// Show duration of track.
		$('#current').text('0:00');
		$('#total').text(formatTime(duration));

		// Show the progress of the track in time.
		clearInterval(timer);
		timer = setInterval(() => {
			$('#current').text(formatTime(wavesurfer.getCurrentTime()));
		}, 1000);

		playSong.playing = true;
	}
});

// Event handler when a track finishes playing
wavesurfer.on('finish', function () {
	if (!repeat) {
		wavesurfer.stop();
	} else if (repeat == 1) {
		playTrack();
	}
});


wavesurfer.on('seek', () => {
	$('#current').text(formatTime(wavesurfer.getCurrentTime()));
});


/*---------------------
	Player controls
----------------------*/

$('#play-button').on('click', () => {
	wavesurfer.play();
});

$('#pause-button').on('click', () => {
	wavesurfer.playPause();
});

$('#stop-button').on('click', () => {
	wavesurfer.stop();
});


/*-------------------
 	Helper Functions
--------------------*/

//Automatically start playlist on file load.
function startPlayerWhenReady() {
	var interval = setInterval(() => {
		if (playSong) {
			playTrack();
			$('#container').removeClass('disabled');
			clearInterval(interval);
		}
	}, 200);
}

// Format time in minutes:seconds
function formatTime(time) {
	time = Math.round(time);

	var minutes = Math.floor(time / 60),
		seconds = time - minutes * 60;

	seconds = seconds < 10 ? '0' + seconds : seconds;

	return minutes + ":" + seconds;
}

// Wavesurfer responsiveness
$(window).on('resize', () => {
	if ($('#wave').is(":visible")) {
		wavesurfer.drawer.containerWidth = wavesurfer.drawer.container.clientWidth;
		wavesurfer.drawBuffer();
	}
});