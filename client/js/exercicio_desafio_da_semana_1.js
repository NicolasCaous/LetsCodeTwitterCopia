function limpaString(s) {
    let ret = "";

    for (const c of s) {
        if (c === "=" || c === "," || c === "\\")
            ret += "\\" + c;
        else
            ret += c
    }

    return ret;
}

function deslimpaString(s) {
    let ret = "";

    let i = 0;
    while (i < s.length) {
        if (s[i] === "\\" && (s[i+1] === "\\" || s[i+1] === "=" || s[i+1] === ",")) {
            ret += s[i+1];
            i += 2;
            continue;
        }

        ret += s[i];
        ++i;
    }

    return ret;
}

function S(obj) {
    let ret = "";

    for (const key in obj) {
        ret += limpaString(key);
        ret += "=";

        if(typeof obj[key] === "number") {
            ret += "N";
        } else if (typeof obj[key] === "string") {
            ret += "S";
        }

        ret += limpaString(obj[key].toString());
        ret += ",";
    }

    return ret.substring(0, ret.length - 1);
}

// https://github.com/v8/v8/blob/e6f7a3470f5798c6fe01a2bb88ae0c2ce46b5ce6/test/webkit/resources/json2-es5-compat.js#L356
function D(s) {
    let ret = {};

    function DKey(start, end) {
        let key = s.substring(start, end);
        return deslimpaString(key);
    }

    function DValue(start, end) {
        let type = s[start];
        let value = s.substring(start + 1, end);

        if (type === "N")
            return parseFloat(deslimpaString(value));
        if (type === "S")
            return deslimpaString(value);
    }

    function DProp(start, end) {
        let prop = s.substring(start, end);

        let i = 0;
        while(i < prop.length) {
            if (prop[i] === "\\" && (prop[i+1] === "=" || prop[i+1] === "\\" || prop[i+1] === ",")) {
                i += 2;
                continue;
            }

            if (prop[i] === "=") {
                ret[DKey(start, start + i)] = DValue(start + i + 1, end);
                break;
            }

            ++i;
        }
    }

    let start = -1;
    let end = -1;

    let i = 0;
    while(i < s.length) {
        if (s[i] === "\\" && (s[i+1] === "=" || s[i+1] === "\\" || s[i+1] === ",")) {
            i += 2;
            continue;
        }

        if(s[i] === ",") {
            start = end + 1;
            end = i;

            DProp(start, end);
        }

        ++i;
    }

    DProp(end + 1, s.length);

    return ret;
}

const x = {a: 0, b: 1, c: 2};

const serializado = S(x);

console.log(serializado)
console.log(D(serializado));