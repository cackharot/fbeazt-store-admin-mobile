#!/bin/bash

keytool -exportcert -list -v -alias fsa-alias -keystore android/app/fsa-release-key.keystore
