# Online mobile bank app for Proper Invest Bank

## The repository includes:
1. The UI of the app
2. The app
3. The server part of the app
4. Some additional data for the app

## Model

<img width="742" alt="image" src="https://github.com/TIVMOF/online_bank/assets/78173711/5a03d1b3-5e48-45e6-ad65-24f28ee204f1">


## Application
## Build

	docker build -t online_bank .
 
## PULL

	docker pull ghcr.io/tivmof/online_bank:latest

## Run

	docker run --name online_bank -d -p 8080:8080 ghcr.io/tivmof/online_bank:latest
 
## Clean

	docker rm online_bank

   
