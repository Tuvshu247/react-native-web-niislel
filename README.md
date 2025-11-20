# НИТХ-н апп React Native CLI

Анх өөр дээрээ clone хийсэн бол macOS ruby gem-ээ update хийх шаардлагатай

Terminal-аа 2 хувааж байгаад, эхлээд dev server-ээ асаагаад

### Start Metro

```sh
npm start
```

Дараа нь аль OS дээр ажиллуулхаа шийдээд асаана

### Android & iOS

```sh
npm run ios
npm run android
```

## DEPLOYMENT

### Android

```sh
android/app/build.gradle

versionCode 1
versionName "1.0.0"
```

Шинэ release болгон дээр өөрчлөгдөх шаардлагатай. Тэгээд бусад нь тохируулагдцан байгаа.

```sh
cd android
./gradlew bundleRelease
```

Тэгээд энд .aab file ороод ирнэ.

```sh
android/app/build/outputs/bundle/release/app-release.aab
```

### iOS

Одоохондоо би л чаднадаа... Apple account edree macOS дээрээ тохируулаад XCode эдр татаад бөөн л юм болды.
Тэгээд эхний хэдэн тохиргоогоо хииж чадвал

```sh
cd ios
```

```sh
niislelApp.xcworkspace
```

дээр mouse 2 дараад reveal finder гээд xcworkspace дээр дараад xcode руу ороод version-г өөрчлөөд

```sh
Product > Archive
```

Build хийж дууссаны дараа

```sh
Distribute App > App Store Connect > Distribute
```

Тэгээл ямар нэг алдаа гарахгүй бол connect дотор чинь ороод ирнэ.
