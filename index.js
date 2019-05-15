let factoryProps = new solace.SolclientFactoryProperties();
factoryProps.profile = solace.SolclientFactoryProfiles.version10;
solace.SolclientFactory.init(factoryProps);

let session = solace.SolclientFactory.createSession({
    url:      'wss://',
    vpnName:  'msgvpn',
    userName: 'solace-cloud-client',
    password: 'password',
});

session.on(solace.SessionEventCode.UP_NOTICE, function (sessionEvent) {
    console.log('=== Successfully connected and ready to subscribe. ===');
    session.subscribe(solace.SolclientFactory.createTopic('car/drive/*'), true, 'car/drive/*', 10000);
});

session.on(solace.SessionEventCode.MESSAGE, function (message) {
    console.log(`Received message: "${message.getBinaryAttachment()}", details:\n ${message.dump()}`);
    let payload = JSON.parse(message.getBinaryAttachment())
    let topicLevels = message.xi.gl.split('/');
    if (topicLevels.length == 3) {
      let vehicleId = topicLevels[2];
      gameInstance.SendMessage(vehicleId, 'setLeftMotorSpeed', payload['l']);
      gameInstance.SendMessage(vehicleId, 'setRightMotorSpeed', payload['r']);
      gameInstance.SendMessage(vehicleId, 'setDriveDuration', payload['d']);
    }
});

session.connect();
