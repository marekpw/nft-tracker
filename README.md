# LoopNFT.net source repository

This is the repository for [loopnft.net](https://loopnft.net). Please open an issue for any bugs/feature requests that you find.

## Structure

* The `src` directory contains the React application code bootstrapped with create-react-app.
* The netlify directory contains the background function code running as a serverless function in Netlify every 10 minutes.

## How it works

The Graph and Infura is scanned every 10 minutes for new NFT trades. Those are parsed and saved as JSON. Since Netlify does not have any file hosting (it can only build the app and deploy the dist dir, but there's no way to deploy any custom files programmatically i.e. from a serverless function), we "abuse" the GitHub API to commit the new JSON files back into the repository during each run. This causes Netlify to pick up the changes as a new CI/CD push and rebuild/redeploy the application.

## Contributing

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.
