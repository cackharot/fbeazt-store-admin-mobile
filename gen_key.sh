#!/bin/bash

keytool -genkey -v -keystore fsa-release-key.keystore -alias fsa-alias -keyalg RSA -keysize 2048 -validity 10000
