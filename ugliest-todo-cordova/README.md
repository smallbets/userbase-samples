# Ugly Cordova To-Do App

This guide will get you up and running creating a mobile app using only static JavaScript, HTML, and CSS. The app will be complete with user accounts and end-to-end encrypted user data persistence.

It will be virtually identical to our other ugly to-do apps [you may be familiar with](https://github.com/smallbets/userbase-samples#ugliest-todo), the difference being that the final product will be a native iOS or Android app.

## Create a Cordova App

Follow the steps [here](https://cordova.apache.org/docs/en/latest/guide/cli/index.html) to create your first Cordova app. The platforms we'll be targeting are `ios` and `android`.

<i>A warning: if you're new to Cordova, it could take a bit to get all the dependencies set up, but once set up, you'll be slinging mobile apps in no time.</i>

## Install the Userbase plugin

```
cordova plugin add cordova-plugin-userbase
```

## Overwrite the www/index.html file

Copy the `index.html` file in this repo at [./www/index.html](./www/index.html), and overwrite the one in your mock Cordova app.

## Set your App ID

[Create a free Userbase admin account](https://v1.userbase.com/#create-admin). In your Userbase admin account, you will find a Trial app. Get its App ID, and replace [line 54 of the index.html file](./www/index.html#L54) with it:

```
...

function onDeviceReady() {
  userbase.init({ appId: '<YOUR APP ID>' })

...
```

## And you're ready!

Build and run the app:

```
cordova build
cordova run android
cordova run ios
```

## Misc.

Check out the [Userbase quickstart](https://userbase.com/docs/) for finer details on writing the `index.html` file from scratch. It explains each section of the code step-by-step. The only differences between this repo's `index.html` file and the `index.html` file in the quickstart are:

- The script tag at the top  - <i>this repo's `index.html` uses `cordova.js` to load the Userbase plugin</i>.
- The `onDeviceReady` event listener - <i>Cordova fires this once it finishes setting up the app</i>.