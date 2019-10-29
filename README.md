# Please review `develop` branch for hackathon

# defi-custody-hackathon
DeFi Custody proof of concept for hackathon


## Watchtower
The watchertower is a nodejs server that comunicate with ETH network.

### Local setup
In order to run it, we need to follow the normal steps for a node js app.

```
yarn install
yarn build
```

By default, all env vars are point to dev. So no futher work needed it to connect with ganache.

### prod setup
For the prod setup, we need to add this env vars:

```
export NODE_ENV= (prod or dev)
export DEFICUSTODY_PRIVATE_KEY=
export INFURA_ID=
export NETWORK=
```

To run it, just do.
```
docker-compose build
docker-compose up
```

In our prod setup, we have a script call start.sh that has all the configurations pre-configurations to run the project.
It get the code from a specific branch, build it and run it.

