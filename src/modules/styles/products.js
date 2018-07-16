import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        // backgroundColor: '#6566A0',
        ...Platform.select({
            ios: {
                // paddingTop: 64
            }
        })
    },
    orderDetailsContainer: {
        backgroundColor: '#6566A0',
    },
    linearGradient: {
        top: 0,
        left: 0,
        right: 0,
        height: 248,
        position: 'absolute'
    },
    imageBackdrop: {
        height: 200,
        width: null,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        paddingBottom: 20
    },
    price: {
        paddingTop: 13,
        color: 'white',
        fontSize: 28,
        fontWeight: '800'
    },
    progressBar: {
        backgroundColor: '#4B7AAC',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    seperator: {
        // marginTop: 10,
        backgroundColor: '#8E8E8E'
    },
});

export default styles;
