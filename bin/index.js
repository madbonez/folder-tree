#!/usr/bin/env node

const fs = require('fs');
const commandLineUsage = require('command-line-usage')
const commandLineArgs = require('command-line-args')
const directoryTree = require('../lib/directory-tree');

const optionList = [
    {
        name: 'path',
        alias: 'p',
        required: true,
        typeLabel: '{underline string}',
        description: 'đ The input folder to process. Required.'
    },
    {
        name: 'exclude',
        alias: 'e',
        type: String,
        description: 'đ Exclude some folders from processing by regexp string. Ex -e "test_data/some_dir$|js|.DS_Store"'
    },
    {
        name: 'output',
        alias: 'o',
        type: String,
        description: 'đ Put result into file provided by this options. Overwrites if exists.'
    },
    {
        name: 'firstLevel',
        type: Boolean,
        description: 'â Grab only first level of tree structure'
    },
    {
        name: 'attributes',
        type: String,
        description: 'âšī¸ Grab file attributes. Ex --attributes size,type,extension'
    },
    {
        name: 'pretty',
        type: Boolean,
        description: 'đ Json pretty print'
    },
    {
        name: 'help',
        alias: 'h',
        type: Boolean,
        description: 'âī¸ Print this usage guide.'
    }
]

const usageNotes = [
    {
        header: 'âī¸ī¸ Folder-tree command line script',
        content: 'Used for generates json representation of folder internals'
    },
    {
        header: 'đĨ Options đĨ',
        optionList: optionList
    }
]

const usage = commandLineUsage(usageNotes)
let options = null;
try {
    options = commandLineArgs(optionList)
} catch(e) {
    console.log(usage);
    return;
}

if (Object.keys(options).length === 0 || options.help || !options.path) {
    console.log(usage)
    return;
}

if (!fs.existsSync(options.path)) {
    console.log('-----------------------------------------------------------------------------------------------------')
    console.log(`ERROR: Folder \"${options.path}\" doesn\'t exist please check your args`);
    console.log('-----------------------------------------------------------------------------------------------------')
    console.log(usage)
    return;
}

if (options.firstLevel && options.attributes.indexOf('size') !== -1) {
    console.log('WARNING: due to firstLevel option enabled, size will be shown only for files');
}

const result = directoryTree(options.path, {
    firstLevel: options.firstLevel,
    exclude: options.exclude ? [new RegExp(options.exclude)] : undefined,
    attributes: options.attributes ? options.attributes.split(',') : undefined
})

const resultString = JSON.stringify(result, null, options.pretty ? '  ' : '');
if (options.output) {
    fs.writeFileSync(options.output, resultString);
} else {
    console.log(resultString);
}
