// This is an ugly flattener.
// This function flattens js object by concatenating the keys with ::. 
// This means that if an object as '::' in one of it's attributes's keys
// You're screwed. Also, it considers arrays as objects.
// The reason behind this is allow for simple request on redis

function flatten(object, prefix) {
    var obj = {};
    for (var i in object) {
        if(typeof(object[i]) === "object") {
            var flat = flatten(object[i], i);
            if(prefix) {
                for (var j in flat) {
                    obj[prefix + '::' + j] = flat[j];
                }
            }
            else {
                for (var j in flat) {
                    obj[j] = flat[j];
                }
            }
        }
        else {
            if(prefix) {
                obj[prefix + '::' + i] = object[i]
            }
            else {
                obj[i] = object[i];
            }
        }
    }
    return obj;
}

exports.flatten = flatten;

function expand(object) {
    var obj = {};
    for (var i in object) {
        var splitted = i.split('::');
        var r = obj;
        for(var j = 0; j < splitted.length; j++) {
            
            var k = splitted[j];
            if(!r[k]) {
                // The key doesn't exist yet!.
                if(j === splitted.length - 1) {
                    // Last level
                    r[k] = object[i]
                }
                else {
                    r[k] = {};
                }
            }
            r = r[k];
        }
    }
    return obj;
}

exports.expand = expand;
