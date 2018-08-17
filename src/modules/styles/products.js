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
    itemContainer: {
        height: 90,
        // width: 135,
        backgroundColor: '#FDFDFD',
        flexDirection: 'row',
        // justifyContent: 'flex-start',
        marginTop: 8,
        marginRight: 10,
        marginLeft: 10,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderLeftColor: '#B86EC4',
        borderLeftWidth: 5,
        borderRadius: 5,
    },
    itemLeftContainer: {
        width: 75,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    itemRightContainer: {
        borderLeftWidth: 1,
        borderLeftColor: '#CCC',
        paddingLeft: 10,
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    itemPrice:{
        fontSize: 16,
        fontWeight: '400',
        color: '#595E63'
    },
    itemName: {
        fontSize: 16,
        fontWeight: '400',
        color: '#595E63'
    },
    itemVarieties:{
        fontSize: 14,
        color: '#666'
    },
    itemCuisines:{
        fontSize: 14,
        color: '#aaa'
    },
    itemAvailability:{
        fontSize: 13,
        color: '#aaa'
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
        fontSize: 23,
        fontWeight: '800'
    },
    detailHeaderContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: 18,
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
