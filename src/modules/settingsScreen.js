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
import { showLogin } from '../appNav';

class SettingsScreen extends Component {
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
            showLogin();
        } catch (error) {
            this.setState({
                error,
            });
        }
    };

    getCurrentUser = async () => {
        try {
            const user = await GoogleSignin.currentUserAsync();
            this.setState({ user });
        } catch (error) {
            console.error(error);
        }
    };

    componentDidMount = async () => {
        await this.getCurrentUser();
    }

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
                            <View>
                                <Text>Session is expired! Please login again</Text>
                            </View>
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

export default connect(mapStateToProps, null, null, { "withRef": true })(SettingsScreen);