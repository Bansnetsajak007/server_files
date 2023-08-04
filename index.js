const express = require('express')
const cors = require('cors');
const ytdl = require('ytdl-core')
const port = process.env.PORT || 4000;

const app = express()
app.use(cors());


app.get('/', (req,res) =>{
	res.send("server working!!!");
})


app.get('/demo', (req,res) =>{
	res.json({Username : 'sajak'})
})

app.get('/download', async (req, res, next) => {
	try {
		let url = req.query.url;
        console.log("Received url", url)
		if(!ytdl.validateURL(url)) {
			return res.sendStatus(400);
		}
		let title = 'audio';

		await ytdl.getBasicInfo(url, {
			format: 'mp3'
		}, (err, info) => {
			if (err) throw err;
			title = info.player_response.videoDetails.title.replace(/[^\x00-\x7F]/g, "");
		});

		res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
		ytdl(url, {
			format: 'mp3',
			filter: 'audioonly',
		}).pipe(res);
		
	} catch (err) {
		console.error(err);
	}
});

app.listen(port,() => {
	console.log("Server works!!!")
})