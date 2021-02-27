# mTLS example with NGINX and NodeJS

A simple example on how to do client authentication with certificates - mutual TLS (mTLS.)

## Installation

Consider tools like [OpenSSL](https://www.openssl.org/), [Docker](https://www.docker.com/) and [Node.js](https://nodejs.org/en/) needs to be installed on the machine running the project.

### Create Certificates

Before running the example create `certificate authority (CA)`, `server` and `client` certificates with the `create_certs.sh` script. A detailed description of each step can be found within the script.

```shell
./script/create_certs.sh

# Output
Enter path for certificates directory and press [ENTER]: ./certs
Enter certificate authority (CA) name and press [ENTER]: any_ca
# ...
```

With the above example a directory `certs` will be created in the root directory and puts the following certificates in there:
```
- Certificate Authority
    - ca.crt
    - ca.key
    - ca.srl
- Server
    - server.crt
    - server.csr -- Certificate Signing Request (CSR)
    - server.key
- Client
    - client.crt
    - client.csr -- Certificate Signing Request (CSR)
    - client.key
```


## Usage

