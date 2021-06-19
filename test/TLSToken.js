const { expect } = require('chai');

describe('TLSToken Smart Contract', function () {
    let TLSToken;
    let TLSTokenFactory;

    let addr1;
    let addr2;

    const cert_name = 'Parker Queen';
    const cert_domain_name = 'www.parkerqueen.com';
    const cert_state = 'Ohio';
    const cert_country = 'United States';
    const cert_rsa_public_key =
        'MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgGFdYmurUYiMmlwaePaJeN+wIMRQDLzW8y4giibP0f9IrJU2frcCzvB7nEIqAztk5JHA0RetQ0zTKquN9XXJSh3YQ30X5c1glx3maScx9qXTTqHFhKHJXX7+F/2LSUUu1waafPg4yrnF9t6EXUrBnGCVLwpEcqwM3DbTXlwBGFCDAgMBAAE=';
    const cert_rsa_key_size = 1024;

    // Deploy the contract and a certificate before each test
    beforeEach(async function () {
        TLSTokenFactory = await ethers.getContractFactory('TLSToken');
        [_, addr1, addr2] = await ethers.getSigners();
        TLSToken = await TLSTokenFactory.deploy();

        await TLSToken.add_certificate(
            cert_name,
            cert_domain_name,
            cert_state,
            cert_country,
            cert_rsa_public_key,
            cert_rsa_key_size
        );
    });

    // Fetch the deployed certificate and test if all attributes are correct
    it('Should fetch a certificate from the registry', async function () {
        const certificate = await TLSToken.fetch_certificate(0);
        expect(certificate.name).to.equal(cert_name);
        expect(certificate.domain_name).to.equal(cert_domain_name);
        expect(certificate.state).to.equal(cert_state);
        expect(certificate.country).to.equal(cert_country);
        expect(certificate.rsa_public_key).to.equal(cert_rsa_public_key);
        expect(certificate.rsa_key_size).to.equal(cert_rsa_key_size);
    });

    // Sign the certificate twice and fetch the signatures and verify them
    it('Should sign a certificate already published', async function () {
        await TLSToken.connect(addr1).sign_certificate(0, 1624051419);
        await TLSToken.connect(addr2).sign_certificate(0, 1624051529);
        const signatures = await TLSToken.fetch_signatures(0);
        expect(signatures[0].signer).to.equal(addr1.address);
        expect(signatures[1].signer).to.equal(addr2.address);
        expect(signatures[0].expiry.toNumber()).to.equal(1624051419);
        expect(signatures[1].expiry.toNumber()).to.equal(1624051529);
    });
});
