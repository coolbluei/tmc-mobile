import { Platform, StyleSheet } from "react-native";

let appPaddingTop = 0;
let appPaddingBottom = 25;

if(Platform.OS === 'android') {
    appPaddingTop = 40;
}

const borderRadius = 6;
const padding = 15;
const margin = 10;

const white = '#ffffff';
const greyLight = '#eeeeee';
const greyMedium = '#aaaaaa';
const greyDark = '#555555';
const black = '#000000';
const overlay = 'rgba(0, 0, 0, 0.8)';

const secondaryLight = '#abcdef';
const secondary = '#8abcde';

const thumbnailSize = 80;

const Styles = StyleSheet.create({
    appWrapper: {
        flex: 1,
        paddingTop: appPaddingTop,
        paddingBottom: appPaddingBottom,
        flexBasis: 20,
        flexGrow: 10,
        flexShrink: 0,
        backgroundColor: white,
        justifyContent: 'center',
    },
    container: {
        flexBasis: 20,
        flexGrow: 10,
        flexShrink: 0,
        backgroundColor: white,
        justifyContent: 'start',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        minWidth: '100%',
        flexBasis: 100,
        overflow: 'scroll',
        display: 'flex',
        flex: 1
    },
    scroll: {
        width: '100%',
        minWidth: '100%'
    },
    input: {
        height: 40,
        marginTop: margin,
        marginBottom: margin,
        borderWidth: 1,
        padding: margin,
        width: 200,
        paddingVertical: 0,
        paddingHorizontal: margin,
        paddingRight: margin,
        paddingLeft: margin,
        borderRadius: borderRadius
    },
    navbar: {
        display: 'flex',
        padding: padding,
        borderTopColor: greyDark,
        borderTopWidth: 1,
        width: '100%',
    },
    navbarItems: {
        display: 'flex',
        flexDirection: 'row',
        gap: 60,
        width: '100%',
        justifyContent: 'center'
    },
    content: {
        flexGrow: 10
    },
    navbarItem: {
        color: greyDark
    },
    highlight: {
        backgroundColor: secondaryLight,
        padding: padding,
        margin: margin,
        borderColor: secondary,
        borderWidth: 3,
        borderRadius: borderRadius
    },
    padded: {
        paddingLeft: padding,
        paddingRight: padding
    },
    listItem: {
        backgroundColor: greyLight,
        width: '100%',
        borderTopWidth: 1,
        borderColor: greyMedium,
        maxWidth: '100%',
        minWidth: '100%'
    },
    listItemContent: {
        display: 'flex',
        flexDirection: 'row',
        flexBasis: 20,
        flex: 3,
        flexGrow: 10,
        gap: padding,
        padding: padding,
        backgroundColor: greyLight
    },
    pageTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: margin
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        whiteSpace: 'wrap',
        flexWrap: 'wrap',
        flexShrink: 1,
    },
    listTitle: {
        flexGrow: 1
    },
    player: {
        width: '100%',
        padding: padding,
        borderTopWidth: 1,
        borderTopColor: greyDark,
        flexShrink: 10
    },
    playerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        minWidth: '100%',
        textAlign: 'center',
    },
    playerControls: {
        display: 'flex',
        flexDirection: 'row',
        gap: 30
    },
    listItemImage: {
        height: thumbnailSize,
        width: thumbnailSize,
        borderWidth: 1,
        borderColor: greyDark,
        borderRadius: borderRadius
    },
    inactive: {
        color: '#cdcdcd'
    },
    alignCenter: {
        alignItems: 'center'
    },
    deleteButton: {
        backgroundColor: '#f01132',
        padding: padding,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInverted: {
        color: white
    },
    textBig: {
        fontSize: 18
    },
    favorite: {
        color: '#f52558'
    },
    downloaded: {
        color: '#549441'
    },
    download: {
        color: '#3b69d4'
    },
    isDownloading: {
        color: greyMedium
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: overlay
    }
});

export default Styles;