import { Platform, StyleSheet } from "react-native";

let appPaddingTop = 0;
let appPaddingBottom = 0;

if(Platform.OS === 'android') {
    appPaddingTop = 40;
    appPaddingBottom = 25;
}

const borderRadius = 6;
const padding = 15;
const margin = 10;

const white = '#ffffff';
const greyLight = '#eeeeee';
const greyDark = '#555555';
const black = '#000000';

const secondaryLight = '#abcdef';
const secondary = '#8abcde';

const thumbnailSize = 80;

const Styles = StyleSheet.create({
    appWrapper: {
        paddingTop: appPaddingTop,
        paddingBottom: appPaddingBottom,
        flexBasis: 20,
        flexGrow: 10,
        flexShrink: 0,
        backgroundColor: white,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        minWidth: '100%',
        flexBasis: 100
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
        display: 'flex'
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
        padding: padding,
        borderRadius: borderRadius,
        marginTop: margin,
        width: '100%',
        borderWidth: 2,
        borderColor: greyDark,
        maxWidth: '100%',
        minWidth: '100%'
    },
    listItemContent: {
        display: 'flex',
        flexDirection: 'row',
        flexBasis: 20,
        flex: 3,
        flexGrow: 10,
        gap: padding
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
        flexShrink: 1
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
    }
});

export default Styles;