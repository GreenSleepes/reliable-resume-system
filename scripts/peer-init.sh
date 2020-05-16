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

fi
