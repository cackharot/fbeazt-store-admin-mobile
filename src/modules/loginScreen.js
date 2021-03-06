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
import { setupNotification } from '../pushNotification';
import ProgressBar from './components/progressBar';

class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            user: {},
            error: null
        };
    }

    componentDidMount = async () => {
        console.log('Getting already signed in user.');
        GoogleSignin.currentUserAsync().then((user) => {
            this.checkUser(user).then((res) => {
                this.setState({isLoading: false});
                if(!res.error && showMainApp());
            });
        }).catch((e) => {
            console.log(`No already sign in user found: ${e}`);
            this.setState({isLoading: false});
        });
    }

    checkUser = async (user) => {
        if (!user || !user.idToken || user.idToken.length === 0) {
            return { error: `Login attempt failed!` };
        }
        this.setState({ user });
        storage.save({key: 'loginState', data: user});
        storage.save({key: 'idToken', data: user.idToken});
        const authToken = `Bearer ${user.idToken}`;
        httpClient.defaults.headers.common['Authorization'] = authToken;
        const stores = await this.getStores(authToken);
        if(stores && stores.length > 0) {
            const store = stores[0];
            storage.save({key: 'userStore', data: store});
            setupNotification(user.email);
            return {};
        }else{
            await GoogleSignin.revokeAccess();
            return { error: `Unauthorized! ${user.name} is not a store admin!` };
        }
    }

    getStores = async (authToken) => {
        return httpClient.get(`/user_stores`)
            .then(res => res.data)
            .catch(error=> {
                console.log(JSON.stringify(error));
            });
    }

    _signIn = async () => {
        this.setState({isLoading: true});
        try {
            const user = await GoogleSignin.signIn();
            const res = await this.checkUser(user);
            if(!res.error){
                showMainApp();
            }else{
                this.setState({isLoading: false});
                this.setState({error: res.error});
            }
        } catch (error) {
            this.setState({isLoading: false});
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
        const { isLoading, error } = this.state;
        return (
            isLoading ? <View style={styles.progressBar}><ProgressBar /></View> :
            <Container>
                <Content contentContainerStyle={{ flexBasis: '100%' }}>
                <ImageBackground source={require('../images/login_bg.jpg')} style={styles.imageBackdrop} >
                    <LinearGradient colors={['rgba(80,80,135, 0.9)', 'rgba(80,80,130, 0.8)', 'rgba(80,80,140, 0.7)']} style={styles.linearGradient} />
                    <View style={styles.loginContainer}>
                    <Icon name="ios-pulse" style={styles.logo} />
                    <Text style={styles.title}>Foodbeazt</Text>
                    <Text style={styles.desc}>Store administrator App</Text>
                    <Button style={styles.loginBtn} onPressOut={this._signIn}>
                        <Icon name="logo-googleplus" style={styles.gplus}/>
                        <Text style={styles.btnText}>Sign In with Google</Text>
                    </Button>
                { error && error.length > 0 && (
                        <View style={styles.errorContainer}>
                            <Text note style={styles.errorText}>{error}</Text>
                        </View>
                )}
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
    errorContainer:{
        marginTop: 20
    },
    errorText:{
        color: '#FDFDFD'
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
    },
    progressBar: {
        backgroundColor: '#4B7AAC',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

function mapStateToProps(state, ownProps) {
    return {};
}

export default connect(mapStateToProps, null, null, { "withRef": true })(LoginScreen);
