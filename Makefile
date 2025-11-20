run-ios:
	npx react-native run-ios

run-android:
	npx react-native run-android

pod-install:
	cd ios/ && pod install && cd ..

clean-ios:
	cd ios/ && rm -rf Pods Podfile.lock && rm -rf ~/Library/Developer/Xcode/DerivedData && pod install --repo-update && cd ..

build-android:
	cd android && ./gradlew clean
	cd ..
