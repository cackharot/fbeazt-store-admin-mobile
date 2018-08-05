import React, { Component } from 'react';
import {
    StyleSheet,
    ImageBackground,
    RefreshControl,
    ScrollView,
    View,
    TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import { Root, Container, Text, Button, Right, Left, Body, Content, Icon } from 'native-base';
import { Thumbnail, Separator, Header, List, ListItem, Switch } from 'native-base';
import { showLogin } from '../appNav';
import ProgressBar from './components/progressBar';

class SettingsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            error: null
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
                error
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

    getUserStore = async () => {
        const store = await storage.load({key: 'userStore', autoSync: false, syncInBackgroud: false});
        this.setState({store});
    }

    componentDidMount = async () => {
        await this.getCurrentUser();
        await this.getUserStore();
    }

    render() {
        const { user, store } = this.state;
        return (
            this.state.isLoading ? <View style={styles.progressBar}><ProgressBar /></View> :
            <Container>
                {user && user.name && store && (
                   <Content>
                        <View style={styles.profileContainer}>
                            <Thumbnail source={{ uri: user.photo }} />
                            <Text>{user.givenName}</Text>
                        </View>
                        <Separator>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name="person" style={{ fontSize: 22, marginRight: 10 }} />
                        <Text>Admin of store:</Text>
                        </View>
                        </Separator>
                        <ListItem>
                            <Body>
                                <Text>{store.name}</Text>
                                <Text note>{store.address}</Text>
                            </Body>
                        </ListItem>
                        <ListItem icon>
                            <Left>
                                <Button style={{ backgroundColor: "#3187F0" }}>
                                    <Icon active name="cut" />
                                </Button>
                            </Left>
                            <Body>
                                <Text>Discount</Text>
                            </Body>
                            <Right>
                                <Text note>{store.given_discount}%</Text>
                            </Right>
                        </ListItem>
                        <ListItem icon button onPressOut={this._signOut}>
                            <Left>
                                <Button style={{ backgroundColor: "#F7403D" }}>
                                    <Icon active name="log-out" />
                                </Button>
                            </Left>
                            <Body>
                                <Text>Logout</Text>
                            </Body>
                        </ListItem>
                    </Content>
                )}
            {(!user || !store) && (
                    <Content contentContainerStyle={{ flexBasis: '100%' }}>
                        <Text>Session is expired! Please login again</Text>
                    </Content>
            )}
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    profileContainer: {
        marginTop: 30,
        borderBottomWidth: 1,
        borderColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 20
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

export default connect(mapStateToProps, null, null, { "withRef": true })(SettingsScreen);
