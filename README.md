A react app that uploads files to S3. 

Add an .env file with the following properties to the root directory. Make sure it is in .gitignore.

AWS_ACCESS_KEY_ID="..."

AWS_SECRET_ACCESS_KEY="..."

AWS_AWS_BUCKET="..."

AWS_REGION="..."

You need to run chrome with --disable-web-security on dev machine, on MAC the command is 

open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security

## Run the app

Run the following in the separate terminals

### `yarn start`

### `cd src && node server.js`

Your express server will run on port 3001 and react app on port 3000