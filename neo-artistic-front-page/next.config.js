const withTM = require('next-transpile-modules')([
	'@rentfuse-labs/neo-wallet-adapter-base',
	'@rentfuse-labs/neo-wallet-adapter-react',
	'@rentfuse-labs/neo-wallet-adapter-wallets',
	'@rentfuse-labs/neo-wallet-adapter-react-ui',
	'@rentfuse-labs/neo-wallet-adapter-neoline',
	'@rentfuse-labs/neo-wallet-adapter-o3',
	'@rentfuse-labs/neo-wallet-adapter-walletconnect',
	'@rentfuse-labs/neo-wallet-adapter-onegate',
]);

const withPlugins = require('next-compose-plugins');

module.exports = withPlugins([withTM], {
  reactStrictMode: true,
  env: {
	  mongodburl: "mongodb+srv://admin:Ntt141187@cluster0.eboyt.mongodb.net/neo-artistic",
	  apiurl: "https://neo-api.neo-artistic.com/"
  },
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback = {
				fs: false,
				path: false,
				os: false,
				zlib: false,
				stream: false,
				net: false,
				tls: false,
				crypto: false,
				http: false,
				https: false,
				url: false,
			};
		}
		return config;
	},
});