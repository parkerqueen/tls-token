// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract TLSToken {
    struct Signature {
        uint96 expiry;
        address signer;
    }

    struct Certificate {
        uint256 id;
        string name;
        string domain_name;
        string state;
        string country;
        string rsa_public_key;
        uint32 rsa_key_size;
        address cert_owner;
    }

    Certificate[] public certificates;
    mapping(address => bool) cert_issued;
    mapping(address => Certificate) cert_registry;
    mapping(uint256 => Signature[]) cert_signatures;

    function add_certificate(
        string calldata name,
        string calldata domain_name,
        string calldata state,
        string calldata country,
        string calldata rsa_public_key,
        uint32 rsa_key_size
    ) external {
        require(
            rsa_key_size == 1024 || rsa_key_size == 2048,
            "KEY SIZE INVALID"
        );
        require(!str_empty(name), "NAME EMPTY");
        require(!str_empty(domain_name), "DOMAIN NAME EMPTY");
        require(!str_empty(state), "STATE EMPTY");
        require(!str_empty(country), "COUNTRY EMPTY");
        require(!str_empty(rsa_public_key), "PUBLIC KEY EMPTY");

        Certificate memory certificate;
        certificate.id = certificates.length;
        certificate.name = name;
        certificate.domain_name = domain_name;
        certificate.state = state;
        certificate.country = country;
        certificate.rsa_key_size = rsa_key_size;
        certificate.rsa_public_key = rsa_public_key;
        certificate.cert_owner = msg.sender;

        certificates.push(certificate);
        cert_issued[msg.sender] = true;
        cert_registry[msg.sender] = certificate;
    }

    function sign_certificate(uint256 cert_id, uint96 expiry) external {
        require(cert_id < certificates.length, "CERTIFICATE ID INVALID");
        require(
            msg.sender != certificates[cert_id].cert_owner,
            "CANT SIGN OWN CERT"
        );
        cert_signatures[cert_id].push(Signature(expiry, msg.sender));
    }

    function fetch_certificate(uint256 cert_id)
        external
        view
        returns (
            string memory name,
            string memory domain_name,
            string memory state,
            string memory country,
            string memory rsa_public_key,
            uint32 rsa_key_size,
            address cert_owner
        )
    {
        require(cert_id < certificates.length, "CERTIFICATE ID INVALID");
        Certificate storage certificate = certificates[cert_id];

        cert_owner = certificate.cert_owner;
        name = certificate.name;
        domain_name = certificate.domain_name;
        state = certificate.state;
        country = certificate.country;
        rsa_public_key = certificate.rsa_public_key;
        rsa_key_size = certificate.rsa_key_size;
    }

    function fetch_signatures(uint256 cert_id)
        external
        view
        returns (Signature[] memory signatures)
    {
        require(cert_id < certificates.length, "CERTIFICATE ID INVALID");
        uint256 signatures_length = cert_signatures[cert_id].length;

        signatures = new Signature[](signatures_length);
        for (uint256 i = 0; i < signatures_length; i++)
            signatures[i] = cert_signatures[cert_id][i];
    }

    function str_empty(string memory str) private pure returns (bool) {
        return bytes(str).length == 0;
    }
}
