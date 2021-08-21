import { PassThrough } from "stream";
import ibm from "ibm-cos-sdk";

import { mocked } from "ts-jest/utils";

import { UserInputError, ApolloError } from "apollo-server-errors";

jest.mock("ibm-cos-sdk");

jest.mock("../../../config", () => ({
  WEBSITE_URL: "https://test.com",
  IBM_CONFIG: {
    endpoint: "s3.endpoint.com",
    apiKeyId: "api-key-id",
    serviceInstanceid: "service-instance-id",
    bucket: "test-bucket"
  }
}));

const FILE_UPLOADS_MOCK = [
  {
    filename: "file-1.png",
    mimetype: "image/png",
    createReadStream: () => {}
  },
  {
    filename: "file-2.jpg",
    mimetype: "image/jpg",
    createReadStream: () => {}
  }
] as any;

// I'm using dynamic imports because i wanna see if the ibm.S3 class is called with the correct data
// And i can't import the ImageController globally
const getImageController = async () => {
  return (await import("../ImageController")).default;
}

// deactivate the console log
console.log = () => {}

describe("server/utils/controllers/ImageController", () => {
  const getObjectMock = jest.fn();
  const putObjectMock = jest.fn();
  const deleteObjectsMock = jest.fn();

  const ibmS3Mocked = mocked(ibm.S3);

  const dateNowSpy = jest.spyOn(Date, "now");

  beforeEach(() => {
    jest.resetAllMocks();

    putObjectMock.mockImplementation(() => ({
      promise: () => Promise.resolve()
    }))

    deleteObjectsMock.mockImplementation(() => ({
      promise: () => Promise.resolve()
    }))

    ibmS3Mocked.mockImplementation(() => {
      return {
        getObject: getObjectMock,
        putObject: putObjectMock,
        deleteObjects: deleteObjectsMock
      } as any;
    });

    dateNowSpy.mockImplementation(() => 1111);
  });


  it("should call the ibm.s3 class correctly", async () => {
    await import("../ImageController");

    expect(ibmS3Mocked).toHaveBeenCalledTimes(1);

    expect(ibmS3Mocked).toHaveBeenCalledWith({
      endpoint: "s3.endpoint.com",
      apiKeyId: "api-key-id",
      serviceInstanceId: "service-instance-id"
    });
  });

  describe("getImage", () => {
    beforeEach(() => {
      getObjectMock.mockImplementation(() => ({
        promise: () => Promise.resolve(FILE_UPLOADS_MOCK[0])
      } as any));
    });

    it("should call the getObject function and return the result", async () => {
      const ImageController = await getImageController();

      const image = await ImageController.getImage("test-key");

      expect(image).toEqual(FILE_UPLOADS_MOCK[0]);
      expect(getObjectMock).toHaveBeenCalledWith({
        Bucket: "test-bucket",
        Key: "test-key"
      });
    });
  });

  describe("uploadImage", () => {
    it("should call putObject and return the image url", async () => {
      const ImageController = await getImageController();

      const readStreamMock = new PassThrough();

      const fileUploadMock = {
        ...FILE_UPLOADS_MOCK[0],
        createReadStream: () => readStreamMock
      }

      const imageURLPromise = ImageController.uploadImage(fileUploadMock);

      const bufferMock = Buffer.from("test");

      readStreamMock.emit("data", bufferMock);
      readStreamMock.emit("end");

      const Key = "1111-file-1.png";

      expect(await imageURLPromise).toBe(`https://test.com/img/uploads/${Key}`);

      expect(putObjectMock).toHaveBeenCalledWith({
        Bucket: "test-bucket",
        Key,
        Body: bufferMock,
        ContentType: "image/png"
      });
    });

    it("should throw an error when the file type is not supported", async () => {
      const ImageController = await getImageController();

      try {
        await ImageController.uploadImage({
          filename: "file-1.html",
          mimetype: "text/html",
        } as any);
      } catch (err) {
         expect(err).toEqual(new UserInputError("The file must be a .png, .jpg or .jpeg image")) ;
      }
    });

    it("should throw an error when the readStream throws an error", async () => {
      const ImageController = await getImageController();

      try {
        const readStreamMock = new PassThrough();

        const fileUploadMock = {
          ...FILE_UPLOADS_MOCK[0],
          createReadStream: () => readStreamMock
        }

        const imageURLPromise = ImageController.uploadImage(fileUploadMock);

        readStreamMock.emit("error", new Error("test error"));

        await imageURLPromise;
      } catch (err) {
         expect(err).toEqual(new ApolloError("Error trying to upload the file-1.png image to the server.")) ;
      }
    });
  });

  describe("uploadImages", () => {
    it("should throw an error when there is a file type not supported", async () => {
      const ImageController = await getImageController();

      try {
        await ImageController.uploadImages([{
          filename: "file-1.html",
          mimetype: "text/html",
        }] as any);
      } catch (err) {
        expect(err).toEqual(new UserInputError("All the files must be a .png, .jpg or .jpeg image")) ;
      }
    });

    it("should return an empty array when we pass an empty array as parameter", async () => {
      const ImageController = await getImageController();
      
      const imageURLs = await ImageController.uploadImages([]);
      expect(imageURLs).toEqual([]);
    });

    it("should return the image urls", async () => {
      const ImageController = await getImageController();

      const readStreamsMock = [new PassThrough(), new PassThrough()];

      const fileUploadsMock = [
        {
          ...FILE_UPLOADS_MOCK[0],
          createReadStream: () => readStreamsMock[0]
        },
        {
          ...FILE_UPLOADS_MOCK[1],
          createReadStream: () => readStreamsMock[1]
        }
      ];

      const imageURLsPromise = ImageController.uploadImages(fileUploadsMock);

      readStreamsMock.forEach(readStream => readStream.emit("end"));

      expect(await imageURLsPromise).toEqual([
        "https://test.com/img/uploads/1111-file-1.png",
        "https://test.com/img/uploads/1111-file-2.jpg"
      ]);
    });
  });

  describe("deleteImages", () => {
    it("should do nothing when we pass an empty array as parameter", async () => {
      const ImageController = await getImageController();

      await ImageController.deleteImages([]);

      expect(deleteObjectsMock).not.toHaveBeenCalled();
    });

    it("should call deleteObjects with the object keys", async () => {
      const ImageController = await getImageController();

      await ImageController.deleteImages([
        "https://test.com/img/uploads/test-file.jpg",
        "https://test.com/img/uploads/test-file-2.jpg"
      ]);

      expect(deleteObjectsMock).toHaveBeenCalledWith({
        Bucket: "test-bucket",
        Delete: {
          Objects: [
            { Key: "test-file.jpg" },
            { Key: "test-file-2.jpg" }
          ]
        }
      });
    });

    it("should throw an error when the getObjects function throws an error", async () => {
      try {
        const ImageController = await getImageController();

        deleteObjectsMock.mockImplementation(() => ({
          promise: () => Promise.reject()
        }))

        await ImageController.deleteImages([
          "https://test.com/img/uploads/test-file.jpg",
          "https://test.com/img/uploads/test-file-2.jpg"
        ]);
      } catch (err) {
        expect(err).toEqual(new ApolloError("Error trying to delete the images"));
      }
    });
  });
});
