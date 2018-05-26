<template>
	<section class="container">
		<video id="background_video" loop muted></video>
		<div id="video_cover"></div>
		<div id="overlay"></div>
		<div class="main">
			<Home></Home>
		</div>
	</section>
</template>

<script>
import Home from "~/components/home.vue";
// import 'bideo.js';
export default {
components: {
	Home
},
methods: {
	initVideo() {
		var bv = new Bideo();
		bv.init({
			// Video element
			videoEl: document.querySelector("#background_video"),
			// Container element
			container: document.querySelector("body"),
			// Resize
			resize: true,
			// autoplay: false,
			isMobile: window.matchMedia("(max-width: 768px)").matches,
			src: [
				{
				src: "http://qiniujiexino2opublic.51icare.cn/night.mp4",
				type: "video/mp4"
				},
				{
				src: "http://qiniujiexino2opublic.51icare.cn/night.webm",
				type: 'video/webm;codecs="vp8, vorbis"'
				}
			],
			// What to do once video loads (initial frame)
			onLoad: function() {
				document.querySelector("#video_cover").style.display = "none";
			}
		});
	}
},
mounted() {
    var bv = new Bideo();
    bv.init({
      // Video element
      videoEl: document.querySelector("#background_video"),
      // Container element
      container: document.querySelector("body"),
      // Resize
      resize: true,
      // autoplay: false,
      isMobile: window.matchMedia("(max-width: 768px)").matches,
      src: [
        {
          src: "http://qiniujiexino2opublic.51icare.cn/night.mp4",
          type: "video/mp4"
        },
        {
          src: "http://qiniujiexino2opublic.51icare.cn/night.webm",
          type: 'video/webm;codecs="vp8, vorbis"'
        }
      ],
      // What to do once video loads (initial frame)
      onLoad: function() {
        document.querySelector("#video_cover").style.display = "none";
      }
    });
  }
};
</script>

<style lang="scss">
.container {
	.main {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		overflow: auto;
		color: #ffffffb3;
	}
}
</style>
<style>
* {
  margin: 0;
  padding: 0;
}
html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
h1, h2, h3, h4, h5 {
	color: #fff;
}
#container {
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
#background_video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  object-fit: cover;
  height: 100%;
  width: 100%;
}
#video_cover {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("http://qiniujiexino2opublic.51icare.cn/video_cover.jpeg")
    no-repeat;
  background-size: cover;
  background-position: center;
}
/* Demo page specific styles */
body {
  text-align: center;
  font-family: "proxima-nova", Helvetica;
}
#container {
  height: 100%;
}
#overlay {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}
.text-center {
	text-align: center
}
.flex {
	display: flex;
}
.flex-1 {
	flex: 1;
}
</style>
