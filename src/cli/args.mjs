function parseArgs() {
    const args = process.argv.slice(2);

    // prepate props object
    let props = {};
    args.forEach((element, index, array) => {
        if (element.startsWith('--')) {
            let splitPlace = element.indexOf('=');
            const propName = element.slice(2, splitPlace);
            const propValue = element.slice(splitPlace + 1);
            props[propName] = propValue;
        }
    });

    return props;
    // prepare string and print it
    let textArr = [];
    for (let propName in props) {
        let text = `${propName} is ${props[propName]}`;
        textArr.push(text);
    }
    console.log(textArr.join(', '));
}

export {
    parseArgs,
};



// parseArgs();
//args.js - implement function that parses command line arguments
// (given in format --propName value --prop2Name value2, you don't need to validate it)
// and prints them to the console in the format propName is value, prop2Name is value2

// test: node .\src\cli\args.js --propName value --prop2Name value2
