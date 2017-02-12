# What horror awaits me today?
## Development
1. Git clone
2. npm install
3. Add your twitter configuration to rootDir/config/config.json
4. npm run start
 + This will copy your config to the alexa-app-server working directory, copy the minimal package.json, run index.js through babel transpilation, and start alexa-app-server
5. point browser to http://localhost:8080/alexa/what-horror

## Release
1. npm run release
 + This will copy minimal package.json, copy twitter config, babel transpilation of index.js, npm install on the minimal package.json and create whatHorror.zip
2. Upload zip file to lambda function
