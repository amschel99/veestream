<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Veestream API Documentation</title>
	<style>
		pre {
  background-color: #282c34;
  color: #abb2bf;
  border: 1px solid #abb2bf;
  padding: 10px;
  font-size: 14px;
  line-height: 1.4;
  font-family: 'Courier New', Courier, monospace;
  overflow-x: auto;
  white-space: pre-wrap;
  border-radius: 5px;
}



	</style>
</head>
<body>
	<h1>Veestream API Documentation</h1>
	<p>Welcome to the Veestream API documentation. Veestream is a video API that allows you to upload, stream, and manage your video content. This API is intended for anyone who wants to integrate video on demand feature into their web or mobile applications.</p>

	<h2>Base URL</h2>
	<p>The base URL for the Veestream API is <code>https://veestream.tech</code>.</p>

	<h2>Getting an API key</h2>
	<p>An API key is required to use the veestream API. To get an API key,register by providing your name, email and paying 1$ via paypal, credit card or debit card. After you signup, you will get an API key. It is recommended that you keep this API key safe and private. This API key must be provided in the request header when making calls to other API endpoints. After the payment, you will get an email from paypal with your transaction receipt. It is recommended that you keep this receipt safe for reference. </p>

	
	<h2>Endpoints</h2>

	<h3>Upload Video</h3>
	<p>This endpoint allows a user with an API key to upload one video at a time. When you signed up, an azure blob storage container is created for you. All the video files you upload will be stored on that container.</p>
	<pre><code>POST /video/upload</code></pre>
	<h4>Headers</h4>
<p>Use the following header in your  request for the upload endpoint:</p>
<pre><code class="language-bash">apikey: yourapikey</code></pre>
<h4>Body</h4>
<p>Include name in the request body. This should be a string, the name for your video file .</p>
<pre><code class="language-bash">name:"video name"</code></pre>
<h3>File Upload</h3>
<p>To upload a file, send a POST request to the API endpoint and include the file in the request. The name property of the file should be video.</p>
<p>The following example demonstrates how to upload a file using curl</p>
<pre><code class="language-javascript">curl -X POST -H "apiKey: b7642f0d6db02f383498e7f7edd353597ad8e5fe" -F "video=@/home/amschel/Downloads/honey.mp4" -F "name=My Video" https://veestream.tech/video/upload
</code></pre>
<p>The following example demonstrates how to upload a file using javascript</p>
<pre><code class="language-javascript">
	const apiKey = 'b7642f0d6db02f383498e7f7edd353597ad8e5fe';
	const fileInput = document.querySelector('#file-input');
	const formData = new FormData();
	formData.append('video', fileInput.files[0]);
	formData.append('name', 'My Video');
	
	fetch('https://veestream.tech/video/upload', {``
	  method: 'POST',
	  headers: {
		'apiKey': apiKey,
	  },
	  body: formData
	})
	.then(response => response.json())
	.then(data => console.log(data))
	.catch(error => console.error(error));
	
	</code></pre>
	<a href="https://github.com/amschel99/veestream-code-samples/blob/master/uploadVideo.html">Full Example on github</a>

		<p>Example response</p>
		<pre><code class="language-javascript">
			

https/1.1 200 OK
Content-Type: application/json

{
  "_id": "61f19d85d28a103995b1816c",
  "name": "honey.mp4",
  "poster": "/video/61f19d85d28a103995b1816c/poster",
  "gif": "/video/61f19d85d28a103995b1816c/gif",
  "url": "https://mystorageaccount.blob.core.windows.net/mycontainer/honey.mp4",
  "apikey": "b7642f0d6db02f383498e7f7edd353597ad8e5fe"
 
}

		</code></pre>
	<h3>Get video url for streaming</h3>
	<pre><code>GET /video/:id</code></pre>
	<p>This endpoint returns a valid video url that can be used as an src attribute of the Html5 video tag to play videos in browsers. 	<pre><code>GET /video/61f19d85d28a103995b1816c</code></pre> </p>
	<p>To make a request to this endpoint, pass a valid apikey in the request headers. If the apikey is wrong, you will get a 401 anauthorized response.</p>
	<pre><code>
				const videoPlayer = document.querySelector('video');
				const apiKey = 'your_api_key_here';
				const videoId = 'video_id_here';
				const apiUrl = `https://veestream.tech/video/${videoId}`;
				
				fetch(apiUrl, { headers: { apikey: apiKey } })
					.then(response => response.json())
					.then(videoUrl => {
						videoPlayer.src = videoUrl;
						videoPlayer.play();
					})
					.catch(error => console.error(error));
		
		
		
	</code></pre>
	<a href="https://github.com/amschel99/veestream-code-samples/blob/master/playVideo.html">Full example on github</a>
	<h3>Get Video Metadata</h3>
	<pre><code>GET /video/:id/data</code></pre>
	<p>This allows you to get metadata about a particular video. We pass the id parameter to specify the video we are requesting data for. id is from _id field that each video has.</p>
	<p>Below is an example curl command</p>
	<pre><code>curl -X GET -H "apikey: b7642f0d6db02f383498e7f7edd353597ad8e5fe" https://veestream.tech/video/61f19d85d28a103995b1816c/data
	</code></pre>
	<p>Below is the example code in javascript for this endpoint</p>
	<pre>
