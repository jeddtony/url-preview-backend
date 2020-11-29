const router = require('express').Router();

const axios = require('axios');

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

    // let titleString = extractContent("og:title", webContent);
    let titleString = getTitle(webContent);
    console.log('showing this title string ', titleString);
    // let imageString = extractContent("og:image", webContent);
    let imageString = getImage(webContent);
    console.log("showing image url ", imageString);

    // let descriptionString = extractContent("og:description", webContent);
    let descriptionString = getDescription(webContent);
    console.log("showing the description ", descriptionString);

    return res.json({titleString, imageString, descriptionString});
});

router.get("/jed", (req, res) => {
    res.send("This is the url previewer backend");
});

const extractContent = (key, webContent) => {
    let ogTitleIndex = webContent.indexOf(key);
    console.log('showing the index of ', key, ogTitleIndex);
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

const getTitle = (webContent) => {
    let key = "og:title";
    let ogTitleIndex = webContent.indexOf(key);
    console.log('showing the index of ', key, ogTitleIndex);
    let titleString;
    if (ogTitleIndex !== -1){
       return searchForOgTitle(webContent, ogTitleIndex);
    }
     titleString = searchForTitleTag(webContent);
    return titleString
    
}

const searchForOgTitle = (webContent, ogTitleIndex) => {
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

const searchForTitleTag = (webContent) => {
    let openingTag = webContent.indexOf('<title>');
    let closingTag = webContent.indexOf('</title>');

    let stringLengthOfTitleTag = 7;
    let titleString = webContent.substring(openingTag + stringLengthOfTitleTag, closingTag);
    return titleString
}

const getDescription = (webContent) => {
    let key = 'og:description';
    let ogDescriptionIndex = webContent.indexOf(key);
    console.log('showing the index of ', key, ogDescriptionIndex);
    let descriptionString;
    if(ogDescriptionIndex !== -1){
        descriptionString = searchForOgDescription(webContent, ogDescriptionIndex);
    }
    descriptionString = searchForMetaDescription(webContent);
    return descriptionString;
}

const searchForOgDescription = (webContent, ogDescriptionIndex) => {
    let ogString = webContent.substring(ogDescriptionIndex + 15)
    let contentIndex = ogString.indexOf("=\"")
    let contentString = ogString.substring(contentIndex + 2);
    let endingQuote = contentString.indexOf(`"`);
    console.log('showing ending quote index', endingQuote);
    let titleString = ogString.substring(contentIndex + 2, (endingQuote + contentIndex + 2) );
    
    return titleString;
}

const searchForMetaDescription = (webContent) => {
    let key = "name=\"description\"";
    let metaDescIndex = webContent.indexOf(key);
    console.log('showing metaDescIndex ', metaDescIndex);
    let metaDescSubstring = webContent.substring(metaDescIndex + 18)
    let descriptionContentIndex = metaDescSubstring.indexOf('content=\"');
    console.log('index of description content ', descriptionContentIndex);
    let descriptionContent = metaDescSubstring.substring(descriptionContentIndex + 9); // 9 is the length of the word content=
    let endingQuote = descriptionContent.indexOf("\"");
    let finalDescriptionContent = descriptionContent.substring(0, endingQuote);

    return finalDescriptionContent;
}

const getImage = (webContent) => {
    let key = "favicon";
    let faviconIndex = webContent.indexOf(key);
    console.log('showing the favicon index ', faviconIndex);
    let firstPartOfString = webContent.substring(0, faviconIndex);
    let hrefIndex = firstPartOfString.lastIndexOf('href=');
    let closingQuote = webContent.substring(faviconIndex).indexOf("\"");
    console.log('show closing quote ', closingQuote);
    let imageString = webContent.substring(hrefIndex + 6, firstPartOfString.length + closingQuote);
    console.log('showing the image String ', imageString);
    return imageString;
}

module.exports = router;