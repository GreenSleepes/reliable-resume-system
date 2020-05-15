cd $(dirname "$0") || exit 1

# Install the docker image of Fabric and download the platform-specific binaries.
if [ ! -d bin ]; then
    curl -s https://raw.githubusercontent.com/hyperledger/fabric/master/scripts/bootstrap.sh | bash /dev/stdin 2.1.0 1.4.7 "-ds"
    if [ -d config ]; then
        rm -r config
    fi
fi

# Generate key material.
./bin/cryptogen generate --config=./crypto-config.yaml

# Generate a genesis block.
./bin/configtxgen -profile SampleMultiNodeEtcdRaft -channelID main-channel -outputBlock ./channel-artifacts/genesis.block

# Generate a transaction for create channel.
./bin/configtxgen -profile MainChannel -channelID main-channel -outputCreateChannelTx ./channel-artifacts/channel.tx

# Generate the configuration update transaction to sets the anchor peers.
./bin/configtxgen -profile MainChannel -channelID main-channel -asOrg MainAuthorityInstitution -outputAnchorPeersUpdate ./channel-artifacts/main-institution-anchor.tx
./bin/configtxgen -profile MainChannel -channelID main-channel -asOrg MainAuthorityApplicant -outputAnchorPeersUpdate ./channel-artifacts/main-applicant-anchor.tx

# Install the node modules.
cd client || exit 1
if [ ! -d node_modules ]; then
    npm install
fi
