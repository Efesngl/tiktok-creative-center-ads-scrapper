
# Tik Tok Creative Center Top Ads Dashboard scrapper
This project scrapes the Tik Tok Creative Center's Top Ads Dashboard to get public ads


## Run on your system

Clone the project

```bash
  git clone https://github.com/Efesngl/tiktok-creative-center-ads-scrapper.git
```

Go to project folder

```bash
  cd tiktok-creative-center-ads-scrapper
```
## To use with docker
Build the docker image
```bash
  docker build . -t {image_tag}
```
Run the image
```bash
  docker run -p {host_port}:{container_port} --env PORT={container_port} {image_tag}
```
## To use on locally
Install packages

```bash
  npm install
```

Run server

```bash
 node server.js
```

  
## API Usage
#### All the available filter options
```http
  GET /filters
```
#### Get ads

```http
  GET /getads?
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `period` | `integer` | Time limit |
| `industry` | `integer` | Ids of the industry you want to search |
| `order_by` | `string` | Order type|
| `ad_language` | `string` | Language of the ads |
| `country` | `string` | Countries of the ads |
| `limit` | `int` | Maximum amount of the ads that will be returned. MAX:20 |
| `page` | `int` | Page number |
| `like` | `int` | Like type |
| `objective` | `int` | Type of the objective you want |


Parameter Usage
```http
?period=7&industry=25000000000,25000000000&order_by=ctrad_language=en&country=US&objective=1
```
#### Get details of the ads

```http
  GET /getadsdetails?
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `period` | `integer` | Time limit |
| `industry` | `integer` | Ids of the industry you want to search |
| `order_by` | `string` | Order type|
| `ad_language` | `string` | Language of the ads |
| `country` | `string` | Countries of the ads |
| `limit` | `int` | Maximum amount of the ads that will be returned. MAX:20 |
| `like` | `int` | Like type |
| `objective` | `int` | Type of the objective you want |

#### Get the detail of the ad
```http
  GET /getaddetail/ad_id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `ad_id` | `integer` | ID of the ad |



  
