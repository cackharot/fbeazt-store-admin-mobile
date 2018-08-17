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
    statusIcon: {
        color: 'white',
        fontSize: 33,
        fontWeight: '800',
        marginRight: 10,
    },
    itemPrice: {
        paddingTop: 13,
        color: 'white',
        fontSize: 20,
        fontWeight: '800'
    },
    itemName: {
        color: 'white',
        fontSize: 20,
        fontWeight: '900',
        flexWrap: 'wrap',
        flex: 1
    },
    itemVarieties: {
        fontSize: 18,
        color: 'white',
    },
    itemCuisines: {
        fontSize: 16,
        paddingVertical: 10,
        color: 'white',
        fontWeight: '700',
    },
    itemAvailability: {
        fontSize: 18,
        color: '#aaa'
    },
    timeago: {
        paddingVertical: 10,
        color: 'white',
        fontSize: 18,
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
    detailHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        paddingHorizontal: 18
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
