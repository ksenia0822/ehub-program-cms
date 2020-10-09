
var aws = require('aws-sdk');
require('dotenv').config(); // Configure dotenv to load in the .env file
// Configure aws with your accessKeyId and your secretAccessKey

const REGION = process.env.AWS_REGION_1;
aws.config.update({
    region: REGION, // Put your aws region here
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_1,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_1
});

const S3_BUCKET = process.env.AWS_BUCKET_1;


const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

var cors = require('cors');

app.use(cors());
app.use(express.json());

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/express_backend', (req, res) => {
    res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });

});


app.post('/sign_s3', (req, res) => {
    const s3 = new aws.S3();  // Create a new instance of S3
    const fileName = req.body.fileName;
    const fileType = req.body.fileType;
// Set up the payload of what we are sending to the S3 api
    const s3Params = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Expires: 500,
        ContentType: fileType,
        ACL: 'public-read'
    };

// Make a request to the S3 API to get a signed URL which we can use to upload our file
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if(err){
            console.log(err);
            res.json({success: false, error: err})
        }
        // Data payload of what we are sending back, the url of the signedRequest and a URL where we can access the content after its saved.
        const returnData = {
            signedRequest: data,
            url: `https://s3.${REGION}.amazonaws.com/${S3_BUCKET}/${fileName}`,
            s3Path: `https://s3.console.aws.amazon.com/s3/object/${S3_BUCKET}/${fileName}`
        };
        // Send it all back
        res.json({success:true, data:{returnData}});
    });
});

