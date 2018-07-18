import React, { Component } from 'react';
import {
    ImageBackground,
    RefreshControl,
    ScrollView,
    View,
    TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import { Container, Text, Button, Right, Left, Body, Content, Icon } from 'native-base';
import { showMainApp } from '../appNav';

class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {}
        };
    }

    _signOut = async () => {
        console.log('Sigining out user');
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            this.setState({ user: null });
        } catch (error) {
            this.setState({
                error,
            });
        }
    };

    getCurrentUser = async () => {
        try {
            const user = await GoogleSignin.currentUserAsync();
            if (user && user.name) {
                console.log(`Got signed in user ${user.name}`);
                showMainApp();
            }
            this.setState({ user });
        } catch (error) {
            console.error(error);
        }
    };

    componentDidMount = async () => {
        await this.getCurrentUser();
    }

    _signIn = async () => {
        try {
            const user = await GoogleSignin.signIn();
            this.setState({ user });
            if (user && user.name) {
                console.log(`Got signed in user ${user.name}`);
                showMainApp();
            }
        } catch (error) {
            if (error.code === 'CANCELED') {
                // user cancelled the login flow
            } else {
                // some other error happened
            }
        }
    };

    render() {
        const { user } = this.state;
        return (
            <Container>
                <Content contentContainerStyle={{ flexBasis: '100%' }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        {user && user.name && (
                            <View>
                                <Text>{user.name}</Text>
                                <Button onPressOut={this._signOut}>
                                    <Text>SignOut</Text>
                                </Button>
                            </View>
                        )}
                        {!user &&
                            <GoogleSigninButton
                                style={{ width: 312, height: 48 }}
                                size={GoogleSigninButton.Size.Icon}
                                color={GoogleSigninButton.Color.Light}
                                onPress={this._signIn} />
                        }
                    </View>
                </Content>
            </Container>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {};
}

export default connect(mapStateToProps, null, null, { "withRef": true })(LoginScreen);
