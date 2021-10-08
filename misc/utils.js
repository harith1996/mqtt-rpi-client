const parseBrokers = (hosts, ports, usernames, passwords) => {

    let brokerAddrs = [];
    const brokerHosts = hosts?.split(',')
    const brokerPorts = ports?.split(',')
    const brokerUsers = usernames?.split(',')
    const brokerPwds = passwords?.split(',')

    for (var x = 0; x < brokerHosts?.length; x++) {
        brokerAddrs.push({
            host: brokerHosts[x],
            port: brokerPorts[x] || 1883,
            username: brokerUsers[x],
            password: brokerPwds[x],
        })
    }
    
    return brokerAddrs
}

module.exports = {
    parseBrokers
}