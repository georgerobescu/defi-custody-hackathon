## Installation
#####npm packages
To install all npm package dependencies run `yarn` command. 
##### API config
To configure `API` request URL change:
```
    REACT_APP_API_URL=http://localhost:5000/v1/
```
At [.env.development](./.env.development) and [.env.production](./.env.production)
for development and production correspondingly.
##### Smart contracts
Make sure smart contract [deployed](../README.md)
## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

## Deployment

In order to deploy project, should be generated `build` through `yarn build` 
and run any server that will return `build/index.html` to all `Get` requests.