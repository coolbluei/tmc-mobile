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
        flex: 1,
        flexBasis: 20,
        flexGrow: 10,
        flexShrink: 0,
        backgroundColor: white,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        flexBasis: 100
    },
    container: {
        flex: 1,
        flexBasis: 20,
        flexGrow: 10,
        flexShrink: 0,
        backgroundColor: white,
        justifyContent: 'start',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        maxWidth: '100%',
        flexBasis: 100,
        margin: margin,
        overflow: 'scroll'
    },
    input: {
        height: 40,
        marginTop: 12,
        marginBottom: 12,
        borderWidth: 1,
        padding: 10,
        width: 200,
    },
    navbar: {
        flex: 1,
        flexBasis: 1,
        flexShrink: 1,
        flexGrow: 0,
        padding: padding,
        borderTopColor: greyDark,
        borderTopWidth: 1,
        width: '100%',
    },
    navbarItems: {
        flex: 1,
        flexDirection: 'row',
        gap: 60,
        width: '100%',
        justifyContent: 'center'
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
    listItem: {
        backgroundColor: greyLight,
        padding: padding,
        borderRadius: borderRadius,
        marginTop: margin,
        display: 'flex',
        flexDirection: 'row',
        gap: padding,
        width: '100%',
        borderWidth: 2,
        maxWidth: '100%',
        flexShrink: 1,
        overflow: 'hidden'
    },
    pageTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: margin
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        whiteSpace: 'wrap'
    },
    playerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        whiteSpace: 'wrap',
        width: '100%',
        textAlign: 'center'
    },
    playerControls: {
        display: 'flex',
        flexDirection: 'row',
        gap: padding
    },
    listItemImage: {
        height: thumbnailSize,
        width: thumbnailSize
    }
});

export default Styles;