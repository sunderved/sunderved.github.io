
var cities = {
	V1   : 'Seattle',
	V18  : 'Portland',
	V21  : 'Helena',
	V25  : 'Bismarck',
	V28  : 'Duluth',
	V46  : 'Minneapolis',
	V51  : 'Buffalo',
	V53  : 'Boston',
	V54  : 'Medford',
	V66  : 'Chicago',
	V75  : 'Salt Lake City',
	V80  : 'Omaha',
	V88  : 'New York',
	V90  : 'Sacramento',
	V95  : 'Denver',
	V103 : 'Cincinnati',
	V105 : 'Washington',
	V108 : 'San Francisco',
	V117 : 'Kansas City',
	V119 : 'St Louis',
	V141 : 'Richmond',
	V149 : 'Santa Fe',
	V152 : 'Oklahoma City',
	V158 : 'Winston',
	V163 : 'Los Angeles',
	V165 : 'Phoenix',
	V173 : 'Memphis',
	V182 : 'San Diego',
	V189 : 'Dallas',
	V193 : 'Atlanta',
	V195 : 'Charleston',
	V203 : 'El Paso',
	V225 : 'Houston',
	V227 : 'New Orleans',
	V230 : 'Jacksonville'
}

var g = [];

function initGraph()
{
	g	= new Graph();
		
	g.addVertex('V1', {V2: 1, V18: 1, V19: 2});
	g.addVertex('V2', {V1: 1, V3: 1, V19: 1, V20: 1});
	g.addVertex('V3', {V2: 1, V4: 1, V20: 2, V21: 1});
	g.addVertex('V4', {V3: 1, V5: 1, V21: 1, V22: 1});
	g.addVertex('V5', {V4: 1, V6: 1, V22: 2, V23: 2});
	g.addVertex('V6', {V5: 1, V7: 1, V23: 2, V24: 2});
	g.addVertex('V7', {V6: 1, V8: 1, V24: 2, V25: 1});
	g.addVertex('V8', {V7: 1, V9: 1, V25: 1, V26: 1});
	g.addVertex('V9', {V8: 1, V10: 1, V26: 1, V27: 1});
	g.addVertex('V10', {V9: 1, V27: 1, V28: 1});
	g.addVertex('V18', {V1: 1, V19: 2, V36: 1, V37: 2});
	g.addVertex('V19', {V1: 2, V2: 1, V18: 2, V20: 1, V37: 1, V38: 1});
	g.addVertex('V20', {V2: 1, V3: 2, V19: 1, V21: 2, V38: 1, V39: 1});
	g.addVertex('V21', {V3: 1, V4: 1, V20: 2, V22: 2, V39: 2, V40: 1});
	g.addVertex('V22', {V4: 1, V5: 2, V21: 2, V23: 1, V40: 2, V41: 1});
	g.addVertex('V23', {V5: 2, V6: 2, V22: 1, V24: 1, V41: 1, V42: 1});
	g.addVertex('V24', {V6: 2, V7: 2, V23: 1, V25: 2, V42: 1, V43: 1});
	g.addVertex('V25', {V7: 1, V8: 1, V24: 2, V26: 1, V43: 2, V44: 1});
	g.addVertex('V26', {V8: 1, V9: 1, V25: 1, V27: 1, V44: 1, V45: 1});
	g.addVertex('V27', {V9: 1, V10: 1, V26: 1, V28: 2, V45: 1, V46: 1});
	g.addVertex('V28', {V10: 1, V27: 2, V29: 1, V46: 2, V47: 1});
	g.addVertex('V29', {V28: 1, V47: 1, V48: 1});
	g.addVertex('V33', {V34: 1, V51: 1, V52: 1});
	g.addVertex('V34', {V33: 1, V52: 1, V53: 1});
	g.addVertex('V36', {V18: 1, V37: 2, V54: 1});
	g.addVertex('V37', {V18: 2, V19: 1, V36: 2, V38: 1, V54: 2, V55: 1});
	g.addVertex('V38', {V19: 1, V20: 1, V37: 1, V39: 1, V55: 1, V56: 1});
	g.addVertex('V39', {V20: 1, V21: 2, V38: 1, V40: 2, V56: 1, V57: 1});
	g.addVertex('V40', {V21: 1, V22: 2, V39: 2, V41: 2, V57: 1, V58: 1});
	g.addVertex('V41', {V22: 1, V23: 1, V40: 2, V42: 1, V58: 2, V59: 1});
	g.addVertex('V42', {V23: 1, V24: 1, V41: 1, V43: 1, V59: 1, V60: 1});
	g.addVertex('V43', {V24: 1, V25: 2, V42: 1, V44: 2, V60: 1, V61: 1});
	g.addVertex('V44', {V25: 1, V26: 1, V43: 2, V45: 1, V61: 2, V62: 1});
	g.addVertex('V45', {V26: 1, V27: 1, V44: 1, V46: 1, V62: 1, V63: 1});
	g.addVertex('V46', {V27: 1, V28: 2, V45: 1, V47: 2, V63: 1, V64: 1});
	g.addVertex('V47', {V28: 1, V29: 1, V46: 2, V48: 1, V64: 2, V65: 1});
	g.addVertex('V48', {V29: 1, V47: 1, V65: 1, V66: 1});
	g.addVertex('V51', {V33: 1, V52: 1, V68: 1, V69: 1});
	g.addVertex('V52', {V33: 1, V34: 1, V51: 1, V53: 1, V69: 1, V70: 1});
	g.addVertex('V53', {V34: 1, V52: 1, V70: 1});
	g.addVertex('V54', {V36: 1, V37: 2, V55: 2, V72: 1, V73: 2});
	g.addVertex('V55', {V37: 1, V38: 1, V54: 2, V56: 1, V73: 1, V74: 1});
	g.addVertex('V56', {V38: 1, V39: 1, V55: 1, V57: 1, V74: 1, V75: 1});
	g.addVertex('V57', {V39: 1, V40: 1, V56: 1, V58: 1, V75: 1, V76: 1});
	g.addVertex('V58', {V40: 1, V41: 2, V57: 1, V59: 2, V76: 1, V77: 1});
	g.addVertex('V59', {V41: 1, V42: 1, V58: 2, V60: 1, V77: 1, V78: 1});
	g.addVertex('V60', {V42: 1, V43: 1, V59: 1, V61: 1, V78: 1, V79: 1});
	g.addVertex('V61', {V43: 1, V44: 2, V60: 1, V62: 2, V79: 1, V80: 1});
	g.addVertex('V62', {V44: 1, V45: 1, V61: 2, V63: 1, V80: 2, V81: 1});
	g.addVertex('V63', {V45: 1, V46: 1, V62: 1, V64: 1, V81: 1, V82: 1});
	g.addVertex('V64', {V46: 1, V47: 2, V63: 1, V65: 2, V82: 1, V83: 2});
	g.addVertex('V65', {V47: 1, V48: 1, V64: 2, V66: 1, V83: 1, V84: 1});
	g.addVertex('V66', {V48: 1, V65: 1, V67: 1, V84: 1, V85: 1});
	g.addVertex('V67', {V66: 1, V68: 1, V85: 1, V86: 1});
	g.addVertex('V68', {V51: 1, V67: 1, V69: 1, V86: 1, V87: 1});
	g.addVertex('V69', {V51: 1, V52: 1, V68: 1, V70: 1, V87: 1, V88: 2});
	g.addVertex('V70', {V52: 1, V53: 1, V69: 1, V88: 1});
	g.addVertex('V72', {V54: 1, V73: 2, V90: 1});
	g.addVertex('V73', {V54: 2, V55: 1, V72: 2, V74: 1, V90: 2, V91: 1});
	g.addVertex('V74', {V55: 1, V56: 1, V73: 1, V75: 1, V91: 2, V92: 1});
	g.addVertex('V75', {V56: 1, V57: 1, V74: 1, V76: 1, V92: 1, V93: 1});
	g.addVertex('V76', {V57: 1, V58: 1, V75: 1, V77: 1, V93: 2, V94: 1});
	g.addVertex('V77', {V58: 1, V59: 1, V76: 1, V78: 1, V94: 1, V95: 1});
	g.addVertex('V78', {V59: 1, V60: 1, V77: 1, V79: 1, V95: 1, V96: 1});
	g.addVertex('V79', {V60: 1, V61: 1, V78: 1, V80: 1, V96: 1, V97: 1});
	g.addVertex('V80', {V61: 1, V62: 2, V79: 1, V81: 2, V97: 1, V98: 1});
	g.addVertex('V81', {V62: 1, V63: 1, V80: 2, V82: 1, V98: 2, V99: 1});
	g.addVertex('V82', {V63: 1, V64: 1, V81: 1, V83: 2, V99: 1, V100: 1});
	g.addVertex('V83', {V64: 2, V65: 1, V82: 2, V84: 1, V100: 2, V101: 1});
	g.addVertex('V84', {V65: 1, V66: 1, V83: 1, V85: 1, V101: 1, V102: 1});
	g.addVertex('V85', {V66: 1, V67: 1, V84: 1, V86: 1, V102: 1, V103: 1});
	g.addVertex('V86', {V67: 1, V68: 1, V85: 1, V87: 1, V103: 1, V104: 1});
	g.addVertex('V87', {V68: 1, V69: 1, V86: 1, V88: 2, V104: 1, V105: 2});
	g.addVertex('V88', {V69: 2, V70: 1, V87: 2, V105: 1});
	g.addVertex('V90', {V72: 1, V73: 2, V91: 2, V108: 1, V109: 2});
	g.addVertex('V91', {V73: 1, V74: 2, V90: 2, V92: 2, V109: 1, V110: 2});
	g.addVertex('V92', {V74: 1, V75: 1, V91: 2, V93: 1, V110: 1, V111: 1});
	g.addVertex('V93', {V75: 1, V76: 2, V92: 1, V94: 1, V111: 1, V112: 2});
	g.addVertex('V94', {V76: 1, V77: 1, V93: 1, V95: 2, V112: 2, V113: 1});
	g.addVertex('V95', {V77: 1, V78: 1, V94: 2, V96: 1, V113: 2, V114: 1});
	g.addVertex('V96', {V78: 1, V79: 1, V95: 1, V97: 1, V114: 1, V115: 1});
	g.addVertex('V97', {V79: 1, V80: 1, V96: 1, V98: 1, V115: 1, V116: 1});
	g.addVertex('V98', {V80: 1, V81: 2, V97: 1, V99: 2, V116: 1, V117: 1});
	g.addVertex('V99', {V81: 1, V82: 1, V98: 2, V100: 1, V117: 2, V118: 2});
	g.addVertex('V100', {V82: 1, V83: 2, V99: 1, V101: 2, V118: 2, V119: 2});
	g.addVertex('V101', {V83: 1, V84: 1, V100: 2, V102: 1, V119: 2, V120: 1});
	g.addVertex('V102', {V84: 1, V85: 1, V101: 1, V103: 1, V120: 1, V121: 2});
	g.addVertex('V103', {V85: 1, V86: 1, V102: 1, V104: 1, V121: 2, V122: 2});
	g.addVertex('V104', {V86: 1, V87: 1, V103: 1, V105: 2, V122: 1, V123: 2});
	g.addVertex('V105', {V87: 2, V88: 1, V104: 2, V123: 1});
	g.addVertex('V108', {V90: 1, V109: 1, V126: 1});
	g.addVertex('V109', {V90: 2, V91: 1, V108: 1, V110: 2, V126: 2, V127: 1});
	g.addVertex('V110', {V91: 2, V92: 1, V109: 2, V111: 1, V127: 1, V128: 1});
	g.addVertex('V111', {V92: 1, V93: 1, V110: 1, V112: 2, V128: 1, V129: 2});
	g.addVertex('V112', {V93: 2, V94: 2, V111: 2, V113: 1, V129: 1, V130: 1});
	g.addVertex('V113', {V94: 1, V95: 2, V112: 1, V114: 2, V130: 1, V131: 2});
	g.addVertex('V114', {V95: 1, V96: 1, V113: 2, V115: 1, V131: 1, V132: 1});
	g.addVertex('V115', {V96: 1, V97: 1, V114: 1, V116: 1, V132: 1, V133: 1});
	g.addVertex('V116', {V97: 1, V98: 1, V115: 1, V117: 1, V133: 1, V134: 1});
	g.addVertex('V117', {V98: 1, V99: 2, V116: 1, V118: 1, V134: 1, V135: 1});
	g.addVertex('V118', {V99: 2, V100: 2, V117: 1, V119: 1, V135: 1, V136: 1});
	g.addVertex('V119', {V100: 2, V101: 2, V118: 1, V120: 2, V136: 1, V137: 1});
	g.addVertex('V120', {V101: 1, V102: 1, V119: 2, V121: 2, V137: 2, V138: 2});
	g.addVertex('V121', {V102: 2, V103: 2, V120: 2, V122: 1, V138: 1, V139: 1});
	g.addVertex('V122', {V103: 2, V104: 1, V121: 1, V123: 2, V139: 1, V140: 2});
	g.addVertex('V123', {V104: 2, V105: 1, V122: 2, V140: 1, V141: 1});
	g.addVertex('V126', {V108: 1, V109: 2, V127: 2, V145: 1});
	g.addVertex('V127', {V109: 1, V110: 1, V126: 2, V128: 1, V145: 1, V146: 1});
	g.addVertex('V128', {V110: 1, V111: 1, V127: 1, V129: 2, V146: 1, V147: 2});
	g.addVertex('V129', {V111: 2, V112: 1, V128: 2, V130: 1, V147: 1, V148: 1});
	g.addVertex('V130', {V112: 1, V113: 1, V129: 1, V131: 2, V148: 1, V149: 1});
	g.addVertex('V131', {V113: 2, V114: 1, V130: 2, V132: 1, V149: 1, V150: 1});
	g.addVertex('V132', {V114: 1, V115: 1, V131: 1, V133: 1, V150: 1, V151: 1});
	g.addVertex('V133', {V115: 1, V116: 1, V132: 1, V134: 1, V151: 1, V152: 1});
	g.addVertex('V134', {V116: 1, V117: 1, V133: 1, V135: 1, V152: 1, V153: 1});
	g.addVertex('V135', {V117: 1, V118: 1, V134: 1, V136: 1, V153: 1, V154: 1});
	g.addVertex('V136', {V118: 1, V119: 1, V135: 1, V137: 1, V154: 1, V155: 1});
	g.addVertex('V137', {V119: 1, V120: 2, V136: 1, V138: 2, V155: 1, V156: 2});
	g.addVertex('V138', {V120: 2, V121: 1, V137: 2, V139: 1, V156: 1, V157: 1});
	g.addVertex('V139', {V121: 1, V122: 1, V138: 1, V140: 2, V157: 1, V158: 2});
	g.addVertex('V140', {V122: 2, V123: 1, V139: 2, V141: 1, V158: 1, V159: 1});
	g.addVertex('V141', {V123: 1, V140: 1, V159: 1, V160: 1});
	g.addVertex('V145', {V126: 1, V127: 1, V146: 2, V163: 1});
	g.addVertex('V146', {V127: 1, V128: 1, V145: 2, V147: 2, V163: 1, V164: 1});
	g.addVertex('V147', {V128: 2, V129: 1, V146: 2, V148: 2, V164: 2, V165: 1});
	g.addVertex('V148', {V129: 1, V130: 1, V147: 2, V149: 1, V165: 2, V166: 1});
	g.addVertex('V149', {V130: 1, V131: 1, V148: 1, V150: 1, V166: 1, V167: 1});
	g.addVertex('V150', {V131: 1, V132: 1, V149: 1, V151: 1, V167: 1, V168: 1});
	g.addVertex('V151', {V132: 1, V133: 1, V150: 1, V152: 1, V168: 1, V169: 1});
	g.addVertex('V152', {V133: 1, V134: 1, V151: 1, V153: 1, V169: 1, V170: 1});
	g.addVertex('V153', {V134: 1, V135: 1, V152: 1, V154: 1, V170: 1, V171: 1});
	g.addVertex('V154', {V135: 1, V136: 1, V153: 1, V155: 1, V171: 1, V172: 1});
	g.addVertex('V155', {V136: 1, V137: 1, V154: 1, V156: 2, V172: 1, V173: 2});
	g.addVertex('V156', {V137: 2, V138: 1, V155: 2, V157: 1, V173: 1, V174: 1});
	g.addVertex('V157', {V138: 1, V139: 1, V156: 1, V158: 2, V174: 1, V175: 2});
	g.addVertex('V158', {V139: 2, V140: 1, V157: 2, V159: 1, V175: 1, V176: 1});
	g.addVertex('V159', {V140: 1, V141: 1, V158: 1, V160: 1, V176: 1, V177: 1});
	g.addVertex('V160', {V141: 1, V159: 1, V177: 1});
	g.addVertex('V163', {V145: 1, V146: 1, V164: 2, V182: 1});
	g.addVertex('V164', {V146: 1, V147: 2, V163: 2, V165: 2, V182: 1, V183: 2});
	g.addVertex('V165', {V147: 1, V148: 2, V164: 2, V166: 2, V183: 1, V184: 1});
	g.addVertex('V166', {V148: 1, V149: 1, V165: 2, V167: 1, V184: 2, V185: 2});
	g.addVertex('V167', {V149: 1, V150: 1, V166: 1, V168: 1, V185: 1, V186: 1});
	g.addVertex('V168', {V150: 1, V151: 1, V167: 1, V169: 1, V186: 1, V187: 1});
	g.addVertex('V169', {V151: 1, V152: 1, V168: 1, V170: 1, V187: 1, V188: 1});
	g.addVertex('V170', {V152: 1, V153: 1, V169: 1, V171: 1, V188: 1, V189: 1});
	g.addVertex('V171', {V153: 1, V154: 1, V170: 1, V172: 1, V189: 1, V190: 1});
	g.addVertex('V172', {V154: 1, V155: 1, V171: 1, V173: 2, V190: 1, V191: 2});
	g.addVertex('V173', {V155: 2, V156: 1, V172: 2, V174: 1, V191: 1, V192: 1});
	g.addVertex('V174', {V156: 1, V157: 1, V173: 1, V175: 2, V192: 1, V193: 1});
	g.addVertex('V175', {V157: 2, V158: 1, V174: 2, V176: 1, V193: 1, V194: 1});
	g.addVertex('V176', {V158: 1, V159: 1, V175: 1, V177: 1, V194: 1, V195: 1});
	g.addVertex('V177', {V159: 1, V160: 1, V176: 1, V195: 1});
	g.addVertex('V182', {V163: 1, V164: 1, V183: 2});
	g.addVertex('V183', {V164: 2, V165: 1, V182: 2, V184: 1, V201: 1});
	g.addVertex('V184', {V165: 1, V166: 2, V183: 1, V185: 1, V201: 1, V202: 1});
	g.addVertex('V185', {V166: 2, V167: 1, V184: 1, V186: 1, V202: 1, V203: 1});
	g.addVertex('V186', {V167: 1, V168: 1, V185: 1, V187: 1, V203: 1, V204: 1});
	g.addVertex('V187', {V168: 1, V169: 1, V186: 1, V188: 1, V204: 1, V205: 1});
	g.addVertex('V188', {V169: 1, V170: 1, V187: 1, V189: 1, V205: 1, V206: 1});
	g.addVertex('V189', {V170: 1, V171: 1, V188: 1, V190: 1, V206: 1, V207: 1});
	g.addVertex('V190', {V171: 1, V172: 1, V189: 1, V191: 2, V207: 1, V208: 1});
	g.addVertex('V191', {V172: 2, V173: 1, V190: 2, V192: 1, V208: 2, V209: 1});
	g.addVertex('V192', {V173: 1, V174: 1, V191: 1, V193: 1, V209: 1, V210: 1});
	g.addVertex('V193', {V174: 1, V175: 1, V192: 1, V194: 1, V210: 1, V211: 1});
	g.addVertex('V194', {V175: 1, V176: 1, V193: 1, V195: 1, V211: 1, V212: 1});
	g.addVertex('V195', {V176: 1, V177: 1, V194: 1, V212: 1});
	g.addVertex('V201', {V183: 1, V184: 1, V202: 1});
	g.addVertex('V202', {V184: 1, V185: 1, V201: 1, V203: 1});
	g.addVertex('V203', {V185: 1, V186: 1, V202: 1, V204: 1, V222: 1});
	g.addVertex('V204', {V186: 1, V187: 1, V203: 1, V205: 1, V222: 1, V223: 1});
	g.addVertex('V205', {V187: 1, V188: 1, V204: 1, V206: 1, V223: 1, V224: 1});
	g.addVertex('V206', {V188: 1, V189: 1, V205: 1, V207: 1, V224: 1, V225: 1});
	g.addVertex('V207', {V189: 1, V190: 1, V206: 1, V208: 1, V225: 1, V226: 1});
	g.addVertex('V208', {V190: 1, V191: 2, V207: 1, V209: 2, V226: 1, V227: 2});
	g.addVertex('V209', {V191: 1, V192: 1, V208: 2, V210: 1, V227: 1, V228: 1});
	g.addVertex('V210', {V192: 1, V193: 1, V209: 1, V211: 1, V228: 1, V229: 1});
	g.addVertex('V211', {V193: 1, V194: 1, V210: 1, V212: 1, V229: 1, V230: 1});
	g.addVertex('V212', {V194: 1, V195: 1, V211: 1, V230: 1});
	g.addVertex('V222', {V203: 1, V204: 1, V223: 1});
	g.addVertex('V223', {V204: 1, V205: 1, V222: 1, V224: 1});
	g.addVertex('V224', {V205: 1, V206: 1, V223: 1, V225: 1});
	g.addVertex('V225', {V206: 1, V207: 1, V224: 1, V226: 1});
	g.addVertex('V226', {V207: 1, V208: 1, V225: 1, V227: 2});
	g.addVertex('V227', {V208: 2, V209: 1, V226: 2, V228: 1});
	g.addVertex('V228', {V209: 1, V210: 1, V227: 1, V229: 1});
	g.addVertex('V229', {V210: 1, V211: 1, V228: 1, V230: 1});
	g.addVertex('V230', {V211: 1, V212: 1, V229: 1});	
}

