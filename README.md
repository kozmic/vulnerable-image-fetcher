# SSRF vulnerable application in AWS

This web application is intentionally vulnerable to Service-side Request Forgery (SSRF). It simulates an AWS environment with IMDS (v1 on port 80 and v2 on port 2000).

# Run it

```
docker run --cap-add NET_ADMIN -d -p 127.0.0.1:4000:4000/tcp kozmico/vulnerable-image-fetcher
```
(we need NET_ADMIN to use the static IP 169.254.169.254 inside the container, feel free to run it without this permission, but then you need to use `localhost` in your payload)

# Walkthrough
* See that the solution work by enter an image url (example: https://avatars.githubusercontent.com/u/6666)
* Now try to change the url to some none image file... what is happening? Look at the requests.
* Now exploit the vulnerability by requesting http://169.254.169.254/, and see that `latest` is returned. This is IMDS!
* Fetch AWS instance credentials from AWS IMDS: 

```
curl "http://localhost:4000/fetchImage?imageUrl=http://169.254.169.254/latest/meta-data/iam/security-credentials/baskinc-role"
```
* Now try to exploit the IMDSv2 service on `169.254.169.254:2000`, it should not be possible and you will get HTTP 401 since your request is missing the `X-aws-ec2-metadata-token: $TOKEN` header :)  This is why we recommend to enforce IMDSv2 only, and not allow version 1.

# TODO 
* Add custom configuration to amazon-ec2-metadata-mock for some more funny output and customization.
* Ctrl + C should kill the container
# Develop
Developed on Node 18.8.

```
npm install
npm run server
```
Install and start https://github.com/aws/amazon-ec2-metadata-mock
