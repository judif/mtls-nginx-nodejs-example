# mTLS example with NGINX and NodeJS

A simple example on how to do client authentication with certificates - mutual TLS (mTLS).

## Installation

Consider tools like [OpenSSL](https://www.openssl.org/), [Docker](https://www.docker.com/) and [Node.js](https://nodejs.org/en/) needs to be installed on the machine running the project.

### Create Certificates

Before running the example create `certificate authority (CA)`, `server` and `client` certificates with the `create_certs.sh` script. A detailed description of each step can be found within the script.

```shell
./script/create_certs.sh

# Output
Enter path for certificates directory (default: certs): ./certs
Enter certificate authority (CA) name (default: mtls_ca): my_ca
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

Before running the application consider the following section. 

### Prerequisites

Make sure `docker` and `docker-compose` are up and running and ports `3000`, `80` and `443` are not in use already. In case the ports are used by another application, adapt the ports in [./docker-compose.yml](https://github.com/judif/mtls-basic/blob/main/docker-compose.yml), [./nginx-server/proxy.conf](https://github.com/judif/mtls-basic/blob/main/nginx-server/proxy.conf#L2) and [./node-server/server.js](https://github.com/judif/mtls-basic/blob/main/nginx-server/proxy.conf#L2).

If there has been chosen a certificates directory different to the default path `./certs`, please also make sure the path will be adapted inside `./docker-compose.yml`.
```dockerfile
...
    volumes:
      - ./{directory to certificates}/server.crt:/etc/ssl/server.crt
      - ./{directory to certificates}/server.key:/etc/ssl/server.key
      - ./{directory to certificates}/ca.crt:/etc/nginx/client_certs/ca.crt
...
```

### Installing 

After considering the stops above - let's get ready to spin up the servers.

```shell
docker-compose up --build 
```

Both servers `NGINX` and the `Node JS Express` server are now available. 