import React, { Component } from 'react';
import { Platform, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
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
import { httpClient } from '../actions/httpClient';

class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {}
        };
    }

    componentDidMount = async () => {
    }

    _signIn = async () => {
        try {
            const user = await GoogleSignin.signIn();
            this.setState({ user });
            if (user && user.name) {
                console.log(`Got signed in user ${user.name}`);
                storage.save({key: 'loginState', data: user});
                storage.save({key: 'idToken', data: user.idToken});
                httpClient.defaults.headers.common['Authorization'] = `Bearer ${user.idToken}`;
                showMainApp();
            }
        } catch (error) {
            if (error.code === 'CANCELED') {
                this.setState({error: 'Please sigin with a Google Account'});
                // user cancelled the login flow
            } else {
                // some other error happened
                this.setState({error: 'Please sigin with a Google Account'});
            }
        }
    };

    render() {
        const { user } = this.state;
        return (
            <Container>
                <Content contentContainerStyle={{ flexBasis: '100%' }}>
                <ImageBackground source={require('../images/login_bg.jpg')} style={styles.imageBackdrop} >
                    <LinearGradient colors={['rgba(80,80,135, 0.9)', 'rgba(80,80,130, 0.8)', 'rgba(80,80,140, 0.7)']} style={styles.linearGradient} />
                    <View style={styles.loginContainer}>
                    <Icon name="pluse" ios="ios-pulse" style={styles.logo} />
                    <Text style={styles.title}>Foodbeazt</Text>
                    <Text style={styles.desc}>Store administrator App</Text>
                <Button style={styles.loginBtn} onPressOut={this._signIn}>
                <Icon name="logo-googleplus" style={styles.gplus}/>
                <Text style={styles.btnText}>Sign In with Google</Text>
                </Button>
                    </View>
                </ImageBackground>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        // backgroundColor: '#4F4D8D',
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageBackdrop: {
        width: null,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    linearGradient: {
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        position: 'absolute'
    },
    logo: {
        fontSize: 80,
        // color: 'transparent',
        color: 'white',
        fontWeight: '600'
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 10,
        marginBottom: 5
    },
    desc: {
        fontSize: 30,
        fontWeight: '200',
        color: 'white',
        marginBottom: 20
    },
    loginBtn: {
        width: 250,
        backgroundColor: 'white',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15
    },
    btnText: {
        color: '#4F4D8D'
    },
    gplus: {
        color: '#4F4D8D'
    }
});

function mapStateToProps(state, ownProps) {
    return {};
}

export default connect(mapStateToProps, null, null, { "withRef": true })(LoginScreen);
