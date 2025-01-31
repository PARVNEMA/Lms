import mongoose from "mongoose";

const MAX_RETRIES = 3;
const RETRY_INTERVAL = 5000; // 5 SEC

class DatabaseConnection {
	constructor() {
		this.retryCount = 0;
		this.isConnected = false;

		// ? configure mongoose settings agar schema me wohh field nahi hai to yahi se mongoose return kardega
		mongoose.set("strictQuery", true);

		// * mongoose events different things done on different events
		mongoose.connection.on("connected", () => {
			console.log("mongodb connected successfully");
			this.isConnected = true;
		});
		mongoose.connection.on("error", () => {
			console.log("mongodb connection error");
			this.isConnected = false;
		});
		mongoose.connection.on("disconnected", () => {
			console.log("mongodb connected disconnected");
			this.handleDisconnection();
		});

		process.on(
			"SIGTERM",
			this.handleappTermination.bind(this)
		);
	}

	async connect() {
		try {
			if (!process.env.MONGO_URI) {
				throw new Error(
					"MONGO_URI is not defined in env variables"
				);
			}

			const connectionOptions = {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				maxPoolSize: 10,
				serverSelectionTimeoutMS: 5000,
				socketTimeoutMs: 45000,
				family: 4, // use IPv4
			};

			if (process.env.NODE_ENV === "development") {
				mongoose.set("debug", true);
			}

			await mongoose.connect(
				process.env.MONGO_URI,
				connectionOptions
			);

			this.retryCount = 0; // reset retry count on successful connection
		} catch (error) {
			console.error(
				`Error connecting to MongoDB: ${error.message}`
			);
			await this.handleConnectionError();
		}
	}

	async handleConnectionError() {
		if (this.retryCount < MAX_RETRIES) {
			this.retryCount++;
			console.log(
				`retying connection ... attempt ${this.retryCount} of ${MAX_RETRIES}`
			);
			await new Promise((resolve) =>
				setTimeout(() => {
					resolve;
				}, RETRY_INTERVAL)
			);
			return this.connect();
		} else {
			console.error(
				`failed to connect to mongodb after ${MAX_RETRIES} attempt`
			);
			process.exit(1);
		}
	}

	async handleDisconnection() {
		if (!this.isConnected) {
			console.log("attempting to reconnect to mongodb ...");
			this.connect();
		}
	}

	async handleappTermination() {
		try {
			await mongoose.connection.close();
			console.log(
				"mongodb connection closed through app termination"
			);
			process.exit(0);
		} catch (error) {
			console.error(
				"error during database disconnection",
				error
			);
			process.exit(1);
		}
	}

	getConnectionStatus() {
		return {
			isConnected: this.isConnected,
			readyState: mongoose.connection.readyState,
			name: mongoose.connection.name,
		};
	}
}

// todo create a singleton instance

const dbConnection = new DatabaseConnection();

export default dbConnection.connect.bind(dbConnection);
export const getDBStatus =
	dbConnection.getConnectionStatus.bind(dbConnection);
