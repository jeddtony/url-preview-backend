const router = require('express').Router();

const axios = require('axios');

router.get("/test", (req, res) => {
    res.send('This is the test route');
});

router.get("/", async function (req, res) {
    let requestUrl = ""
    console.log(req.query);
     requestUrl = req.query.searchUrl;
    console.log(requestUrl);

    if(requestUrl === ""){
        return
    }
    //Check if it contains https
    let httpRegex = new RegExp("[a-z][a-z0-9+\-.]*://");

    let matchString = httpRegex.exec(requestUrl);

    console.log('checking match string', matchString);
    if(matchString === null){
        requestUrl = "http://"+requestUrl;
    }
    let results = await axios.get(requestUrl);
    let webContent = results.data;

    let titleString = extractContent("og:title", webContent);
    console.log('showing this title string ', titleString);
    let imageString = extractContent("og:image", webContent);
    console.log("showing image url ", imageString);

    let descriptionString = extractContent("og:description", webContent);
    console.log("showing the description ", descriptionString);

    return res.json({titleString, imageString, descriptionString});
});


const extractContent = (key, webContent) => {
    let ogTitleIndex = webContent.indexOf(key);
    let ogString = webContent.substring(ogTitleIndex + 8)
    let contentIndex = ogString.indexOf("=\"")
    let contentString = ogString.substring(contentIndex + 2);
    // console.log('showing content string ', contentString)
    let endingQuote = contentString.indexOf(`"`);
    console.log('showing ending quote index', endingQuote);
    let titleString = ogString.substring(contentIndex + 2, (endingQuote + contentIndex + 2) );
    // console.log('showing title string' ,titleString);
    return titleString;
}

module.exports = router;