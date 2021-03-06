import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        backgroundColor: '#6566A0',
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
        justifyContent: 'flex-end',
        paddingBottom: 10
    },
    detailHeaderContainer: {
        justifyContent: 'space-between',
        alignItems: 'stretch',
    },
    statusIcon: {
        color: 'white',
        fontSize: 33,
        fontWeight: '800',
        marginRight: 10,
    },
    orderitems: {
        color: 'white',
        fontSize: 22
    },
    orderno: {
        color: 'white',
        fontSize: 28,
        fontWeight: '900',
        ...Platform.select({
            android: {
                fontSize: 23
            }
        })
    },
    timeago: {
        paddingVertical: 10,
        color: 'white',
        fontSize: 22,
        fontWeight: '700',
        ...Platform.select({
            ios: {
                fontSize: 14
            },
            android: {
                fontSize: 15
            }
        })
    },
    orderTotal: {
        color: 'white',
        fontSize: 28,
        fontWeight: '800',
        ...Platform.select({
            android: {
                fontSize: 23
            }
        })
    },
    statusNote: {
        marginTop: 15,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: '#eee'
    },
    progressBar: {
        backgroundColor: '#4B7AAC',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    seperator: {
        marginTop: 10,
        backgroundColor: '#8E8E8E'
    },
    listHeading: {
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 30
    },
    listHeadingLeft: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18
    },
    listHeadingRight: {
        color: 'white',
        ...Platform.select({
            ios: {
                fontSize: 15
            },
            android: {
                fontSize: 16
            }
        })
    },
    browseList: {
        marginTop: 30,
        paddingHorizontal: 16,
        ...Platform.select({
            ios: {
                marginBottom: 60
            },
            android: {
                marginBottom: 30
            }
        })
    },
    browseListItem: {
        ...Platform.select({
            ios: {
                paddingVertical: 8
            },
            android: {
                paddingVertical: 10
            }
        }),
        flexDirection: 'row'
    },
    browseListItemText: {
        flex: 1,
        color: 'white',
        paddingLeft: 10,
        ...Platform.select({
            ios: {
                fontSize: 15,
                fontWeight: '500'
            },
            android: {
                fontSize: 16,
                fontWeight: '100'
            }
        })
    }
});

export default styles;
