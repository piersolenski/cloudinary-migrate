const request = require("request-promise");
const cloudinary = require("cloudinary");
const config = require("./config");

cloudinary.v2.config(config.to);

async function migrate() {
  const { cloud_name, api_key, api_secret } = config.from;
  const res = await request(
    `https://${api_key}:${api_secret}@api.cloudinary.com/v1_1/${cloud_name}/resources/${config.assetType}/?max_results=200`
  );
  const assets = JSON.parse(res).resources;
  assets.forEach((asset) => {
    const { url, public_id } = asset;
    cloudinary.v2.uploader.upload(
      url,
      { public_id, resource_type: config.assetType },
      () => console.log(`Uploaded ${public_id}!`)
    );
  });
}

migrate();
