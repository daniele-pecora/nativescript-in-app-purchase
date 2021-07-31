# DEMO

This nativescript plugin contains an app that has to  
be published at least to a closed release track for  
testint in app purchases.


### Product IDs list

Since the app stores do not provide a service to request all available products,  
the product IDs must be provided by the implementor it self.  
This app does request the product IDs remotely via http GET request.  
The url to this remote service is defined platform specific files in folder [`./demo/src/settings`](./demo/src/settings).  

- [settings.common.ts](./demo/src/settings/settings.common.ts) (Shared)
- [settings.ts](./demo/src/settings/settings.ts) (Global - _is unused_)
- [settings.android.ts](./demo/src/settings/settings.android.ts) (for Android)
- [settings.ios.ts](./demo/src/settings/settings.ios.ts) (for iOS)
    
The result must be a JSON of type [`ProductIDListings`](./demo/src/app/products/products.model.ts)  
described in [products.model.ts](./demo/src/app/products/products.model.ts)

Here an example JSON
```json
    {
        "test_level_1": {
            "id": "test_level_1",
            "consumable": false,
            "description": "description is optional"
        },
        "test_moneybag_1": {
            "id": "test_moneybag_1",
            "consumable": true,
            "description": "description is optional"
        }
    }
```

Note:   
This demo uses the remote JSON storage [jsonblob.com](https://jsonblob.com) to hold the product lists.   
See also [./demo-resources/in-app-purchases-json/README.md](./demo-resources/in-app-purchases-json/README.md)

### Build or run demo

First of all `cd` into `src` directory:
```bash
    $ cd src/
```


## The demo app

### Run 

To run the angular demo with android

```bash
    $ npm run demo.android
```

To debug the angular demo with android

```bash
    $ npm run demo.android.debug
```

For IOS simply change `android` with `ios` like 

```bash
    $ npm run demo.ios
```

### Release build 

#### Android
Create release build APK

```bash
    tns build android --release \
    --key-store-path <path> \
    --key-store-password <pass> \
    --key-store-alias <alias> \
    --key-store-alias-password <pass> \
    --copy-to <path>/app-id.apk
```

In case the app is too big Google Play Store requires to upload an Android App Bundle instead of an APK

Create release build Android App Bundle

```bash
    tns build android --release \
    --key-store-path <path> \
    --key-store-password <pass> \
    --key-store-alias <alias> \
    --key-store-alias-password <pass> \
    --aab \
    --copy-to <path>/app-id.aab
```


###### Version counter

You might execute this inside you project dir to automated counting up the version code

```bash
    node -e "\
    let a='app/App_Resources';try{a=(JSON.parse(require('fs').readFileSync('nsconfig.json'))||{}).appResourcesPath||''}catch(e){};\
    var aManifest=a+'/Android/src/main/AndroidManifest.xml';\
    var fs=require('fs');\
    var xml=fs.readFileSync(aManifest,'utf8');\
    var _xs;var _xv=xml;_xv=_xv.substring(_xs=_xv.indexOf('android:versionCode=\"')+'android:versionCode=\"'.length,_xv.indexOf('\"',_xs)).trim();\
    var newXML=xml.replace(new RegExp('(.*)(android:versionCode=\")([0-9]*)(\")(.*)','g'),'\$1\$2'+'__VERSION__'+'\$4\$5');\
    var version=Number.parseInt(_xv)+1;\
    newXML=newXML.replace('__VERSION__',version);\
    fs.writeFileSync(aManifest,newXML);\
    console.log(version);\
    "
```

here a one line as script for the `package.json`

```bash
    "bump-version-android" : "node -e \"let a='app\/App_Resources';try{a=(JSON.parse(require('fs').readFileSync('nsconfig.json'))||{}).appResourcesPath||''}catch(e){};var aManifest=a+'\/Android\/src\/main\/AndroidManifest.xml';var fs=require('fs');var xml=fs.readFileSync(aManifest,'utf8');var _xs;var _xv=xml;_xv=_xv.substring(_xs=_xv.indexOf('android:versionCode=\\\"')+'android:versionCode=\\\"'.length,_xv.indexOf('\\\"',_xs)).trim();var newXML=xml.replace(new RegExp('(.*)(android:versionCode=\\\")([0-9]*)(\\\")(.*)','g'),'\\$1\\$2'+'__VERSION__'+'\\$4\\$5');var version=Number.parseInt(_xv)+1;newXML=newXML.replace('__VERSION__',version);fs.writeFileSync(aManifest,newXML);console.log(version);\""
```

#### IOS

You might execute this inside you project dir to automated counting up the version code

```bash
    node -e "\
    let a='app/App_Resources';try{a=(JSON.parse(require('fs').readFileSync('nsconfig.json'))||{}).appResourcesPath||''}catch(e){};\
    var aManifest=a+'/iOS/Info.plist';\
    var fs=require('fs');\
    var xml=fs.readFileSync(aManifest,'utf8');\
    var _xs;var _xv=xml;_xv=_xv.substring(_xs=_xv.indexOf('CFBundleVersion</key>')+'CFBundleVersion</key>'.length,_xv.indexOf('</string>',_xs)).replace('<string>','').replace('</string>','').trim();\
    var newXML=xml.replace(new RegExp('(.*)(<key>CFBundleVersion</key>)([\n\r\t])*(<string>)(.*)(</string>)',''),'\$1\$2\$3\n\t\$4__VERSION__\$6');\
    var _xva=_xv.split('.');\
    _xva[_xva.length-1]=Number.parseInt(_xva[_xva.length-1])+1;\
    var version=_xva.join('.');\
    newXML=newXML.replace('__VERSION__',version);\
    fs.writeFileSync(aManifest,newXML);\
    console.log(version);"
```


here a one line as script for the `package.json`

```bash
    "bump-version-ios" : "node -e \"let a='app\/App_Resources';try{a=(JSON.parse(require('fs').readFileSync('nsconfig.json'))||{}).appResourcesPath||''}catch(e){};var aManifest=a+'\/iOS\/Info.plist';var fs=require('fs');var xml=fs.readFileSync(aManifest,'utf8');var _xs;var _xv=xml;_xv=_xv.substring(_xs=_xv.indexOf('CFBundleVersion<\/key>')+'CFBundleVersion<\/key>'.length,_xv.indexOf('<\/string>',_xs)).replace('<string>','').replace('<\/string>','').trim();var newXML=xml.replace(new RegExp('(.*)(<key>CFBundleVersion<\/key>)([\\n\\r\\t])*(<string>)(.*)(<\/string>)',''),'\\$1\\$2\\$3\\n\\t\\$4__VERSION__\\$6');var _xva=_xv.split('.');_xva[_xva.length-1]=Number.parseInt(_xva[_xva.length-1])+1;var version=_xva.join('.');newXML=newXML.replace('__VERSION__',version);fs.writeFileSync(aManifest,newXML);console.log(version);\""
```