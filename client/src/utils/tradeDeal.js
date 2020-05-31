export function getTradeSide(
    tradeDeal,
    yourSide,
    player
) {
    const initiator = tradeDeal.parties.initiator;
    const receiver = tradeDeal.parties.receiver;
    if (player.attributes.id === initiator.id) {
        return yourSide ? initiator : receiver;
    }

    return yourSide ? receiver : initiator;
}

export function isPlayerTheInitiator(
    tradeDeal,
    player
) {
    const initiator = tradeDeal.parties.initiator;
    if (player.attributes.id === initiator.id) {
        return true;
    }

    return false;
}
