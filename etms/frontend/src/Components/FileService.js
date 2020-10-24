import service from "./Service.js";

export class FileService {
	uploadFileToServer(data) {
		//returns Promise object
		return service.getRestClient().post("/etms/api/uploadFile", data);
	}

	getUsers() {
		//returns Promise object
		return service.getRestClient().get("/etms/api/getAllUsers");
	}

	test() {
		return service.getRestClient().get("/info.0.json");
	}
}
