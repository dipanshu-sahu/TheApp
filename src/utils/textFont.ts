const fontFamily = {
  regular: 'Nunito-Regular',
  bold: 'Nunito-Bold',
} as const;

export const textFont = {
  regularXXXS: { fontFamily: fontFamily.regular, fontSize: 8  },
  regularXXS:  { fontFamily: fontFamily.regular, fontSize: 10 },
  regularXS:   { fontFamily: fontFamily.regular, fontSize: 12 },
  regularS:    { fontFamily: fontFamily.regular, fontSize: 14 },
  regularM:    { fontFamily: fontFamily.regular, fontSize: 16 },
  regularL:    { fontFamily: fontFamily.regular, fontSize: 18 },
  regularXL:   { fontFamily: fontFamily.regular, fontSize: 20 },
  regularXXL:  { fontFamily: fontFamily.regular, fontSize: 22 },
  regularXXXL: { fontFamily: fontFamily.regular, fontSize: 24 },
  boldXXXS:    { fontFamily: fontFamily.bold,    fontSize: 8  },
  boldXXS:     { fontFamily: fontFamily.bold,    fontSize: 10 },
  boldXS:      { fontFamily: fontFamily.bold,    fontSize: 12 },
  boldS:       { fontFamily: fontFamily.bold,    fontSize: 14 },
  boldM:       { fontFamily: fontFamily.bold,    fontSize: 16 },
  boldL:       { fontFamily: fontFamily.bold,    fontSize: 18 },
  boldXL:      { fontFamily: fontFamily.bold,    fontSize: 20 },
  boldXXL:     { fontFamily: fontFamily.bold,    fontSize: 22 },
  boldXXXL:    { fontFamily: fontFamily.bold,    fontSize: 24 },
} as const;
