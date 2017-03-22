var fs = require('fs');
var path = require('path');

// console.log(__dirname);
var translationFileMap = {};

function travarseFolder (fileOrFolderName, depth) {
    var s = '';
    for (var i = 0; i < depth; i++) {
        s = s + '-';
    }
    var filesArray = fileOrFolderName.split('\\');
    var fileName = filesArray[filesArray.length - 1];
    var fileExt = fileName.split('.')[1];

    s = s + fileName;
    // console.log(s);

    if (fs.lstatSync(fileOrFolderName).isDirectory()) {

        var fileList = fs.readdirSync(fileOrFolderName);
        fileList.forEach(function (file) {
            var file = path.resolve(fileOrFolderName, file);
            return travarseFolder(file, depth + 1);
        });
    } else if (fileName.match(/lang-de/) !== null) {
        var folderName = fileOrFolderName.split('\\');
        folderName.pop();
        folderName = folderName.join('\\');
        if (!translationFileMap[folderName]) {
            translationFileMap[folderName] = {};
        }
        translationFileMap[folderName]['de'] = fileName;
        return translationFileMap;
    } else if (fileName.match(/lang-en/) !== null) {
        var folderName = fileOrFolderName.split('\\');
        folderName.pop();
        folderName = folderName.join('\\');
        if (!translationFileMap[folderName]) {
            translationFileMap[folderName] = {};
        }
        translationFileMap[folderName]['en'] = fileName;
        return translationFileMap;
    } else if (fileName.match(/lang-fr/) !== null) {
        var folderName = fileOrFolderName.split('\\');
        folderName.pop();
        folderName = folderName.join('\\');
        if (!translationFileMap[folderName]) {
            translationFileMap[folderName] = {};
        }
        translationFileMap[folderName]['fr'] = fileName;
        return translationFileMap;
    }
}

travarseFolder(__dirname, 0);
console.log(translationFileMap);
fs.appendFileSync('output.tsv', "FILE PATH\t TRANSLATION KEY\t ENGLISH\t GERMAN\t FRENCH\n", 'utf8');
for (var key in translationFileMap) {
    // console.log('doing for ' + key);
    var contentForCSV = {
    };

    for (var lang in translationFileMap[key]) {
        var JSONDump = fs.readFileSync(key + '\\' + translationFileMap[key][lang], 'utf8');
        console.log(JSONDump);
        if (JSONDump.charAt(0) !== '{')
            JSONDump = JSONDump.slice(1);

        var KeyValueMap = {};
        var Obj = JSON.parse(JSONDump);
        mixUpJson('', Obj, KeyValueMap);
        // console.log(KeyValueMap);
        contentForCSV[lang] = KeyValueMap;
    }

    for (var key_2 in contentForCSV['en']) {
        var preppedString = '"' + key + '"\t"' + key_2 + '"\t"' + contentForCSV['en'][key_2] + '"\t"' + contentForCSV['de'][key_2] + '"\t"' + contentForCSV['fr'][key_2] + '"\n';
        console.log(preppedString);
        fs.appendFileSync('output.tsv', preppedString, 'utf8');
    }

}


function mixUpJson (keySequence, obj, keyMapReference) {
    if (typeof obj === 'string') {
        keyMapReference[keySequence] = obj;
    } else {
        for (var key in obj) {
            if (typeof obj[key] === 'object') {
                for (var key in obj) {
                    var newKewSeq = keySequence == '' ? key : keySequence + '.' + key;
                    mixUpJson(newKewSeq, obj[key], keyMapReference);
                }
            } else {
                var newKewSeq =  keySequence == '' ? key : keySequence + '.' + key;
                keyMapReference[newKewSeq] = obj[key];
            }
        }
    }
}
