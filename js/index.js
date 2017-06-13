'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function () {
	var $ = document.querySelector.bind(document);
	var video = $('video');
	var canvas = $('canvas');
	var ctx = canvas.getContext('2d');
	var strip = $('.strip');

	function getVideo() {
		navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(function (localMediaStream) {
			video.src = window.URL.createObjectURL(localMediaStream);
		}).catch(Materialize.toast("Let us access your camera", 300));
	}

	function paintToCanvas() {
		var width = video.videoWidth;
		var height = video.videoHeight;
		canvas.height = height;
		canvas.width = width;

		return setInterval(function () {
			ctx.drawImage(video, 0, 0, width, height);
			var pixels = ctx.getImageData(0, 0, width, height);
			var filter = [].concat(_toConsumableArray(document.querySelectorAll('input[type=\'radio\']'))).filter(function (f) {
				return f.checked;
			})[0].value;
			switch (filter) {
				case 'red':
					pixels = redEffect(pixels);
					ctx.globalAlpha = 1;
					break;
				case 'green':
					pixels = greenEffect(pixels);
					ctx.globalAlpha = 1;
					break;
				case 'blue':
					pixels = blueEffect(pixels);
					ctx.globalAlpha = 1;
					break;
				case 'hal':
					pixels = hallucinate(pixels);
					ctx.globalAlpha = 0.1;
					break;
			}
			ctx.putImageData(pixels, 0, 0);
		});
	}

	function takePhoto() {
		var snap = $('.snap');
		snap.currentTime = 0;
		snap.play();
		var data = canvas.toDataURL('image/jpeg');
		var photo = document.createElement('span');
		photo.className = 'photos';
		var link = document.createElement('a');
		link.href = data;
		link.setAttribute('download', 'me');
		link.innerHTML = '<img src=' + data + ' class="snaps" alt="My Snap" />';
		photo.appendChild(link);
		strip.insertBefore(photo, strip.firstChild);
		Materialize.toast('Snap stored to strip!', 300);
	}

	function redEffect(pixels) {
		for (var i = 0; i < pixels.data.length; i += 4) {
			pixels.data[i + 0] = pixels.data[i + 0] + 100;
			pixels.data[i + 1] = pixels.data[i + 1] - 50;
			pixels.data[i + 2] = pixels.data[i + 2] - 50;
		}
		return pixels;
	}

	function greenEffect(pixels) {
		for (var i = 0; i < pixels.data.length; i += 4) {
			pixels.data[i + 0] = pixels.data[i + 0] - 50;
			pixels.data[i + 1] = pixels.data[i + 1] + 100;
			pixels.data[i + 2] = pixels.data[i + 2] - 50;
		}
		return pixels;
	}

	function blueEffect(pixels) {
		for (var i = 0; i < pixels.data.length; i += 4) {
			pixels.data[i + 0] = pixels.data[i + 0] - 50;
			pixels.data[i + 1] = pixels.data[i + 1] - 50;
			pixels.data[i + 2] = pixels.data[i + 2] + 100;
		}
		return pixels;
	}

	function hallucinate(pixels) {
		for (var i = 0; i < pixels.data.length; i += 4) {
			pixels.data[i - 150] = pixels.data[i + 0];
			pixels.data[i + 300] = pixels.data[i + 1];
			pixels.data[i - 350] = pixels.data[i + 2];
		}
		return pixels;
	}

	getVideo();

	$('.take-photo').addEventListener('click', takePhoto);
	video.addEventListener('canplay', paintToCanvas);
})();