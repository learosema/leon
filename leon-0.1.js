(function() {

    var myLEON = {
        /**
         * LEON's error string
         */
        error: null,

        /**
         * set typeGuessing to false if 
         * you want to force the decoder to return strings
         */
        typeGuessing: true,

        /**
         * encode an object
         */
        encode: function(obj) {
            if (typeof obj != 'object') {
                return myLEON.encodeVal(obj);
            }
            var key, val, i = 0;
            var outputArray = [];
            for (key in obj) {
                val = obj[key];
                if (typeof val == 'object') {
                    val = '~' + myLEON.encode(obj[key]) + '~';
                } else {
                    val = myLEON.encodeVal(val);
                }
                if (key == i) {
                    outputArray.push(val);
                } else {
                    outputArray.push(myLEON.esc(key) + '_' + val);
                }
                i++;
            }
            return outputArray.join('.');
        },

        /**
         * private function esc(val)
         * escape a string
         */
        esc: function(val) {
            // val = val.replace(/\-/, '--');
            val = val.replace(/\-([^0-9])/g, '--$1'); // replace - with --, if there is no number following
            val = val.replace(/\_/, '-_');
            val = val.replace(/\./, '-.');
            val = val.replace(/\~/, '-~');
            return val;
        },

        /**
         * private function unEsc(val)
         * unescape a string
         */
        unEsc: function(val) {
            val = val.replace(/\-\-/, '-');
            val = val.replace(/\-\_/, '_');
            val = val.replace(/\-\./, '.');
            val = val.replace(/\-\~/, '~');
            return val;
        },


        /**
         * encode a value
         */
        encodeVal: function(val) {
            if (typeof val == 'string') {
                return myLEON.esc(val);
            }
            if (typeof val == 'boolean') {
                return (val) ? 'true' : 'false';
            }
            if (typeof val == 'number') {
                return myLEON.esc(val.toString());
            }
            return '';
        },

        guessValueType: function(val) {
            if (myLEON.typeGuessing === false || typeof val !== 'string') {
                return val;
            }
            if (/^[-+]?\d+(e[0-9]+)?$/.test(val)) {
                return parseInt(val);
            }
            if (/^[-+]?[0-9]+(\.[0-9]+)?(e[0-9]+)?$/.test(val)) {
                return parseFloat(val);
            }
            if (val === 'true' || val === 'false') {
                return (val === 'true') ? true : false;
            }
            if (val === 'undefined') {
                return undefined;
            }
            if (val === 'null') {
                return null;
            }
            if (val === 'NaN') {
                return NaN;
            }
            return val;
        },

        decode: function(str) {
            var expressions = undefined;
            var exprKey, exprVal,exprIndex = 0,levelDir = 1,underScore = -1;
            var i,level =0, j = 0;
            myLEON.error = null;
            if (typeof str !== 'string') {
                myLEON.error = 'bad parameter.';
                return undefined;
            }
            str += '.';
            for (i = 0; i < str.length; i++) {
                if (str[i] === '-') {
                    if (i === str.length-1 || "0123456789~-_.".indexOf(str[i+1]) < 0) {
                        myLEON.error = 'parse error: unexpected - at ' + i;
                        return undefined;
                    }
                    i++;
                    continue;
                }
                if (str[i] === '_' && level === 0) {
                    underScore = i;
                    continue;
                }
                if (str[i] === '~') {
                    if (i === 0) {
                        level++;
                        levelDir = 1;
                        continue;
                    }
                    if (str[i-1] === '_' || str[i-1] === '.') {
                        if ((i < 2) || str[i-2] != '-') {
                            level++;
                            levelDir = 1;
                            continue;
                        }
                    }
                    if (str[i-1] === '~') {
                        if ((i < 2) || str[i-1] != '-') {
                            level += levelDir;
                            continue;
                        }
                    }
                    level--;
                    levelDir = -1;
                    if (level < 0) {
                        myLEON.error = 'parse error: unexpected ~ at ' + i;
                        return undefined;
                    }
                    continue;
                }
                if (str[i] === '.' && level === 0) {
                    if (underScore >= j) {
                        exprKey = myLEON.unEsc(str.slice(j, underScore));
                        exprVal = str.slice(underScore + 1, i);
                        if (expressions === undefined) {
                            expressions = {};
                        }
                    } else {
                        exprKey = exprIndex;
                        exprVal = str.slice(j, i);
                        if (expressions === undefined) {
                            expressions = [];
                        }
                    }
                    j = i + 1;
                    exprIndex++;
                    underScore = -1;
                    if (exprVal[0] === '~') {
                        expressions[exprKey] = myLEON.decode(exprVal.slice(1, exprVal.length - 1)); // ~1.2.3~
                        if (expressions[exprKey] === 'undefined') {
                            LEON.error = 'Error in sub expression ' + exprVal + ':\n' + LEON.error;
                            return undefined;
                        }

                    } else {
                        expressions[exprKey] = myLEON.guessValueType(myLEON.unEsc(exprVal));
                    }
                }
            }
            if (level > 0) {
                myLEON.error = 'parse error: missing ~';
                return undefined;
            }
            
            if (expressions instanceof Array && expressions.length === 1) {
                return expressions[0];
            }
            return expressions;
        }
    };

    if (window.LEON === undefined) {
        window.LEON = { encode: myLEON.encode, decode: myLEON.decode, error: myLEON.error, typeGuessing: myLEON.typeGuessing };
    }
    

}());
