# mTLS example with NGINX and NodeJS

A simple example on how to do client authentication with certificates - mutual TLS (mTLS).

## Installation

Required tools as [OpenSSL](https://www.openssl.org/), [Docker](https://www.docker.com/) and [Node.js](https://nodejs.org/en/) need to be installed on the machine running the project.

### Create Certificates

Before running the example create `certificate authority (CA)`, `server` and `client` certificates with the `create_certs.sh` script. 

A detailed description of each step can be found within the script.

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

When starting the application notice the comments below and adjust the code if necessary.

### Prerequisites

Make sure `docker` and `docker-compose` are up and running. 

Also be aware that ports `3000`, `80` and `443` are not occupied already. In case the ports are used by another application, adapt the configuration in [./docker-compose.yml](https://github.com/judif/mtls-basic/blob/main/docker-compose.yml), [./nginx-server/proxy.conf](https://github.com/judif/mtls-basic/blob/main/nginx-server/proxy.conf#L2) and [./node-server/server.js](https://github.com/judif/mtls-basic/blob/main/nginx-server/proxy.conf#L2).

If there has been chosen a certificates directory different to the default path `./certs`, please adjust the path inside `./docker-compose.yml`.

```dockerfile
...
    volumes:
      - ./{directory to certificates}/server.crt:/etc/ssl/server.crt
      - ./{directory to certificates}/server.key:/etc/ssl/server.key
      - ./{directory to certificates}/ca.crt:/etc/nginx/client_certs/ca.crt
...
```

### Deployment 

All requirements are met? - Let's get ready to spin up the servers with

```shell
docker-compose build

docker-compose up
```

Alternatively combine both commands into one:

```shell
docker-compose up --build 
```

Both servers `NGINX` and the `Node JS Express` server should be available then.

### Testing

In order to verify the server is working correctly, start testing with an appropriate tool of any choice. Below examples are executed with `cURL`.

```shell
curl https://localhost \
  --cacert certs/ca.crt \
  --key certs/client.key \
  --cert certs/client.crt 

# successfull response with message should be returned
```

It depends on how the machine you're testing with is set up: not just `NGINX` can be called also the `Node JS` application can be directly accessed with client certificates. 

```shell
curl https://localhost:3000 \
  --cacert certs/ca.crt \
  --key certs/client.key \
  --cert certs/client.crt 

# successfull response with message should be returned
```

Of course - nobody is perfect. While testing some errors can occur...

#### Potential sources of errors

A list of errors ...

##### Error - Certificate Authority (CA) not known

```shell
curl: (60) SSL certificate problem: unable to get local issuer certificate
```

Check if `ca.crt` file is provided and the correct one hase been chosen.

##### Error - Missing client certificate and key

```shell
<html>
<head><title>403 Forbidden</title></head>
<body>
<center><h1>403 Forbidden</h1></center>
<hr><center>nginx/1.17.10</center>
</body>
</html>
```

Make sure the command consists of all necessary client certificates needed to authenticate with the server.

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/judif/mtls-basic/blob/main/LICENSE.md) file for details
