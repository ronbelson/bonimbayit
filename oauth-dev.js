var ids = {
facebook: {
 clientID: '644078762380354',
 clientSecret: '40eb289c1bda1aa7a599343f52eff230',
 callbackURL: 'http://localhost:3000/auth/facebook/callback',
 profileFields: ['id', 'displayName', 'link', 'about', 'photos', 'emails']
},
twitter: {
 consumerKey: 'get_your_own',
 consumerSecret: 'get_your_own',
 callbackURL: "http://127.0.0.1:1337/auth/twitter/callback"
},
github: {
 clientID: 'get_your_own',
 clientSecret: 'get_your_own',
 callbackURL: "http://127.0.0.1:1337/auth/github/callback"
},
google: {
 returnURL: 'http://127.0.0.1:1337/auth/google/callback',
 realm: 'http://127.0.0.1:1337'
}
}

module.exports = ids