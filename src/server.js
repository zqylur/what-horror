const AlexaAppServer = require('alexa-app-server');

AlexaAppServer.start({
    server_root: './', // Path to root
    public_html: 'public_html', // Static content
    // app_dir: path.join(__dirname, '/apps'), // Location of alexa-app modules
    app_dir: 'src/apps', // Location of alexa-app modules
    app_root: '/alexa/', // Service root
    port: 8080, // Port to use
});
