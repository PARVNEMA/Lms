import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// *resuable code
// ? sometimes env variables are not able to load properly in cloudinary file thats why we are reconfiguring it
dotenv.config({});

//check and load env variables

cloudinary.config({
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
	cloud_name: process.env.CLOUD_NAME,
});

export const uploadMedia = async (file) => {
	try {
		const uploadResponse = await cloudinary.uploader(file, {
			resource_type: "auto",
		});

		return uploadResponse;
	} catch (error) {
		console.log("error in uploading media to cloudinary");

		console.log(error);
	}
};
export const deleteMediaFromCloudinary = async (
	publicId
) => {
	try {
		const deleteResponse =
			await cloudinary.uploader.destroy(publicId);
	} catch (error) {
		console.log("error in deleting media from cloudinary");

		console.log(error);
	}
};
export const deleteVideoFromCloudinary = async (
	publicId
) => {
	try {
		const deleteResponse =
			await cloudinary.uploader.destroy(publicId, {
				resource_type: "video",
			});
	} catch (error) {
		console.log(
			"error in deleting media video from cloudinary"
		);

		console.log(error);
	}
};
