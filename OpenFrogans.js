// These are the known servers that are used to bootstrap the client
const V5_FPB_HOSTS = [
	"http://fpb.p2205.test.lab.op3ft.org",
	"http://fpb.p2305.test.lab.op3ft.org"
];

const V5_BOOTSTRAP_PATH = "/architecture-1/fpbl1.0/data.fpbl";

const NETWORK_PROTOS = {
	"IP-DNS-TCP-HTTP": "http",
	"IP-DNS-TCP-TLS-HTTP": "https"
};

/**
 * Encode a string into an IFAP string (4-digit base-36 encoded char codes)
 * @param {string} str The string to encode
 * @returns {string} The encoded IFAP string
 */
function ifapEncode(str) {
	let result = "";
	for (let i = 0; i < str.length; i++) {
		const charCode = str.charCodeAt(i);
		result += charCode.toString(36).padStart(4, "0");
	}
	return result.padStart(4, "0");
}

/**
 * Decode an IFAP string (4-digit base-36 encoded char codes) into a string
 * @param {string} str The IFAP string to decode
 * @returns {string} The decoded string
 */
function ifapDecode(str) {
	let result = "";
	for (let i = 0; i < str.length; i += 4) {
		const charCode = parseInt(str.substring(i, i + 4), 36);
		result += String.fromCharCode(charCode);
	}
	return result;
}

/**
 * OpenFrogans Client
 */
class OpenFrogansClient {
	#v5fnsServers = [];
	#v5fnsNetworkCache = [];
	#v5fnsSiteCache = new Map();

	/**
	 * Initialize the Frogans Client
	 */
	async initialize() {
		await this.#initializeV5();
	}

	async #initializeV5() {
		// Choose a random FPB host
		const fpbHost =
			V5_FPB_HOSTS[Math.floor(Math.random() * V5_FPB_HOSTS.length)];
		const bootstrapUrl = fpbHost + V5_BOOTSTRAP_PATH;

		// Fetch the bootstrap file
		const response = await fetch(bootstrapUrl);
		const data = await response.text();

		// Parse the XML bootstrap file
		const parser = new DOMParser();
		const xml = parser.parseFromString(data, "application/xml");

		// Extract the FNS servers
		const fnslServers = xml.querySelectorAll(
			"fnsl-servers content-server ucsr-path"
		);

		// Store the FNS servers
		for (const server of fnslServers) {
			const proto = NETWORK_PROTOS[server.getAttribute("network")];
			const host = server.querySelector(
				"[name='domain-name']"
			).textContent;
			const port = server.querySelector("[name='port']").textContent;
			const path = server.querySelector("[name='directory']").textContent;
			this.#v5fnsServers.push(`${proto}://${host}:${port}${path}`);
		}
	}

	/**
	 * Resolve a Frogans address
	 * @param {string} address The Frogans address to resolve
	 * @returns {index: string, servers: {protocol: string, siteServer: string, port: number, directory: string}[]} The resolved site
	 */
	async resolveV5(address) {
		// Check the cache
		if (this.#v5fnsSiteCache.has(address)) {
			return this.#v5fnsSiteCache.get(address);
		}

		// Select random FNS server
		const fnsServer =
			this.#v5fnsServers[
				Math.floor(Math.random() * this.#v5fnsServers.length)
			];

		// Check that the network exists
		const addressParts = address.split("*");
		const network = addressParts[0];
		const siteName = addressParts[1];
		if (!this.#v5fnsNetworkCache.includes(network)) {
			const fnsNetworkResponse = await fetch(
				`${fnsServer}/architecture-1/fnsl5.0/network-${ifapEncode(
					network
				)}.fnsl`
			);
			if (!fnsNetworkResponse.ok) {
				throw new Error("Network not found");
			}
			this.#v5fnsNetworkCache.push(network);
		}

		// Fetch the site details
		const fnsSiteResponse = await fetch(
			`${fnsServer}/architecture-1/fnsl5.0/network-${ifapEncode(
				network
			)}.site-${ifapEncode(siteName)}.fnsl`
		);

		if (!fnsSiteResponse.ok) {
			throw new Error("Site not found");
		}

		// Parse the site details
		const data = await fnsSiteResponse.text();
		const parser = new DOMParser();
		const xml = parser.parseFromString(data, "application/xml");

		const siteServers = xml.querySelectorAll(
			"frogans-site-servers content-server ucsr-path"
		);

		const site = {
			servers: [],
			index: xml.querySelector("home-slide file-selector").textContent,
			fsdlVersion: xml.querySelector("fsdl-version").textContent
		};

		for (const server of siteServers) {
			// Extract the server details
			const protocol = NETWORK_PROTOS[server.getAttribute("network")];
			const siteServer = server.querySelector(
				"[name='domain-name']"
			).textContent;
			const port = parseInt(
				server.querySelector("[name='port']").textContent
			);
			const directory =
				server.querySelector("[name='directory']").textContent;
			site.servers.push({ protocol, siteServer, port, directory });
		}

		// Cache the site
		this.#v5fnsSiteCache.set(address, site);

		return site;
	}

	/**
	 * Fetch a resource from a Frogans address
	 * @param {string} address The Frogans address to fetch the resource from
	 * @param {string} resource The resource to fetch
	 * @returns {Response} The fetched resource
	 */
	async fetchV5(address, resource) {
		// Resolve the site
		const site = await this.resolveV5(address);
		const server =
			site.servers[Math.floor(Math.random() * site.servers.length)];

		const addressParts = address.split("*");
		const network = addressParts[0];
		const siteName = addressParts[1];

		// Fetch the resource
		const response = await fetch(
			`${server.protocol}://${server.siteServer}:${server.port}${
				server.directory
			}/network-${ifapEncode(network)}.site-${ifapEncode(
				siteName
			)}/${resource}`
		);
		if (!response.ok) {
			throw new Error("Resource not found");
		}

		return response;
	}
}

export default OpenFrogansClient;
export { ifapEncode, ifapDecode };
