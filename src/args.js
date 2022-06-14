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

