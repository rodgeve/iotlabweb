let factoryProps = new solace.SolclientFactoryProperties();
factoryProps.profile = solace.SolclientFactoryProfiles.version10;
solace.SolclientFactory.init(factoryProps);

let session = solace.SolclientFactory.createSession({
    url:      'hostname',
    vpnName:  'vpnname',
    userName: 'solace-cloud-client',
    password: 'password',
});

session.on(solace.SessionEventCode.UP_NOTICE, function (sessionEvent) {
    console.log('=== Successfully connected and ready to subscribe. ===');
    session.subscribe(solace.SolclientFactory.createTopicDestination('car/move'), true, 'car/move', 10000);
});

session.on(solace.SessionEventCode.MESSAGE, function (message) {
    console.log(`Received message: "${message.getBinaryAttachment()}", details:\n ${message.dump()}`);
    let payload = JSON.parse(message.getBinaryAttachment())
    gameInstance.SendMessage('CarKit', 'setLeftMotorSpeed', payload['l']);
    gameInstance.SendMessage('CarKit', 'setRightMotorSpeed', payload['r']);
    gameInstance.SendMessage('CarKit', 'setDriveDuration', payload['d']);
});

session.connect();