if [ ! -f /etc/channel-artifacts/main-channel.block ]; then

    export CORE_PEER_TLS_CERT_FILE=/etc/crypto-config/peerOrganizations/institution.mainauthority.com/peers/peer0.institution.mainauthority.com/tls/server.crt
    export CORE_PEER_TLS_KEY_FILE=/etc/crypto-config/peerOrganizations/institution.mainauthority.com/peers/peer0.institution.mainauthority.com/tls/server.key
    export CORE_PEER_TLS_ROOTCERT_FILE=/etc/crypto-config/peerOrganizations/institution.mainauthority.com/peers/peer0.institution.mainauthority.com/tls/ca.crt
    export CORE_PEER_ID=peer0.institution.mainauthority.com
    export CORE_PEER_ADDRESS=peer0.institution.mainauthority.com:8051
    export CORE_PEER_LISTENADDRESS=0.0.0.0:8051
    export CORE_PEER_CHAINCODEADDRESS=peer0.institution.mainauthority.com:8052
    export CORE_PEER_CHAINCODELISTENADDRESS=0.0.0.0:8052
    export CORE_PEER_GOSSIP_EXTERNALENDPOINT=peer0.institution.mainauthority.com:8051
    export CORE_PEER_GOSSIP_BOOTSTRAP=peer0.institution.mainauthority.com:8051
    export CORE_PEER_MSPCONFIGPATH=/etc/crypto-config/peerOrganizations/institution.mainauthority.com/users/Admin@institution.mainauthority.com/msp
    export CORE_PEER_LOCALMSPID=MainAuthorityInstitutionMSP

    # Create the main channel.
    peer channel create -o orderer.mainauthority.com:7050 -c main-channel --ordererTLSHostnameOverride orderer.mainauthority.com -f /etc/channel-artifacts/main-channel.tx --outputBlock /etc/channel-artifacts/main-channel.block --tls true --cafile /etc/crypto-config/ordererOrganizations/mainauthority.com/orderers/orderer.mainauthority.com/msp/tlscacerts/tlsca.mainauthority.com-cert.pem

    # peer0.institution.mainauthority.com join the main channel.
    peer channel join -b /etc/channel-artifacts/main-channel.block --tls true --cafile /etc/crypto-config/ordererOrganizations/mainauthority.com/orderers/orderer.mainauthority.com/msp/tlscacerts/tlsca.mainauthority.com-cert.pem

    # Set the anchor peers for institution.mainauthority.com.
    peer channel update -o orderer.mainauthority.com:7050 -c main-channel --ordererTLSHostnameOverride orderer.mainauthority.com -f /etc/channel-artifacts/main-institution-anchor.tx --tls true --cafile /etc/crypto-config/ordererOrganizations/mainauthority.com/orderers/orderer.mainauthority.com/msp/tlscacerts/tlsca.mainauthority.com-cert.pem

    # Package the chaincode issue_certificate.
    peer lifecycle chaincode package issue_certificate.tar.gz --path /etc/chaincode --lang node --label issue_certificate

    # Install the chaincode issue_certificate to peer0.institution.mainauthority.com.
    peer lifecycle chaincode install issue_certificate.tar.gz

    # Query the installed chaincode.
    peer lifecycle chaincode queryinstalled >&tmp
	PACKAGE_ID=$(sed -n "/issue_certificate/{s/^Package ID: //; s/, Label:.*$//; p;}" tmp)

    # Approve the installed chaincode for peer0.institution.mainauthority.com.
    peer lifecycle chaincode approveformyorg -o orderer.mainauthority.com:7050 --ordererTLSHostnameOverride orderer.mainauthority.com --tls true --cafile /etc/crypto-config/ordererOrganizations/mainauthority.com/orderers/orderer.mainauthority.com/msp/tlscacerts/tlsca.mainauthority.com-cert.pem --channelID main-channel --name issue_certificate --version 1 --package-id $PACKAGE_ID

    # Check whether the chaincode definition is ready to be committed on the channel.
    peer lifecycle chaincode checkcommitreadiness --channelID main-channel --name issue_certificate --version 1

    CORE_PEER_TLS_CERT_FILE=/etc/crypto-config/peerOrganizations/applicant.mainauthority.com/peers/peer0.applicant.mainauthority.com/tls/server.crt
    CORE_PEER_TLS_KEY_FILE=/etc/crypto-config/peerOrganizations/applicant.mainauthority.com/peers/peer0.applicant.mainauthority.com/tls/server.key
    CORE_PEER_TLS_ROOTCERT_FILE=/etc/crypto-config/peerOrganizations/applicant.mainauthority.com/peers/peer0.applicant.mainauthority.com/tls/ca.crt
    CORE_PEER_ID=peer0.applicant.mainauthority.com
    CORE_PEER_ADDRESS=peer0.applicant.mainauthority.com:9051
    CORE_PEER_LISTENADDRESS=0.0.0.0:9051
    CORE_PEER_CHAINCODEADDRESS=peer0.applicant.mainauthority.com:9052
    CORE_PEER_CHAINCODELISTENADDRESS=0.0.0.0:9052
    CORE_PEER_GOSSIP_EXTERNALENDPOINT=peer0.applicant.mainauthority.com:9051
    CORE_PEER_GOSSIP_BOOTSTRAP=peer0.applicant.mainauthority.com:9051
    CORE_PEER_MSPCONFIGPATH=/etc/crypto-config/peerOrganizations/applicant.mainauthority.com/users/Admin@applicant.mainauthority.com/msp
    CORE_PEER_LOCALMSPID=MainAuthorityApplicantMSP

    # peer0.applicant.mainauthority.com join the main channel.
    peer channel join -b /etc/channel-artifacts/main-channel.block --tls true --cafile /etc/crypto-config/ordererOrganizations/mainauthority.com/orderers/orderer.mainauthority.com/msp/tlscacerts/tlsca.mainauthority.com-cert.pem

    # Set the anchor peers for applicant.mainauthority.com.
    peer channel update -o orderer.mainauthority.com:7050 -c main-channel --ordererTLSHostnameOverride orderer.mainauthority.com -f /etc/channel-artifacts/main-applicant-anchor.tx --tls true --cafile /etc/crypto-config/ordererOrganizations/mainauthority.com/orderers/orderer.mainauthority.com/msp/tlscacerts/tlsca.mainauthority.com-cert.pem

    # Install the chaincode issue_certificate to peer0.applicant.mainauthority.com.
    peer lifecycle chaincode install issue_certificate.tar.gz

    # Query the installed chaincode.
    peer lifecycle chaincode queryinstalled

    # Query the installed chaincode.
    peer lifecycle chaincode queryinstalled >&tmp
	PACKAGE_ID=$(sed -n "/issue_certificate/{s/^Package ID: //; s/, Label:.*$//; p;}" tmp)

    # Approve the installed chaincode for peer0.applicant.mainauthority.com.
    peer lifecycle chaincode approveformyorg -o orderer.mainauthority.com:7050 --ordererTLSHostnameOverride orderer.mainauthority.com --tls true --cafile /etc/crypto-config/ordererOrganizations/mainauthority.com/orderers/orderer.mainauthority.com/msp/tlscacerts/tlsca.mainauthority.com-cert.pem --channelID main-channel --name issue_certificate --version 1 --package-id $PACKAGE_ID

    # Check whether the chaincode definition is ready to be committed on the channel.
    peer lifecycle chaincode checkcommitreadiness --channelID main-channel --name issue_certificate --version 1

    # Commit the chaincode definition on the channel.
    peer lifecycle chaincode commit -o orderer.mainauthority.com:7050 --ordererTLSHostnameOverride orderer.mainauthority.com --tls true --tlsRootCertFiles /etc/crypto-config/peerOrganizations/institution.mainauthority.com/peers/peer0.institution.mainauthority.com/tls/ca.crt --tlsRootCertFiles /etc/crypto-config/peerOrganizations/applicant.mainauthority.com/peers/peer0.applicant.mainauthority.com/tls/ca.crt --cafile /etc/crypto-config/ordererOrganizations/mainauthority.com/orderers/orderer.mainauthority.com/msp/tlscacerts/tlsca.mainauthority.com-cert.pem --channelID main-channel --peerAddresses peer0.institution.mainauthority.com:8051 --peerAddresses peer0.applicant.mainauthority.com:9051 --name issue_certificate --version 1

    # Query the committed chaincode definitions by channel on peer0.applicant.mainauthority.com.
    peer lifecycle chaincode querycommitted --channelID main-channel --name issue_certificate

    CORE_PEER_TLS_CERT_FILE=/etc/crypto-config/peerOrganizations/institution.mainauthority.com/peers/peer0.institution.mainauthority.com/tls/server.crt
    CORE_PEER_TLS_KEY_FILE=/etc/crypto-config/peerOrganizations/institution.mainauthority.com/peers/peer0.institution.mainauthority.com/tls/server.key
    CORE_PEER_TLS_ROOTCERT_FILE=/etc/crypto-config/peerOrganizations/institution.mainauthority.com/peers/peer0.institution.mainauthority.com/tls/ca.crt
    CORE_PEER_ID=peer0.institution.mainauthority.com
    CORE_PEER_ADDRESS=peer0.institution.mainauthority.com:8051
    CORE_PEER_LISTENADDRESS=0.0.0.0:8051
    CORE_PEER_CHAINCODEADDRESS=peer0.institution.mainauthority.com:8052
    CORE_PEER_CHAINCODELISTENADDRESS=0.0.0.0:8052
    CORE_PEER_GOSSIP_EXTERNALENDPOINT=peer0.institution.mainauthority.com:8051
    CORE_PEER_GOSSIP_BOOTSTRAP=peer0.institution.mainauthority.com:8051
    CORE_PEER_MSPCONFIGPATH=/etc/crypto-config/peerOrganizations/institution.mainauthority.com/users/Admin@institution.mainauthority.com/msp
    CORE_PEER_LOCALMSPID=MainAuthorityInstitutionMSP

    # Query the committed chaincode definitions by channel on peer0.institution.mainauthority.com.
    peer lifecycle chaincode querycommitted --channelID main-channel --name issue_certificate

fi
