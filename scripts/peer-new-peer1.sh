export CORE_PEER_TLS_CERT_FILE=/etc/crypto-config/peerOrganizations/applicant.mainauthority.com/peers/peer1.applicant.mainauthority.com/tls/server.crt
export CORE_PEER_TLS_KEY_FILE=/etc/crypto-config/peerOrganizations/applicant.mainauthority.com/peers/peer1.applicant.mainauthority.com/tls/server.key
export CORE_PEER_TLS_ROOTCERT_FILE=/etc/crypto-config/peerOrganizations/applicant.mainauthority.com/peers/peer1.applicant.mainauthority.com/tls/ca.crt
export CORE_PEER_ID=peer1.applicant.mainauthority.com
export CORE_PEER_ADDRESS=peer1.applicant.mainauthority.com:10051
export CORE_PEER_LISTENADDRESS=0.0.0.0:10051
export CORE_PEER_CHAINCODEADDRESS=peer1.applicant.mainauthority.com:10052
export CORE_PEER_CHAINCODELISTENADDRESS=0.0.0.0:10052
export CORE_PEER_GOSSIP_EXTERNALENDPOINT=peer1.applicant.mainauthority.com:10051
export CORE_PEER_GOSSIP_BOOTSTRAP=peer1.applicant.mainauthority.com:10051
export CORE_PEER_MSPCONFIGPATH=/etc/crypto-config/peerOrganizations/applicant.mainauthority.com/users/Admin@applicant.mainauthority.com/msp
export CORE_PEER_LOCALMSPID=MainAuthorityApplicantMSP

# peer1.applicant.mainauthority.com join the main channel.
peer channel join -b /etc/channel-artifacts/main-channel.block --tls true --cafile /etc/crypto-config/ordererOrganizations/mainauthority.com/orderers/orderer.mainauthority.com/msp/tlscacerts/tlsca.mainauthority.com-cert.pem

# Package the chaincode issue_certificate.
peer lifecycle chaincode package issue_certificate.tar.gz --path /etc/chaincode --lang node --label issue_certificate

# Install the chaincode issue_certificate to peer1.applicant.mainauthority.com.
peer lifecycle chaincode install issue_certificate.tar.gz

# Query the installed chaincode.
peer lifecycle chaincode queryinstalled >&tmp
PACKAGE_ID=$(sed -n "/issue_certificate/{s/^Package ID: //; s/, Label:.*$//; p;}" tmp)

# Approve the installed chaincode for peer1.applicant.mainauthority.com.
peer lifecycle chaincode approveformyorg --signature-policy "OR('MainAuthorityInstitutionMSP.admin', 'MainAuthorityInstitutionMSP.member')" -o orderer.mainauthority.com:7050 --ordererTLSHostnameOverride orderer.mainauthority.com --tls true --cafile /etc/crypto-config/ordererOrganizations/mainauthority.com/orderers/orderer.mainauthority.com/msp/tlscacerts/tlsca.mainauthority.com-cert.pem --channelID main-channel --name issue_certificate --version 1 --package-id $PACKAGE_ID

# Check whether the chaincode definition is ready to be committed on the channel.
peer lifecycle chaincode checkcommitreadiness --signature-policy "OR('MainAuthorityInstitutionMSP.admin', 'MainAuthorityInstitutionMSP.member')" --channelID main-channel --name issue_certificate --version 1

# Query the committed chaincode definitions by channel on peer1.applicant.mainauthority.com.
peer lifecycle chaincode querycommitted --channelID main-channel --name issue_certificate
