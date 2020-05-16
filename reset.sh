cd $(dirname "$0") || exit 1

# rm -r ./bin
rm -r ./ca/mainauthority.com/msp
rm -r ./ca/applicant.mainauthority.com/msp
rm ./ca/applicant.mainauthority.com/fabric-ca-server.db
rm ./ca/applicant.mainauthority.com/IssuerPublicKey
rm ./ca/applicant.mainauthority.com/IssuerRevocationPublicKey
rm -r ./ca/institution.mainauthority.com/msp
rm ./ca/institution.mainauthority.com/fabric-ca-server.db
rm ./ca/institution.mainauthority.com/IssuerPublicKey
rm ./ca/institution.mainauthority.com/IssuerRevocationPublicKey
rm ./ca/mainauthority.com/fabric-ca-server.db
rm ./ca/mainauthority.com/IssuerPublicKey
rm ./ca/mainauthority.com/IssuerRevocationPublicKey
rm -r ./channel-artifacts
# rm -r ./client/node_modules
rm -r ./crypto-config
rm -r ./wallet