function createArc(va, vb, vw)
{
	var a = vertexId(va);
	var b = vertexId(vb);
	
	if (a<b) {
		var x = a % 18;
		var y = (a-x)/18;
		
		var length = 50;
		var left = x*length+(isEven(y)?0:length/2); // left
		var top  = y*length*(Math.sqrt(3)/2);       // top
		var rot  = '000';                              // rotation 
		
		if (a+1==b) {
			rot = '000';
		} else if (a+17==b) {
			rot = '120';
		} else if (a+19==b) {
			rot = '060';
		} else if (isEven(y)) {
			rot = '060';			
		} else {
			rot = '120';
		}	
		
		var e = createDiv('map', arcName(va, vb), left, top, 'dropzone track track'+vw+' rot'+rot, clickedTrack);
		e.VA = va;
		e.VB = vb;
	}
}

function initArc(va, vb, vw)
{
	document.getElementById(arcName(va, vb)).classList.remove('trackClicked');	
	document.getElementById(arcName(va, vb)).classList.add('track'+vw);	
}

function createCity(city)
{
	var a = vertexId(city);
	
	var x = a % 18;
	var y = (a-x)/18;
	
	var length = 50;
	var left = x*length+(isEven(y)?0:length/2); // left
	var top  = y*length*(Math.sqrt(3)/2);       // top
	
	createDiv('map', city, left-7, top-7, 'city');
}

function initCity(city)
{
	document.getElementById(city).classList = 'city';	
}

function createMap()
{
	for (va in g.vertices) {
// 		var tmp = [];
// 		for (vb in g.vertices[va]) {
// 			tmp.unshift(vb);
// 		}
		for (vb in g.vertices[va]) {
			createArc(va, vb, g.vertices[va][vb]);
		}
	}
	
	for (c in cities) {
		createCity(c);
	}	
	
//	createDiv('map', 'visor', 600, 100, 'draggable');

}

function initMap()
{
	for (va in g.vertices) {
		for (vb in g.vertices[va]) {
			initArc(va, vb, g.vertices[va][vb]);
		}
	}
	
	for (c in cities) {
		initCity(c);
	}	
}


function createDiv(container, id, x, y, style, f) 
{
  var el;
  el = document.createElement('div');
  el.id=id;
  el.className=style;
  el.style.left = x+'px';
  el.style.top = y+'px';
  if (f!=undefined) {
	  if ("ontouchstart" in document.documentElement) {
	    el.addEventListener('touchstart', f);
	  } else {
	    el.addEventListener('click', f);
	  }   
  }        
  document.getElementById(container).appendChild(el);
  return el;
}   