const axios = require('axios');

const url = 'https://veestream.tech/video/61f19d85d28a103995b1816c/data';

const headers = {
  apiKey: 'b7642f0d6db02f383498e7f7edd353597ad8e5fe',
};

axios.get(url, { headers })
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.log(error.response.data);
  });

	</code></pre>
	<h4>Example response</h4>
	<pre><code>
{"_id":"6411586553934d5529ea3ced","name":"thoughts","url":"https://veezo.blob.core.windows.net/container-c9e754e147351c54/honeybee.mp4","apikey":"59959534HX078772Rae8569f7c8bc5fafb6d7e0286b396bcc83551de4","__v":0,"gif":"/video/6416ce9bf76c1366c4f9a922/gif","poster":"/video/6416ce9bf76c1366c4f9a922/poster"}
</code></pre>
<a href="https://github.com/amschel99/veestream-code-samples/blob/master/getVideoMetaData.html">Full example on github</a>
	<h3>Generate a  video thumbnail</h3>
	<p>A video thumbnail is generated by taking a screenshot of the video by default from 10-12secs. It is of type image/png. Below is the example curl command to generate a thumbnail. </p>
	<pre><code>
curl -X GET https://veestream.tech/video/61f19d85d28a103995b1816c/poster -H 'apikey: b7642f0d6db02f383498e7f7edd353597ad8e5fe'
	  </code></pre>
	  <p>When you make a request to /video/:id/data, you get a poster as part of the response. You can add the base url i.e https://veestream.tech and concatenate it with the poster to create the full url for the thumbnail endpoint. You can set this url as the src attribute of an image to display video thumbnails on your frontend. </p>

	  <a href="https://github.com/amschel99/veestream-code-samples/blob/master/getVideoMetaData.html">Check how to generate thumbnail on  the 'getVideoMetaData' example on github</a>

	<h3>Generate Video GIF</h3>
	<p>A video gif is generated using ffmpeg which takes a video and generates a 2 seconds  gif from 10-12 seconds of the video by default. </p>
	<pre><code>
		curl -X GET https://veestream.tech/video/61f19d85d28a103995b1816c/gif -H 'apikey: b7642f0d6db02f383498e7f7edd353597ad8e5fe'
	</code></pre>
	<p>When you make a request to /video/:id/data, you get a gif too as part of the response. You can concatenate the base url, https://veestream.tech with the gif to create the full url for the gif endpoint.You can now set the url as an src attribute of an image on hover to play the gif when a user hovers over the image. </p>

	<a href="https://github.com/amschel99/veestream-code-samples/blob/master/getVideoMetaData.html">Check how to generate gif on 'getVideoMetaData' example on github</a>

    <h3>Get All Videos</h3>
    <pre><code>GET /videos</code></pre>
    <p>This endpoint allows you to get all the videos related to your account. It returns an array of videos metadata for all the videos stored in your account. Below are examples of how to utilize this endpoints using curl and javascript</p>
	<h6>curl:</h6>
	<pre><code>curl -H "apikey: b7642f0d6db02f383498e7f7edd353597ad8e5fe" https://veestream.tech/videos
	</code></pre>
	<p>Javascript</p>

		<pre><code>
			fetch('https://veestream.tech/videos', {
			headers: {
			  'apikey': 'b7642f0d6db02f383498e7f7edd353597ad8e5fe'
			}
		  })
			.then(response => response.json())
			.then(data => console.log(data))
			.catch(error => console.error(error));
		  
		
	</code></pre>
	<h6>Example response</h6>
	<pre><code>[{"_id": "60e93a62a09de04c753f53d7","name":"Sample Video","poster": "https://veestream.tech/video/61f19d85d28a103995b1816c/poster","gif": "https://veestream.tech/video/61f19d85d28a103995b1816c/gif","url": "https://veestream.tech/video/61f19d85d28a103995b1816c.mp4","apikey": "b7642f0d6db02f383498e7f7edd353597ad8e5fe"}]
	</code></pre>
	<a href="https://github.com/amschel99/veestream-code-samples/blob/master/getVideos.html">Full example on github</a>
    <h2>Conclusion</h2>
    <p>That's it! We hope you find the Veestream API useful for your video needs. If you have any questions, feedback or need help with integration, please contact us at <a href="mailto:support@veestream.tech">support@veestream.tech</a>, we always try to get back ASAP!</p>
    
    </body>
    </html>
