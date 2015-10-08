#! /usr/bin/env node

var fs = require('fs'),
    args = process.argv.slice(2),
    targetFilePath = args[0],
    targetSectionName = args[1];

if(!targetFilePath){
    console.log('runme needs a target markdown file');
    return;
}

fs.readFile(targetFilePath, 'utf8', function(error, file){
    if(error){
        console.log(error);

        return;
    }

    var matcher = /((?:^.*?$)?)\n^```\n([^]*?)\n^```/gm
        sections = {};

    do{
        var match = matcher.exec(file);

        if(match){
            var index = Object.keys(sections).length,
                name = match[1].trim() || index;

            sections[index] = sections[name] = {
                name: name,
                code: match[2]
            };
        }
    }while(match);

    if(!(targetSectionName in sections)){
        console.log('Section not found: ' + targetSectionName);
    }

    var targetSection = sections[targetSectionName];

    eval(targetSection.code);
});