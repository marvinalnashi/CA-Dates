import {
    Black,
    BORDER,
    BUBBLELEFT,
    BUBBLERIGHT,
    INFOTEXTCOLOR,
    LIGHTWHITE,
    BLUE,
    PRIMARYB,
    TEXTCOLOR,
    TIMETEXTCOLOR,
    White,
} from './constants';

export const THEMES = [
  {
    key: 'LIGHT',
    container: {
      backgroundColor: White,
      headerTextColor: Black,
    },
    backgroundColor: White,
    primaryBackgroundColor: PRIMARYB,
    primaryColor: BLUE,
    subPrimaryColor: INFOTEXTCOLOR,
    secondaryColor: TEXTCOLOR,
    subSecondaryColor: TIMETEXTCOLOR,
    blueColor: BLUE,
    borderColor: BORDER,
    textInputBackgroundColor: LIGHTWHITE,
    chatTheme: {
      backgroundColor: Black,
      left: {
        wrapper: {
          backgroundColor: BUBBLELEFT
        },
        text: {
          color: Black
        }
      },
      right: {
        wrapper: {
          backgroundColor: BUBBLERIGHT
        },
        text: {
          color: White
        }
      },
    }
  },
];
