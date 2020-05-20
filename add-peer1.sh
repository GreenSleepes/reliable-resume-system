cd $(dirname "$0") || exit 1

# Generate key material for the new peer.
./bin/cryptogen extend --config=./crypto-config.yaml
