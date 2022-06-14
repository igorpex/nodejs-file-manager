import os from 'os';

const getOsInfo = (parameter) => {
    //Check if arguments are presented
    if (!parameter || !parameter.startsWith('--')) {
        console.log('Input error');
        return
    };
    let param = parameter.slice(2);

    switch (param) {
        case 'EOL':
            console.log(JSON.stringify(os.EOL));
            break;
        case 'cpus':
            let cpus = os.cpus();
            const numOfCpus = cpus.length;
            console.log('Number of CPUs:', numOfCpus);
            for (let i = 0; i < numOfCpus; i++) {
                console.log(`CPU # ${i}:`);
                console.log('CPU Model:', cpus[i].model);
            }
            break;
        case 'homedir':
            console.log(os.homedir());
            break;
        case 'username':
            console.log(os.userInfo().username);
            break;
        case 'architecture':
            console.log(os.arch());
            break;
        default:
            break;
    }
    return
}

export {
    getOsInfo
};
