import Errors from "../services/errors/enums.js";

export function errorHandler(error, _, res, next) {
	switch (error.code) {
		case Errors.ROUTING_ERROR:
			res.status(404).json({ status: "error", error: error.name, cause: error.cause });
			break
		case Errors.ID_ERROR:
			res.status(404).json({ status: "error", error: error.name, cause: error.cause });
			break
		case Errors.DATABASES_ERROR:
			res.status(500).json({ status: "error", error: error.name, cause: error.cause });
			break
		case Errors.DATABASES_READ_ERROR:
			res.status(500).json({ status: "error", error: error.name, cause: error.cause });
			break
		case Errors.UNHANDLER_ERROR:
			res.status(500).json({ status: "error", error: error.name, cause: error.cause });
			break
		default:
			res.status(500).json({ status: "error", error: "Unexpected error", cause:'Something went wrong'});
			break;
	}
}